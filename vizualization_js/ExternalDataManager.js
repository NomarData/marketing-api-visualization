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
            d3.csv("data/application_data/facebook_population.csv", function(error, data) {
                if(error){
                    throw Error("Error loading csv : " + error);
                } else{
                    defer.resolve({fbInstancesDemographic:data});
                }
            });
            var promise = defer.promise();
            return promise;
        };

        this.getPromiseToUpdateDatasetBySelection = function(luxurySelection, healthSelection){
            var defer = $.Deferred();
            if(luxurySelection != null && healthSelection != null){
                //Try to load file healthSelection first, or luxurySelection first
                d3.csv("data/application_data/" + healthSelection + "-" + luxurySelection + ".csv", function(error, data) {
                    if(error){
                        d3.csv("data/application_data/" + luxurySelection  + "-" +  healthSelection + ".csv", function(error, data) {
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
                d3.csv("data/application_data/" + luxurySelection + ".csv", function(error, data) {
                    if(error){
                        throw Error("Error loading csv : " + error);
                    } else {
                        defer.resolve({instances:data});
                    }
                });
                var promise = defer.promise();
                return promise;
            }else if (healthSelection != null){
                d3.csv("data/application_data/" + healthSelection + ".csv", function(error, data) {
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
        this.updateCountriesList =function(data){
            // var promise = currentInstance.getPromiseListCountries();
                var countries_code = [];
                for(var instanceIndex in data){
                    var instance = data[instanceIndex];
                    if(countries_code.indexOf(instance.country_code) == -1){
                        countries_code.push(instance.country_code);
                    }
                }
                var sortedListCountries = currentInstance.getDictsCountriesWhichMatchesInCountryMapOrderedByCountryName(countries_code);
                var countriesListContainer = $("#countriesList");
                countriesListContainer.empty();
                for(var countriesIndex in sortedListCountries){
                    var country = sortedListCountries[countriesIndex];
                    countriesListContainer.append("<div class='countryItem btn btn-country' data-code=\""+ country._2letter_code +"\">" + country.name + "</div>");
                }
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

        this.getDictsCountriesWhichMatchesInCountryMapOrderedByCountryName = function(list_country_codes){
            updateFilteringCountryCodeMap(list_country_codes);
            var list_countries = getCountriesGivenCodes(list_country_codes);
            var sortedListCountries = sortDictListGivenAttribute(list_countries,"name");
            return sortedListCountries;

        };

        this.init = function(){};
        this.init();
    }
