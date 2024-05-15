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
    if (year < 1831) return 0;
    if (year < 1888) return 1;
    else return 2;
}

var current_map = 0;
export function switch_base_map(map, base_maps, index) {
    current_map = index;
    base_maps[index].addTo(map);
    setTimeout(function () {
        for (var i = 0; i < base_maps.length; ++i) {
            if (current_map != i) base_maps[i].remove();
        }
        //     if (current_map != 0) base_maps[0].remove();
        //    if (current_map != 1) base_maps[1].remove();
        //   if (current_map != 2) base_maps[2].remove();
    }, 150);
}

