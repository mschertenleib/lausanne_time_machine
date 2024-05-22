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

const melotte_buildings_geojson = await FileAttachment("./data/melotte_buildings.geojson").json();
const berney_buildings_geojson = await FileAttachment("./data/berney_buildings.geojson").json();
const renove_buildings_geojson = await FileAttachment("./data/renove_buildings.geojson").json();

const melotte_buildings = L.geoJSON(melotte_buildings_geojson.features, {
    style: M.get_feature_style,
    onEachFeature: function(feature, layer) {
        layer.bindPopup("blablabla");
        //L.marker(layer.getBounds().getCenter()).addTo(map);
    }
});
const berney_buildings = L.geoJSON(berney_buildings_geojson.features, {
    style: M.get_feature_style,
    onEachFeature: function(feature, layer) {
        layer.bindPopup("blablabla");
        //L.marker(layer.getBounds().getCenter()).addTo(map);
    }
});

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
}
.info h4 {
    margin: 0 0 5px;
    color: #777;
}
</style>

```js
function highlight_feature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 3,
        color: "#000000",
    });
    layer.bringToFront();
    info.update(layer.feature.properties);
}
function reset_highlight(e) {
    e.target.setStyle(M.get_feature_style(e.target.feature));
    info.update();
}
function zoom_to_feature(e) {
    map.fitBounds(e.target.getBounds());
}
function on_each_feature(feature, layer) {
    layer.on({
        mouseover: highlight_feature,
        mouseout: reset_highlight,
        click: zoom_to_feature
    });
    //layer.bindPopup("blablabla");
    //L.marker(layer.getBounds().getCenter()).addTo(map);
}

const renove_buildings = L.geoJSON(renove_buildings_geojson.features, {
    style: M.get_feature_style,
    onEachFeature: on_each_feature
});

const base_maps = {
    "Melotte": melotte,
    "Berney": berney,
    "Rénové": renove,
    "OSM": osm
};
const overlay_maps = {
    "Bâtiments Melotte": melotte_buildings,
    "Bâtiments Berney": berney_buildings,
    "Bâtiments Rénové": renove_buildings
};
const layer_control = L.control.layers(base_maps, overlay_maps).addTo(map);

L.control.scale().addTo(map);




const year = view(Inputs.range([1720, 1910], {step: 10, value: 1850, label: "Date", width: 1000}));
```

```js
M.switch_layer(
    map,
    [melotte, berney, renove],
    [melotte_buildings, berney_buildings, renove_buildings],
    M.year_to_index(year)
);
```
