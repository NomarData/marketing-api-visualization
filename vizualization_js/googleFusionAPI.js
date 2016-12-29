    /**
     * Created by maraujo on 12/1/16.
     */

    TABLE = "1oKaEW3aVQ9I2q_6LtjvVtc3q-mZzGuAsgANHdEHR";
    // TABLE = "1xQ5SloMxn2Ug8r7jO4rwEm_0KsAbyjB1yMGWeAcK";
    // var API_KEY = "AIzaSyDO2DFB13Hr_DpzHtb8ONXkUvtCo7W7BHk";
    API_KEY = "AIzaSyD0EM0Y_XwkLCtFOYDuKbB5nc39926L1Wg";
    function GoogleFusionAPI(){
        var currentInstance = this;
        this.URL_sql = "https://www.googleapis.com/fusiontables/v2/query?sql=$query&key=$key".replace("$key",API_KEY);

        this.defaultSelection = {
            ageRange : "",
            country_code : [],
            interests : ["fitness and wellness","luxury goods"],
            scholarity : "",
            gender : 0,
            citizenship: ""
        };

        this.buildOrFromList = function(field_name, list) {
            var expression = squel.expr();
            if(list.length > 0){
                for(var index in list){
                    var item = list[index]
                    expression.or(field_name +"='" + item + "'");
                }
            }
            return expression;
        }

        this.getWhereExpressionForSelection = function(selection){
            var expression = squel.expr();
            var age_range = selection.ageRange === "" ? "" : selection.ageRange;
            var exclude_expats = selection.citizenship === "" ? "" : selection.citizenship;
            var scholarity = selection.scholarity === "" ? "" : selection.scholarity;
            var gender = selection.gender === "" ? "" : selection.gender.toString();

            if(age_range != ""){
                expression.and("age_range='" + age_range + "'");
            }

            expression.and("exclude_expats='" + exclude_expats + "'");
            expression.and("scholarity='" + scholarity + "'");
            expression.and("gender='" + gender + "'");
            var interests_or = currentInstance.buildOrFromList("interest", selection.interests);
            var countries_or = currentInstance.buildOrFromList("country_code", selection.country_code);

            if(interests_or.toString() != "")expression.and(interests_or);
            if(countries_or.toString() != "")expression.and(countries_or);

            return expression;
        };

        this.updateFacebookPopulationData = function(){
            var facebookPopulationDataPromise = currentInstance.getPromiseOfFacebookPopulationData();
            facebookPopulationDataPromise.done(function(d){
                currentInstance.setFacebookPopulationList(d.facebookPopulation);
            });
            return facebookPopulationDataPromise;
        }
        this.init = function(){
        }
        this.cleanCurrentDataByKeyValue = function (key, value) {
            var newData = []
            for(var instanceIndex in currentData){
                var instance = currentData[instanceIndex];
                if(instance[key] != value){
                    newData.push(instance);
                }
            }
            return newData;
        }
        this.setCurrentSelection = function(){};



        this.getPromiseOfFacebookPopulationData = function(){
            var defer = $.Deferred();
            //Try to load file healthSelection first, or luxurySelection first
            d3.csv("data/facebook_population.csv", function(error, data) {
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
                d3.csv("data/combinations/" + healthSelection + "-" + luxurySelection + ".csv", function(error, data) {
                    if(error){
                        d3.csv("data/combinations/" + luxurySelection  + "-" +  healthSelection + ".csv", function(error, data) {
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
                d3.csv("data/combinations/" + luxurySelection + ".csv", function(error, data) {
                    if(error){
                        throw Error("Error loading csv : " + error);
                    } else {
                        defer.resolve({instances:data});
                    }
                });
                var promise = defer.promise();
                return promise;
            }else if (healthSelection != null){
                d3.csv("data/combinations/" + healthSelection + ".csv", function(error, data) {
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



        this.failPromise = function(errorObj){
            console.log(errorObj);
            alert("Promise Failed.");
        };

        this.getPromiseListCountries = function(){
            var SQL_list_countries = "SELECT country_code FROM $table GROUP BY country_code".replace("$table", TABLE);
            var url = this.URL_sql.replace("$key",API_KEY).replace("$query",SQL_list_countries.replace("$table",TABLE));
            console.log(url)
            var promise =  $.get(url,function(data){
                var countries = $.map(data.rows, function(row){ return row[0] });
                data.countries = countries;
            }).fail(function(errorObj) {
                currentInstance.failPromise(errorObj);
            });
            return promise;
        };

        this.getPromiseInterestsAudienceList = function(){
            var SQL_list_topics = "SELECT interest, SUM(audience) FROM $table GROUP BY interest".replace("$table", TABLE);
            var url  = URL_sql.replace("$key",API_KEY).replace("$query",SQL_list_topics.replace("$table",TABLE));
            var promise = $.get(url,function(data){
                var interests = $.map(data.rows, function(row){ return {"name":row[0],"audience":parseInt(row[1])} });
                data.interests = interests;
            }).fail(function(errorObj) {
                currentInstance.failPromise(errorObj);
            });
            return promise;
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

        this.buildInterestTag = function(interest){
            var interestName = interest.name;
            var interestAudience = interest.audience;
            var tag = $("<ul></ul>");
            tag.text(interestName + " : " + convertIntegerToReadable(interestAudience));
            tag.addClass("interestItem");
            if(getInterestPolarity(interestName) < 0) tag.addClass("jewelItem");
            else tag.addClass("healthItem");

            return tag;
        };

        this.updateInterestsAudienceList = function(){
            var promise = currentInstance.getPromiseInterestsAudienceList();
            promise.done(function(data){
                var interestsListContainer = $("#interestsList");
                interestsListContainer.empty();
                for(var interestIndex in data.interests){
                    var interest = data.interests[interestIndex];
                    var interestTag = currentInstance.buildInterestTag(interest);
                    interestsListContainer.append(interestTag);
                }
            });
        };

        this.setFacebookPopulationList = function(instances){
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




    }
