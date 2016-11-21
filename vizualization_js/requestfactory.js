var TABLE = "1xQ5SloMxn2Ug8r7jO4rwEm_0KsAbyjB1yMGWeAcK";
var API_KEY = "AIzaSyDO2DFB13Hr_DpzHtb8ONXkUvtCo7W7BHk";
var SQL_list_countries = "SELECT location FROM $table GROUP BY location".replace("$table", TABLE);
var SQL_list_topics = "SELECT topic, SUM(audience) FROM $table GROUP BY topic".replace("$table", TABLE);
var SQL_list_unique = "SELECT $column, SUM(audience) FROM $table GROUP BY $column".replace("$table", TABLE);
var URL_sql = "https://www.googleapis.com/fusiontables/v2/query?sql=$query&key=$key".replace("$key",API_KEY);
var URL_list_columns = "https://www.googleapis.com/fusiontables/v2/tables/$table/columns?key=$key".replace("$key",API_KEY);
var list_countries_url = URL_sql.replace("$key",API_KEY).replace("$query",SQL_list_countries.replace("$table",TABLE));
var list_topics_url = URL_sql.replace("$key",API_KEY).replace("$query",SQL_list_topics.replace("$table",TABLE));


function getUrlForCountriesList(){
    return URL_sql.replace("$key",API_KEY).replace("$query",SQL_list_countries.replace("$table",TABLE));
}

function getUrlForInterestsList(specific_sql){
    var list_topics_url;
    if (typeof(specific_sql)==='undefined' || specific_sql == null) {
        list_topics_url = URL_sql.replace("$key",API_KEY).replace("$query",SQL_list_topics.replace("$table",TABLE));
    } else {
        list_topics_url = URL_sql.replace("$key",API_KEY).replace("$query",specific_sql.replace("$table",TABLE));
    }
    return list_topics_url;
}

function getUrlForDemographicCategoriesList(){
    return URL_list_columns.replace("$table",TABLE);
}

function getUrlForSubCategoriesListGivenCategory(categoryName){
    if (isDemographicCategoryName(categoryName)){
        var sql_query =  SQL_list_unique.replace(/\$column/g,categoryName);
        return URL_sql.replace("$query", sql_query);
    }else {
        throw new Error("Category " + categoryName + " is not a Demographic Category");
    }

}