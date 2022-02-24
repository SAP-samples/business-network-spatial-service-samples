import mapboxgl, { Map, NavigationControl } from "mapbox-gl/dist/mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import MapboxWorker from "mapbox-gl/dist/mapbox-gl-csp-worker";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import EventEmitter from "events";
import { EventType, DrawMode } from "./types";

export default class MapboxRenderer {

    constructor() {
        mapboxgl.workerClass = MapboxWorker;

        this._events = new EventEmitter();
    }

    /**************************************************************************
     * ACCESSOR PROPERTIES
     **************************************************************************/

    get style() {
        return this._style;
    }

    set style(value) {
        this._style = value;
        this._map.setStyle(value);
    }

    get center() {
        return this._center;
    }

    set center(value) {
        console.log(`center: ${value}`)
        this._center = value;
        this._map.setCenter(value);
    }

    get zoom() {
        return this._zoom;
    }

    set zoom(value) {
        this._zoom = value;
        this._map.setZoom(value);
    }

    /**************************************************************************
     * EVENTS & EVENT HANDLERS
     **************************************************************************/

    onClick(listener) {
        this._events.on(EventType.CLICK, listener);
    }

    onClickLayer(listener) {
        this._events.on(EventType.CLICK_LAYER, listener);
    }

    onContextMenu(listener) {
        this._events.on(EventType.CONTEXT_MENU, listener);
    }

    onContextMenuLayer(listener) {
        this._events.on(EventType.CONTEXT_MENU_LAYER, listener);
    }

    onDraw(listener) {
        this._events.on(EventType.DRAW, listener);
    }

    onSelectionChange(listener) {
        this._events.on(EventType.SELECTION_CHANGE, listener);
    }

    _registerEventHandlers() {
        this._map.on("click", (event) => {
            this._events.emit(EventType.CLICK, event);
        });

        this._map.once("load", () => {
            this._map.on("draw.create", () => {
                this._emitDraw();
            });

            this._map.on("draw.update", () => {
                this._emitDraw();
            });

            this._map.on("draw.delete", () => {
                this._emitDraw();
            });

            this._map.on("draw.selectionchange", (event) => {
                const { features } = event;
                if (features.length) {
                    const feature = features.pop();

                    const customEvent = new CustomEvent(EventType.SELECTION_CHANGE, {
                        detail: {
                            featureId: feature.id,
                            feature
                        }
                    });
                    this._events.emit(EventType.SELECTION_CHANGE, customEvent);
                }
            });
        });

        this._map.on("contextmenu", (event) => {
            this._timeout = setTimeout(() => {
                const marker = new MapboxMarker()
                    .setLngLat(event.lngLat)
                    .addTo(this._map);
                marker.getElement().style.visibility = "hidden";

                setTimeout(() => {
                    marker.remove();
                });

                const customEvent = new CustomEvent("contextmenu", {
                    detail: {
                        source: marker.getElement()
                    }
                });

                this._events.emit(EventType.CONTEXT_MENU, customEvent);
            });
        });
    }

    /**************************************************************************
     * METHODS
     **************************************************************************/

    initialize(options) {
        this._apiKey = options.apiKey;

        this._map = new Map({
            accessToken: options.apiKey,
            container: options.container,
            style: options.style || "mapbox://styles/mapbox/dark-v10",
            center: options.center,
            zoom: options.zoom,
            maxBounds: [[-180, -90], [180, 90]]
        });

        this._mapDraw = new MapboxDraw({ displayControlsDefault: false });

        this._map.addControl(new NavigationControl({ showCompass: false }), "bottom-right");
        this._map.addControl(this._mapDraw, "bottom-right");
        this._registerEventHandlers();

        return this;
    }

    addLayer(layer) {
        if (this._isFullyLoaded) {
            this._addSourceAndLayer(layer);
        } else {
            if (this._map.loaded()) {
                this._addSourceAndLayer(layer);
                this._isFullyLoaded = true;
            } else {
                this._map.once("load", () => {
                    this._addSourceAndLayer(layer);
                    this._isFullyLoaded = true;
                });
            }
        }

        this._setCursorDisplay(layer.id);

        this._map.on("click", layer.id, (event) => {
            if (this._timeout) {
                clearTimeout(this._timeout);
                this._timeout = null;
            }
            if (event.features?.length) {
                const featureId = event.features.pop().id.toString();

                this._timeout = setTimeout(() => {
                    const customEvent = new CustomEvent(EventType.CLICK, {
                        detail: {
                            featureId
                        }
                    });
                    this._events.emit(EventType.CLICK_LAYER, customEvent);
                });
            }
        });

        this._map.on("contextmenu", layer.id, (event) => {
            if (this._timeout) {
                clearTimeout(this._timeout);
                this._timeout = null;
            }

            const marker = new MapboxMarker()
                .setLngLat(event.lngLat)
                .addTo(this._map);
            marker.getElement().style.visibility = "hidden";

            setTimeout(() => {
                marker.remove();
            });

            const customEvent = new CustomEvent(EventType.CLICK_LAYER, {
                detail: {
                    source: marker.getElement(),
                    layer: event.features[0].layer,
                    properties: event.features[0].properties
                }
            });

            this._events.emit(EventType.CONTEXT_MENU_LAYER, customEvent);
        });

        return this;
    }

    addLayers(layers) {
        layers.forEach(layer => {
            this.addLayer(layer);
        });

        return this;
    }

    hideLayers(layers) {
        layers.forEach(layer => {
            const value = layer.isVisible ? "visible" : "none";
            this._map.setLayoutProperty(layer.id, "visibility", value);
        });

        return this;
    }

    zoomTo(zoom) {
        this._map.zoomTo(zoom);
        return this;
    }

    removeFeature() {
        if (this._isFullyLoaded) {
            this._mapDraw
                .deleteAll();
        }
    }

    draw(mode) {
        switch (mode) {
            case DrawMode.LINE_STRING:
                this._mapDraw.changeMode(DrawMode.LINE_STRING);
                break;
            case DrawMode.POINT:
                this._mapDraw.changeMode(DrawMode.POINT);
                break;
            case DrawMode.POLYGON:
                this._mapDraw.changeMode(DrawMode.POLYGON);
                break;
            default:
                throw new Error(`${mode} mode is not supported.`);
        }
    }

    setBounds(coordinates, padding) {
        this._map.fitBounds(coordinates, { padding });
    }

    addSearchBar(featureCollection) {
        const filterFeature = searchItem => {
            const matchingFeature = [];

            featureCollection.features.forEach((feature) => {
                Object.keys(feature?.properties).forEach((key) => {
                    if (typeof feature?.properties[key] === "string" && feature?.properties[key].toLowerCase().search(searchItem.toLowerCase()) >= 0) {
                        const placeName = feature.properties[key];
                        let center = [0, 0];
                        const point = MapUtil.center(feature);

                        if (point && point.geometry.type === "Point") {
                            center = point.geometry.coordinates;
                            const selectedFeature = {
                                place_name: placeName,
                                center,
                            };
                            matchingFeature.push(selectedFeature);
                        }
                    }
                });
            });

            return matchingFeature;
        };

        if (this._map.hasControl(this._mapboxGeoCoder)) {
            this._map.removeControl(this._mapboxGeoCoder);
        }

        this._mapboxGeoCoder = new MapboxGeocoder({
            accessToken: this._apiKey,
            localGeocoder: filterFeature,
            zoom: 14,
            placeholder: "Search Text",
            mapboxgl: mapboxgl
        });

        return this._mapboxGeoCoder.onAdd(this._map);
    }

    _addSourceAndLayer(option) {
        if (this._map) {
            if (this._map.getLayer(option.id)) {
                this._map.removeLayer(option.id);
                this._map.removeSource(option.id);
            }

            this._map.addSource(option.id, JSON.parse(JSON.stringify(option.source)));

            const clone = JSON.parse(JSON.stringify(option));
            clone.source = option.id;
            clone.metadata = {
                customLayer: true
            };
            delete clone.settings;

            const layer = (option.settings ? { ...clone, ...JSON.parse(JSON.stringify(option.settings)) } : clone);

            this._map.addLayer(layer);
        }
    }

    _setCursorDisplay(id) {
        this._map.on("mouseenter", id, () => {
            this._map.getCanvas().style.cursor = "pointer";
        });

        this._map.on("mouseleave", id, () => {
            this._map.getCanvas().style.removeProperty("cursor");
        });
    }

    _emitDraw() {
        const { features } = this._mapDraw.getAll();
        let feature = null;
        if (features.length) {
            feature = features[0];
        }
        const customEvent = new CustomEvent(EventType.DRAW, {
            detail: {
                feature: feature
            }
        });
        this._events.emit(EventType.DRAW, customEvent);
    }
}
