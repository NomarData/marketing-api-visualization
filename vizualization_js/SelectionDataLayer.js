function SelectionDataLayer(){
    var currentInstance = this;
    this.country_codes2letters = [];
    this.categories = {};
    this.selected_instances = [];
    this.selectedFacebookPopulationInstances = [];
    this.selectedHealth = healthTopics[3];
    this.selectedLuxury = luxuryTopics[4];
    this.selectedFacebookPopulationSum = 0;
    this.loader = $(".loader");


    this.getTotalFacebookUsersGivenActualSelectionAndACategoryAndSubcategory = function(categoryName, subCategoryName){
        var total = 0;
        for(var instanceIndex in currentInstance.selectedFacebookPopulationInstances){
            var instance = currentInstance.selectedFacebookPopulationInstances[instanceIndex];
            if(instance[categoryName] == subCategoryName){
                total += instance.audience
            }
        }
        return total;
    };

    this.updateDatasetAndGetPromise = function(){
        currentInstance.loader.fadeIn();
        return fusionAPI.getPromiseToUpdateDatasetBySelection(currentInstance.selectedHealth, currentInstance.selectedLuxury).done(function(data){
            fusionAPI.setInstanceList(data.instances);
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
        currentInstance.country_codes2letters = [];
        currentInstance.updateVisualComponents();
    };
    this.selectAllCountries = function(){
        currentInstance.country_codes2letters = [];
        for(var countryCode in countryCodeMap){
            currentInstance.country_codes2letters.push(countryCode);
        }
        currentInstance.updateVisualComponents();
    };
    this.selectDefaultCountries = function(){
        // onClickCountryFunctionBy2LettersCode("AE");
        // onClickCountryFunctionBy2LettersCode("DZ");
        currentInstance.selectAllCountries();
    };
    this.getSelectedInstances = function(){
        return currentInstance.selected_instances;
    }
    this.setCountryCodeList = function(countryCodeList){
        currentInstance.country_codes2letters = countryCodeList;
        currentInstance.updateVisualComponents();
    }
    this.insertCountryCode = function(countryCode){
        console.log("Inserting:" + countryCode);
        currentInstance.country_codes2letters.push(countryCode);
        currentInstance.updateVisualComponents();
    }
    this.removeCountryCode = function(country_code){
        currentInstance.country_codes2letters = removeValueFromArray(currentInstance.country_codes2letters, country_code);
        currentInstance.updateVisualComponents();
    }
    this.setCategoryValueSelected = function(category, value){
        if(!value) return;
        currentInstance.categories[category] = value;
        currentInstance.updateVisualComponents();
    }
    this.unsetCategory = function(category){
        delete currentInstance.categories[category];
        currentInstance.updateVisualComponents();
    }
     this.setSelectedInstances = function(){
         console.log("Selecting Instances")
        var instances = [];
        var facebookPopulationInstances = [];
        for(var indexData in currentData){
            var instance = currentData[indexData];
            if(NODES_SELECTED.isInstanceAgreeWithSelected(instance)){
                instances.push(instance)
            }
        }
         for(var indexFacebookPopulation in facebookPopulation){
             var instance = facebookPopulation[indexFacebookPopulation];
             if(currentInstance.isInstanceAgreeWithSelected(instance)){
                 facebookPopulationInstances.push(instance)
             }
         }
        currentInstance.selected_instances = instances;
        currentInstance.selectedFacebookPopulationInstances = facebookPopulationInstances;
        currentInstance.updateSumSelectedFacebookPopulation();
        console.log(currentInstance.selectedFacebookPopulationSum)
        console.log("Instances and Facebook Population Selected");
    }

    this.updateSumSelectedFacebookPopulation = function(){
        if(currentInstance.selectedFacebookPopulationInstances.length > 0){
            var total = currentInstance.selectedFacebookPopulationInstances.map(function(instance){ return instance.audience}).reduce(function (total, num) { return total + num});
            currentInstance.selectedFacebookPopulationSum = total;
        } else {
            currentInstance.selectedFacebookPopulationSum = 0;
        }


    }

    this.getSumSelectedFacebookPopulationByCountry = function(countryCode){
        if(currentInstance.selectedFacebookPopulationInstances.length > 0){
            var total = 0;
            for(var instanceIndex in currentInstance.selectedFacebookPopulationInstances){
                var instance = currentInstance.selectedFacebookPopulationInstances[instanceIndex];
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
        return currentInstance.country_codes2letters.indexOf(country_code) != -1 ? true : false;
    };
    this.isInstanceAgreeWithSelected = function(instance){
        for(var key in currentInstance.categories){
            if(instance[key] != currentInstance.categories[key]){
                // console.log(instance[key] + "!=" + currentInstance.categories[key]);
                return false;
            }
        }
        //Check Country code
        if(currentInstance.country_codes2letters.length > 0){
            if(!currentInstance.isCountryAlreadySelected(instance.country_code)){
                // console.log("Country Not Selected");
                return false;
            }
        }

        return true;
    }
}

