/**
 * Created by maraujo on 2/20/17.
 */
function LocationsDataManager(){
    var currentInstance = this;
    this.locationsDataInMap = {};
    this.locationsColors = {};
    this.init = function(){
        var locationsKeys = getAllKeysInLocationMap();
        $.map(locationsKeys, function(locationKey){
            currentInstance.locationsDataInMap[locationKey] = {
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

    this.mousemoveTooltip = function(locationKey){
        var locationData = locationsDataManager.getLocationSelectedData(locationKey);
        var locationName = getLocationNameFromLocationKey(locationKey);


        d3.select("#tooltip-locations").classed("hidden", false);
        var xPosition = d3.event.pageX + TOOLTIP_DISTANCE_FROM_MOUSE;
        var yPosition = d3.event.pageY + TOOLTIP_DISTANCE_FROM_MOUSE;
        d3.select("#tooltip-locations")
            .style("left", xPosition + "px")
            .style("top", yPosition + "px");

        d3.select("#tooltip-locations  #locationNameTooltip")
            .text(locationName);

        if(!dataManager.isLocationKeyAlreadySelected(locationKey)){
            d3.select("#locationDataTooltipContainer").classed("hidden",true);

        } else {
            d3.select("#locationDataTooltipContainer").classed("hidden",false);
            d3.select("#tooltip-locations #locationScoreTooltip").text(scoreToPercentage(locationData.score));
            d3.select("#tooltip-locations  #locationFacebookCoverage")
                .text(convertIntegerToReadable(locationData.audienceCoverage));

            d3.select("#tooltip-locations  #leftAudienceLocationTooltip")
                .text(convertIntegerToReadable(locationData.leftAudience));

            d3.select("#tooltip-locations  #rightAudienceLocationTooltip")
                .text(convertIntegerToReadable(locationData.rightAudience));
        }
    };

    this.mouseoutTooltip = function(){
        d3.select("#tooltip-locations").classed("hidden", true);
    };

    this.init();
}
