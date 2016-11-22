/**
 * Created by maraujo on 11/20/16.
 */
//Global Variables
var INTEREST_COLUMN_NAME = "topic";
var COUNTRY_COLUMN_NAME = "location";
var countries_container = $("#countries_list");
var interests_container = $("#topics_list");
var demographicCategoriesContainer = $("#categories_list");
var countries_interest_data = [];
var defaultsPropertiesTreemap = {
    margin: {top: 24, right: 0, bottom: 0, left: 0},
    rootname: "TOP",
    format: ",d",
    title: "",
    height: 100
};


$(document).ready(function () {
    //Set (initialize) selected_subcategories to a empty list
    setVariableInSession("selected_subcategories",[]);
    
    // Load Fusion Table Data
    initializeDataLayerModule();

    // Plot treemaps
    var check_data_exists = setInterval(function(){
        var treemap_data = getVariableFromSession("global_data");
        if (treemap_data != null){
            clearInterval(check_data_exists);
            main({title: "Gender"}, {key: "Arabic League", values: getVariableFromSession("global_data")}, "chart1");
            main({title: "Scholarity"}, {key: "Arabic League", values: getVariableFromSession("global_data")}, "chart2");
            main({title: "Age Range"}, {key: "Arabic League", values: getVariableFromSession("global_data")}, "chart3");
            main({title: "Language"}, {key: "Arabic League", values: getVariableFromSession("global_data")}, "chart4");
            main({title: "Native or Expats?"}, {key: "Arabic League", values: getVariableFromSession("global_data")}, "chart5");
        }
    }, 500);
    //
});