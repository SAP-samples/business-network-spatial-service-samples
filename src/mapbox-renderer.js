import mapboxgl, { Map, NavigationControl } from "mapbox-gl/dist/mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import MapboxWorker from "mapbox-gl/dist/mapbox-gl-csp-worker";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import EventEmitter from "events";
import { EventType, DrawMode } from "./types";

export default class MapboxRenderer {

    /**
	 * Contructor for Mapbox Renderer.
	 */
    constructor() {
        mapboxgl.workerClass = MapboxWorker;

        this._events = new EventEmitter();
    }

    /**************************************************************************
     * ACCESSOR PROPERTIES
     **************************************************************************/

    /**
	 * Getter for map style.
	 *
	 * @returns Map style value.
	 */
    get style() {
        return this._style;
    }

    /**
	 * Setter for map style.
	 *
	 * @param value - The map style value.
	 */
    set style(value) {
        this._style = value;
        this._map.setStyle(value);
    }

    /**
	 * Getter for map center coordinate.
	 *
	 * @returns Map center coordinate.
	 */
    get center() {
        return this._center;
    }

    /**
	 * Setter for map center coordinate.
	 *
	 * @param value - The map center coordinate.
	 */
    set center(value) {
        console.log(`center: ${value}`)
        this._center = value;
        this._map.setCenter(value);
    }

    /**
	 * Getter for map initial zoom level.
	 *
	 * @returns Map initial zoom level.
	 */
    get zoom() {
        return this._zoom;
    }

    /**
	 * Setter for map initial zoom level.
	 *
	 * @param value - The map initial zoom level.
	 */
    set zoom(value) {
        this._zoom = value;
        this._map.setZoom(value);
    }

    /**************************************************************************
     * EVENTS & EVENT HANDLERS
     **************************************************************************/

    /**
	 * Handler for `click` event.
	 *
	 * @param listener - A callback method.
	 */
    onClick(listener) {
        this._events.on(EventType.CLICK, listener);
    }

    /**
	 * Handler for layer `click` event.
	 *
	 * @param listener - A callback method.
	 */
    onClickLayer(listener) {
        this._events.on(EventType.CLICK_LAYER, listener);
    }

    /**
	 * Handler for `contextMenu` event.
	 *
	 * @param listener - A callback method.
	 */
    onContextMenu(listener) {
        this._events.on(EventType.CONTEXT_MENU, listener);
    }

    /**
	 * Handler for layer `contextMenu` event.
	 *
	 * @param listener - A callback method.
	 */
    onContextMenuLayer(listener) {
        this._events.on(EventType.CONTEXT_MENU_LAYER, listener);
    }

    /**
	 * Handler for `draw` event.
	 *
	 * @param listener - The event listener function.
	 */
    onDraw(listener) {
        this._events.on(EventType.DRAW, listener);
    }

    /**
	 * Handler for `selectionChange` event.
	 *
	 * @param listener - A callback method.
	 */
    onSelectionChange(listener) {
        this._events.on(EventType.SELECTION_CHANGE, listener);
    }

    /**
	 * Register event handlers.
	 *
	 * @remarks
	 * This function attached event handlers to its corresponding events.
	 */
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

    /**
	 * Initialize the map renderer.
	 * 
	 * @param options - The optional parameters.
	 * @returns this for method chaining.
	 */
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

    /**
	 * Adds a Layer into the map.
	 *
     * @remarks
	 * There's a need to check if the map is fully loaded and then set the flag
	 * `_isFullyLoaded` to true. Odd cases happen when the map is fully loaded
	 * and yet the Mapbox `loaded()` function returns false.
	 * Based on https://github.com/mapbox/mapbox-gl-js/issues/6707, it's safe to
	 * add layer after the initial `map.loaded()` is true. But will revisit this
	 * for a better implementation.
     * 
	 * @param option - Layer options.
	 * @returns this for method chaining.
	 */
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

    /**
	 * Adds Layers into the map.
	 *
	 * @param layers - Layers.
	 * @returns this for method chaining.
	 */
    addLayers(layers) {
        layers.forEach(layer => {
            this.addLayer(layer);
        });

        return this;
    }

    /**
	 * Hides the layers from the map.
	 *
	 * @param layers - Layers.
	 * @returns this for method chaining.
	 */
    hideLayers(layers) {
        layers.forEach(layer => {
            const value = layer.isVisible ? "visible" : "none";
            this._map.setLayoutProperty(layer.id, "visibility", value);
        });

        return this;
    }

    /**
	 * Zooms the map to the specified zoom level.
	 *
	 * @param zoom - The zoom level to transition to.
	 * @returns this for method chaining.
	 */
    zoomTo(zoom) {
        this._map.zoomTo(zoom);
        return this;
    }

    /**
	 * Remove all features.
	 *
	 * @remarks
	 * This function removes all existing features in the map.
	 */
    removeFeature() {
        if (this._isFullyLoaded) {
            this._mapDraw
                .deleteAll();
        }
    }

    /**
	 * Draw feature (point, polygon or line string) on the map.
	 *
	 * @param mode - Draw mode from the selected draw toolbar buttons.
	 */
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

    /**
	 * Set bounding box of the map.
	 *
	 * @remarks
	 * This method set the bounding box of the map. It accepts coordinates and a numerical value
	 * to set as padding of bounding box.
	 *
	 * @param coordinates - Array of numbers with a length of 4 elements.
	 * @param padding - Numerical value of Bounding box padding.
	 */
    setBounds(coordinates, padding) {
        this._map.fitBounds(coordinates, { padding });
    }

    /**
	 * Add Search bar.
	 *
	 * @remarks
	 * This function adds the built-in search service of the map.
	 *
	 * @param features - A Feature Collection.
	 */
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

    /**
	 * Adds Source and Layer to Mapbox.
	 *
	 * @remarks
	 * In Mapbox, when removing a layer using `map.removeLayer()`, the `source`
	 * is not automatically removed and when you add the same source once again,
	 * the library will throw an error saying that the source already exists.
	 * In order to avoid the error, adding source and layer should be done
	 * separately in order to be able remove them one by one.
	 *
	 * @param option - The parameter options for adding new layer.
	 */
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

    /**
	 * Set the mouse cursor display.
	 */
    _setCursorDisplay(id) {
        this._map.on("mouseenter", id, () => {
            this._map.getCanvas().style.cursor = "pointer";
        });

        this._map.on("mouseleave", id, () => {
            this._map.getCanvas().style.removeProperty("cursor");
        });
    }

    /**
	 * Emit draw event.
	 */
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
