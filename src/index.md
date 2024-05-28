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
                const image_id = building.images[building.preferred_image].image_id;
                tooltip_html += '<img src="./_file/data/images/' + image_id + '.jpg" style="width:250px"> <br>';
            }
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
    html += '<b>Utilisation</b>: ' + selected_feature.feature.properties.use + '<br>';
    html += '<b>Propriétaire</b>: ' + selected_feature.feature.properties.owner + '<br><br>';
    if (selected_building.description) {
        html += selected_building.description;
    } else {
        html += "<i>Pas d'informations.</i>";
    }
    document.getElementById("building_details").innerHTML = html;
}
function set_building_image_html() {
    var html = '';
    if (selected_building.images) {
        const image = selected_building.images[image_index];
        html += '<img src="./_file/data/images/' + image.image_id + '.jpg" style="width:100%"><br><br>';
        html += '<i>Date: ';
        if (image.date_begin == image.date_end) {
            html += image.date_begin;
        } else {
            html += 'entre ' + image.date_begin + ' et ' + image.date_end;
        }
        html += '</i><br><br>';
        html += image.description;
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

<style type="text/css">
.info {
    padding: 6px 8px;
    width: 250px;
    font: 14px/16px Arial, Helvetica, sans-serif;
    background: white;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    color: #222;
    white-space: initial;
}
.info h4 {
    margin: 0 0 5px;
    color: #444;
}
.card {
    padding: 20px 20px;
    font: 14px/16px Arial, Helvetica, sans-serif;
    box-shadow: 0 0 15px rgba(0,0,0,0.2);
    border-radius: 10px;
    color: light-dark(#222, #bbb);
    white-space: initial;
    text-align: justify;
    text-justify: inter-word;
}
.card h2 {
    margin: 0 0 10px;
    font: 20px/22px Arial, Helvetica, sans-serif;
    color: light-dark(#444, #999);
    text-align: center;
}
</style>

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
            uses = uses.concat(feature.properties.use.split('|').join(',').split(','));
        }
    });
    uses = uses.map(s => s.trim());
    return uses;
}
const uses_melotte = get_uses(melotte_buildings_geojson);
const uses_berney = get_uses(berney_buildings_geojson);
const uses_renove = get_uses(renove_buildings_geojson);
```

```js
Plot.rectX(uses_berney, Plot.groupY({x: "count"}, {sort: {y: "x"}})).plot()
```

<br><br>

## Études de cas

### Familles ayant eu un impact significatif sur les industries liées à l'eau

<div class="grid grid-cols-2">
<div class="card">
<h2>Kohler</h2>

Fondée en 1830 par Charles-Amédée Kohler et son frère Frédéric, la Chocolaterie Kohler est l’une des pionnières de l’industrie chocolatière suisse. Fils d’Amédée Kohler, un marchand en denrées coloniales actif à Lausanne depuis 1793, les deux frères installent initialement leur chocolaterie au Petit-St-Jean. Charles-Amédée y crée les tout premiers chocolats combinés avec des amandes et des fruits secs, octroyant une large renommée à l’entreprise.

En 1849, Charles-Amédée achète le moulin municipal de Sauvabelin en vue de moderniser la production, et de répondre à une demande croissante. Il utilise alors la force hydraulique du Flon pour broyer les fèves de cacao, optimisant les procédés de fabrication et augmentant sensiblement la production.

En 1865, il transmet l’entreprise à ses fils, Charles-Amédée II et Adolphe qui continuent de la moderniser. En 1887, Amédée-Louis et Jean-Jacques Kohler, fils de Charles-Amédée II, achètent un moulin et un canal, transformant la propriété de Sauvabelin en un centre de production. La scierie y est utilisée comme site de fabrication jusqu’à la construction d’une usine à Echandens, entre 1894 et 1896. Celle-ci permet alors d’augmenter la production jusqu’en 1907, jouant un rôle crucial dans l’expansion de la marque Köhler.

À l’initiative de Jean-Jacques Kohler, la chocolaterie fusionne en 1904 avec l’entreprise Daniel Peter, pionnier du chocolat au lait. Cette fusion donne alors naissance à la Société Générale Suisse de Chocolats Peter et Kohler réunis. Jean-Jacques Kohler initie par la suite des négociations avec Auguste Roussy de Nestlé. Un accord signé en 1904 confie à Peter et Kohler la fabrication du chocolat au lait de marque “Nestlé”, limitant Nestlé à la seule usine de Sauvabelin. En 1911, la société est rebaptisée Société Peter, Cailler, Kohler, Chocolats Suisses S. A. (PCK). L’entité se lie finalement à Nestlé en 1929, consolidant sa position dans l’industrie mondiale.

L’utilisation stratégique des moulins, à Sauvabelin puis à Echandens, permet à la Chocolaterie Kohler d’optimiser sa production, assurant sa pérennité et sa renommée. L’histoire de la Chocolaterie Kohler et de ses innovations illustre ainsi l’évolution de l’industrie du chocolat en Suisse, puis de son expansion à l’internationale.

</div>
<div class="card">
<h2>Rochat</h2>

La famille Rochat a joué un rôle crucial dans le développement industriel de la Vallée de Joux, et ce dès la fin du XVe siècle. Jean Rochat amorce cette expansion via l’exploitation d’un complexe agricole sur la Venoge. Celui-ci comprend des moulins, un abattoir et un pressoir. Leur intense utilisation est avérée par l’état de dégradation celles-ci, tel que consigné lors de leur mise aux enchères en 1526 par l’abbaye du Lac de Joux.

Guillaume Rochat et son fils Jean obtiennent en 1514 l’autorisation d’exploiter un cours d’eau allant du moulin du Lieu jusqu’au Lac Brenet. Ils y édifient une forge, un moulin et une scierie. Ce développement permet alors aux Rochat en fait des pionniers dans l’implantation d’industries hydrauliques dans la Vallée de Joux. Dès 1524, on retrouve des moulins, des battoirs, des scies et autres martinets de fer.

Claude Rochat, fils de Jean, délaisse petit à petit le domaine, la scierie et la forge. Ces installations furent reprises par d’autres familles en 1526.

Au XIXe siècle, les moulins Rochat sont intégrés au développement urbain de Lausanne. Une gravure de 1852 montre ainsi un moulin Rochat situé sous le Grand-Pont, au lieu-dit « Le Pas des  nes », sur la rive droite du Flon. Autrefois périphérique, cette installation rejoint le centre de Lausanne alors en pleine extension. En 1874, ce moulin est le premier bâtiment à être détruit lors des travaux de comblement du vallon.

Les Rochat se distingue également dans diverses autres industries telles l’horlogerie et la microtechnique, participant ici aussi à l’évolution industrielle de la région. Leur modèle économique, fondé sur la participation familiale et l’ancrage socio-géographique, permet la transmission de savoir-faire et de patrimoines en vase clos. Ce modèle présente néanmoins des défis, notamment lors de l’intégration de technologies extérieures et la mobilisation de ressources financières importantes.

L’histoire des Rochat reflète ainsi les multiples étapes industrielles traversées par la Vallée de Joux (forges, horlogeries, lapidaires et microtechniques). Leur capacité d’adaptation aux changements économiques, couplée au maintenant d’une forte tradition familiale, a amplement marqué la société vaudoise. Cette expansion industrielle a conféré aux Rochat une influence socio-politique notable, avec des membres de la famille occupant des rôles tels qu’officiers, magistrats, pasteurs, professeurs, médecins et ingénieurs.

</div>
<div class="card">
<h2>Mercier</h2>

Originaire de France, d’où elle fuit les persécutions anti-protestantes, la famille Mercier a joué un rôle crucial dans le développement du quartier du Flon à Lausanne. En 1740, ils établissent une tannerie en bordure du Flon, un emplacement stratégique de par l’immense quantité d’eau nécessaire au traitement du cuir. Leur entreprise prospère rapidement, leur apportant fortune et renommée.

La tannerie est dirigée par plusieurs générations de Mercier. Jean-Jacques Mercier I qui succède à son père Pierre est ainsi suivi par ses descendants. Jean-Jacques Mercier III, arrière-petit-fils de Pierre, fut particulièrement influent. Sous sa direction, la tannerie atteint une renommée internationale, commerçant avec l’Angleterre et les États-Unis. Il amorce également une diversification des activités familiales, investissant dans le commerce de denrées et l’immobilier.

Cependant, l’impact le plus significatif de Jean-Jacques Mercier III sur Lausanne fut son rôle dans le développement des infrastructures ferroviaires. En partenariat avec l’entrepreneur Louis Gonin, il amorce la création d’un chemin de fer reliant la gare de Lausanne à Ouchy et passant par le Flon. La ville cède à cette occasion le terrain du Flon à la famille Mercier, en échange de leur financement des travaux entre 1874 et 1877. Le projet aboutit à la construction de la gare, du funiculaire d’Ouchy, et de nombreux entrepôts.

Ces infrastructures font alors du Flon la principale gare de marchandises de Lausanne, accélérant la transformation du quartier. La vallée est aplanie et la première rangée d’arches du Grand-Pont est ensevelie, témoignant de l’ampleur des modifications. Malgré son départ à l’étranger en 1886 pour des raisons fiscales, Jean-Jacques Mercier III continue de gérer les affaires familiales et la Compagnie du chemin de fer Lausanne-Ouchy.

En 1898, la famille vend la tannerie, devenue incapable de concurrencer le protectionnisme du marché américain. Les Mercier continuent par la suite à investir dans l’immobilier, possédant tous les bâtiments du Flon, le lac de Bret (source d’eau potable et d’énergie pour Lausanne) et le château d’Ouchy. Ils maintiennent parallèlement leur implication dans le chemin de fer. Cette diversification permit à la famille de laisser une empreinte durable sur l’infrastructure et l’économie de Lausanne.

</div>
</div>
