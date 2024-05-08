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
    
const map = L.map(div).setView([46.5205253, 6.6320297], 15);

L.tileLayer("./data/berney_1831_tiles/{z}/{x}/{y}.png", {maxZoom: 18}).addTo(map);

//const berney = await FileAttachment("./data/berney_1831.geojson").json();
/*L.geoJSON(berney.features, {
        style: M.get_feature_style}
    ).addTo(map);
*/
const berney_buildings = await FileAttachment("./data/berney_buildings.geojson").json();
L.geoJSON(berney_buildings.features, {
        style: M.get_extracted_feature_style, 
        onEachFeature: M.on_each_feature}
    ).addTo(map);
```
