function SelectionDataLayer(){
    var currentInstance = this;
    this.country_codes = [];
    this.categories = {};
    this.insertCountryCode = function(country_code){
        currentInstance.country_codes.push(country_code);
        currentInstance.update();
    }
    this.removeCountryCode = function(country_code){
        currentInstance.country_codes = removeValueFromArray(currentInstance.country_codes, country_code);
        currentInstance.update();
    }
    this.setCategoryValueSelected = function(category, value){
        currentInstance.categories[category] = value;
    }
    this.unsetCategory = function(category){
        delete currentInstance.categories[category];
    }
    this.update = function(){
        selectedInstancesTable.updateData()
    };

    this.isCountryAlreadySelected = function(country_code) {
        return currentInstance.country_codes.indexOf(country_code) != -1 ? true : false;
    };
    this.isInstanceAgreeWithSelected = function(instance){
        for(var key in currentInstance.categories){
            if(instance[key] != currentInstance.categories[key]){
                return false;
            }
        }
        //Check Country code
        if(currentInstance.country_codes.length > 0){
            if(!currentInstance.isCountryAlreadySelected(instance.country_code)){
                return false;
            }
        }

        return true;
    }


}

// /**
//  * Created by maraujo on 11/21/16.
//  */
// function initializeDataLayerModule(){
//     //List Countries
//     createEmptyDataLayer();
//     // requestInterestsList();
//     // requestCountriesList();
//     return requestDemographicCategoriesAndSubCategories();
// }
// function selectedItemsFactory(){
//     return {
//         column : "",
//         value : "",
//     }
// }
// function selectedDemographicsCategoriesFactory(){
//     return {
//         demographicCategory:"",
//         name : "",
//         value : "",
//     }
// }
// function updateInterests(){}
// function updateDemographicCategories(){}
//
// function updateDataLayers(){
//     updateDemographicCategories();
//     updateInterests();
// }
// //Requests functions and Manage Data
// function createEmptyDataLayer() {
//     var dataLayer = {
//         countries: [],
//         selectedItems: {},
//         demographicsCategories: {},
//         interests: {}
//     };
//     setVariableInSession("dataLayer", dataLayer);
// }
// function requestCountriesList(){
//     var url = getUrlForCountriesList();
//     return $.get(url,function(data){
//         var countries = $.map(data.rows, function(row){ return row[0] });
//         $.when(setDataLayerMember("countries", countries)).done(updateListInPage("countries"));
//     }).fail(function(errorObj) {
//         console.log(errorObj);
//         alert("Fail to load countries.");
//     });
// }
// function getHTMLContainer(member){
//     switch (member){
//         case "interests":
//             return $("#interests_list");
//             break
//         case "countries":
//             return $("#countries_list");
//             break
//         case "demographicsCategories":
//             return $("#demographic_categories_list");
//             break
//         default:
//             throw Error("No html container found");
//             break
//     }
// }
// function updateListInPage(member){
//     var dataLayer = getVariableFromSession("dataLayer");
//     var htmlContainer = getHTMLContainer(member);
//     htmlContainer.empty();
//     switch (member){
//         case "countries":
//             $.map(dataLayer[member], function(country){ htmlContainer.append(generateHTMLGoogleFusionListItemWithCheckbox(country,null,country,COUNTRY_COLUMN_NAME))});
//             break;
//         case "interests":
//             $.map(dataLayer[member], function(interest){ htmlContainer.append(generateHTMLGoogleFusionListItemWithCheckbox(interest.name,interest.sum,interest.name,INTEREST_COLUMN_NAME))});
//             break;
//         case "demographicCategory":
//             break;
//         default:
//             throw Error("No member supported")
//     }
//
// }
// function setDataLayerMember(member, newData){
//     var dataLayer = getVariableFromSession("dataLayer");
//     dataLayer[member] = newData;
//     return $.when(setVariableInSession("dataLayer",dataLayer));
// }
//
// function updateDataLayerMemberValue(member, newData){
//     var dataLayer = getVariableFromSession("dataLayer");
//     dataLayer[member] = newData;
//     setVariableInSession("dataLayer",dataLayer);
// }
//
// function requestInterestsList(){
//     var url = getUrlForInterestsList();
//     return $.get(url,function(data){
//         var interestsLists = $.map(data.rows, function(row){ return {"name":row[0], "sum":parseInt(row[1])}; });
//         data.interests = interestsLists;
//         setDataLayerMember("interests",interestsLists).done(updateListInPage("interests"));
//     }).fail(function(errorObj) {
//         alert("Fail to load interests.")
//     });
// }
//
// function requestDemographicCategoriesList(){
//     var url = getUrlForDemographicCategoriesList();
//     return $.get(url,function(data){
//         var categoriesList = [];
//         for(var category_index = data.items.length - 1; category_index >= 0; category_index--){
//             var categoryData = data.items[category_index];
//             var currentCategoryName = data.items[category_index].name;
//             if(isDemographicCategoryName(currentCategoryName)){
//                 categoriesList.push(categoryData);
//             }
//         }
//         data.demographicCategories = categoriesList;
//     }).fail(function(errorObj) {
//         alert("Fail to load DemographicCategories.")
//     });
// }
//
// function requestSubDemographicCategoriesList(parentCategory){
//     var url = getUrlForSubCategoriesListGivenCategory(parentCategory);
//     return $.get(url,function(data){
//         var subCategoriesAudienceDictionary = convertDataRowsFirstSecondValueToKeyValueDictionary(data);
//         data.subCategoriesAudienceDictionary = subCategoriesAudienceDictionary;
//         data.parentCategory = parentCategory;
//     }).fail(function(errorObj) {
//         alert("Fail to load DemographicCategories.")
//     });
// }
//
// function setVariableInSession(name, obj) {
//     window.localStorage.setItem(name, JSON.stringify(obj));
// }
// function getVariableFromSession(name){
//     return JSON.parse(window.localStorage.getItem(name));
// }
//
// //Manage Interface
// // function updateListCountriesInPage(){
// //     $.when(requestCountriesList()).done(function(data){
// //         var countries = data.countries;
// //         $.map(countries, function(country){ countries_container.append(generateHTMLGoogleFusionListItemWithCheckbox(country,null,country,COUNTRY_COLUMN_NAME))});
// //     });
// // }
//
// // function updateInterestsListInPage(specific_sql){
// //     $.when(requestInterestsList()).done(function(data){
// //         var interests = data.interests;
// //         $.map(interests, function(interest){ interests_container.append(generateHTMLGoogleFusionListItemWithCheckbox(interest.name,interest.sum,interest.name,INTEREST_COLUMN_NAME))});
// //     });
// // }
//
// function addParentDemographicCategoryInPage(parentName){
//     var htmlListItem = generateHTMLItemListGivenName(parentName);
//     demographicCategoriesContainer.append(htmlListItem);
// }
//
// function addSubCategoriesToParentDemographicCategoryInPage(parentName, subCategories){
//     var htmlParentListItem = $("#" + parentName + "ItemList");
//     for(var key in subCategories){
//         htmlParentListItem.append(generateHTMLGoogleFusionListItemWithCheckbox(key, subCategories[key], key, parentName));
//     }
// }
//
// function requestDemographicCategoriesAndSubCategories(){
//     //TODO: I need to create a way to make these promise works even though they are in a map loop
//     $.when(requestDemographicCategoriesList()).done(function(categoriesData){
//         var demographicCategories = categoriesData.demographicCategories;
//         $.map(demographicCategories, function(demographicCategory){
//             addParentDemographicCategoryInPage(demographicCategory.name);
//         });
//     }).done(function(data){
//         $.map(data.demographicCategories, function(demographicCategory){
//             $.when(requestSubDemographicCategoriesList(demographicCategory.name).done(function(subCategoriesData){
//                 addSubCategoriesToParentDemographicCategoryInPage(subCategoriesData.parentCategory, subCategoriesData.subCategoriesAudienceDictionary)
//             }));
//         });
//
//     });
// }
