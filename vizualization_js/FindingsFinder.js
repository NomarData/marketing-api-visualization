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
                currentInstance.currentCountriesFinding.push("<b>"  + getCountryNameGivenCode2Letters(countryCode) + "</b> has a score <span class='good'>" + (Math.abs(score/average*100)).toFixed(0) + "%</span> higher than average.");
            }
            if(score < (average - 2*std)){
                currentInstance.currentCountriesFinding.push("<b>"  + getCountryNameGivenCode2Letters(countryCode) + "</b> has a score <span class='bad'>" + (Math.abs(score/average*100)).toFixed(0) + "%</span> lower than average.");
            }
        }
    };

    this.findDemographicsOutOfStandardDeviation = function(){
        $.map(DEFAULT_CATEGORIES_NAMES, function (category) {
            var cellsData = dataManager.getCellsData(category);
            // var std = this.computeCountriesStandardDeviation(countriesData);
            // var average = this.computeCountriesStandardAverage(countriesData);
            // for(var cellData in cellsData){
            //     var score = cellData.score
            //     if(score > (average + 2*std)){
            //         currentInstance.currentDemographicFinding.push("<b>"  + getCountryNameGivenCode2Letters(countryCode) + "</b> has a score <span class='good'>" + (Math.abs(score/average*100)).toFixed(0) + "%</span> higher than average.");
            //     }
            //     if(score < (average - 2*std)){
            //         currentInstance.currentDemographicFinding.push("<b>"  + getCountryNameGivenCode2Letters(countryCode) + "</b> has a score <span class='bad'>" + (Math.abs(score/average*100)).toFixed(0) + "%</span> lower than average.");
            //     }
            // }
        })
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

    this.updateData = function () {
        currentInstance.cleanFindingContainer();
        currentInstance.findCountriesOutOfStandardDeviation();
        currentInstance.addCountriesFindingToInterface();
        // currentInstance.findDemographicsOutOfStandardDeviation();
        // currentInstance.addDemographicsFindingToInterface();
        }



    this.init = function(){
        currentInstance.updateData();
    };
    this.init();
}
