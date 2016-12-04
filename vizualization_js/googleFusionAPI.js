    /**
     * Created by maraujo on 12/1/16.
     */

    TABLE = "1xQ5SloMxn2Ug8r7jO4rwEm_0KsAbyjB1yMGWeAcK";
    // var API_KEY = "AIzaSyDO2DFB13Hr_DpzHtb8ONXkUvtCo7W7BHk";
    API_KEY = "AIzaSyD_zutY8jNPKZ_jCAUCKIqK6iLrvpzN4LA";
    function GoogleFusionAPI(){
        var currentInstance = this;
        this.URL_sql = "https://www.googleapis.com/fusiontables/v2/query?sql=$query&key=$key".replace("$key",API_KEY);

        this.defaultSelection = {
            ageRange : "18+",
            country_code : [],
            interests : [],
            scholarity : "",
            gender : 0,
            citizenship: ""
        };

        this.getWhereExpressionForSelection = function(selection){
            var expression = squel.expr();

            var age_range = selection.ageRange;
            var exclude_expats = selection.citizenship === "" ? "" : selection.citizenship;
            var scholarity = selection.scholarity === "" ? "" : selection.scholarity;
            var gender = selection.gender === "" ? "" : selection.gender.toString();

            expression.and("age_range='" + age_range + "'");
            expression.and("exclude_expats='" + exclude_expats + "'");
            expression.and("scholarity='" + scholarity + "'");
            expression.and("gender='" + gender + "'");

            if(selection.interests.length > 0){
                for(var interestIndex in selection.interests){
                    var interest = selection.interests[interestIndex]
                    expression.or("interest ='" + interest + "'");
                }
            }
            if(selection.country_code.length > 0){
                for(var countryIndex in selection.country_code){
                    var code = selection.country_code[countryIndex]
                    expression.or("country_code ='" + code + "'");
                }
            }

            return expression;
        };

        this.currentSelection = cloneObject(this.defaultSelection);
        this.init = function(){}
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
            var promise = $.get(url, function (data) {
                var instances = $.map(data.rows, function(row){
                    var instance = {}
                    for(var columnIndex in data.columns){
                        var column = data.columns[columnIndex];
                        var value = row[columnIndex];
                        instance[column] = value;
                    }
                    return instance;
                });
                data.instances = instances;
            }).fail(function(data){
                currentInstance.failPromise(data);
            });

            return promise;
        };



        this.failPromise = function(errorObj){
            console.log(errorObj);
            alert("Promise Failed.");
        };

        this.getPromiseListCountries = function(){
            var SQL_list_countries = "SELECT location FROM $table GROUP BY location".replace("$table", TABLE);
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
            var SQL_list_topics = "SELECT topic, SUM(audience) FROM $table GROUP BY topic".replace("$table", TABLE);
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
            promise.done(function (data) {
                var countriesListContainer = $("#countriesList");
                countriesListContainer.empty();
                for(var countriesIndex in data.countries){
                    var country = data.countries[countriesIndex];
                    countriesListContainer.append("<ul class='countryItem'>" + country + "</ul>");
                }
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

        this.updateInstancesDataBasedOnSelection = function(){
            var promise = currentInstance.getPromiseCurrentSelection();
            promise.done(function(data){
                fakeData = data.instances;
                selectedInstancesTable.updateData();
            });
        }
        this.getDefaultData = function(){

        }

    }
