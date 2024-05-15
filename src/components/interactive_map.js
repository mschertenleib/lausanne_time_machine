import * as L from "npm:leaflet";

export function get_extracted_feature_style(feature) {
    const style = {
        weight: 1,
        opacity: 1.0,
        fillOpacity: 1.0,
        color: "#000000"
    };

    if (feature.properties.use.includes("moulin")) { style.fillColor = "#ff0000"; }
    else if (feature.properties.use.includes("tannerie")) { style.fillColor = "#00ff00"; }
    else if (feature.properties.use.includes("scierie")) { style.fillColor = "#0000ff"; }
    else { style.fillColor = "#ff00ff"; }

    return style;
}

export function year_to_index(year) {
    if (year < 1800) return 0;
    if (year < 1870) return 1;
    else return 2;
}

var current_layer = 0;
export function switch_layer(map, base_layers, overlay_layers, index) {
    current_layer = index;
    base_layers[index].addTo(map);
    overlay_layers[index].addTo(map);
    setTimeout(function () {
        for (var i = 0; i < base_layers.length; ++i) {
            if (current_layer != i) {
                base_layers[i].remove();
                overlay_layers[i].remove();
            }
        }
    }, 250);
}
