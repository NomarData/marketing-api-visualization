/**
 * Created by maraujo on 2/20/17.
 */
function LocationsDataManager(){
    var currentInstance = this;
    this.locationsDataInMap = {};
    this.locationsColors = {};
    this.init = function(){
        var scope = DATAMAPS_CONFIGS[DATAMAPS_CONFIG_KEY].scope;
        Datamap.prototype[scope + "Topo"].objects[scope].geometries.map(function(locationDatamapData){
            currentInstance.locationsDataInMap[convertDatamapsCodeToLocationKey(locationDatamapData.id)] = {
                rightAudience: 0,
                leftAudience: 0,
            }
        });
    };

    this.empty = function(){
        for(var locationKey in currentInstance.locationsDataInMap) {
            currentInstance.locationsDataInMap[locationKey] = {
                rightAudience: 0,
                leftAudience: 0
            }
        }
    };

    this.updateData = function(){
        var instances = dataManager.getSelectedInstances();
        currentInstance.empty();
        currentInstance.addInstances(instances);
        currentInstance.updateLocationsColors();
    }

    this.addInstanceAudienceToLocationDataInMap = function(instance){
        var locationKey = instance.location;
        try {
            if (getInstancePolarity(instance) == 1) currentInstance.locationsDataInMap[locationKey].leftAudience += instance.audience;
            else currentInstance.locationsDataInMap[locationKey].rightAudience += instance.audience;
        } catch (err){
            throw Error("Location Key not found:" + locationKey);
        }

    };

    this.addInstances = function(instances){
        for(var i in instances){
            currentInstance.addInstanceAudienceToLocationDataInMap(instances[i]);
        }
    };

    this.getLocationScore = function(locationKey){
        return currentInstance.getLocationSelectedData(locationKey)["score"];
    };
    this.getLocationSelectedData = function(locationKey){
        var leftAudience = currentInstance.locationsDataInMap[locationKey].leftAudience;
        var rightAudience = currentInstance.locationsDataInMap[locationKey].rightAudience;
        var audienceCoverage = currentInstance.getLocationAudience(locationKey);
        return {
            "leftAudience" : leftAudience,
            "rightAudience" : rightAudience,
            "audienceCoverage" : audienceCoverage,
            "score" : (leftAudience - rightAudience) / audienceCoverage,
            "locationDatamap_code" : locationKey,
            "location2LetterCode" : getLocation2letterFromLocationKey(locationKey),
            "name" : getLocationNameFromLocationKey(locationKey)
        }
    };
    this.getLocationAudience = function(locationKey){
        var _2letterCode = getLocation2letterFromLocationKey(locationKey);
        return dataManager.getSumSelectedFacebookPopulationByLocation2letters(_2letterCode);
    };

    this.updateLocationsColors = function () {
        var locationsKeys = getAllKeysInLocationMap();
        //Paint all locations as unselected
        for(var locationKeyIndex in locationsKeys){
            var locationKey = locationsKeys[locationKeyIndex];
            currentInstance.locationsColors[locationKey] = DEFAULT_MAP_LOCATIONS_BACKGROUND_COLOR;
        }

        //Paint all selected locations as selected
        for(var selectedLocationIndex in dataManager.selectedLocations_2letters){
            var location2Letters = dataManager.selectedLocations_2letters[selectedLocationIndex];
            var locationKey = getLocationKeyFromLocation2letter(location2Letters);
            if(currentInstance.getLocationAudience(locationKey) > 0){
                var score = currentInstance.getLocationScore(locationKey);
                currentInstance.locationsColors[locationKey] = getGreenOrRedColorByScore(score);
            }
        }
    };

    this.getLocationsColors = function(){
        return currentInstance.locationsColors;
    };
    this.init();
}
