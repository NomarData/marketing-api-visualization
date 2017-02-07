/**
 * Created by maraujo on 11/20/16.
 */

$(document).ready(function () {
    $(".loader").fadeIn();
    initApplicationStaticTexts();
    dataManager = new DataManager();
    externalDataManager = new ExternalDataManager();
    var updateFBDemographicDataPromise = externalDataManager.updateFacebookDemographicData();
    var promiseForDefaultState = externalDataManager.getPromiseToUpdateDatasetBySelection(dataManager.selectedLuxury, dataManager.selectedHealth);
    promiseForDefaultState.done(function(data){
        externalDataManager.setInstanceList(data.instances);
        updateFBDemographicDataPromise.done(function(d){
            dataManager.setSelectedInstances();
            buildAndInitVisualComponents();
        });
    });
});

