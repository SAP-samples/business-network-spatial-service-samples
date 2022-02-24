import MapboxRenderer from "./mapbox-renderer";

(() => {
    // instantiate the NSC Client object. 2 parameters are required:
    // first: the custom map renderer object
    // second: the element ID of the container in index.html
    return new nsc.Client(new MapboxRenderer, "container");
})();