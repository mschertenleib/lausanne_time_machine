---
toc: false
---

# Lausanne Time Machine

## Les industries liées à l'eau du Flon et de la Louve en 1727, 1831 et 1888

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
    const building = buildings_json.buildings.find((b) => b.building_id == selected_feature.feature.properties.building_id);
    document.getElementById("building_details").innerHTML = get_building_html(building);
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

<div class="grid grid-cols-2">
<div class="card" id="building_details" hidden>
</div>
</div>

```js
function get_building_html(building) {
    var html = '<h2>' + building.name + '</h2>';
    html += building.description;
    return html;
}
```

## Études de cas

### Familles ayant eu un impact significatif sur les industries liées à l'eau

<div class="grid grid-cols-2">
<div class="card">
<h2>Merciers</h2>
<p>Id ornare arcu odio ut sem nulla pharetra. Aliquet lectus proin nibh nisl condimentum id venenatis a. Feugiat sed lectus vestibulum mattis ullamcorper velit. Aliquet nec ullamcorper sit amet. Sit amet tellus cras adipiscing. Condimentum id venenatis a condimentum vitae. Semper eget duis at tellus. Ut faucibus pulvinar elementum integer enim.</p>
<p>Et malesuada fames ac turpis. Integer vitae justo eget magna fermentum iaculis eu non diam. Aliquet risus feugiat in ante metus dictum at. Consectetur purus ut faucibus pulvinar.</p>
</div>
<div class="card">
<h2>Rochat</h2>
<p>The Rochat family's connection to Lausanne's industrial development is deeply rooted in the 19th century, particularly through the entrepreneurial endeavors of Jean Rochat. Jean Rochat was a pivotal figure in the industrialization of Lausanne during this period. He was involved in various industries, including textiles, machinery, and manufacturing. His ventures contributed significantly to the city's economic growth and transformation. One of Jean Rochat's most notable achievements was his establishment of textile mills in Lausanne, which played a crucial role in the city's emergence as a center for textile production. These mills not only provided employment opportunities for local residents but also helped bolster Lausanne's reputation as an industrial hub.</p>
<p>In addition to his contributions to the textile industry, Jean Rochat was also involved in other sectors, such as machinery manufacturing and real estate development. His entrepreneurial spirit and vision helped shape the landscape of Lausanne, laying the foundation for its continued prosperity.The Rochat family's involvement in Lausanne's industrial development extends beyond Jean Rochat's generation, with subsequent members of the family continuing to contribute to the city's economic and cultural advancement. Today, their legacy remains an integral part of Lausanne's history and identity.</p>
</div>
<div class="card">
<h2>Delisle</h2>
<p>Id ornare arcu odio ut sem nulla pharetra. Aliquet lectus proin nibh nisl condimentum id venenatis a. Feugiat sed lectus vestibulum mattis ullamcorper velit. Aliquet nec ullamcorper sit amet. Sit amet tellus cras adipiscing. Condimentum id venenatis a condimentum vitae. Semper eget duis at tellus. Ut faucibus pulvinar elementum integer enim.</p>
<p>Et malesuada fames ac turpis. Integer vitae justo eget magna fermentum iaculis eu non diam. Aliquet risus feugiat in ante metus dictum at. Consectetur purus ut faucibus pulvinar.</p>
</div>
</div>
