/**
 * Created by maraujo on 12/25/16.
 */
function SharebleLink(){
    var currentInstance = this;
    this.init = function () {
        if(window.location.search){
            var params = window.location.search.split("?").pop();
            currentInstance.applyStateByParams(params);
        } else {
            sharebleLink.setSharebleLinkAsUrl();
        }

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
        for(var countryIndex = 0; countryIndex < state.countries.length; countryIndex++){
            var countryCode = state.countries[countryIndex];
            urlParams.append("country",countryCode);
        }
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
    this.setSharebleLinkAsUrl = function(){
        var newUrl = currentInstance.getCurrentSharebleLink();
        history.pushState({}, null, newUrl)
    };
    this.updateData = function () {
      currentInstance.setSharebleLinkAsUrl();
    };
    this.paramFromUrlParams = function (paramName, urlParams) {
        switch(paramName){
            case "health":
                var valueInParams = urlParams.get("health");
                var valueInOurData = getValueFromListIgnoreCase(valueInParams, healthTopics);
                if(valueInOurData){
                    return valueInOurData;
                } else{
                    throw Error("Parameter name invalid.");
                }
                break;
            case "luxury":
                var valueInParams = urlParams.get("luxury");
                var valueInOurData = getValueFromListIgnoreCase(valueInParams, luxuryTopics);
                if(valueInOurData){
                    return valueInOurData;
                } else{
                    throw Error("Parameter name invalid.");
                }
                break;
            case "country":
                var country_codes = [];
                var referencesToCountryList = urlParams.getAll("country");
                for(var referenceIndex in referencesToCountryList){
                    var reference = referencesToCountryList[referenceIndex];
                    var countryCode = getCountryCodeFromReference(reference);
                    if(countryCode){
                        country_codes.push(countryCode);
                    } else {
                        throw Error("Parameter name invalid.");
                    }
                }
                return country_codes;
                break;
            case "gender":
                var valueInParams = urlParams.get("gender");
                var valueInOurData = getValueFromListIgnoreCase(valueInParams, ["Male", "Female"]);
                if(valueInOurData){
                    return valueInOurData;
                } else{
                    throw Error("Parameter name invalid.");
                }
                break;
            case "scholarity":
                var valueInParams = urlParams.get("scholarity");
                var valueInOurData = getValueFromListIgnoreCase(valueInParams, ["GRAD","ND","HS"]);
                if(valueInOurData){
                    return valueInOurData;
                } else{
                    throw Error("Parameter name invalid.");
                }
                break;
            case "age_range":
                var valueInParams = urlParams.get("age_range");
                var valueInOurData = getValueFromListIgnoreCase(valueInParams, ["18-24", "25-44", "45+" ]);
                if(valueInOurData){
                    return valueInOurData;
                } else{
                    throw Error("Parameter name invalid.");
                }
                break;
            case "citizenship":
                var valueInParams = urlParams.get("citizenship");
                var valueInOurData = getValueFromListIgnoreCase(valueInParams, ["Expats", "Locals"]);
                if(valueInOurData){
                    return valueInOurData;
                } else{
                    throw Error("Parameter name invalid.");
                }
                break;
            default:
                throw Error("Parameter name invalid.");
        }
        return params.get(paramName);
    };
    this.applyStateByParams = function (params) {
        try{
            var urlParams = new URLSearchParams(params);
            let health = currentInstance.paramFromUrlParams("health", urlParams);
            let luxury = currentInstance.paramFromUrlParams("luxury", urlParams);
            let countries = currentInstance.paramFromUrlParams("country", urlParams);
            let gender = currentInstance.paramFromUrlParams("gender", urlParams);
            let scholarity = currentInstance.paramFromUrlParams("scholarity", urlParams);
            let age_range = currentInstance.paramFromUrlParams("age_range", urlParams);
            let citizenship = currentInstance.paramFromUrlParams("citizenship", urlParams);

            if(health == null && luxury == null){
                throw Error("Health and Luxury can't be null in the same time.");
            }
            NODES_SELECTED.selectedHealth = health;
            NODES_SELECTED.selectedLuxury = luxury;
            NODES_SELECTED.country_codes2letters = countries;
            if(gender){
                NODES_SELECTED.categories["gender"] = gender;
            }
            if(scholarity){
                NODES_SELECTED.categories["scholarity"] = scholarity;
            }
            if(age_range){
                NODES_SELECTED.categories["gender"] = age_range;
            }
            if(citizenship){
                NODES_SELECTED.categories["gender"] = citizenship;
            }
            NODES_SELECTED.update();


        } catch(Exception){
            $("#alertCouldntParseParams").removeClass("hidden");
            setTimeout(function(){ $("#alertCouldntParseParams").fadeOut(); }, 8000);
            console.log("Couldn't parse parameters. Default parameters applied.")
        }
    };
}