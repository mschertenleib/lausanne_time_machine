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
