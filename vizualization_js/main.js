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
            fusionAPI.updateCountriesList().done(function(){
                arabMap.applyClickFunctionToCountryBtns();
                NODES_SELECTED.selectDefaultCountries();
                $(".loader").fadeOut();
            });
            btnsTopicsSelectors = new BtnsTopicsSelectors();
            btnsTopicsSelectors.init();
        });
    });
    //----------------------------------------------------------------------------


    function render(scale,selector) {
        var max=1, data = [], min=-1;
        var step = (max-min)/20;
        for (var i=-1.0 + step;i<max;i=i+step){
            data.push(i);
        }

        var selection =  d3.select(selector).selectAll("div.cell").data(data);
        selection.enter()
            .append("div")
            .classed("cell",true)
            .append("div.test")
            .append("span");
        selection.data(data).exit().remove();
        selection.style("display","inline-block")
            .style("background-color",function(d){
                return scale(d);
            })
            .select("span")
                .text(function(d,i){return d.toFixed(2);});


    }
    render(colorFunction, "#color");



});