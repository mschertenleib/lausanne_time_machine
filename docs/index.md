---
toc: false
---

# Lausanne Time Machine

## Les industries sur le Flon et la Louve du 17e au 19e siècle 

```js
import * as L from "npm:leaflet";
import { FileAttachment } from "npm:@observablehq/stdlib";

const div = display(document.createElement("div"));
div.style = "height: 800px;";
    
const map = L.map(div).setView([46.5199, 6.6370], 14);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const geojsonFeature = {
        "type": "Feature",
        "properties": {
            "class": "built",
            "layer": "DecoupeBerney_001",
            "path": "/Users/remipetitpierre/Desktop/Cartes/Lausanne/1831_berney/vectorisation/shapefile_v6/DecoupeBerney_001.shp",
            "identifier": "1119",
            "page": 1.0,
            "number": "119",
            "subclass": "built",
            "use": "forge, écurie, fenil",
            "own_type": "private",
            "own_desc": "Samuel-Daniel-Bénédict Rochat feu Jean-Abram-Henri",
            "own_share": "nan",
            "own_col_ty": "nan",
            "own_col_de": "nan",
            "own_surnam": "Samuel-Daniel-Bénédict",
            "own_name": "Rochat",
            "own_compl": "feu Jean-Abram-Henri",
            "area": 131.76
        },
        "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
                [[[6.63165454253324782, 46.52053341590979585],
                [6.63164821903478963, 46.52055346979834383],
                [6.63165518435079715, 46.52055767773435946],
                [6.6317971193534957, 46.52060027118738361],
                [6.63180314283548089, 46.52060031402832152],
                [6.63180618560741042, 46.5205982564758358],
                [6.63182250681140673, 46.52058104594248533],
                [6.63182858200804581, 46.52057762382729322],
                [6.63182963763800171, 46.52057416601238771],
                [6.63185921655373889, 46.52054318847247316],
                [6.63185924758260636, 46.52054110949959664],
                [6.63185527330434077, 46.52053830897710895],
                [6.63176850184242728, 46.5204995732891291],
                [6.63169767928663756, 46.52046857469349561],
                [6.63168965834210411, 46.52046782457371421],
                [6.63166064877165162, 46.5205279148307369],
                [6.63165454253324782, 46.52053341590979585]]]
            ]
        }
    };

const geojson = await FileAttachment("berney_buildings.geojson").json();
display(geojson);
display(geojsonFeature);
L.geoJSON(geojsonFeature, {style: {"color": "#ff00ff"}}).addTo(map);
L.geoJSON(geojson.features, {style: {"color": "#0000ff"}}).addTo(map);
```
