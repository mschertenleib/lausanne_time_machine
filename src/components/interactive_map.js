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

var current_map = 0;
export function switch_map(map, year, melotte, berney, renove) {
    if (year < 1831) {
        current_map = 0;
        melotte.addTo(map);
        setTimeout(function () {
            if (current_map != 1) berney.remove();
            if (current_map != 2) renove.remove();
        }, 150);
    } else if (year < 1888) {
        current_map = 1;
        berney.addTo(map);
        setTimeout(function () {
            if (current_map != 0) melotte.remove();
            if (current_map != 2) renove.remove();
        }, 150);
    } else {
        current_map = 2;
        renove.addTo(map);
        setTimeout(function () {
            if (current_map != 0) melotte.remove();
            if (current_map != 1) berney.remove();
        }, 150);
    }
}
