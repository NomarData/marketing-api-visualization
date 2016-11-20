/**
 * Created by maraujo on 11/20/16.
 */
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
            main({title: "Arabic Health Awareness"}, {key: "Arabic League", values: getStorage("global_data")});
        }
    }, 500);
    //
});