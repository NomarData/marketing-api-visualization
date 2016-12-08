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

        this.currentSelection = cloneObject(this.defaultSelection);
        this.init = function(){}
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

        this.buildSQLQueryForSelection = function(){
            var selection = currentInstance.currentSelection;
            var squelQuery = squel.select()
                    .from(TABLE)
                    .where( currentInstance.getWhereExpressionForSelection(selection));
            var stringQuery = squelQuery.toString();
            stringQuery = removeAllParentheses(stringQuery);
            return stringQuery;
        };

        this.getPromiseCurrentSelection = function(){
            var sql = currentInstance.buildSQLQueryForSelection();
            var sql_uri = encodeURIComponent(sql);
            var url = currentInstance.URL_sql.replace("$key",API_KEY).replace("$query",sql_uri);
            console.log(sql);
            console.log(url);
            // var promise = $.get(url, function (data) {
            //     var instances = $.map(data.rows, function(row){
            //         var instance = {}
            //         for(var columnIndex in data.columns){
            //             var column = data.columns[columnIndex];
            //             var value = row[columnIndex];
            //             if(!isNaN(value)) value = parseFloat(value);
            //             instance[column] = value;
            //         }
            //         return instance;
            //     });
            //     if(instances == []){
            //         console.log("Instances should never return [], ignore it for while");
            //     }
            //     data.instances = instances;
            // }).fail(function(data){
            //     currentInstance.failPromise(data);
            // });

            //Fake Promise
            var defer = $.Deferred();
            d3.csv("data/googlefusion.csv", function(error, data) {
                if(error){
                    throw Error("Error loading csv : " + error)
                } else{
                    defer.resolve({instances:data});
                }
            });
            var promise = defer.promise();
            return promise;
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

        this.updateCountriesList =function(){
            var promise = currentInstance.getPromiseListCountries();
            return promise.done(function (data) {
                var countriesListContainer = $("#countriesList");
                countriesListContainer.empty();
                for(var countriesIndex in data.countries){
                    var country_code = data.countries[countriesIndex];
                    try {
                        convert2LettersCodeToName(country_code)
                    } catch (err){
                        continue
                    }
                    countriesListContainer.append("<ul class='countryItem' data-code=\""+ country_code +"\">" + convert2LettersCodeToName(country_code) + "</ul>");
                }
                NODES_SELECTED.selectDefaultCountries();
            });
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

        this.parseInstanceList = function(instances){
            console.log("Parsing int");
            var parsedInstances = $.map(instances,function(instance){
                instance.audience = parseInt(instance.audience);
                return instance;
            });
            return parsedInstances;
            console.log("Parsing done")
        };

        this.updateInstancesDataBasedOnSelection = function(){
            var promise = currentInstance.getPromiseCurrentSelection();
            promise.done(function(data){
                currentData = currentInstance.parseInstanceList(data.instances);
                NODES_SELECTED.setSelectedInstances();

                console.log("Building Treemaps");
                treemapManager = new TreemapManager();
                treemapManager.initTreemaps();
                console.log("Treemaps builded");

                console.log("Building luxuriousHealthBar");
                luxuriousHealthBar = new stackedHorizontalBar();
                luxuriousHealthBar.init();
                console.log("Builded luxuriousHealthBar");

                arabMap = new arabLeagueMap();
                arabMap.init();

                // selectedInstancesTable = new SelectedInstancesTable("#selectedDataInstancesTable");
                // selectedInstancesTable.init();
                // selectedInstancesTable.updateData();

                // currentDataInstancesTable = new SelectedInstancesTable("#currentDataTable");
                // currentDataInstancesTable.init();

                inclinationScore = new InclinationScore();
                inclinationScore.init();

                // currentDataInstancesTable.updateDataGivenInstances(currentData);

                fusionAPI.updateCountriesList().done(function(){
                    $(".countryItem").click(function(){
                        onClickCountryFunction($(this));
                    });
                });
                fusionAPI.updateInterestsAudienceList();


            });
        }
        this.getDefaultData = function(){

        }

    }
