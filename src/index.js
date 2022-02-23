import MapboxRenderer from "./mapbox-renderer";

(() => {
    return new nsc.Client(new MapboxRenderer, "container");
})();