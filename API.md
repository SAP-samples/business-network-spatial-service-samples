# API Reference

<a id="interface-map-renderer"></a>

### Interface MapRenderer

### Overview

A Map Renderer interface that can be used to implement into any Map Control library and use together with [NSC Client](https://github.wdf.sap.corp/BNC/bnc-nsc-server).

### Usage

Load the interface into the app and implement all the required methods.

#### Accessor Properties

Summary

| Method                                | Description                                    |
| :------------------------------------ | :--------------------------------------------- |
| [center](#accessor-properties-center) | The inital geographical centerpoint of the map |
| [style](#accessor-properties-style)   | The map's style                                |
| [zoom](#accessor-properties-zoom)     | The initial zoom level of the map              |

<a id="accessor-properties-center"></a>
**center**

The inital geographical centerpoint of the map.

Visibility: public

Setter

```js
set center(value : Coordinate) : void
```

| Param | Type       | Default Value | Description                                     |
| :---- | :--------- | :------------ | :---------------------------------------------- |
| value | Coordinate |               | The initial geographical centerpoint of the map |

Getter

```js
get center() : Coordinate
```

| Returns    | Description                                     |
| :--------- | :---------------------------------------------- |
| Coordinate | The initial geographical centerpoint of the map |

<a id="accessor-properties-style"></a>
**style**

The map's style.

Visibility: public

Setter

```js
set style(value : string) : void
```

| Param | Type   | Default Value | Description     |
| :---- | :----- | :------------ | :-------------- |
| value | string |               | The map's style |

Getter

```js
get style() : string
```

| Returns | Description     |
| :------ | :-------------- |
| string  | The map's style |

<a id="accessor-properties-zoom"></a>
**zoom**

The initial zoom level of the map.

Visibility: public

Setter

```js
set zoom(value : number) : void
```

| Param | Type   | Default Value | Description                       |
| :---- | :----- | :------------ | :-------------------------------- |
| value | number |               | The initial zoom level of the map |

Getter

```js
get zoom() : number
```

| Returns | Description                       |
| :------ | :-------------------------------- |
| number  | The initial zoom level of the map |

#### Event Handlers

Summary

| Event Handler                                              | Description                              |
| :--------------------------------------------------------- | :--------------------------------------- |
| [onClick](#event-handler-on-click)                         | Handler for `click` event on map         |
| [onContextMenu](#event-handler-on-context-menu)            | Handler for `contextMenu` event on map   |
| [onClickLayer](#event-handler-on-click-layer)              | Handler for `click` event on layer       |
| [onContextMenuLayer](#event-handler-on-context-menu-layer) | Handler for `contextMenu` event on layer |
| [onDraw](#event-handler-on-draw)                           | Handler for `draw` event                 |
| [onSelectionChange](#event-handler-on-selection-change)    | Handler for `selectionChange` event      |

<a id="event-handler-on-click"></a>
**onClick**

Handler for `click` event on map.

Visibility: public

```js
onClick(listener : EventListener) : void
```

| Param    | Type         | Description             |
| :------- | :----------- | :---------------------- |
| listener | EventListner | Event listener function |

<a id="event-handler-on-context-menu"></a>
**onContextMenu**

Handler for `contextMenu` event on map.

Visibility: public

```js
onContextMenu(listener : EventListener) : void
```

| Param    | Type         | Description             |
| :------- | :----------- | :---------------------- |
| listener | EventListner | Event listener function |

<a id="event-handler-on-click-layer"></a>
**onClickLayer**

Handler for `click` event on layer.

Visibility: public

```js
onClickLayer(listener : EventListener) : void
```

| Param    | Type         | Description             |
| :------- | :----------- | :---------------------- |
| listener | EventListner | Event listener function |

<a id="event-handler-on-context-menu-layer"></a>
**onContextMenuLayer**

Handler for `contextMenu` event on layer.

Visibility: public

```js
onContextMenuLayer(listener : EventListener) : void
```

| Param    | Type         | Description             |
| :------- | :----------- | :---------------------- |
| listener | EventListner | Event listener function |

<a id="event-handler-on-draw"></a>
**onDraw**

Handler for `draw` event.

Visibility: public

```js
onDraw(listener : EventListener) : void
```

| Param    | Type         | Description             |
| :------- | :----------- | :---------------------- |
| listener | EventListner | Event listener function |

<a id="event-handler-on-selection-change"></a>
**onSelectionChange**

Handler for `selectionChange` event.

Visibility: public

```js
onSelectionChange(listener : EventListener) : void
```

| Param    | Type         | Description             |
| :------- | :----------- | :---------------------- |
| listener | EventListner | Event listener function |

#### Methods

Summary

| Method                                  | Description                                                                                 |
| :-------------------------------------- | :------------------------------------------------------------------------------------------ |
| [initialize](#method-initialize)        | Initialize the map renderer                                                                 |
| [addLayer](#method-add-layer)           | Add a layer into the map                                                                    |
| [addLayers](#method-add-layers)         | Add layers into the map                                                                     |
| [hideLayers](#method-hide-layers)       | Hide layers from map                                                                        |
| [zoomTo](#method-zoom-to)               | Zooms the map to the specified zoom level                                                   |
| [removeFeature](#method-remove-feature) | Remove all features in the map                                                              |
| [draw](#method-draw)                    | Activate draw mode on the map                                                               |
| [setBounds](#method-set-bounds)         | Pans and zooms the map to contain its visible area within the specified geographical bounds |
| [addSearchBar](#method-add-search-bar)  | Add a search bar into the map                                                               |

<a id="method-initilize"></a>
**initialize**

Initialize the map renderer.

Visibility: public

```js
initialize(options : MapRendererOptions) : this
```

| Param           | Type               | Default Value | Description                 |
| :-------------- | :----------------- | :------------ | :-------------------------- |
| options         | MapRendererOptions |               |                             |
| &emsp;apiKey    | string             |               | Map API key                 |
| &emsp;container | string             |               | The container element ID    |
| &emsp;style?    | string             |               | Map style                   |
| &emsp;zoom?     | number             |               | Map initial zoom level      |
| &emsp;center    | Coordinate         |               | Map initial center position |

| Returns | Description                                           |
| :------ | :---------------------------------------------------- |
| this    | Reference to `this` in order to allow method chaining |

<a id="method-add-layer"></a>
**addLayer**

Add a layer into the map.

Visibility: public

```js
addLayer(options : LayerOptions) : this
```

| Param                   | Type                       | Default Value | Description                                          |
| :---------------------- | :------------------------- | :------------ | :--------------------------------------------------- |
| options                 | LayerOptions               |               |                                                      |
| &emsp;id                | string                     |               | Layer ID                                             |
| &emsp;type              | LayerType                  |               | Layer type                                           |
| &emsp;name?             | string                     |               | Layer name                                           |
| &emsp;description?      | string                     |               | Layer description                                    |
| &emsp;source            | AnySourceOptions \| string |               | Layer source                                         |
| &emsp;layout?           | object                     |               | Layer layout config                                  |
| &emsp;paint?            | object                     |               | Layer paint config                                   |
| &emsp;settings?         | object                     |               | Layer settings config                                |
| &emsp;metadata?         | object                     |               | Layer metadata config                                |
| &emsp;isVisible         | boolean                    |               | Determine whether layer is visible                   |
| &emsp;isUpdateable      | boolean                    |               | Determine whether layer is editable                  |
| &emsp;groupName?        | string                     |               | The group name of the layer                          |
| &emsp;isToggleable      | boolean                    |               | Determine whether layer is toggleable                |
| &emsp;isIncludedForBBox | boolean                    |               | Determine whether layer is included for bounding box |

| Returns | Description                                           |
| :------ | :---------------------------------------------------- |
| this    | Reference to `this` in order to allow method chaining |

<a id="method-add-layers"></a>
**addLayers**

Add layers into the map.

Visibility: public

```js
addLayers(layers : LayerOptions[]) : this
```

| Param                   | Type                       | Default Value | Description                                          |
| :---------------------- | :------------------------- | :------------ | :--------------------------------------------------- |
| layers                  | LayerOptions[]             |               |                                                      |
| &emsp;id                | string                     |               | Layer ID                                             |
| &emsp;type              | LayerType                  |               | Layer type                                           |
| &emsp;name?             | string                     |               | Layer name                                           |
| &emsp;description?      | string                     |               | Layer description                                    |
| &emsp;source            | AnySourceOptions \| string |               | Layer source                                         |
| &emsp;layout?           | object                     |               | Layer layout config                                  |
| &emsp;paint?            | object                     |               | Layer paint config                                   |
| &emsp;settings?         | object                     |               | Layer settings config                                |
| &emsp;metadata?         | object                     |               | Layer metadata config                                |
| &emsp;isVisible         | boolean                    |               | Determine whether layer is visible                   |
| &emsp;isUpdateable      | boolean                    |               | Determine whether layer is editable                  |
| &emsp;groupName?        | string                     |               | The group name of the layer                          |
| &emsp;isToggleable      | boolean                    |               | Determine whether layer is toggleable                |
| &emsp;isIncludedForBBox | boolean                    |               | Determine whether layer is included for bounding box |

| Returns | Description                                           |
| :------ | :---------------------------------------------------- |
| this    | Reference to `this` in order to allow method chaining |

<a id="method-hide-layers"></a>
**hideLayers**

Hide layers into the map.

Visibility: public

```js
hideLayers(layers : LayerOptions[]) : this
```

| Param                   | Type                       | Default Value | Description                                          |
| :---------------------- | :------------------------- | :------------ | :--------------------------------------------------- |
| layers                  | LayerOptions[]             |               |                                                      |
| &emsp;id                | string                     |               | Layer ID                                             |
| &emsp;type              | LayerType                  |               | Layer type                                           |
| &emsp;name?             | string                     |               | Layer name                                           |
| &emsp;description?      | string                     |               | Layer description                                    |
| &emsp;source            | AnySourceOptions \| string |               | Layer source                                         |
| &emsp;layout?           | object                     |               | Layer layout config                                  |
| &emsp;paint?            | object                     |               | Layer paint config                                   |
| &emsp;settings?         | object                     |               | Layer settings config                                |
| &emsp;metadata?         | object                     |               | Layer metadata config                                |
| &emsp;isVisible         | boolean                    |               | Determine whether layer is visible                   |
| &emsp;isUpdateable      | boolean                    |               | Determine whether layer is editable                  |
| &emsp;groupName?        | string                     |               | The group name of the layer                          |
| &emsp;isToggleable      | boolean                    |               | Determine whether layer is toggleable                |
| &emsp;isIncludedForBBox | boolean                    |               | Determine whether layer is included for bounding box |

| Returns | Description                                           |
| :------ | :---------------------------------------------------- |
| this    | Reference to `this` in order to allow method chaining |

<a id="method-zoom-to"></a>
**zoomTo**

Zooms the map to the specified zoom level.

Visibility: public

```js
zoomTo(zoom : number) : this
```

| Param | Type   | Default Value | Description                     |
| :---- | :----- | :------------ | :------------------------------ |
| zoom  | number |               | The zoom level to transition to |

| Returns | Description                                           |
| :------ | :---------------------------------------------------- |
| this    | Reference to `this` in order to allow method chaining |

<a id="method-remove-feature"></a>
**removeFeature**

Remove all features in the map.

Visibility: public

```js
removeFeature() : void
```

<a id="method-draw"></a>
**draw**

Activate draw mode on the map.

Visibility: public

```js
draw(mode : string) : void
```

| Param | Type   | Default Value | Description                                             |
| :---- | :----- | :------------ | :------------------------------------------------------ |
| mode  | string |               | The draw mode. Refer to enum [DrawMode](enum-draw-mode) |

<a id="method-set-bounds"></a>
**setBounds**

Pans and zooms the map to contain its visible area within the specified geographical bounds.

Visibility: public

```js
setBounds(positions : LngLatBoundsLike, padding : number) : void
```

| Param     | Type             | Default Value | Description                                  |
| :-------- | :--------------- | :------------ | :------------------------------------------- |
| positions | LngLatBoundsLike |               | Array of numbers with a length of 4 elements |
| padding   | number           |               | Numerical value of Bounding box padding      |

<a id="method-add-search-bar"></a>
**addSearchBar**

Add a search bar into the map.

Visibility: public

```js
addSearchBar(features : GeoJSON.FeatureCollection) : HTMLElement
```

| Param    | Type                      | Default Value | Description          |
| :------- | :------------------------ | :------------ | :------------------- |
| features | GeoJSON.FeatureCollection |               | A feature collection |

| Returns     | Description                    |
| :---------- | :----------------------------- |
| HTMLElement | HTML element of the search bar |

### enum EventType

#### Overview

Different predefined event types for [MapRenderer](#interface-map-renderer)

#### Fields

| Name               | Type | Description                  |
| :----------------- | :--- | :--------------------------- |
| CLICK              |      | Click event on Global        |
| CONTEXT_MENU       |      | Context Menu event on Global |
| CLICK_LAYER        |      | Click event on Layer         |
| CONTEXT_MENU_LAYER |      | Context Menu event on Layer  |
| DRAW               |      | Draw event                   |
| SELECTION_CHANGE   |      | Selection Change event       |

<a id="enum-draw-mode"></a>

### enum DrawMode

#### Overview

Different predefined draw mode types for [MapRenderer](#interface-map-renderer)

#### Fields

| Name        | Type | Description                |
| :---------- | :--- | :------------------------- |
| POINT       |      | To draw Point on Map       |
| POLYGON     |      | To draw Polygon on Map     |
| LINE_STRING |      | To draw Line String on Map |

### enum GeometryType

#### Overview

Different predefined geometry types for [MapRenderer](#interface-map-renderer)

#### Fields

| Name        | Type | Description |
| :---------- | :--- | :---------- |
| POINT       |      | Point       |
| POLYGON     |      | Polygon     |
| LINE_STRING |      | Line String |

### enum GeometrySourceType

#### Overview

Different predefined geometry source types for [MapRenderer](#interface-map-renderer)

#### Fields

| Name               | Type | Description                 |
| :----------------- | :--- | :-------------------------- |
| FEATURE            |      | Geometry Feature            |
| FEATURE_COLLECTION |      | Geometry Feature Collection |
