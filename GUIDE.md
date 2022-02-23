This is a step-by-step guide to develop a simple web application with NSC Client and Mapbox.

# Step 1: Create new map app

In this step, you will a new project to build your Mapbox app with NSC Client.

1. Open a Terminal or Command Prompt window and navigate to the space where you want to develop the app. Then create a new folder:

    ```shell
    > mkdir nss-map
    > cd nss-map
    ```

2. Run the following command to initilize the project:

    ```shell
    > npm init -y
    ```

3. The command will then generate a `package.json` with the default metadata. Next, install the dependencies:

    ```shell
    > npm i -g live-server
    > npm i @sap/nsc-client mapbox-gl events
    > npm i copy-webpack-plugin webpack webpack-cli worker-loader --save-dev
    ```

4. Open `package.json` file and add the following scripts:

    ```json
    {
        ...
        "scripts": {
            ...
            "build": "webpack --mode=production",
            "start": "live-server --open=index.html?mock=true public"
            ...
        }
        ...
    }
    ```

5. Create a new file name `webpack.config.js` and paste the following code to the file:

    ```js
    const path = require('path');
    const CopyPlugin = require('copy-webpack-plugin');

    module.exports = {
        entry: './src/index.js',
        module: {
            rules: [
                {
                    test: /\bmapbox-gl-csp-worker.js\b/i,
                    use: { loader: 'worker-loader' }
                }
            ]
        },
        plugins: [
            new CopyPlugin({
                patterns: [
                    { from: 'node_modules/@sap/nsc-client', to: './nsc-client' }
                ]
            })
        ],
        output: {
            path: path.resolve(__dirname, 'public'),
            filename: 'bundle.js'
        },
        performance: {
            hints: false,
            maxEntrypointSize: 512000,
            maxAssetSize: 512000
        }
    };
    ```

6. In the end of this step, your folder structure will look as below:

    ![](images/1.png)

# Step 2: Add index.html and CSS style to public folder

In this step, you will create a `public` folder to host the index.html and CSS style files.

1. At the root of the project, create a new directory `public`:

    ```shell
    > mkdir public
    ```

    ![](images/2.png)

2. Create a new `index.html` file and paste the following code. This will serve as the entry page to the web app:

    ```html
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <title>Map</title>

        <meta charset="utf-8" />
        <meta name="viewport"
            content="width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1">

        <link rel="stylesheet" href="css/styles.css">
    </head>

    <body>
        <div id="container"></div>
        <script src="./nsc-client/bundle.js"></script>
        <script src="./bundle.js"></script>
    </body>

    </html>
    ```

3. Next, create a new directory `css` and in the directory, create new CSS file `styles.css` with the following code:

    ```css
    body {
        margin: 0;
        padding: 0;
    }

    #container {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
    }
    ```

# Step 3: Instantiate NSC Client object

Next, you will be creating a new `src` folder to store all the source code files.

1. At the root of the project, create a new directory `src`.

    ```shell
    > mkdir src
    ```

    ![](images/3.png)

2. In the `src` directory, create a new file `index.js` with the following code:

    ```js
    import MapboxRenderer from "./mapbox-renderer";

    (() => {
        return new nsc.Client(new MapBoxRenderer, "container");
    })();
    ```

    > **NOTE**: index.js serves as the entry point for the app and we use this to instantiate the NSC Client including the custom map renderer implementation. 

# Step 4: Create custom map renderer

In this step, you will create the mapbox renderer with it's implementation. To use map renderer with NSC Client, we need to follow the methods define by the MapRenderer interface.

The API for MapRenderer can be found [here](./API.md).

In this guide, we will on focus on implementing the `initialization`, `setBounds`, `addLayers` and it's corresponding methods.

1. Create a new file `mapbox-renderer.js` in the `src` directory.

2. Copy and paste the following code into `mapbox-renderer.js`:

    ```js
    import mapboxgl, { Map, NavigationControl } from "mapbox-gl/dist/mapbox-gl";
    import MapboxDraw from "@mapbox/mapbox-gl-draw";
    import MapboxWorker from "mapbox-gl/dist/mapbox-gl-csp-worker";
    import EventEmitter from "events";

    export default class MapboxRenderer {

        constructor() {
            mapboxgl.workerClass = MapboxWorker;

            this._events = new EventEmitter();
        }

        get style() { }

        set style(value) { }

        get center() { }

        set center(value) { }

        get zoom() { }

        set zoom(value) { }

        onClick(listener) { }

        onClickLayer(listener) { }

        onContextMenu(listener) { }

        onContextMenuLayer(listener) { }

        onDraw(listener) { }

        onSelectionChange(listener) { }

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
        }

        addLayers(layers) {
            layers.forEach(layer => {
                this.addLayer(layer);
            });

            return this;
        }

        hideLayers(layers) { }

        zoomTo(zoom) { }

        removeFeature() { }

        draw(mode) { }

        setBounds(coordinates, padding) {
            this._map.fitBounds(coordinates, { padding });
        }

        addSearchBar(featureCollection) { }

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

    }
    ```

    > **NOTE**: For the full source code of Mapbox implementation, please find it in [/src/mapbox-renderer.js](./src/mapbox-renderer.js). 

# Step 5: Build the project

1. Run the following command to build the project:

    ```shell
    > npm run build
    ```

# Step 6: Run the app locally

1. Run the following command to start the app locally:

    ```shell
    > npm start
    ```

2. The app will start the live server and launch the web app using your default browser with a URL parameter `mock=true`.

    ```url
    http://localhost:8080/?mock=true
    ```
