/**
 * Created by maraujo on 11/20/16.
 */
//Global Variables


colorRangeScale = ["#d73027", "#fc8d59", "#fee08b", '#ffffbf', '#d9ef8b', '#91cf60', '#1a9850'];
colorD3RangeScale = [d3.rgb("#d73027"), d3.rgb("#fc8d59"), d3.rgb("#fee08b"), d3.rgb('#ffffbf'), d3.rgb('#d9ef8b'), d3.rgb('#91cf60'), d3.rgb('#1a9850')];
domainLinear = [-1, -0.66, -0.33, 0, 0.33, 0.66, 1];
domainNotLinear = [-0.7, -0.3, -0.05, 0, 0.05, 0.3, 0.7];
breakPointsColor = buildBreakPoints(domainLinear, colorRangeScale);
colorFunction = d3.scale.linear().domain(domainNotLinear).interpolate(d3.interpolateRgb).range(colorD3RangeScale);
colorNotLinearFunction = d3.scale.linear().domain(domainNotLinear).interpolate(d3.interpolateRgb).range(colorD3RangeScale);
colorLinearFunction = d3.scale.linear().domain(domainLinear).interpolate(d3.interpolateRgb).range(colorD3RangeScale);


$(document).ready(function () {
    $(".loader").fadeIn();
    dataManager = new DataManager();
    externalDataManager = new ExternalDataManager();
    var updateFacebookPopulationDataPromise = externalDataManager.updateFacebookPopulationData();
    var promiseForDefaultState = externalDataManager.getPromiseToUpdateDatasetBySelection(dataManager.selectedLuxury, dataManager.selectedHealth);
    promiseForDefaultState.done(function(data){
        externalDataManager.setInstanceList(data.instances);
        updateFacebookPopulationDataPromise.done(function(d){
            dataManager.setSelectedInstances();
            buildAndInitVisualComponents();
        });
    });
});

