---
toc: false
---

# Lausanne Time Machine

## Les industries liées à l'eau du Flon et de la Louve en 1727, 1831 et 1888

<head>
<link rel="stylesheet" href="style.css">
</head>

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

```js
var melotte = L.featureGroup();
var berney = L.featureGroup();
var renove = L.featureGroup();
var selected_feature;
var selected_building;

function get_feature_style(feature) {
    const style = {
        weight: 1,
        opacity: 1.0,
        fillOpacity: 1.0,
        color: "#000000",
        fillColor: "#757575"
    };

    /*if (feature.properties.use.includes("moulin")) { style.fillColor = "#ff0000"; }
    else if (feature.properties.use.includes("tannerie")) { style.fillColor = "#00ff00"; }
    else if (feature.properties.use.includes("scie")) { style.fillColor = "#0000ff"; }
    else { style.fillColor = "#ff00ff"; }*/

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
    L.DomEvent.stopPropagation(e);
    map.fitBounds(e.target.getBounds());
    var feature_object = Object.values(e.target._layers)[0];
    if (selected_feature !== undefined && selected_feature !== feature_object) {
        selected_feature.setStyle(get_feature_style(selected_feature.feature));
    }
    selected_feature = feature_object;
    selected_building = buildings_json.buildings.find((b) => b.building_id == selected_feature.feature.properties.building_id);
    image_index = 0;
    if (selected_building !== undefined) {
        document.getElementById("building_details").hidden = false;
        set_building_details_html();
        if (selected_building.images) {
            document.getElementById("building_images").hidden = false;
            set_building_image_html();
            set_images_button_label();
        }
    } else {
        document.getElementById("building_details").hidden = true;
        document.getElementById("building_images").hidden = true;
    }
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
            if (building.images && building.preferred_image !== null) {
                const image = building.images.find((i) => i.image_id == building.preferred_image);
                if (image !== undefined) {
                    tooltip_html += '<img src="./_file/data/images/building_' + building.building_id + '/' + image.image_id + '.jpg" style="width:250px"> <br>';
                } else {
                    display("failed to find preferred_image");
                    display(building.preferred_image);
                }
            }
        }
    }
    if (feature.properties.use)
        tooltip_html += '<b>Utilisation</b>: ' + feature.properties.use + '<br>';
    if (feature.properties.owner)
        tooltip_html += '<b>Propriétaire</b>: ' + feature.properties.owner + '<br>';
    if (feature.properties.address)
        tooltip_html += '<b>Adresse</b>: ' + feature.properties.address + '<br>';
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
    selected_building = undefined;
    image_index = 0;
    document.getElementById("building_details").hidden = true;
    document.getElementById("building_images").hidden = true;
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

var image_index = 0;
function set_building_details_html() {
    var html = '<h2>' + selected_building.name + '</h2><br>';
    if (selected_feature.feature.properties.use)
        html += '<b>Utilisation</b>: ' + selected_feature.feature.properties.use + '<br>';
    if (selected_feature.feature.properties.owner)
        html += '<b>Propriétaire</b>: ' + selected_feature.feature.properties.owner + '<br>';
    if (selected_feature.feature.properties.address)
        html += '<b>Adresse</b>: ' + selected_feature.feature.properties.address + '<br>';
    html += '<br>';
    if (selected_building.informations) {
        html += selected_building.informations;
    } else {
        html += "<i>Pas d'informations.</i>";
    }
    document.getElementById("building_details").innerHTML = html;
}
function set_building_image_html() {
    var html = '';
    if (selected_building.images) {
        const image = selected_building.images[image_index];
        html += '<img src="./_file/data/images/building_' + selected_building.building_id + '/' + image.image_id + '.jpg" style="width:100%"><br><br>';
        html += '<b>Date:</b> ';
        if (image.date_begin == image.date_end) {
            html += image.date_begin;
        } else {
            html += 'entre ' + image.date_begin + ' et ' + image.date_end;
        }
        html += '<br><br>';
        html += image.description + '<br><br>';
        if (image.bibliography) {
            html += '<b>Bibliographie:</b> ' + image.bibliography + '<br><br>';
        }
        html += '<b>Source:</b> ' + image.institution + ': <a href="url">' + image.url + '</a>';
    }
    document.getElementById("building_selected_image").innerHTML = html;
}
function set_images_button_label() {
    document.getElementById("images_button_label").innerHTML =
        '<i>Image ' + (image_index + 1) + '/' + selected_building.images.length + '</i>';
}
function next_image() {
    image_index = (image_index + 1) % selected_building.images.length;
    set_building_image_html();
    set_images_button_label();
}
function previous_image() {
    image_index -= 1;
    if (image_index < 0) image_index = selected_building.images.length - 1;
    set_building_image_html();
    set_images_button_label();
}
```

<div class="grid grid-cols-2">
<div class="card" id="building_details" className="card" hidden>
</div>
<div class="card" id="building_images" className="card" hidden>

```js
view(Inputs.button([
    ["Image précédente", () => { previous_image(); }],
    ["Image suivante", () => { next_image(); }],
], {label: html`<a id="images_button_label"></a>`}));
```

<div id="building_selected_image">
</div>
</div>
</div>

<br><br>

```js
function get_uses(geojson) {
    var uses = [];
    geojson.features.forEach(function(feature) {
        if (feature.properties.use) {
            uses = uses.concat(feature.properties.use.split('|').join(',').split('et').join(',').split(','));
        }
    });
    uses = uses.map(s => s.trim());
    return uses;
}
const uses_melotte = get_uses(melotte_buildings_geojson);
const uses_berney = get_uses(berney_buildings_geojson);
const uses_renove = get_uses(renove_buildings_geojson);
var uses = [];
uses_melotte.forEach(use => {uses.push({"use": use, "cadastre": "melotte"})});
uses_berney.forEach(use => {uses.push({"use": use, "cadastre": "berney"})});
uses_renove.forEach(use => {uses.push({"use": use, "cadastre": "renove"})});
```

<div class="card" className="card">

```js
display(Plot.plot({
  marginBottom: 100,
  x: {paddingOuter: 0.2, tickRotate: 90},
  y: {grid: true},
  color: {legend: true},
  marks: [
    Plot.barY(uses_melotte, Plot.groupX({y: "count"}, {sort: {x: "y"}})),
    Plot.ruleY([0])
  ]
}));
display(Plot.plot({
  marginBottom: 100,
  x: {paddingOuter: 0.2, tickRotate: 90},
  y: {grid: true},
  color: {legend: true},
  marks: [
    Plot.barY(uses_berney, Plot.groupX({y: "count"}, {sort: {x: "y"}})),
    Plot.ruleY([0])
  ]
}));
display(Plot.plot({
  marginBottom: 100,
  x: {paddingOuter: 0.2, tickRotate: 90},
  y: {grid: true},
  color: {legend: true},
  marks: [
    Plot.barY(uses_renove, Plot.groupX({y: "count"}, {sort: {x: "y"}})),
    Plot.ruleY([0])
  ]
}));
```

</div>
