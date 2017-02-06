/**
 * Created by maraujo on 2/2/17.
 */
/**
 * Created by maraujo on 12/1/16.
 */
function FindingFinder(){
    var currentInstance = this;
    this.currentDemographicFinding = [];
    this.currentCountriesFinding = [];
    this.computeCountriesStandardDeviation = function(countriesData) {
        var scores = [];
        for(var countryCode in countriesData){
            var countryData = countriesData[countryCode];
            scores.push(countryData.score);
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

    this.computeCountriesStandardAverage = function(countriesData) {
        var scores = [];
        for(var countryCode in countriesData){
            var countryData = countriesData[countryCode];
            scores.push(countryData.score);
        }
        return ss.mean(scores)
    }

    this.findCountriesOutOfStandardDeviation = function(){
        var countriesData = dataManager.getSelectedCountriesData();
        var std = this.computeCountriesStandardDeviation(countriesData);
        var average = this.computeCountriesStandardAverage(countriesData);

        for(var countryCode in countriesData){
            var score = countriesData[countryCode].score
            if(score > (average + 2*std)){
                currentInstance.currentCountriesFinding.push("<b>"  + getCountryNameGivenCode2Letters(countryCode) + "</b> has a score (" + scoreToPercentage(score) + ")</span> <span class='good'>higher</span> than average <span class=''>(" + scoreToPercentage(average) + ")</span>  of others countries.");
            }
            if(score < (average - 2*std)){
                currentInstance.currentCountriesFinding.push("<b>"  + getCountryNameGivenCode2Letters(countryCode) + "</b> has a score (" + scoreToPercentage(score) + ")</span> <span class='bad'>lower</span> than average <span class=''>(" + scoreToPercentage(average) + ")</span>  of others countries.");
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
                currentInstance.currentDemographicFinding.push("<b>"  + demographicName + "</b> has a score (" + scoreToPercentage(score) + ")</span> <span class='good'>higher</span> than average <span class=''>(" + scoreToPercentage(average) + ")</span>  of others demographic filters.");
            }
            if(score < (average - 2*std)){
                currentInstance.currentDemographicFinding.push("<b>"  + demographicName + "</b> has a score (" + scoreToPercentage(score) + ")</span> <span class='bad'>lower</span> than average <span class=''>(" + scoreToPercentage(average) + ")</span>  of others demographic filters.");
            }
        }
    };

    this.addCountriesFindingToInterface = function(){
        if(currentInstance.currentCountriesFinding.length > 0){
            $("#interestingFindingContainer").append("<div  class='span6'><div class='text-center' style='font-weight:bold'>Between Countries</div><div class='text-center' id='countriesFindingList'></div></div>")
        }
        for(var findingIndex in currentInstance.currentCountriesFinding){
            var finding = currentInstance.currentCountriesFinding[findingIndex];
            $("#countriesFindingList").append("<div>" + finding + "</div>");
        }
    };

    this.addDemographicsFindingToInterface = function(){
        if(currentInstance.currentDemographicFinding.length > 0){
            $("#interestingFindingContainer").append("<div  class='span6'><div class='text-center' style='font-weight:bold'>Between Demographics</div><div class='text-center' id='demographicsFindingList'></div></div>")
        }
        for(var findingIndex in currentInstance.currentDemographicFinding){
            var finding = currentInstance.currentDemographicFinding[findingIndex];
            $("#demographicsFindingList").append("<div>" + finding + "</div>");
        }
    };
    this.cleanFindingContainer = function(){
            $("#interestingFindingContainer").empty();
            currentInstance.currentDemographicFinding = [];
            currentInstance.currentCountriesFinding = [];
    }
    this.showTitle = function(){
        if(currentInstance.currentDemographicFinding.length > 0 || currentInstance.currentCountriesFinding.length > 0){
            $("#interestingFindingsTitle").show()
        } else {
            $("#interestingFindingsTitle").hide()
        }
    }

    this.updateData = function () {
        currentInstance.cleanFindingContainer();
        currentInstance.findCountriesOutOfStandardDeviation();
        currentInstance.addCountriesFindingToInterface();
        currentInstance.findDemographicsOutOfStandardDeviation();
        currentInstance.addDemographicsFindingToInterface();
        currentInstance.showTitle();
        }




    this.init = function(){
        currentInstance.updateData();
    };
    this.init();
}
