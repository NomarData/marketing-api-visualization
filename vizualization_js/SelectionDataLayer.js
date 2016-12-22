function SelectionDataLayer(){
    var currentInstance = this;
    this.country_codes2letters = [];
    this.categories = {};
    this.selected_instances = [];
    this.selectedFacebookPopulationInstances = [];
    this.selectedHealth = healthTopics[3];
    this.selectedLuxury = luxuryTopics[4];
    this.selectedFacebookPopulationSum = 0;
    this.loader = $(".loader");

    this.getTotalFacebookUsersGivenActualSelectionAndACategoryAndSubcategory = function(categoryName, subCategoryName){
        var total = 0;
        for(var instanceIndex in currentInstance.selectedFacebookPopulationInstances){
            var instance = currentInstance.selectedFacebookPopulationInstances[instanceIndex];
            if(instance[categoryName] == subCategoryName){
                total += instance.audience
            }
        }
        return total;
    }

    this.updateDataset = function(){
        currentInstance.loader.fadeIn();
        fusionAPI.getPromiseToUpdateDatasetBySelection(currentInstance.selectedHealth, currentInstance.selectedLuxury).done(function(data){
            fusionAPI.setInstanceList(data.instances);
            currentInstance.loader.fadeOut();
            currentInstance.update();
            // waitingDialog.hide()
        })
    }
    this.updateSelectedLuxury = function(luxuryInterest){
        if(currentInstance.selectedLuxury != luxuryInterest){
            currentInstance.selectedLuxury = luxuryInterest;
            currentInstance.updateDataset();
        } else if (currentInstance.selectedHealth != null){
            currentInstance.selectedLuxury = null;
            currentInstance.updateDataset();
        }

    };
    this.updateSelectedHealth = function(healthInterest){
        if(currentInstance.selectedHealth != healthInterest) {
            currentInstance.selectedHealth = healthInterest;
            currentInstance.updateDataset();
        } else if (currentInstance.selectedLuxury != null){
            currentInstance.selectedHealth = null;
            currentInstance.updateDataset();
        }
    };
    this.deselectAllCountries = function(){
        currentInstance.country_codes2letters = [];
        currentInstance.update();
    };
    this.selectAllCountries = function(){
        currentInstance.country_codes2letters = [];
        for(var countryCode in countryCodeMap){
            currentInstance.country_codes2letters.push(countryCode);
        }
        currentInstance.update();
    };
    this.selectDefaultCountries = function(){
        // onClickCountryFunctionBy2LettersCode("AE");
        // onClickCountryFunctionBy2LettersCode("DZ");
        for(var countryCode in countryCodeMap){
            onClickCountryFunctionBy2LettersCode(countryCode);
        }
    };
    this.getSelectedInstances = function(){
        return currentInstance.selected_instances;
    }
    this.insertCountryCode = function(countryCode){
        console.log("Inserting:" + countryCode);
        currentInstance.country_codes2letters.push(countryCode);
        currentInstance.update();
    }
    this.removeCountryCode = function(country_code){
        currentInstance.country_codes2letters = removeValueFromArray(currentInstance.country_codes2letters, country_code);
        currentInstance.update();
    }
    this.setCategoryValueSelected = function(category, value){
        currentInstance.categories[category] = value;
        currentInstance.update();
    }
    this.unsetCategory = function(category){
        delete currentInstance.categories[category];
        currentInstance.update();
    }
     this.setSelectedInstances = function(){
         console.log("Selecting Instances")
        var instances = [];
        var facebookPopulationInstances = [];
        for(var indexData in currentData){
            var instance = currentData[indexData];
            if(NODES_SELECTED.isInstanceAgreeWithSelected(instance)){
                instances.push(instance)
            }
        }
         for(var indexFacebookPopulation in facebookPopulation){
             var instance = facebookPopulation[indexFacebookPopulation];
             if(currentInstance.isInstanceAgreeWithSelected(instance)){
                 facebookPopulationInstances.push(instance)
             }
         }
        currentInstance.selected_instances = instances;
        currentInstance.selectedFacebookPopulationInstances = facebookPopulationInstances;
        currentInstance.updateSumSelectedFacebookPopulation();
         console.log(currentInstance.selectedFacebookPopulationSum)
        console.log("Instances and Facebook Population Selected");
    }

    this.updateSumSelectedFacebookPopulation = function(){
        if(currentInstance.selectedFacebookPopulationInstances.length > 0){
            var total = currentInstance.selectedFacebookPopulationInstances.map(function(instance){ return instance.audience}).reduce(function (total, num) { return total + num});
            currentInstance.selectedFacebookPopulationSum = total;
        } else {
            currentInstance.selectedFacebookPopulationSum = 0;
        }


    }

    this.getSumSelectedFacebookPopulationByCountry = function(countryCode){
        if(currentInstance.selectedFacebookPopulationInstances.length > 0){
            var total = 0;
            for(var instanceIndex in currentInstance.selectedFacebookPopulationInstances){
                var instance = currentInstance.selectedFacebookPopulationInstances[instanceIndex];
                if(instance.country_code == countryCode){
                    total += instance.audience;
                }
            }
            return total;
        } else {
            return 0;
        }


    }

    this.update = function(){
        currentInstance.setSelectedInstances();
        // selectedInstancesTable.updateData();
        treemapManager.updateTreemaps();
        inclinationScore.updateData();
        arabMap.updateData();
        luxuriousHealthBar.updateData();
    };

    this.updateDesign = function(){

    }

    this.isCountryAlreadySelected = function(country_code) {
        return currentInstance.country_codes2letters.indexOf(country_code) != -1 ? true : false;
    };
    this.isInstanceAgreeWithSelected = function(instance){
        for(var key in currentInstance.categories){
            if(instance[key] != currentInstance.categories[key]){
                // console.log(instance[key] + "!=" + currentInstance.categories[key]);
                return false;
            }
        }
        //Check Country code
        if(currentInstance.country_codes2letters.length > 0){
            if(!currentInstance.isCountryAlreadySelected(instance.country_code)){
                // console.log("Country Not Selected");
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
