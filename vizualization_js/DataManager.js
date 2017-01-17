function DataManager(){
    var currentInstance = this;
    this.selectedCountries_2letters = [];
    this.selectedCategoriesAndValues = {};
    this.selectedInstances = [];
    this.selectedFbDemographicInstances = [];
    this.selectedHealth = healthTopics[3];
    this.selectedLuxury = luxuryTopics[4];
    this.selectedFbDemographicSum = 0;
    this.loader = $(".loader");

    this.getTotalFacebookUsersGivenActualSelectionAndACategoryAndSubcategory = function(categoryName, subCategoryName){
        var total = 0;
        for(var instanceIndex in currentInstance.selectedFbDemographicInstances){
            var instance = currentInstance.selectedFbDemographicInstances[instanceIndex];
            if(instance[categoryName] == subCategoryName){
                total += instance.audience
            }
        }
        return total;
    };

    this.updateDatasetAndGetPromise = function(){
        currentInstance.loader.fadeIn();
        return externalDataManager.getPromiseToUpdateDatasetBySelection(currentInstance.selectedHealth, currentInstance.selectedLuxury).done(function(data){
            externalDataManager.setInstanceList(data.instances);
            currentInstance.loader.fadeOut();
            currentInstance.updateVisualComponents();
            // waitingDialog.hide()
        });
    };
    this.setLuxuryTopic = function(luxuryInterest){
        currentInstance.selectedLuxury = luxuryInterest;
        currentInstance.updateDatasetAndGetPromise();
    };
    this.setHealthTopic = function(healthInterest){
        currentInstance.selectedHealth = healthInterest;
        currentInstance.updateDatasetAndGetPromise();
    };
    this.setHealthAndLuxuryTopicAndGetPromise = function(healthInterest, luxuryInterest){
        currentInstance.selectedHealth = healthInterest;
        currentInstance.selectedLuxury = luxuryInterest;
        return currentInstance.updateDatasetAndGetPromise();
    };
    this.flipSelectedLuxury = function(luxuryInterest){
        if(!luxuryInterest) return;
        if(currentInstance.selectedLuxury != luxuryInterest){
            currentInstance.setLuxuryTopic(luxuryInterest);
        } else if (currentInstance.selectedHealth != null){
            currentInstance.setLuxuryTopic(null);
        }
    };
    this.flipSelectedHealth = function(healthInterest){
        if(!healthInterest) return;
        if(currentInstance.selectedHealth != healthInterest) {
            currentInstance.setHealthTopic(healthInterest);
        } else if (currentInstance.selectedLuxury != null){
            currentInstance.setHealthTopic(null);
        }
    };
    this.deselectAllCountries = function(){
        currentInstance.selectedCountries_2letters = [];
        currentInstance.updateVisualComponents();
    };
    this.selectAllCountries = function(){
        currentInstance.selectedCountries_2letters = [];
        for(var countryCode in countryCodeMap){
            currentInstance.selectedCountries_2letters.push(countryCode);
        }
        currentInstance.updateVisualComponents();
    };
    this.selectDefaultCountries = function(){
        // onClickCountryFunctionBy2LettersCode("AE");
        // onClickCountryFunctionBy2LettersCode("DZ");
        currentInstance.selectAllCountries();
    };
    this.getSelectedInstances = function(){
        return currentInstance.selectedInstances;
    }
    this.setCountryCodeList = function(countryCodeList){
        currentInstance.selectedCountries_2letters = countryCodeList;
        currentInstance.updateVisualComponents();
    }
    this.insertCountryCode = function(countryCode){
        console.log("Inserting:" + countryCode);
        currentInstance.selectedCountries_2letters.push(countryCode);
        currentInstance.updateVisualComponents();
    }
    this.removeCountryCode = function(country_code){
        currentInstance.selectedCountries_2letters = removeValueFromArray(currentInstance.selectedCountries_2letters, country_code);
        currentInstance.updateVisualComponents();
    }
    this.setCategoryValueSelected = function(category, value){
        if(!value) return;
        currentInstance.selectedCategoriesAndValues[category] = value;
        currentInstance.updateVisualComponents();
    }
    this.unsetCategory = function(category){
        delete currentInstance.selectedCategoriesAndValues[category];
        currentInstance.updateVisualComponents();
    }
     this.setSelectedInstances = function(){
         console.log("Selecting Instances")
        var instances = [];
        var facebookPopulationInstances = [];
        //Filtering Instances With Interests
        for(var indexData in fbInstancesWithInterests){
            var instance = fbInstancesWithInterests[indexData];
            if(dataManager.isInstanceAgreeWithSelected(instance)){
                instances.push(instance)
            }
        }
         //Filtering demographic related instances
         for(var indexFacebookPopulation in fbInstancesDemographic){
             var instance = fbInstancesDemographic[indexFacebookPopulation];
             if(!currentInstance.hasAllInAnyCategory(instance)){
                 if(currentInstance.isInstanceAgreeWithSelected(instance)){
                     facebookPopulationInstances.push(instance)
                 }
             }

         }
        console.log(facebookPopulationInstances.length);
        currentInstance.selectedInstances = instances;
        currentInstance.selectedFbDemographicInstances = facebookPopulationInstances;
        currentInstance.updateSumSelectedFbInstancesDemographic();
        console.log(currentInstance.selectedFbDemographicSum);
        console.log("Instances and Facebook Population Selected");
    }

    this.updateSumSelectedFbInstancesDemographic = function(){
        if(currentInstance.selectedFbDemographicInstances.length > 0){
            var total = currentInstance.selectedFbDemographicInstances.map(function(instance){ return instance.audience}).reduce(function (total, num) { return total + num});
            currentInstance.selectedFbDemographicSum = total;
        } else {
            currentInstance.selectedFbDemographicSum = 0;
        }


    }

    this.getSumSelectedFacebookPopulationByCountry = function(countryCode){
        if(currentInstance.selectedFbDemographicInstances.length > 0){
            var total = 0;
            for(var instanceIndex in currentInstance.selectedFbDemographicInstances){
                var instance = currentInstance.selectedFbDemographicInstances[instanceIndex];
                if(instance.country_code == countryCode){
                    total += instance.audience;
                }
            }
            return total;
        } else {
            return 0;
        }
    };

    this.updateVisualComponents = function(){
        currentInstance.setSelectedInstances();
        treemapManager.updateTreemaps();
        inclinationScore.updateData();
        arabMap.updateData();
        btnsTopicsSelectors.updateData();
        luxuriousHealthBar.updateData();
        sharebleLink.updateData();
    };

    this.isCountryAlreadySelected = function(country_code) {
        return currentInstance.selectedCountries_2letters.indexOf(country_code) != -1 ? true : false;
    };
    this.isInstanceAgreeWithSelected = function(instance){
        for(var key in currentInstance.selectedCategoriesAndValues){
            if(instance[key] != currentInstance.selectedCategoriesAndValues[key]){
                return false;
            }
        }
        //Check Country code
        if(currentInstance.selectedCountries_2letters.length > 0){
            if(!currentInstance.isCountryAlreadySelected(instance.country_code)){
                return false;
            }
        }
        return true;
    };
    this.hasAllInAnyCategory = function(instance){
        for(var categoryIndex in DEFAULT_CATEGORIES_NAMES){
            var categoryName = DEFAULT_CATEGORIES_NAMES[categoryIndex];
            if(instance[categoryName] == "ALL"){
                return true;
            }
        }
        return false;
    };
    this.getAverageSelectedInclination = function(){
        var averageInclination = {"greenAudience" : 0, "redAudience":0, "greenInclination":0,"redInclination":0,"average":0};
        if(currentInstance.selectedCountries_2letters.length == 0){
            return averageInclination;
        } else{
            var selectedInstances = currentInstance.getSelectedInstances();
            // var total = selectedInstances.map(function(instance){ return instance.audience}).reduce(function (total, num) { return total + num});
            var total = dataManager.selectedFbDemographicSum;
            averageInclination.total = total;
            averageInclination.greenAudience =  selectedInstances.map(
                function(instance){ return getInstancePolarity(instance) == 1 ? instance.audience : 0})
                .reduce(function (total, num) { return total + num});
            averageInclination.redAudience =  selectedInstances.map(
                function(instance){ return getInstancePolarity(instance) == -1 ? instance.audience : 0})
                .reduce(function (total, num) { return total + num});
            averageInclination.greenInclination = averageInclination.greenAudience / total;
            averageInclination.redInclination = averageInclination.redAudience  / total;
            // averageInclination.average = ((averageInclination.greenInclination * averageInclination.greenAudience) - (averageInclination.redInclination * averageInclination.redAudience) ) / total;
            averageInclination.average = averageInclination.greenInclination - averageInclination.redInclination;
            return averageInclination
        }

    };
}

