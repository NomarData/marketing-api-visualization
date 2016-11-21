/**
 * Created by maraujo on 11/20/16.
 */
//Global Variables
var TABLE = "1xQ5SloMxn2Ug8r7jO4rwEm_0KsAbyjB1yMGWeAcK";
var API_KEY = "AIzaSyDO2DFB13Hr_DpzHtb8ONXkUvtCo7W7BHk";
var SQL_list_countries = "SELECT location FROM $table GROUP BY  location".replace("$table", TABLE);
var SQL_list_topics = "SELECT topic, SUM(audience) FROM $table GROUP BY topic".replace("$table", TABLE);
var SQL_list_unique = "SELECT $column, SUM(audience) FROM $table GROUP BY $column".replace("$table", TABLE);
var URL_sql = "https://www.googleapis.com/fusiontables/v2/query?sql=$query&key=$key".replace("$key",API_KEY);
var URL_list_columns = "https://www.googleapis.com/fusiontables/v2/tables/$table/columns?key=$key".replace("$key",API_KEY);
var list_countries_url = URL_sql.replace("$key",API_KEY).replace("$query",SQL_list_countries.replace("$table",TABLE));
var list_topics_url = URL_sql.replace("$key",API_KEY).replace("$query",SQL_list_topics.replace("$table",TABLE));
var list_columns_url = URL_list_columns.replace("$table",TABLE);
var countries_container = $("#countries_list");
var topics_container = $("#topics_list");
var category_container = $("#categories_list");
var countries_interest_data = [];
var defaultsPropertiesTreemap = {
    margin: {top: 24, right: 0, bottom: 0, left: 0},
    rootname: "TOP",
    format: ",d",
    title: "",
    height: 100
};
//Set (initialize) selected_subcategories to a empty list
setStorage("selected_subcategories",[]);

$(document).ready(function () {
    // Load Fusion Table Data
    //List Countries
    updateListCountries();
    //List Topics
    updateTopics();
    //List Categories
    updateListCategories();
    // Plot treemap
    var check_data_exists = setInterval(function(){
        var treemap_data = getStorage("global_data");
        if (treemap_data != null){
            clearInterval(check_data_exists);
            main({title: "Gender"}, {key: "Arabic League", values: getStorage("global_data")}, "chart1");
            main({title: "Scholarity"}, {key: "Arabic League", values: getStorage("global_data")}, "chart2");
            main({title: "Age Range"}, {key: "Arabic League", values: getStorage("global_data")}, "chart3");
            main({title: "Language"}, {key: "Arabic League", values: getStorage("global_data")}, "chart4");
            main({title: "Native or Expats?"}, {key: "Arabic League", values: getStorage("global_data")}, "chart5");
        }
    }, 500);
    //
});