/**
 * Created by maraujo on 12/25/16.
 */
COUNT_SETURL = 0;
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
    this.listsOfValues = {
        "health" : healthTopics,
        "luxury" : luxuryTopics,
        "gender" : ["Male", "Female"],
        "scholarity" : ["GRAD","ND","HS"],
        "age_range" : ["18-24", "25-44", "45+" ],
        "citizenship" : ["Expats", "Locals"],
        "country" : countryCodeMap,
    };
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
            NODES_SELECTED.updateDataset();
            NODES_SELECTED.selectDefaultCountries();
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
        NODES_SELECTED.setHealthTopic(newState["health"]);
        NODES_SELECTED.setLuxuryTopic(newState["luxury"]);
        treemapManager.clickOnTreemapGivenNameAndValue("gender", newState["gender"]);
        treemapManager.clickOnTreemapGivenNameAndValue("age_range", newState["age_range"]);
        treemapManager.clickOnTreemapGivenNameAndValue("scholarity", newState["scholarity"]);
        treemapManager.clickOnTreemapGivenNameAndValue("citizenship", newState["citizenship"]);
        NODES_SELECTED.setCountryCodeList(newState["countries"]);
        currentInstance.reversingState = false;
        currentInstance.updateData();
    };
    this.getApplycationState = function(){
        return {
            "health": NODES_SELECTED.selectedHealth,
            "luxury": NODES_SELECTED.selectedLuxury,
            "categories" : NODES_SELECTED.categories,
            "countries" : NODES_SELECTED.country_codes2letters
        }
    };
    this.buildUrlFromState = function (state) {
        var urlParams = new URLSearchParams();
        urlParams.append('health', state.health);
        urlParams.append('luxury', state.luxury);
        urlParams.append("country",state.countries.join("-"));
        for(var categoryKey in state.categories){
            urlParams.append(categoryKey,state.categories[categoryKey]);
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
            console.log(".\nSETTING URL: " + COUNT_SETURL + "\n.");
            COUNT_SETURL += 1;
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
        var categories = NODES_SELECTED.categories;
        console.log("Selected Health:" + NODES_SELECTED.selectedHealth);
        console.log("Selected Luxury:" + NODES_SELECTED.selectedLuxury);
        console.log("Selected Countries:" + NODES_SELECTED.country_codes2letters);
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
                NODES_SELECTED.selectAllCountries();
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
            for(var countryCode2Letters in countryCodeMap){
                var code2Letters = countryCode2Letters.toLowerCase();
                var code3Letters = countryCodeMap[countryCode2Letters]._3letter_code.toLowerCase();
                var name = countryCodeMap[countryCode2Letters].name.toLowerCase();
                if(reference == code2Letters || reference == code3Letters || reference == name){
                    return countryCode2Letters;
                }
            }
            throw new InvalidParameterValueException(reference, "countries"); //If no value matched
        }
        return null;
    }
}