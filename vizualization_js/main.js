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

function selectedInstancesTable(){
    var currentInstance = this;
    this.element = $("#selectedDataInstancesTable");

    this.empty = function () {
        currentInstance.element.empty();
        currentInstance.addHeader();
    };

    this.addHeader = function() {
        var keys = [];
        for(var instanceIndex in fakeData){
            var instance = fakeData[instanceIndex];
            for( var key in instance){
                if(keys.indexOf(key) == -1){
                    keys.push(key)
                }
            }
        }
        var header = $("<tr></tr>");
        for(var columnIndex in keys){
            header.append("<th>" + keys[columnIndex] + "</th>");
        }
        currentInstance.element.append(header);
        currentInstance.header = header;
    };

    this.instanceToListItem = function(instance){
      var listItem = $("<tr></tr>");
      for(var key in instance){
          listItem.html("<td>" + instance[key] + "<td/>");
      }
      return listItem;
    };

    this.updateData = function(){
        currentInstance.empty();

        var instances = getSelectedInstances();
        $.map(instances,function (instance) {
            var html = currentInstance.instanceToListItem(instance);
            currentInstance.element.append(html);
        })
    }
}

function getPosibleHeader(){

}

function updatedSelectInstancesList(){


}

$(document).ready(function () {
    // var treemapProperties = generateTreemapProperties(1280 - 80,800 - 180);

    var colors = d3.scale.category10();
    initializeDataLayerModule();
    treemapManager = new TreemapManager();
    treemapManager.initTreemaps();

    luxuriousHealthBar = new stackedHorizontalBar();
    luxuriousHealthBar.init();

    arabMap = new arabLeagueMap();
    arabMap.init();

});