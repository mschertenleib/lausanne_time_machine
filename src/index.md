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

const berney_buildings_geojson = await FileAttachment("./data/berney_buildings.geojson").json();
const berney_buildings = L.geoJSON(berney_buildings_geojson.features, {
    style: M.get_extracted_feature_style,
    onEachFeature: function(feature, layer) {
        layer.bindPopup("blablabla");
        L.marker(layer.getBounds().getCenter()).addTo(map);
    }
});

const base_maps = {
    "Melotte": melotte,
    "Berney": berney,
    "Rénové": renove
};
const overlay_maps = {
    "Berney_buildings": berney_buildings
};
const layer_control = L.control.layers(base_maps, overlay_maps).addTo(map);

berney.addTo(map);
berney_buildings.addTo(map);

//L.control.scale().addTo(map);

const year = view(Inputs.range([1720, 1950], {step: 10, value: 1850, label: "Date", width: 1000}));
```

```js
M.switch_base_map(map, [melotte, berney, renove], M.year_to_index(year));
```
