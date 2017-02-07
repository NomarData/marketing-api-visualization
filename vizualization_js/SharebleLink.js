/**
 * Created by maraujo on 12/25/16.
 */
function InvalidParameterValueException(value, arrayName){
    this.name = "InvalidParameterValueException";
    this.value = value;
    this.arrayName = arrayName;
    this.message = "Sorry, we couldn't parse yours parameters. Default parameters were applied. <strong> The value: " + value + " is invalid. For: " + arrayName.replace("countries","country") + "</strong>";
}

function HealthAndLuxuryNullException(){
    this.name = "HealthAndLuxuryNullException";
    this.message = "Health and Luxury can't be both null."
}


function SharebleLink(){
    var currentInstance = this;
    this.reversingState = false;
    this.listsOfValues = listOfValues;
    this.hasParamsGivenUrl = function(url){
        var urlList = url.split("?");
        if(urlList.length > 1){
            return true;
        } else {
            return false;
        }
    };
    this.getUrlParamsGivenUrl = function (url) {
        var urlList = url.split("?");
        if(urlList.length > 1){
            urlList = urlList.splice(1);
            var params = urlList.join("?")
            return params;
        } else {
            return null;
        }
    };

    this.applyBackBtnFunctionality = function () {
        $(window).on('popstate', function (e) {
            var state = e.originalEvent.state;
            if (state !== null) {
                var url = window.location.href;
                console.log("Back: " + currentInstance.getUrlParamsGivenUrl(url));
                if(currentInstance.hasParamsGivenUrl(url)){
                    currentInstance.applyStateGivenUrl(url);
                }
            }
        });
    };

    this.init = function () {
        var url = window.location.href;
        if(currentInstance.hasParamsGivenUrl(url)){
            currentInstance.applyStateGivenUrl(url);
        } else {
            // dataManager.updateDatasetAndGetPromise();
            dataManager.selectDefaultCountries();
            sharebleLink.updateSharebleLinkAsUrl();
        }
        currentInstance.applyBackBtnFunctionality();
        updateSocialLinkFields();
    };
    this.applyStateGivenUrl = function (url) {
        var params = currentInstance.getUrlParamsGivenUrl(url);
        params = params.toLowerCase();
        var newState = currentInstance.getStateByParams(params);
        if(newState){
            currentInstance.applyState(newState);
        }
    }
    this.applyState = function(newState){
        console.log(newState);
        currentInstance.reversingState = true;
        dataManager.setHealthAndLuxuryTopicAndGetPromise(newState["health"], newState["luxury"]).done(function(){
            treemapManager.clickOnTreemapGivenNameAndValue("genders", newState["genders"]);
            treemapManager.clickOnTreemapGivenNameAndValue("ages_ranges", newState["ages_ranges"]);
            treemapManager.clickOnTreemapGivenNameAndValue("scholarities", newState["scholarities"]);
            treemapManager.clickOnTreemapGivenNameAndValue("behavior", newState["behavior"]);
            dataManager.setCountryCodeList(newState["countries"]);
            currentInstance.reversingState = false;
            currentInstance.updateData();
        });


    };
    this.getApplycationState = function(){
        return {
            "health": dataManager.selectedHealth,
            "luxury": dataManager.selectedLuxury,
            "selectedCategoriesAndValues" : dataManager.selectedCategoriesAndValues,
            "countries" : dataManager.selectedLocations_2letters
        }
    };
    this.buildUrlFromState = function (state) {
        var urlParams = new URLSearchParams();
        urlParams.append('health', state.health);
        urlParams.append('luxury', state.luxury);
        urlParams.append("country",state.countries.join("-"));
        for(var categoryKey in state.selectedCategoriesAndValues){
            urlParams.append(categoryKey,state.selectedCategoriesAndValues[categoryKey]);
        }
        var currentRootUrl = window.location.origin + window.location.pathname + "?";
        return currentRootUrl + urlParams.toString();
    };
    this.getCurrentSharebleLink = function(){
        var applicationState = currentInstance.getApplycationState();
        return currentInstance.buildUrlFromState(applicationState);
    };
    this.updateSharebleLinkAsUrl = function(){
        var newUrl = currentInstance.getCurrentSharebleLink();
        if(newUrl != window.location.href){
            history.pushState({}, null, newUrl);
        }
    };
    this.updateData = function () {
        if(currentInstance.reversingState == false){
            currentInstance.updateSharebleLinkAsUrl();
        }
        updateSocialLinkFields();
    };

    this.paramFromUrlParams = function (paramName, urlParams) {
        var valueInOurData;
        var valueInParams;

        switch(paramName){
            case "health":
                valueInParams = urlParams.get("health");
                valueInOurData = currentInstance.getValueFromListIgnoreCase(valueInParams, "health");
                break;
            case "luxury":
                valueInParams = urlParams.get("luxury");
                valueInOurData = currentInstance.getValueFromListIgnoreCase(valueInParams, "luxury");
                break;
            case "country":
                valueInOurData = [];
                valueInParams = urlParams.get("country");
                if(valueInParams){
                    var referencesToCountryList = valueInParams.split("-");
                    for(var referenceIndex in referencesToCountryList){
                        var reference = referencesToCountryList[referenceIndex];
                        valueInOurData.push(currentInstance.getCountryCodeFromReference(reference));
                    }
                } else {
                    valueInOurData = [];
                }

                break;
            case "gender":
                valueInParams = urlParams.get("gender");
                valueInOurData = currentInstance.getValueFromListIgnoreCase(valueInParams, "gender");
                break;
            case "scholarity":
                valueInParams = urlParams.get("scholarity");
                valueInOurData = currentInstance.getValueFromListIgnoreCase(valueInParams, "scholarity");
                break;
            case "age_range":
                valueInParams = urlParams.get("age_range");
                valueInOurData = currentInstance.getValueFromListIgnoreCase(valueInParams, "age_range");
                break;
            case "citizenship":
                valueInParams = urlParams.get("citizenship");
                valueInOurData = currentInstance.getValueFromListIgnoreCase(valueInParams, "citizenship");
                break;
            default:
                throw Error("Parameter name invalid.");
        }
        //Finally
        return valueInOurData;
    };
    this.printState = function(){
        var categories = dataManager.selectedCategoriesAndValues;
        console.log("Selected Health:" + dataManager.selectedHealth);
        console.log("Selected Luxury:" + dataManager.selectedLuxury);
        console.log("Selected Countries:" + dataManager.selectedLocations_2letters);
        console.log("Selected Gender:" + ("gender" in categories ? categories["gender"] : null));
        console.log("Selected Scholarity:" + ("scholarity" in categories ? categories["scholarity"] : null));
        console.log("Selected Age Range:" + ("age_range" in categories ? categories["age_range"] : null));
        console.log("Selected Citizenship:" + ("citizenship" in categories ? categories["citizenship"] : null));
    };
    this.getStateByParams = function (params) {
        var newState = {};
        try{
            var urlParams = new URLSearchParams(params);
            newState["health"] = currentInstance.paramFromUrlParams("health", urlParams);
            newState["luxury"] = currentInstance.paramFromUrlParams("luxury", urlParams);
            newState["countries"] = currentInstance.paramFromUrlParams("country", urlParams);
            newState["gender"] = currentInstance.paramFromUrlParams("gender", urlParams);
            newState["scholarity"] = currentInstance.paramFromUrlParams("scholarity", urlParams);
            newState["age_range"] = currentInstance.paramFromUrlParams("age_range", urlParams);
            newState["citizenship"] = currentInstance.paramFromUrlParams("citizenship", urlParams);

            if(newState["health"] == null && newState["luxury"] == null){
                throw new HealthAndLuxuryNullException();
            }
            return newState;
        } catch(Exception){
            if(Exception instanceof InvalidParameterValueException || Exception instanceof HealthAndLuxuryNullException){
                $("#alertCouldntParseParams").removeClass("hidden");
                $("#alertCouldntParseParams").html(Exception.message);
                setTimeout(function(){ $("#alertCouldntParseParams").fadeOut(); }, 8000);
                dataManager.selectAllCountries();
                console.log("Exception Name:\n" + Exception.name);
                console.log("Exception Message:\n" + Exception.message);
                console.log(newState);

            }
            else {
                throw Exception;
            }
        }
    };

    this.getValueFromListIgnoreCase = function(givenValue, arrayName){
        var array = currentInstance.listsOfValues[arrayName];
        if(givenValue && givenValue != "null"){
            //reference can be code 2 letter, code 3 letters or country name
            var givenValue = givenValue.toLowerCase();
            for(var index in array){
                var valueInArrayLow = array[index].toLowerCase();
                if(givenValue == valueInArrayLow){
                    return array[index];
                }
            }
            throw new InvalidParameterValueException(givenValue, arrayName); //If no value matched
        }
        return null;
    }

    this.getCountryCodeFromReference = function(reference){
        //reference can be code 2 letter, code 3 letters or country name
        if(reference){
            var reference = reference.toLowerCase();
            for(var countryCode2Letters in locationCodeMap){
                var code2Letters = countryCode2Letters.toLowerCase();
                var code3Letters = locationCodeMap[countryCode2Letters].datamaps_code.toLowerCase();
                var name = locationCodeMap[countryCode2Letters].name.toLowerCase();
                if(reference == code2Letters || reference == code3Letters || reference == name){
                    return countryCode2Letters;
                }
            }
            throw new InvalidParameterValueException(reference, "countries"); //If no value matched
        }
        return null;
    }
}