/**
 * Created by maraujo on 11/20/16.
 */
//Global Variables







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

