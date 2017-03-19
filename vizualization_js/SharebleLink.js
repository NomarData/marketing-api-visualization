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
    this.listsOfValues = applicationPossibleStates;
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
        dataManager.setLeftAndRightTopicAndGetPromise(newState[LEFT_TOPIC], newState[RIGHT_TOPIC]).done(function(){
            for(var key in treemapPossibleStates){
                treemapManager.clickOnTreemapGivenNameAndValue(key, newState[key]);
            }
            dataManager.setSelectedLocations2lettersList(newState["location"]);
            currentInstance.reversingState = false;
            currentInstance.updateData();
        });


    };
    this.getApplycationState = function(){
        var applicationState = {}
        applicationState[LEFT_TOPIC] = dataManager.selectedLeftTopic;
        applicationState[RIGHT_TOPIC] = dataManager.selectedRightTopic;
        applicationState["selectedCategoriesAndValues"] = dataManager.selectedCategoriesAndValues;
        applicationState["locations"] = dataManager.selectedLocations_2letters;
        return applicationState;
    };
    this.buildUrlFromState = function (state) {
        var urlParams = new URLSearchParams();
        urlParams.append('leftTopic', state[LEFT_TOPIC]);
        urlParams.append('rightTopic', state[RIGHT_TOPIC]);
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

        if(Object.keys(treemapPossibleStates).includes(paramName)){
            valueInParams = urlParams.get(paramName);
                return currentInstance.getValueFromListIgnoreCase(valueInParams,paramName);
        }


        switch(paramName){
            case LEFT_TOPIC:
            case "health":
                valueInParams = urlParams.get(LEFT_TOPIC.toLowerCase());
                valueInOurData = currentInstance.getValueFromListIgnoreCase(valueInParams, "leftTopic");
                break;
            case RIGHT_TOPIC:
            case "luxury":
                valueInParams = urlParams.get(RIGHT_TOPIC.toLowerCase());
                valueInOurData = currentInstance.getValueFromListIgnoreCase(valueInParams, RIGHT_TOPIC);
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
            // case "gender":
            //     valueInParams = urlParams.get("gender");
            //     valueInOurData = currentInstance.getValueFromListIgnoreCase(valueInParams, "gender");
            //     break;
            // case "scholarity":
            //     valueInParams = urlParams.get("scholarity");
            //     valueInOurData = currentInstance.getValueFromListIgnoreCase(valueInParams, "scholarity");
            //     break;
            // case "age_range":
            //     valueInParams = urlParams.get("age_range");
            //     valueInOurData = currentInstance.getValueFromListIgnoreCase(valueInParams, "age_range");
            //     break;
            // case "citizenship":
            //     valueInParams = urlParams.get("citizenship");
            //     valueInOurData = currentInstance.getValueFromListIgnoreCase(valueInParams, "citizenship");
            //     break;
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
            newState[LEFT_TOPIC] = currentInstance.paramFromUrlParams(LEFT_TOPIC, urlParams);
            newState[RIGHT_TOPIC] = currentInstance.paramFromUrlParams(RIGHT_TOPIC, urlParams);
            newState["location"] = currentInstance.paramFromUrlParams("location", urlParams);
            for(var treemapName in treemapPossibleStates){
                newState[treemapName] = currentInstance.paramFromUrlParams(treemapName, urlParams);
            }
            if(newState[LEFT_TOPIC] == null && newState[RIGHT_TOPIC] == null){
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
            for(var locationKey in getLocationsData()){
                var code2Letters = getLocationsData()[locationKey]._2letters_code.toLowerCase();
                var name = getLocationsData()[locationKey].name.toLowerCase();
                if(reference == code2Letters || reference == name){
                    return getLocation2letterFromLocationKey(locationKey);
                }
            }
            throw new InvalidParameterValueException(reference, "locations"); //If no value matched
        }
        return null;
    }
}