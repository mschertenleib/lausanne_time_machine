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
    const maps = [melotte, berney, renove];

    const remove_maps = function () {
        setTimeout(function () {
            for (var i = 0; i < maps.length(); ++i) {
                if (current_map != i) {
                    maps[i].remove();
                }
            }
        }, 200);
    };

    if (year >= 1888) {
        current_map = 0;
        renove.addTo(map);
setTimeout(function () {
            for (var i = 0; i < maps.length(); ++i) {
                if (current_map != i) {
                    maps[i].remove();
                }
            }
        }, 200);
        remove_maps();
    } else if (year >= 1831) {
        current_map = 1;
        berney.addTo(map);
        remove_maps();
    } else {
        current_map = 2;
        melotte.addTo(map);
        remove_maps();
    }
}
