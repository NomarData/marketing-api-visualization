/**
 * Created by maraujo on 2/2/17.
 */
/**
 * Created by maraujo on 12/1/16.
 */
function FindingFinder(){
    var currentInstance = this;
    this.currentDemographicFinding = [];
    this.currentLocationsFinding = [];
    this.computeLocationsStandardDeviation = function(locationsData) {
        var scores = [];
        for(var locationCode in locationsData){
            var locationData = locationsData[locationCode];
            scores.push(locationData.score);
        }
        return ss.standardDeviation(scores)
    }
    this.computeDemographicsStandardDeviation = function(demographicsData) {
        var scores = [];
        $.map(demographicsData, function (demographicData) {
            scores.push(demographicData.score);
        })
        return ss.standardDeviation(scores)
    }
    this.computeDemographicsAverage = function(demographicsData) {
        var scores = [];
        $.map(demographicsData, function (demographicData) {
            scores.push(demographicData.score);
        })
        return ss.mean(scores)
    }

    this.computeLocationsStandardAverage = function(locationsData) {
        var scores = [];
        for(var locationData in locationsData){
            var locationData = locationsData[locationData];
            scores.push(locationData.score);
        }
        return ss.mean(scores)
    }

    this.findLocationsOutOfStandardDeviation = function(){
        var locationsData = dataManager.getSelectedLocationsData();
        var std = this.computeLocationsStandardDeviation(locationsData);
        var average = this.computeLocationsStandardAverage(locationsData);

        for(var locationData in locationsData){
            var score = locationsData[locationData].score
            if(score > (average + 2*std)){
                currentInstance.currentLocationsFinding.push("<b>"  + convert2LettersCodeToName(locationData) + "</b> has a score (" + scoreToPercentage(score) + ")</span> <span class='good'>higher</span> than average <span class=''>(" + scoreToPercentage(average) + ")</span>  of others locations.");
            }
            if(score < (average - 2*std)){
                currentInstance.currentLocationsFinding.push("<b>"  + convert2LettersCodeToName(locationData) + "</b> has a score (" + scoreToPercentage(score) + ")</span> <span class='bad'>lower</span> than average <span class=''>(" + scoreToPercentage(average) + ")</span>  of others locations.");
            }
        }
    };

    this.findDemographicsOutOfStandardDeviation = function(){
        var demographicsData = treemapManager.getAllVisibleTreemapData();
        var std = currentInstance.computeDemographicsStandardDeviation(demographicsData);
        var average = this.computeDemographicsAverage(demographicsData);
        for(let demographicName in demographicsData){
            var score = demographicsData[demographicName].score;
            if(score > (average + 2*std )){
                currentInstance.currentDemographicFinding.push("<b>"  + getTooltipLabel(demographicsData[demographicName].category) + ":" + getTooltipLabel(demographicName) + "</b> has a score (" + scoreToPercentage(score) + ")</span> <span class='good'>higher</span> than average <span class=''>(" + scoreToPercentage(average) + ")</span>  of others filters.");
            }
            if(score < (average - 2*std)){
                currentInstance.currentDemographicFinding.push("<b>"  + getTooltipLabel(demographicsData[demographicName].category) + ":" + getTooltipLabel(demographicName) + "</b> has a score (" + scoreToPercentage(score) + ")</span> <span class='bad'>lower</span> than average <span class=''>(" + scoreToPercentage(average) + ")</span>  of others filters.");
            }
        }
    };

    this.addLocationsFindingToInterface = function(){
        if(currentInstance.currentLocationsFinding.length > 0){
            $("#interestingFindingContainer").append("<div  class='span6'><div class='text-center' style='font-weight:bold'>Between Locations</div><div class='text-center' id='locationsFindingList'></div></div>")
        }
        for(var findingIndex in currentInstance.currentLocationsFinding){
            var finding = currentInstance.currentLocationsFinding[findingIndex];
            $("#locationsFindingList").append("<div>" + finding + "</div>");
        }
    };

    this.addDemographicsFindingToInterface = function(){
        if(currentInstance.currentDemographicFinding.length > 0){
            $("#interestingFindingContainer").append("<div  class='span6'><div class='text-center' style='font-weight:bold'>Between Filters</div><div class='text-center' id='demographicsFindingList'></div></div>")
        }
        for(var findingIndex in currentInstance.currentDemographicFinding){
            var finding = currentInstance.currentDemographicFinding[findingIndex];
            $("#demographicsFindingList").append("<div>" + finding + "</div>");
        }
    };
    this.cleanFindingContainer = function(){
            $("#interestingFindingContainer").empty();
            currentInstance.currentDemographicFinding = [];
            currentInstance.currentLocationsFinding = [];
    }
    this.showTitle = function(){
        if(currentInstance.currentDemographicFinding.length > 0 || currentInstance.currentLocationsFinding.length > 0){
            $("#interestingFindingsTitle").show()
        } else {
            $("#interestingFindingsTitle").hide()
        }
    }

    this.updateData = function () {
        currentInstance.cleanFindingContainer();
        currentInstance.findLocationsOutOfStandardDeviation();
        currentInstance.addLocationsFindingToInterface();
        currentInstance.findDemographicsOutOfStandardDeviation();
        currentInstance.addDemographicsFindingToInterface();
        currentInstance.showTitle();
        }




    this.init = function(){
        currentInstance.updateData();
    };
    this.init();
}
