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

function removeValueFromArray(array,valueToRemove){
    return $.grep(array, function(value) {
        return value != valueToRemove;
    });
}

$(document).ready(function () {
    // var treemapProperties = generateTreemapProperties(1280 - 80,800 - 180);
    $(".loader").fadeIn();
    NODES_SELECTED = new SelectionDataLayer();
    var colors = d3.scale.category10();
    // initializeDataLayerModule();
    // treemapManager = new TreemapManager();
    // treemapManager.initTreemaps();
    //
    // luxuriousHealthBar = new stackedHorizontalBar();
    // luxuriousHealthBar.init();
    //
    // arabMap = new arabLeagueMap();
    // arabMap.init();
    //
    // selectedInstancesTable = new SelectedInstancesTable("#selectedDataInstancesTable");
    // selectedInstancesTable.init();
    //
    // currentDataInstancesTable = new SelectedInstancesTable("#currentDataTable");
    // currentDataInstancesTable.init();
    //
    // inclinationScore = new InclinationScore();
    // inclinationScore.init();

    fusionAPI = new GoogleFusionAPI();
    fusionAPI.init();
    var promiseForDefaultState = fusionAPI.getPromiseToUpdateDatasetBySelection(NODES_SELECTED.selectedLuxury, NODES_SELECTED.selectedHealth);
    promiseForDefaultState.done(function(data){
        fusionAPI.setInstanceList(data.instances);
        NODES_SELECTED.setSelectedInstances();

        console.log("Building Treemaps");
        treemapManager = new TreemapManager();
        treemapManager.initTreemaps();
        console.log("Treemaps builded");

        console.log("Building luxuriousHealthBar");
        luxuriousHealthBar = new stackedHorizontalBar();
        luxuriousHealthBar.init();
        console.log("Builded luxuriousHealthBar");

        arabMap = new arabLeagueMap();
        arabMap.init();

        // selectedInstancesTable = new SelectedInstancesTable("#selectedDataInstancesTable");
        // selectedInstancesTable.init();
        // selectedInstancesTable.updateData();

        // currentDataInstancesTable = new SelectedInstancesTable("#currentDataTable");
        // currentDataInstancesTable.init();

        inclinationScore = new InclinationScore();
        inclinationScore.init();

        // currentDataInstancesTable.updateDataGivenInstances(currentData);

        fusionAPI.updateCountriesList().done(function(){
            $(".countryItem").click(function(){
                onClickCountryFunction($(this));
            });
            $(".loader").fadeOut();
        });
        fusionAPI.updateInterestsAudienceList();
    });

    btnsSelectors = new BtnsTopicsSelectors();
    btnsSelectors.init();
    // NODES_SELECTED.selectDefaultCountries();




    // CountriesBarCharts();
    // CountriesBarCharts2();

    var instances = fusionAPI.getDefaultData();


});