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

var treemapDataGender = {
    "name": "Gender",
    "children": [{
        "name": "Male",
        "children": [{
            "name": "Male",
            "size": Math.random()
        }]
    },{
        "name": "Female",
        "children": [{
            "name": "Female",
            "size": Math.random()
        }]
    }
    ]
};

var treemapDataAgeRange = {
    "name": "Age Range",
    "children": [{
        "name": "18-22",
        "children": [{
            "name": "18-22",
            "size": Math.random()
        }]
    },{
        "name": "23-30",
        "children": [{
            "name": "23-30",
            "size": Math.random()
        }]
    },{
        "name": "31-40",
        "children": [{
            "name": "31-40",
            "size": Math.random()
        }]
    }
    ]
};

var treemapDataScholarity = {
    "name": "Scholarity",
    "children": [{
        "name": "HighSchool",
        "children": [{
            "name": "18-22",
            "size": Math.random()
        }]
    },{
        "name": "Graduated",
        "children": [{
            "name": "23-30",
            "size": Math.random()
        }]
    }
    ]
};

var treemapDataLanguage = {
    "name": "Language",
    "children": [{
        "name": "18-22",
        "children": [{
            "name": "18-22",
            "size": 19830
        }]
    },{
        "name": "23-30",
        "children": [{
            "name": "23-30",
            "size": 15023
        }]
    }
    ]
};

var treemapDataNaturality = {
    "name": "Native",
    "children": [{
        "name": "18-22",
        "children": [{
            "name": "18-22",
            "size": 19830
        }]
    },{
        "name": "Expats",
        "children": [{
            "name": "23-30",
            "size": 15023
        }]
    }
    ]
};

$(document).ready(function () {
    // var treemapProperties = generateTreemapProperties(1280 - 80,800 - 180);
    var treemapDefaultHeight = 100;
    var colorFunction = d3.scale.category20();

    genderTreemap = new Treemap($("#genderTreemapDiv").width(),treemapDefaultHeight,$("#genderTreemapDiv").get(0),colorFunction,treemapDataGender);
    genderTreemap.init();

    ageRangeTreemap = new Treemap($("#ageRangeTreemapDiv").width(),treemapDefaultHeight,$("#ageRangeTreemapDiv").get(0),colorFunction,treemapDataAgeRange);
    ageRangeTreemap.init();

    scholarityTreemap = new Treemap($("#scholarityTreemapDiv").width(),treemapDefaultHeight,$("#scholarityTreemapDiv").get(0),colorFunction,treemapDataScholarity);
    scholarityTreemap.init();
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