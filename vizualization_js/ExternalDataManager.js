    /**
     * Created by maraujo on 12/1/16.
     */
    function ExternalDataManager(){
        var currentInstance = this;

        this.updateFacebookPopulationData = function(){
            var facebookPopulationDataPromise = currentInstance.getPromiseOfFacebookPopulationData();
            facebookPopulationDataPromise.done(function(d){
                currentInstance.setFacebookInitialPopulationList(d.facebookPopulation);
            });
            return facebookPopulationDataPromise;
        };


        this.getPromiseOfFacebookPopulationData = function(){
            var defer = $.Deferred();
            //Try to load file healthSelection first, or luxurySelection first
            d3.csv("data/application_data/facebook_population.csv", function(error, data) {
                if(error){
                    throw Error("Error loading csv : " + error);
                } else{
                    defer.resolve({facebookPopulation:data});
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
                updateFilteringCountryCodeMap(countries_code);
                var countriesListContainer = $("#countriesList");
                countriesListContainer.empty();
                for(var countriesIndex in countries_code){
                    var country_code = countries_code[countriesIndex];
                    try {
                        convert2LettersCodeToName(country_code)
                    } catch (err){
                        continue
                    }
                    countriesListContainer.append("<div class='countryItem btn btn-country' data-code=\""+ country_code +"\">" + convert2LettersCodeToName(country_code) + "</div>");
                }
        };
        this.setFacebookInitialPopulationList = function(instances){
            var parsedInstances = $.map(instances,function(instance){
                instance.audience = parseInt(instance.audience);
                return instance;
            });
            facebookPopulation = parsedInstances;
        };

        this.setInstanceList = function(instances){
            // console.log("Parsing int");
            var parsedInstances = $.map(instances,function(instance){
                instance.audience = parseInt(instance.audience);
                return instance;
            });
            // console.log("Parsing done")
            currentData = parsedInstances;
        };

        this.init = function(){};
        this.init();
    }
