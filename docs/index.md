---
toc: false
---

# Lausanne Time Machine

## Les industries sur le Flon et la Louve du 17e au 19e siècle 

```js
import * as L from "npm:leaflet";

const div = display(document.createElement("div"));
div.style = "height: 400px;";

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
        "coordinates": [46.6, 6.6]
    }
};

L.geoJSON(geojsonFeature).addTo(map);
```

