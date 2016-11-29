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



$(document).ready(function () {
    // var treemapProperties = generateTreemapProperties(1280 - 80,800 - 180);

    var colors = d3.scale.category10();
    initializeDataLayerModule();
    treemapManager = new TreemapManager();
    treemapManager.initTreemaps();

    luxuriousHealthBar = new stackedHorizontalBar();
    luxuriousHealthBar.init();

    setInterval(function () {
        var fakeData = {"greenValue":Math.random()*10, "redValue" : Math.random()*10};
        luxuriousHealthBar.updateData(fakeData);
    },1000);

    arabMap = new arabLeagueMap();
    arabMap.init();
    arabMap.giveLife();

});