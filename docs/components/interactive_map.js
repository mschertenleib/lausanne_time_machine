import * as L from "npm:leaflet";
import {FileAttachment} from "npm:@observablehq/stdlib";

export function interactive_map(div) {
    const map = L.map(div).setView([46.5199, 6.6370], 14);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    const geojsonFeature = {
        "type": "Feature",
        "properties": {
            "name": "Un moulin",
            "amenity": "Baseball Stadium",
            "popupContent": "Blablabla"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [6.63, 46.52]
        }
    };
    
    const geojson = FileAttachment("../../data/berney_buildings.geojson").text();

    L.geoJSON(geojson).addTo(map);

    return map;
}