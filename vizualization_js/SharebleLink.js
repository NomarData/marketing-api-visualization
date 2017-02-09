/**
 * Created by maraujo on 12/25/16.
 */
function InvalidParameterValueException(value, arrayName){
    this.name = "InvalidParameterValueException";
    this.value = value;
    this.arrayName = arrayName;
    this.message = "Sorry, we couldn't parse yours parameters. Default parameters were applied. <strong> The value: " + value + " is invalid. For: " + arrayName.replace("locations","location") + "</strong>";
}

function LeftTopicAndRightTopicNullException(){
    this.name = "LeftTopicAndRightTopicNullException";
    this.message = "Left and Right topics can't be both null."
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
            dataManager.selectDefaultLocations();
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
        dataManager.setLeftAndRightTopicAndGetPromise(newState["leftTopic"], newState["rightTopic"]).done(function(){
            treemapManager.clickOnTreemapGivenNameAndValue("genders", newState["genders"]);
            treemapManager.clickOnTreemapGivenNameAndValue("ages_ranges", newState["ages_ranges"]);
            treemapManager.clickOnTreemapGivenNameAndValue("scholarities", newState["scholarities"]);
            treemapManager.clickOnTreemapGivenNameAndValue("behavior", newState["behavior"]);
            dataManager.setSelectedLocations2lettersList(newState["location"]);
            currentInstance.reversingState = false;
            currentInstance.updateData();
        });


    };
    this.getApplycationState = function(){
        return {
            "leftTopic": dataManager.selectedLeftTopic,
            "rightTopic": dataManager.selectedRightTopic,
            "selectedCategoriesAndValues" : dataManager.selectedCategoriesAndValues,
            "locations" : dataManager.selectedLocations_2letters
        }
    };
    this.buildUrlFromState = function (state) {
        var urlParams = new URLSearchParams();
        urlParams.append('leftTopic', state.leftTopic);
        urlParams.append('rightTopic', state.rightTopic);
        urlParams.append("location",state.locations.join("-"));
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
            case "leftTopic":
            case "health":
                valueInParams = urlParams.get("leftTopic");
                valueInOurData = currentInstance.getValueFromListIgnoreCase(valueInParams, "leftTopic");
                break;
            case "rightTopic":
            case "luxury":
                valueInParams = urlParams.get("rightTopic");
                valueInOurData = currentInstance.getValueFromListIgnoreCase(valueInParams, "rightTopic");
                break;
            case "location":
                valueInOurData = [];
                valueInParams = urlParams.get("location");
                if(valueInParams){
                    var referencesToLocationList = valueInParams.split("-");
                    for(var referenceIndex in referencesToLocationList){
                        var reference = referencesToLocationList[referenceIndex];
                        valueInOurData.push(currentInstance.getLocation2lettersFromReference(reference));
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
                throw Error("Parameter name invalid:" + paramName);
        }
        //Finally
        return valueInOurData;
    };
    this.printState = function(){
        var categories = dataManager.selectedCategoriesAndValues;
        console.log("Selected leftTopic:" + dataManager.selectedLeftTopic);
        console.log("Selected rightTopic:" + dataManager.selectedRightTopic);
        console.log("Selected Locations:" + dataManager.selectedLocations_2letters);
        console.log("Selected Gender:" + ("gender" in categories ? categories["gender"] : null));
        console.log("Selected Scholarity:" + ("scholarity" in categories ? categories["scholarity"] : null));
        console.log("Selected Age Range:" + ("age_range" in categories ? categories["age_range"] : null));
        console.log("Selected Citizenship:" + ("citizenship" in categories ? categories["citizenship"] : null));
    };
    this.getStateByParams = function (params) {
        var newState = {};
        try{
            var urlParams = new URLSearchParams(params);
            newState["leftTopic"] = currentInstance.paramFromUrlParams("leftTopic", urlParams);
            newState["rightTopic"] = currentInstance.paramFromUrlParams("rightTopic", urlParams);
            newState["location"] = currentInstance.paramFromUrlParams("location", urlParams);
            newState["gender"] = currentInstance.paramFromUrlParams("gender", urlParams);
            newState["scholarity"] = currentInstance.paramFromUrlParams("scholarity", urlParams);
            newState["age_range"] = currentInstance.paramFromUrlParams("age_range", urlParams);
            newState["citizenship"] = currentInstance.paramFromUrlParams("citizenship", urlParams);

            if(newState["leftTopic"] == null && newState["rightTopic"] == null){
                throw new LeftTopicAndRightTopicNullException();
            }
            return newState;
        } catch(Exception){
            if(Exception instanceof InvalidParameterValueException || Exception instanceof LeftTopicAndRightTopicNullException){
                $("#alertCouldntParseParams").removeClass("hidden");
                $("#alertCouldntParseParams").html(Exception.message);
                setTimeout(function(){ $("#alertCouldntParseParams").fadeOut(); }, 8000);
                dataManager.selectAllLocations();
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
            //reference can be code 2 letter, code 3 letters or location name
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

    this.getLocation2lettersFromReference = function(reference){
        //reference can be code 2 letter, code 3 letters or location name
        if(reference){
            var reference = reference.toLowerCase();
            for(var locationKey in locationCodeMap){
                var code2Letters = locationCodeMap[locationKey]._2letters_code.toLowerCase();
                var datamap_code = locationCodeMap[locationKey].datamaps_code.toLowerCase();
                var name = locationCodeMap[locationKey].name.toLowerCase();
                if(reference == code2Letters || reference == datamap_code || reference == name){
                    return getLocation2letterFromLocationKey(locationKey);
                }
            }
            throw new InvalidParameterValueException(reference, "locations"); //If no value matched
        }
        return null;
    }
}