/**
 * Created by maraujo on 11/21/16.
 */
function initializeDataLayerModule(){
    //List Countries
    createEmptyDataLayer();
    updateListCountriesInPage();
    updateInterestsListInPage();
    updateListDemographicCategoriesAndSubCategoriesInPage();
    

}
//Requests functions and Manage Data
function createEmptyDataLayer() {
    var dataLayer = {
        selectedItems: {},
        interests: {},
        gender: {},
        scholarity: {},
        age_range: {},
        language: {},
        membershipStatus: {},
    };
    setVariableInSession("dataLayer", dataLayer);
}
function requestCountriesList(){
    var url = getUrlForCountriesList();
    return $.get(url,function(data){
        var countries = $.map(data.rows, function(row){ return row[0] });
        data.countries = countries;
        setVariableInSession("countries", data.countries);
    }).fail(function(errorObj) {
        console.log(errorObj);
        alert("Fail to load countries.");
    });
}
function setDataLayerMember(member, newData){
    var dataLayer = getVariableFromSession("dataLayer");
    dataLayer[member] = newData;
    setVariableInSession("dataLayer",dataLayer);
}

function updateDataLayerMemberValue(member, newData){
    var dataLayer = getVariableFromSession("dataLayer");
    dataLayer[member] = newData;
    setVariableInSession("dataLayer",dataLayer);
}

function requestInterestsList(){
    var url = getUrlForInterestsList();
    return $.get(url,function(data){
        var interestsLists = $.map(data.rows, function(row){ return {"name":row[0], "sum":parseInt(row[1])}; });
        data.interests = interestsLists;
        setDataLayerMember("interests",interestsLists);
        setVariableInSession("interests", data.interests);
    }).fail(function(errorObj) {
        alert("Fail to load interests.")
    });
}

function requestDemographicCategoriesList(){
    var url = getUrlForDemographicCategoriesList();
    return $.get(url,function(data){
        var categoriesList = [];
        for(var category_index = data.items.length - 1; category_index >= 0; category_index--){
            var categoryData = data.items[category_index];
            var currentCategoryName = data.items[category_index].name;
            if(isDemographicCategoryName(currentCategoryName)){
                categoriesList.push(categoryData);
            }
        }
        data.demographicCategories = categoriesList;
    }).fail(function(errorObj) {
        alert("Fail to load DemographicCategories.")
    });
}

function requestSubDemographicCategoriesList(parentCategory){
    var url = getUrlForSubCategoriesListGivenCategory(parentCategory);
    return $.get(url,function(data){
        var subCategoriesAudienceDictionary = convertDataRowsFirstSecondValueToKeyValueDictionary(data);
        data.subCategoriesAudienceDictionary = subCategoriesAudienceDictionary;
        data.categoryName = parentCategory;
    }).fail(function(errorObj) {
        alert("Fail to load DemographicCategories.")
    });
}

function setVariableInSession(name, obj) {
    window.localStorage.setItem(name, JSON.stringify(obj));
}
function getVariableFromSession(name){
    return JSON.parse(window.localStorage.getItem(name));
}

//Manage Interface
function updateListCountriesInPage(){
    $.when(requestCountriesList()).done(function(data){
        var countries = data.countries;
        $.map(countries, function(country){ countries_container.append(generateHTMLGoogleFusionListItemWithCheckbox(country,null,country,COUNTRY_COLUMN_NAME))});
    });
}

function updateInterestsListInPage(specific_sql){
    $.when(requestInterestsList()).done(function(data){
        var interests = data.interests;
        $.map(interests, function(interest){ interests_container.append(generateHTMLGoogleFusionListItemWithCheckbox(interest.name,interest.sum,interest.name,INTEREST_COLUMN_NAME))});
    });
}

function updateListDemographicCategoriesAndSubCategoriesInPage(){
    $.when(requestDemographicCategoriesList()).done(function(categoriesData){
        var demographicCategories = categoriesData.demographicCategories;
        $.map(demographicCategories, function(demographicCategory){
            var htmlListItem = generateHTMLItemListGivenName(demographicCategory.name);
            demographicCategoriesContainer.append(htmlListItem);
            $.when(requestSubDemographicCategoriesList(demographicCategory.name).done(function(subCategoriesData){
                var subCategories = subCategoriesData.subCategoriesAudienceDictionary;
                var categoryName = subCategoriesData.categoryName;
                var htmlParentListItem = $("#" + categoryName + "ItemList");
                for(var key in subCategories){
                    htmlParentListItem.append(generateHTMLGoogleFusionListItemWithCheckbox(key, subCategories[key], key, categoryName));
                }
            }));
        });
    });
}
