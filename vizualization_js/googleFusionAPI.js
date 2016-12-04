    /**
     * Created by maraujo on 12/1/16.
     */

    var TABLE = "1xQ5SloMxn2Ug8r7jO4rwEm_0KsAbyjB1yMGWeAcK";
    var API_KEY = "AIzaSyDO2DFB13Hr_DpzHtb8ONXkUvtCo7W7BHk";

    function GoogleFusionAPI(){
        var currentInstance = this;
        this.URL_sql = "https://www.googleapis.com/fusiontables/v2/query?sql=$query&key=$key".replace("$key",API_KEY);

        this.defaultSelection = {
            ageRange : "18+",
            country_code : [],
            interest : [],
            scholarity : "",
            gender : 0,
            citizenship: ""
        };

        this.getWhereFilterForSelection = function(selection){

        };

        this.currentSelection = cloneObject(this.defaultSelection);
        this.init = function(){}
        this.setCurrentSelection = function(){};

        this.buildSQLQueryForSelection = function(){
            var selection = currentInstance.currentSelection;
            var sql_query = "SELECT country_code, ageRange, interest, scholarity, gender, citizenship, audience WHERE "
            var where_filter = currentInstance.getWhereFilterForSelection(selection);
        };

        this.failPromise = function(errorObj){
            console.log(errorObj);
            alert("Fail to load countries.");
        };

        this.getPromiseListCountries = function(){
            var SQL_list_countries = "SELECT location FROM $table GROUP BY location".replace("$table", TABLE);
            var url = this.URL_sql.replace("$key",API_KEY).replace("$query",SQL_list_countries.replace("$table",TABLE));
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

        this.getDataBasedOnSelection = function(){}
        this.getDefaultData = function(){

        }

    }
