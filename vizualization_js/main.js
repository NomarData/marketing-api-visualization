/**
 * Created by maraujo on 11/20/16.
 */

$(document).ready(function () {
    $(".loader").fadeIn();
    initApplicationStaticTexts();
    dataManager = new DataManager();
    externalDataManager = new ExternalDataManager();
    var updateFBDemographicDataPromise = externalDataManager.updateFacebookDemographicData();
    var promiseForDefaultState = externalDataManager.getPromiseToUpdateDatasetBySelection(dataManager.selectedRightTopic, dataManager.selectedLeftTopic);
    promiseForDefaultState.done(function(data){
        externalDataManager.setInstanceList(data.instances);
        updateFBDemographicDataPromise.done(function(d){
            dataManager.setSelectedInstances();
            if(DATAMAPS_CONFIGS[DATAMAPS_CONFIG_KEY].isSubRegionData){
                dataManager.buildAndInitVisualComponents();
            } else{
                $.getScript(DATAMAPS_CONFIGS[DATAMAPS_CONFIG_KEY].mapFilePath)
                    .done(function( script, textStatus ) {
                        console.log( "Map Loadeed" );
                        dataManager.buildAndInitVisualComponents();
                    })
                    .fail(function( jqxhr, settings, exception ) {
                        console.log( " Error load visual components:" + exception );
                    });
            }

        });
    });
});

