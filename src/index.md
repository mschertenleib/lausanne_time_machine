---
toc: false
---

# Lausanne Time Machine

## Les industries sur le Flon et la Louve du 17e au 19e siècle 

```js
import * as M from "./components/interactive_map.js";
import * as L from "npm:leaflet";
import { FileAttachment } from "npm:@observablehq/stdlib";

const div = display(document.createElement("div"));
div.style = "height: 600px;";

const map = L.map(div).setView([46.5205253, 6.6320297], 16);

// https://github.com/mschertenleib/lausanne_time_machine/raw/main/src/data/berney_1831_tiles/{z}/{x}/{y}.png

const melotte = L.tileLayer("./_file/data/melotte_tiles/{z}/{x}/{y}.png",
    { minZoom: 14, maxZoom: 18, opacity: 0.7 });
const berney = L.tileLayer("./_file/data/berney_1831_tiles/{z}/{x}/{y}.png",
    { minZoom: 14, maxZoom: 18, opacity: 0.7 });
const renove = L.tileLayer("./_file/data/renove_1888_tiles/{z}/{x}/{y}.png",
    { minZoom: 14, maxZoom: 18, opacity: 0.7 });
const osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    { minZoom: 14, maxZoom: 18, opacity: 0.7,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});
```

```js
const melotte_buildings_geojson = FileAttachment("./data/melotte_buildings.geojson").json();
const berney_buildings_geojson = FileAttachment("./data/berney_buildings.geojson").json();
const renove_buildings_geojson = FileAttachment("./data/renove_buildings.geojson").json();
```

```js
var info = L.control();
info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};
info.update = function (props) {
    this._div.innerHTML = '<h4>Use</h4>' +
        (props
        ? '<b>' + props.use + '</b>'
        : '');
};
info.addTo(map);
```

<style type="text/css">
.info {
    padding: 6px 8px;
    font: 14px/16px Arial, Helvetica, sans-serif;
    background: white;
    background: rgba(255,255,255,1.0);
    box-shadow: 0 0 15px rgba(0,0,0,0.2);
    border-radius: 5px;
    color: #555;
}
.info h4 {
    margin: 0 0 5px;
    color: #000;
}
</style>

```js

var melotte_feature_group = L.featureGroup();
var berney_feature_group = L.featureGroup();
var renove_feature_group = L.featureGroup();
var selected_feature;

function on_feature_mouseover(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 3,
        color: "#000000",
    });
    layer.bringToFront();
    info.update(Object.values(e.target._layers)[0].feature.properties);
}
function on_feature_mouseout(e) {
    var feature_object = Object.values(e.target._layers)[0];
    if (selected_feature !== feature_object) {
        const style = M.get_feature_style(feature_object.feature);
        e.target.setStyle(style);
        if (selected_feature === undefined) {
            info.update();
        } else {
            info.update(selected_feature.feature.properties);
        }
    }
}
function on_feature_click(e) {
    map.fitBounds(e.target.getBounds());
    if (selected_feature !== undefined) {
        selected_feature.setStyle(M.get_feature_style(selected_feature.feature));
    }
    selected_feature = Object.values(e.target._layers)[0];
    L.DomEvent.stopPropagation(e);
}
function on_each_feature(feature, layer, polygons_and_markers) {
    var marker = L.marker(layer.getBounds().getCenter(), { riseOnHover: true });
    var polygon_and_marker = L.featureGroup([layer, marker]);
    polygon_and_marker.on({
        mouseover: on_feature_mouseover,
        mouseout: on_feature_mouseout,
        click: on_feature_click
    });
    polygon_and_marker.addTo(polygons_and_markers);
}
function on_map_click(e) {
    selected_feature.setStyle(M.get_feature_style(selected_feature.feature));
    info.update();
    selected_feature = undefined;
}
map.on({click: on_map_click});

const melotte_buildings = L.geoJSON(melotte_buildings_geojson.features, {
    style: M.get_feature_style,
    onEachFeature: function(feature, layer) { on_each_feature(feature, layer, melotte_feature_group); }
});
const berney_buildings = L.geoJSON(berney_buildings_geojson.features, {
    style: M.get_feature_style,
    onEachFeature: function(feature, layer) { on_each_feature(feature, layer, berney_feature_group); }
});
const renove_buildings = L.geoJSON(renove_buildings_geojson.features, {
    style: M.get_feature_style,
    onEachFeature: function(feature, layer) { on_each_feature(feature, layer, renove_feature_group); }
});

const base_maps = {
    "Cadastre Melotte 1727": melotte,
    "Cadastre Berney 1831": berney,
    "Cadastre Rénové 1888": renove,
    "OpenStreetMap": osm
};
const layer_control = L.control.layers(base_maps).addTo(map);

L.control.scale().addTo(map);

const year = view(Inputs.range([1720, 1910], {step: 10, value: 1850, label: "Date", width: 1000}));
```

```js
M.switch_layer(
    map,
    [melotte, berney, renove],
    [melotte_feature_group, berney_feature_group, renove_feature_group],
    M.year_to_index(year)
);
```
