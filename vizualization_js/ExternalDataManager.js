    /**
     * Created by maraujo on 12/1/16.
     */
    function ExternalDataManager(){
        var currentInstance = this;

        this.updateFacebookDemographicData = function(){
            var facebookPopulationDataPromise = currentInstance.getPromiseOfFacebookDemographicData();
            facebookPopulationDataPromise.done(function(d){
                currentInstance.setFacebookInitialPopulationList(d.fbInstancesDemographic);
            });
            return facebookPopulationDataPromise;
        };


        this.getPromiseOfFacebookDemographicData = function(){
            var defer = $.Deferred();
            //Try to load file healthSelection first, or luxurySelection first
            d3.csv(CURRENT_DATA_PATH + "facebook_population.csv", function(error, data) {
                if(error){
                    throw Error("Error loading csv : " + error);
                } else{
                    defer.resolve({fbInstancesDemographic:data});
                }
            });
            var promise = defer.promise();
            return promise;
        };

        this.getHistoricMapDataPromise = function(){
            var defer = $.Deferred();
            //Try to load file healthSelection first, or luxurySelection first
            d3.csv(HISTORY_MAP_FILE_PATH, function(error, data) {
                if(error){
                    throw Error("Error loading csv : " + error);
                } else{
                    defer.resolve({history:data});
                }
            });
            var promise = defer.promise();
            return promise;
        };

        this.getPromiseToUpdateDatasetBySelection = function(luxurySelection, healthSelection){
            var defer = $.Deferred();
            if(luxurySelection != null && healthSelection != null){
                //Try to load file healthSelection first, or luxurySelection first
                d3.csv(CURRENT_DATA_PATH + healthSelection + "-" + luxurySelection + ".csv", function(error, data) {
                    if(error){
                        d3.csv(CURRENT_DATA_PATH + luxurySelection  + "-" +  healthSelection + ".csv", function(error, data) {
                            if(error){
                                throw Error("Error loading csv : " + error);
                            } else{
                                defer.resolve({instances:data});
                            }
                        });
                    } else{
                        defer.resolve({instances:data});
                    }
                });
                var promise = defer.promise();
                return promise;
            } else if(luxurySelection != null){
                d3.csv(CURRENT_DATA_PATH + luxurySelection + ".csv", function(error, data) {
                    if(error){
                        throw Error("Error loading csv : " + error);
                    } else {
                        defer.resolve({instances:data});
                    }
                });
                var promise = defer.promise();
                return promise;
            }else if (healthSelection != null){
                d3.csv(CURRENT_DATA_PATH + healthSelection + ".csv", function(error, data) {
                    if(error){
                        throw Error("Error loading csv : " + error);
                    } else {
                        defer.resolve({instances:data});
                    }
                });
                var promise = defer.promise();
                return promise;
            } else {
                throw Error("Undetermined case.")
            }

        };
        this.updateLocationList =function(instances){
            // var promise = currentInstance.getPromiseListLocations();
                var locationsKeys = [];
                for(var instanceIndex in instances){
                    var instance = instances[instanceIndex];
                    if(locationsKeys.indexOf(instance.location) == -1){
                        locationsKeys.push(instance.location);
                    }
                }
                return currentInstance.getLocationDataWhichMatchesInLocationMapOrderedByLocationName(locationsKeys);

        };
        this.setFacebookInitialPopulationList = function(instances){
            var parsedInstances = $.map(instances,function(instance){
                instance.audience = parseInt(instance.audience);
                return instance;
            });
            fbInstancesDemographic = parsedInstances;
        };

        this.setInstanceList = function(instances){
            // console.log("Parsing int");
            var parsedInstances = $.map(instances,function(instance){
                instance.audience = parseInt(instance.audience);
                return instance;
            });
            // console.log("Parsing done")
            fbInstancesWithInterests = parsedInstances;
        };

        this.getLocationDataWhichMatchesInLocationMapOrderedByLocationName = function(listLocationKeys){
            filterJustLocationKeysFromLocationCodeMap(listLocationKeys);
            var locationsData = getLocationsCodeMapGivenKeys(listLocationKeys);
            var sortedLocationData = sortDictListGivenAttribute(locationsData,"name");
            return sortedLocationData;

        };

        this.init = function(){
        };
        this.init();
    }
