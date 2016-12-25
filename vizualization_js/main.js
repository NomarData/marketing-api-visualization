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

function buildAndInitVisualComponents(){
    console.log("Building Treemaps");
    treemapManager = new TreemapManager();
    treemapManager.initTreemaps();
    console.log("Treemaps builded");

    console.log("Building luxuriousHealthBar");
    luxuriousHealthBar = new stackedHorizontalBar();
    luxuriousHealthBar.init();
    console.log("Builded luxuriousHealthBar");

    inclinationScore = new InclinationScore();
    inclinationScore.init();

    arabMap = new arabLeagueMap();
    arabMap.init();
    arabMap.initCountriesBtns();

}

$(document).ready(function () {
    // var treemapProperties = generateTreemapProperties(1280 - 80,800 - 180);
    $(".loader").fadeIn();
    NODES_SELECTED = new SelectionDataLayer();
    fusionAPI = new GoogleFusionAPI();
    var updateFacebookPopulationDataPromise = fusionAPI.updateFacebookPopulationData();
    fusionAPI.init();
    var promiseForDefaultState = fusionAPI.getPromiseToUpdateDatasetBySelection(NODES_SELECTED.selectedLuxury, NODES_SELECTED.selectedHealth);
    promiseForDefaultState.done(function(data){
        fusionAPI.setInstanceList(data.instances);
        NODES_SELECTED.setSelectedInstances();
        updateFacebookPopulationDataPromise.done(function(d){
            buildAndInitVisualComponents();
            btnsTopicsSelectors = new BtnsTopicsSelectors();
            btnsTopicsSelectors.init();
        });
    }).done(function () {
        sharebleLink = new SharebleLink();
        sharebleLink.init();
    });
});