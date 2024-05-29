---
toc: false
---

# Lausanne Time Machine

## Les industries liées à l'eau du Flon et de la Louve en 1727, 1831 et 1888

<head>
<link rel="stylesheet" href="style.css">
</head>

Lausanne est une ville traversée par plusieurs cours d'eau se jetant dans le Léman. Les deux principaux, le  Flon et la Louve, s'ils ont donné leur nom à des lieux bien connus de notre centre-ville, sont aujourd'hui en quasi-totalité enterrés dans la partie urbanisée du territoire de la commune. Leur voûtement et leur canalisation se sont faits sur plusieurs siècles, cependant ce processus s'accélère significativement au 19e siècle pour des raisons de salubrité mais aussi d'aménagement du territoire.

Jusqu'au 19e siècle on observe la présence d'une industrie le long du Flon et de la Louve qui tire directement profit de ces cours d’eau, que ce soit comme force motrice ou comme apport d’eau. Nous avons souhaité partir à la recherche des caractéristiques de cette industrie aujourd'hui disparue. A travers l'étude notamment des cadastres anciens et du fond iconographique du Musée Historique de Lausanne, nous avons voulu créer une page web interactive de ces industries comportant des informations quant à leur utilisation, leur forme bâtie et leurs propriétaires. A travers cette étude nous nous posons également la question de l'impact de ces industries sur l'urbanisation lausannoise.

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
                }
            }
            tooltip_html += "<small><i>Cliquez sur le bâtiment pour plus d'informations</i></small><br><br>";
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
        if (image.description) {
            html += image.description + '<br><br>';
        }
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

## Distribution des familles propriétaires

```js
function get_surnames(geojson, is_surname_first) {
    var owners = [];
    geojson.features.forEach(function(feature) {
        if (feature.properties.owner) {
            var owner = feature.properties.owner;
            owner = owner.split(': ').pop();
            owner = owner.split(' (')[0];
            owners = owners.concat(owner.split('|').join(';').split(';'));
        }
    });
    owners = owners.map(s => s.trim());

    var surnames = [];
    owners.forEach(function(owner) {
        if (owner.startsWith('Etat') || owner.startsWith('Vaud')) {
            surnames.push('Etat de Vaud');
            return;
        } else if (owner.startsWith('Commune') || owner.startsWith('Lausanne')) {
            surnames.push('Commune de Lausanne');
            return;
        }
        if (is_surname_first) {
            surnames.push(owner.split(',')[0]);
        } else {
            surnames.push(owner.split(' ')[1]);
        } 
    });
    return surnames;
}
const surnames_berney = get_surnames(berney_buildings_geojson, false);
const surnames_renove = get_surnames(renove_buildings_geojson, true);
```

<div class="card" className="card">

```js
display(Plot.plot({
    marginLeft: 120,
    x: {grid: true, domain: [0, 18], ticks: 19},
    title: "Cadastre Berney 1831",
    marks: [
        Plot.barX(surnames_berney, Plot.groupY({x: "count"}, {sort: "y"})),
        Plot.ruleX([0])
    ]
}));
```

</div>
<div class="card" className="card">

```js
display(Plot.plot({
    marginLeft: 120,
    x: {grid: true, domain: [0, 18], ticks: 19},
    title: "Cadastre Rénové 1888",
    marks: [
        Plot.barX(surnames_renove, Plot.groupY({x: "count"}, {sort: "y"})),
        Plot.ruleX([0])
    ]
}));
```

</div>

On constate ici que le bâti lausannois lié au Flon se centralise petit à petit entre les mains d'un groupe restreint de propriétaires. Cela est probablement dû à la prise d'importance des différents sites industrielles, les propriétaires faisant petit à petit l'acquisition de leurs concurrents. Ces super-propriétaires gagnent dès lors en influence sur le devenir productif du Flon ainsi que sur l'urbanisme lausannois en général. C'est notamment le cas de la famille Mercier qui, après avoir racheté les autres tanneries liés au Flon, est à l'origine du projet de comblement de la vallée et de sa transformation en zone industrielle.

<br>

## Distribution des utilisations

```js
function get_uses(geojson) {
    var uses = [];
    geojson.features.forEach(function(feature) {
        if (feature.properties.use) {
            uses = uses.concat(feature.properties.use.split('|').join(',').split(' et ').join(',').split(','));
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
    marginLeft: 200,
    x: {grid: true, domain: [0, 18], ticks: 19},
    title: "Cadastre Melotte 1727",
    marks: [
        Plot.barX(uses_melotte, Plot.groupY({x: "count"}, {sort: "y"})),
        Plot.ruleX([0])
    ]
}));
```

</div>
<div class="card" className="card">

```js
display(Plot.plot({
    marginLeft: 200,
    x: {grid: true, domain: [0, 18], ticks: 19},
    title: "Cadastre Berney 1831",
    marks: [
        Plot.barX(uses_berney, Plot.groupY({x: "count"}, {sort: "y"})),
        Plot.ruleX([0])
    ]
}));
```

</div>
<div class="card" className="card">

```js
display(Plot.plot({
    marginLeft: 200,
    x: {grid: true, domain: [0, 18], ticks: 19},
    title: "Cadastre Rénové 1888",
    marks: [
        Plot.barX(uses_renove, Plot.groupY({x: "count"}, {sort: "y"})),
        Plot.ruleX([0])
    ]
}));
```

</div>

Ces graphiques illustrent comment l'utilisation du Flon a évolué au fil du temps, passant d'une utilisation mécanique de sa force hydraulique à une utilisation industrielle. Cette transformation est le résultat direct de l'impact de la révolution industrielle sur les méthodes de production. L'hégémonie de la force hydraulique à été supplantée par celle de la machine à vapeur, le Flon n'ayant dès lors plus la même fonction. Autrefois utilisée principalement pour sa force hydraulique, la rivière est désormais principalement exploitée comme une source d'eau pour alimenter les machines à vapeur. Parallèlement à cela, le Flon se peuple d'abitations et de commerces, témoignant d'un réinvestissement de ses alentours par une population qui jusqu'alors évitait ces quartiers réputés malfamés et insalubres.

## Conclusion

Les industries lausannoises situées le long de la rivière du Flon et de la Louve ont traversé plusieurs phases, passant de l'utilisation pré-industrielle de la force hydraulique pour des moulins et des forges à des petites industries artisanales comme les tanneries et les teintureries, avant de connaître une centralisation industrielle majeure avec l'introduction de la machine à vapeur durant la révolution industrielle. Cette évolution industrielle a eu un impact significatif sur l'urbanisation de Lausanne, attirant une population croissante et nécessitant la construction de logements et de commerces autour des zones industrielles. Les pouvoirs publics ont réaménagé la vallée du Flon par des projets d'enfouissement et de comblement, libérant ainsi de nouveaux espaces pour le développement urbain. Cette réorganisation spatiale a facilité la transition des usages productivistes vers des fonctions résidentielles, commerciales et de services, tout en intégrant les vestiges du passé industriel dans le tissu urbain. Ainsi, l'histoire industrielle du Flon a non seulement façonné l'économie locale, mais a également influencé durablement la structure et les dynamiques urbaines de Lausanne.
