---
toc: false
---

# Lausanne Time Machine

## Les industries sur le Flon et la Louve du 17e au 19e siècle 

```js
import * as L from "npm:leaflet";
import { FileAttachment } from "npm:@observablehq/stdlib";

const div = display(document.createElement("div"));
div.style = "height: 500px;";

const map = L.map(div, { fadeAnimation: false })
    .setView([46.5205253, 6.6320297], 16)
    .setMaxBounds(L.latLngBounds([[46.5004601, 6.5729999], [46.5551420, 6.6927337]]))
    .setMinZoom(14)
    .setMaxZoom(18);

// URL for online tiles (example):
// https://github.com/mschertenleib/lausanne_time_machine/raw/main/src/data/berney_tiles/{z}/{x}/{y}.png

const melotte_tiles = L.tileLayer("./_file/data/melotte_tiles/{z}/{x}/{y}.png",
    { minZoom: 14, maxZoom: 18, opacity: 1.0 });
const berney_tiles = L.tileLayer("./_file/data/berney_tiles/{z}/{x}/{y}.png",
    { minZoom: 14, maxZoom: 18, opacity: 1.0 });
const renove_tiles = L.tileLayer("./_file/data/renove_tiles/{z}/{x}/{y}.png",
    { minZoom: 14, maxZoom: 18, opacity: 1.0 });
const osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    { minZoom: 14, maxZoom: 18, opacity: 1.0,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});
```

```js
const melotte_buildings_geojson = FileAttachment("./data/melotte_buildings.geojson").json();
const berney_buildings_geojson = FileAttachment("./data/berney_buildings.geojson").json();
const renove_buildings_geojson = FileAttachment("./data/renove_buildings.geojson").json();
const buildings_json = FileAttachment("./data/buildings.json").json();
```

<style type="text/css">
.info {
    padding: 6px 8px;
    width: 250px;
    font: 14px/16px Arial, Helvetica, sans-serif;
    background: white;
    background: rgba(255,255,255,1.0);
    box-shadow: 0 0 15px rgba(0,0,0,0.2);
    border-radius: 5px;
    color: #222;
    white-space: initial;
}
.info h4 {
    margin: 0 0 5px;
    color: #444;
}
</style>

```js
var melotte = L.featureGroup();
var berney = L.featureGroup();
var renove = L.featureGroup();
var selected_feature;

function get_feature_style(feature) {
    const style = {
        weight: 1,
        opacity: 1.0,
        fillOpacity: 1.0,
        color: "#000000"
    };

    if (feature.properties.use.includes("moulin")) { style.fillColor = "#ff0000"; }
    else if (feature.properties.use.includes("tannerie")) { style.fillColor = "#00ff00"; }
    else if (feature.properties.use.includes("scie")) { style.fillColor = "#0000ff"; }
    else { style.fillColor = "#ff00ff"; }

    return style;
}

function on_feature_mouseover(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 4,
        color: "#000000",
    });
    layer.bringToFront();
}

function on_feature_mouseout(e) {
    var feature_object = Object.values(e.target._layers)[0];
    if (selected_feature !== feature_object) {
        e.target.setStyle(get_feature_style(feature_object.feature));
    }
}

function on_feature_click(e) {
    map.fitBounds(e.target.getBounds());
    var feature_object = Object.values(e.target._layers)[0];
    if (selected_feature !== undefined && selected_feature !== feature_object) {
        selected_feature.setStyle(get_feature_style(selected_feature.feature));
    }
    selected_feature = feature_object;
    L.DomEvent.stopPropagation(e);
    document.getElementById("building_details").hidden = false;
    document.getElementById("building_details").innerText =
        get_building_html(selected_feature.feature.properties.building_id);
}

function on_each_feature(feature, layer, polygons_and_markers) {
    var marker = L.marker(layer.getBounds().getCenter(), { riseOnHover: true });
    var polygon_and_marker = L.featureGroup([layer, marker]);
    polygon_and_marker.on({
        mouseover: on_feature_mouseover,
        mouseout: on_feature_mouseout,
        click: on_feature_click
    });
    var tooltip_html = '';
    if (feature.properties.building_id !== null) {
        const building = buildings_json.buildings.find((b) => b.building_id == feature.properties.building_id);
        if (building !== undefined) {
            tooltip_html += '<h4>' + building.name + '</h4>';
            var image = './_file/data/test.jpg';
            tooltip_html += '<img src="' + image + '" style="width:250px"> <br>';
        }
    }
    tooltip_html += '<b>Utilisation</b>: ' + feature.properties.use + '<br>';
    tooltip_html += '<b>Propriétaire</b>: ' + feature.properties.owner;
    polygon_and_marker.bindTooltip(tooltip_html, {
        sticky: true,
        className: 'info',
        opacity: 1.0
    });
    polygon_and_marker.addTo(polygons_and_markers);
}

function on_map_click(e) {
    selected_feature.setStyle(get_feature_style(selected_feature.feature));
    selected_feature = undefined;
    document.getElementById("building_details").hidden = true;
}

map.on({click: on_map_click});

melotte_tiles.addTo(melotte);
const melotte_buildings = L.geoJSON(melotte_buildings_geojson.features, {
    style: get_feature_style,
    onEachFeature: function(feature, layer) { on_each_feature(feature, layer, melotte); }
});
berney_tiles.addTo(berney);
const berney_buildings = L.geoJSON(berney_buildings_geojson.features, {
    style: get_feature_style,
    onEachFeature: function(feature, layer) { on_each_feature(feature, layer, berney); }
});
renove_tiles.addTo(renove);
const renove_buildings = L.geoJSON(renove_buildings_geojson.features, {
    style: get_feature_style,
    onEachFeature: function(feature, layer) { on_each_feature(feature, layer, renove); }
});

berney.addTo(map);

const base_maps = {
    "Cadastre Melotte 1727": melotte,
    "Cadastre Berney 1831": berney,
    "Cadastre Rénové 1888": renove
};
const overlay_maps = {
    "OpenStreetMap": osm
}
const layer_control = L.control.layers(base_maps, overlay_maps).addTo(map);

L.control.scale().addTo(map);
```

<div id="building_details" hidden>
</div>

```js
function get_building_html(building_id) {
    display(building_id);
    return "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
}
```
