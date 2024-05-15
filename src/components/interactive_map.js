import * as L from "npm:leaflet";

export function get_feature_style(feature) {
    const style = {
        weight: 0.0,
        opacity: 1.0,
        fillOpacity: 1.0
    };

    if (feature.properties.subclass == "built") { style.color = "#404040"; }
    else if (feature.properties.subclass == "non_built_agri_high") { style.color = "#30ff30"; }
    else if (feature.properties.subclass == "non_built_agri_low") { style.color = "#30a030"; }
    else if (feature.properties.subclass == "non_built_forestry") { style.color = "#307030"; }
    else if (feature.properties.subclass == "non_built_residential") { style.color = "#fae8c3"; }
    else if (feature.properties.subclass == "non-built") { style.color = "#bfaa7c"; }
    else if (feature.properties.subclass == "road_network") { style.color = "#aaaaaa"; }
    else if (feature.properties.subclass == "water") { style.color = "#5555aa"; }
    else { style.color = "#000000"; }

    return style;
}

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
