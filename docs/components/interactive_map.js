import * as L from "npm:leaflet";
import { FileAttachment } from "npm:@observablehq/stdlib";


export function interactive_map(div) {
    const map = L.map(div).setView([46.5199, 6.6370], 14);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    const geojson = await(FileAttachment("berney_buildings.geojson").json());
    L.geoJSON(geojson.features).addTo(map);

    return map;
}
