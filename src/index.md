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
//L.tileLayer("./_file/data/berney_1831_tiles/{z}/{x}/{y}.png", { minZoom: 14, maxZoom: 18, opacity: 0.7 }).addTo(map);
L.tileLayer("./_file/data/renove_1888_tiles/{z}/{x}/{y}.png", { minZoom: 14, maxZoom: 18, opacity: 0.7 }).addTo(map);


//const berney = await FileAttachment("./data/berney_1831.geojson").json();
//L.geoJSON(berney.features, { style: M.get_feature_style }).addTo(map);

const berney_buildings = await FileAttachment("./data/berney_buildings.geojson").json();
L.geoJSON(berney_buildings.features, {
        style: M.get_extracted_feature_style,
        onEachFeature: function(feature, layer) {
            layer.bindPopup("blablabla");
            L.marker(layer.getBounds().getCenter()).addTo(map);
        }
        }
    ).addTo(map);
```

```js
const year = view(Inputs.range([1700, 1950], {step: 10, value: 1800, label: "Date", width: 1000}));
```
