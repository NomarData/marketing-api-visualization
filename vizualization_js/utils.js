/**
 * Created by maraujo on 11/21/16.
 */
function checkAllDefined(...variables){
    $.map(variables,function(variable){
        if (typeof(variable)==='undefined') throw new Error("A variable is not defined at checkAllDefined");
    });
}

function generateUUID(a){return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,generateUUID)}

function isDemographicCategoryName(name){
    demographicCategoriesNames = ["age_range","gender","language","exclude_expats","scholarity"]
    return demographicCategoriesNames.indexOf(name) >= 0;
}

function convertDataRowsFirstSecondValueToKeyValueDictionary(data){
    var finalDictionary = {};
    for(var subCategoriesIndex = data.rows.length - 1; subCategoriesIndex >= 0; subCategoriesIndex--){
        var rowItem = data.rows[subCategoriesIndex];
        finalDictionary[rowItem[0]] = rowItem[1];
    }
    return finalDictionary;
}