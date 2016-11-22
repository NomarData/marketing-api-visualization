/**
 * Created by maraujo on 11/20/16.
 */
//Global Variables
var INTEREST_COLUMN_NAME = "topic";
var COUNTRY_COLUMN_NAME = "location";
var countries_container = $("#countries_list");
var interests_container = $("#interests_list");
var demographicCategoriesContainer = $("#demographic_categories_list");
var countries_interest_data = [];
var defaultsPropertiesTreemap = {
    margin: {top: 24, right: 0, bottom: 0, left: 0},
    rootname: "TOP",
    format: ",d",
    title: "",
    height: 100
};

var treemapData = {
    "name": "Gender",
    "children": [{
        "name": "Male",
        "children": [{
            "name": "Male",
            "size": 1983
        }]
    },{
        "name": "Female",
        "children": [{
            "name": "Female",
            "size": 1983
        }]
    }
    ]
};

function generateTreemapProperties(width,height){
    return {
        w: width,
        h: height,
        x: d3.scale.linear().range([0, width]),
        y : d3.scale.linear().range([0, height]),
        color : d3.scale.category20c()
    }
}

$(document).ready(function () {
    // var treemapProperties = generateTreemapProperties(1280 - 80,800 - 180);
    treemap = new Treemap(1280 - 80,800 - 180);
    treemap.init();
    // buildTreemap(treemapData,treemapProperties);

    // Load Fusion Table Data
    // $.when(initializeDataLayerModule()).always(function(){
    //     main({title: "Gender"}, {key: "gender", values: getVariableFromSession("global_data")}, "chart1");
    //     main({title: "Scholarity"}, {key: "Scholarity", values: getVariableFromSession("global_data")}, "chart2");
    //     main({title: "Age Range"}, {key: "Age Range", values: getVariableFromSession("global_data")}, "chart3");
    //     main({title: "Language"}, {key: "Language", values: getVariableFromSession("global_data")}, "chart4");
    //     main({title: "Native or Expats?"}, {key: "Native or Expats?", values: getVariableFromSession("global_data")}, "chart5");
    // });

    // // Plot treemaps
    // var check_data_exists = setInterval(function(){
    //     var treemap_data = getVariableFromSession("global_data");
    //     if (treemap_data != null){
    //         clearInterval(check_data_exists);
    //
    //     }
    // }, 500);
    //
});