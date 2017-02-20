function DataManager(){
    var currentInstance = this;
    this.selectedLocations_2letters = [];
    this.selectedCategoriesAndValues = {};
    this.selectedInstances = [];
    this.selectedFbDemographicInstances = [];
    this.selectedLeftTopic = leftTopics[DEFAULT_LEFT_TOPIC];
    this.selectedRightTopic = rightTopics[DEFAULT_RIGHT_TOPIC];
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
        return externalDataManager.getPromiseToUpdateDatasetBySelection(currentInstance.selectedLeftTopic, currentInstance.selectedRightTopic).done(function(data){
            externalDataManager.setInstanceList(data.instances);
            currentInstance.loader.fadeOut();
            currentInstance.updateVisualComponents();
            // waitingDialog.hide()
        });
    };
    this.setLuxuryTopic = function(luxuryInterest){
        currentInstance.selectedRightTopic = luxuryInterest;
        currentInstance.updateDatasetAndGetPromise();
    };
    this.setHealthTopic = function(healthInterest){
        currentInstance.selectedLeftTopic = healthInterest;
        currentInstance.updateDatasetAndGetPromise();
    };
    this.setLeftAndRightTopicAndGetPromise = function(healthInterest, luxuryInterest){
        currentInstance.selectedLeftTopic = healthInterest;
        currentInstance.selectedRightTopic = luxuryInterest;
        return currentInstance.updateDatasetAndGetPromise();
    };
    this.flipSelectedRightTopic = function(luxuryInterest){
        if(!luxuryInterest) return;
        if(currentInstance.selectedRightTopic != luxuryInterest){
            currentInstance.setLuxuryTopic(luxuryInterest);
        } else if (currentInstance.selectedLeftTopic != null){
            currentInstance.setLuxuryTopic(null);
        }
    };
    this.flipSelectedLeftTopic = function(healthInterest){
        if(!healthInterest) return;
        if(currentInstance.selectedLeftTopic != healthInterest) {
            currentInstance.setHealthTopic(healthInterest);
        } else if (currentInstance.selectedRightTopic != null){
            currentInstance.setHealthTopic(null);
        }
    };
    this.deselectAllLocations = function(){
        currentInstance.selectedLocations_2letters = [];
        currentInstance.updateVisualComponents();
    };
    this.selectFastLocationsBtn = function () {
        currentInstance.selectedLocations_2letters = MAPS_CONFIGS[MAPS_CONFIG_SELECTION_KEY].fastLocationSelection.locations2letters;
        currentInstance.updateVisualComponents();
    }
    this.selectAllLocations = function(){
        currentInstance.selectedLocations_2letters = [];
        for(var locationKeyIndex in allEnabledLocationsKeys){
            var locationKey = allEnabledLocationsKeys[locationKeyIndex];
            currentInstance.selectedLocations_2letters.push(locationCodeMap[locationKey]._2letters_code);
        }
        currentInstance.updateVisualComponents();
    };
    this.selectDefaultLocations = function(){
        currentInstance.selectAllLocations();
    };
    this.getSelectedInstances = function(){
        return currentInstance.selectedInstances;
    }
    this.setSelectedLocations2lettersList = function(location2LetterList){
        currentInstance.selectedLocations_2letters = location2LetterList;
        currentInstance.updateVisualComponents();
    }
    this.insertLocation2Letter = function(location2Letters){
        console.log("Inserting:" + location2Letters);
        currentInstance.selectedLocations_2letters.push(location2Letters);
        currentInstance.updateVisualComponents();
    }
    this.removeLocation2Letters = function(location2Letters){
        currentInstance.selectedLocations_2letters = removeValueFromArray(currentInstance.selectedLocations_2letters, location2Letters);
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

    this.getSumSelectedFacebookPopulationByLocation2letters = function(location2letter){
        if(currentInstance.selectedFbDemographicInstances.length > 0){
            var total = 0;
            for(var instanceIndex in currentInstance.selectedFbDemographicInstances){
                var instance = currentInstance.selectedFbDemographicInstances[instanceIndex];
                if(getLocation2letterFromLocationKey(instance.location) == location2letter){
                    total += instance.audience;
                }
            }
            return total;
        } else {
            return 0;
        }
    };

    this.buildAndInitVisualComponents = function(){
        console.log("Building visual components");
        treemapManager = new TreemapManager();
        luxuriousHealthBar = new stackedHorizontalBar();
        generalScore = new GeneralScore();
        locationsDataManager = new LocationsDataManager();
        locationsMapDatamap = new LocationsMapDatamap();
        locationsMapSubRegion = new  SubRegionMap();
        locationsBtns = new LocationsBtns();
        sharebleLink = new SharebleLink();
        btnsTopicsSelectors = new BtnsTopicsSelectors();
        historyDataSelector = new HistoryDataSelector();
        findingsFinder = new FindingFinder();
        downloadReport = new DownloadReport();
        console.log("Builded visual components");
        sharebleLink.init();
    }

    this.updateVisualComponents = function(){
        currentInstance.setSelectedInstances();
        treemapManager.updateTreemaps();
        generalScore.updateData();
        locationsDataManager.updateData();
        locationsBtns.updateData();
        locationsMapDatamap.updateData();
        locationsMapSubRegion.updateData();
        btnsTopicsSelectors.updateData();
        luxuriousHealthBar.updateData();
        sharebleLink.updateData();
        findingsFinder.updateData();
    };

    this.isLocationKeyAlreadySelected = function(locationKey) {
        var location2letter = getLocation2letterFromLocationKey(locationKey);
        return currentInstance.selectedLocations_2letters.indexOf(location2letter) != -1 ? true : false;
    };
    this.isInstanceAgreeWithSelected = function(instance){
        for(var key in currentInstance.selectedCategoriesAndValues){
            if(instance[key] != currentInstance.selectedCategoriesAndValues[key]){
                return false;
            }
        }
        //Check Location code
        if(currentInstance.selectedLocations_2letters.length > 0){
            if(!currentInstance.isLocationKeyAlreadySelected(instance.location)){
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
    this.getAverageSelectedScore = function(){
        var averageScore = {"greenAudience" : 0, "redAudience":0, "greenScore":0,"redScore":0,"average":0, "total":0};
        if(currentInstance.selectedLocations_2letters.length == 0){
            return averageScore;
        } else{
            var selectedInstances = currentInstance.getSelectedInstances();
            // var total = selectedInstances.map(function(instance){ return instance.audience}).reduce(function (total, num) { return total + num});
            var total = dataManager.selectedFbDemographicSum;
            averageScore.total = total;
            averageScore.greenAudience =  selectedInstances.map(
                function(instance){ return getInstancePolarity(instance) == 1 ? instance.audience : 0})
                .reduce(function (total, num) { return total + num});
            averageScore.redAudience =  selectedInstances.map(
                function(instance){ return getInstancePolarity(instance) == -1 ? instance.audience : 0})
                .reduce(function (total, num) { return total + num});
            averageScore.greenScore = averageScore.greenAudience / total;
            averageScore.redScore = averageScore.redAudience  / total;
            // averageScore.average = ((averageScore.greenScore * averageScore.greenAudience) - (averageScore.redScore * averageScore.redAudience) ) / total;
            averageScore.average = averageScore.greenScore - averageScore.redScore;
            return averageScore
        }

    };
    this.getSelectedLocationsData = function(){
        var selectedLocationsData = {};

        for(let location2lettersIndex in dataManager.selectedLocations_2letters){
            var location2letters = dataManager.selectedLocations_2letters[location2lettersIndex];
            var locationKey = getLocationKeyFromLocation2letter(location2letters);
            var locationData = locationsDataManager.getLocationSelectedData(locationKey);
            selectedLocationsData[locationKey] = locationData;
        }
        return selectedLocationsData;
    }
}

