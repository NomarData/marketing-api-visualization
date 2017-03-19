/**
 * Created by maraujo on 11/28/16.
 */
/**
 * Created by maraujo on 11/22/16.
 */

function putTreemapLegendsInCenter(){
    var firstCell = $($(".legendCell")[0]);
    var lastCell = $($(".legendCell")[$(".legendCell").size() -1]);
    var scaleWidth = lastCell.position().left - firstCell.position().left;
    var parentWidth = $("#treemapLegend").width() - 30;
    var scaleLeftMargin = (parentWidth - scaleWidth) / 2;
    d3.select("#treemapLegend").attr("style", "margin-left:" + scaleLeftMargin + "px");
}


function getTreemapDataFromInstancesList(category){
    var categoryAudience = {};
    categoryAudience["name"] = category;
    categoryAudience["data"] = {}
    var instancesList = dataManager.getSelectedInstances();
    for(var index in instancesList){
        var instance = instancesList[index];
        if(instance[category] in categoryAudience["data"]){
            categoryAudience["data"][instance[category]].push(instance);
        } else {
            categoryAudience["data"][instance[category]] = [instance];
        }
    }
    var children = generateTreemapChidren(categoryAudience);
    return {"name" : category , "children" : children};
}

function processSubCategoryList(categoryAudience, subCategoryName){
    var rightAudience = 0.0;
    var leftAudience = 0.0;
    var totalAudienceWithInterest = 0.0;
    var subCategoryList = categoryAudience["data"][subCategoryName];

    var totalAudienceGivenSelection = dataManager.getTotalFacebookUsersGivenActualSelectionAndACategoryAndSubcategory(categoryAudience["name"], subCategoryName);

    for(var index in subCategoryList){
        var instance = subCategoryList[index];
        if (getInstancePolarity(instance) == -1){
            rightAudience += instance.audience;
        } else if (getInstancePolarity(instance) == 1){
            leftAudience += instance.audience;
        }
        totalAudienceWithInterest += instance.audience;
    }
    return {
        "category" : categoryAudience["name"],
        "subCategory" : subCategoryName,
        "size" : totalAudienceGivenSelection + 1,
        "audienceWithInterest" : totalAudienceWithInterest,
        "audienceCoverage" : totalAudienceGivenSelection,
        // "score" : (leftAudience - rightAudience) / totalAudienceWithInterest
        "score" : (leftAudience - rightAudience) / (totalAudienceGivenSelection + 1), // (+ 1) Avoid divide by zero probably will never happen,
        "leftAudience" : leftAudience,
        "rightAudience" : rightAudience
    }

}

function generateTreemapChidren(categoryAudience){
    var children = []
    for (var subCategoryName in categoryAudience["data"]){
        var treemapDataCell = processSubCategoryList(categoryAudience, subCategoryName);
        children.push({
            "name" : subCategoryName,
            "children" : [{
                "name": subCategoryName,
                "category": treemapDataCell.category,
                "size" : treemapDataCell.size,
                "audienceWithInterest" : treemapDataCell.audienceWithInterest,
                "score" : treemapDataCell.score,
                "leftAudience" : treemapDataCell.leftAudience,
                "rightAudience" : treemapDataCell.rightAudience,
                "audienceCoverage" : treemapDataCell.audienceCoverage
            }]
        });
    }
    return children;
}

function getInstancePolarity(instance){
    var instancePolarity = getInterestPolarity(instance.topic);
    return instancePolarity;
}
function hasSubstringFromList(list,stringValue){
    if(stringValue === undefined) throw Error("String shouldn't be undefined: " + stringValue );
    stringValue = stringValue.toLowerCase();
    for(var index in list){
        var substring = list[index].toLowerCase();
        if(stringValue.indexOf(substring) != -1){
            return true;
        }
    }
    return false;

}
function getInterestPolarity(interestName){
    if(hasSubstringFromList(leftTopics,interestName)){
        return 1;
    } else if(hasSubstringFromList(rightTopics,interestName)){
        return -1;
    } else{
        console.log("This interest should have a polarity: " + interestName);
        return 1

    }
}

function TreemapManager(){
    var currentInstance = this;
    this.treemaps = [];

    this.getCategoriesNames = function(){
        var categoriesNames = [];
        for(var treemapIndex in currentInstance.treemaps){
            var treemap = currentInstance.treemaps[treemapIndex];
            categoriesNames.push(treemap.root.name);
        }
        return categoriesNames;
    };
    this.init = function(){
        var treemapDefaultHeight = 130;
        $.map(dataColumnsToTreemaps, function (treemapName) {
            $("#treemapsList").append(
                "<div  class='row treemapRowContainer'>" +
                "<div class='span5 treemapSpanContainer'>" +
                "<div id='" + treemapName + "FilterDiv'>" +
                "</div>" +
                "</div>" +
                "</div>"
            );
            var treemap = new Treemap($("#treemapsList").width(),treemapDefaultHeight,$("#" + treemapName + "FilterDiv").get(0),colorFunction,getTreemapDataFromInstancesList(treemapName));
            treemap.init();
            currentInstance.treemaps.push(treemap);
        });
    };
    
    this.hideTreemapsAndAskToSelectLocations = function(){
        for(var treemapIndex in currentInstance.treemaps){
            var treemapContainer = $(currentInstance.treemaps[treemapIndex].treemapContainer);
            var chart = treemapContainer.find(".chart");
            $("#alertToSelectLocation").removeClass("hidden");
            chart.hide();
        }
    }
    
    this.showTreemaps = function () {
        $("#alertToSelectLocation").addClass("hidden");
        for(var treemapIndex in currentInstance.treemaps){
            var treemapContainer = $(currentInstance.treemaps[treemapIndex].treemapContainer);
            var containerHeight = treemapContainer.height();
            var chart = treemapContainer.find(".chart");
            chart.show();
        }
    }

    this.checkIfNeedToHideTreemaps = function(){
        if(dataManager.selectedLocations_2letters.length > 0){
            if(!$(".chart").is(":visible")){
                currentInstance.showTreemaps();
            }
        } else{
            if($(".chart").is(":visible")){
                currentInstance.hideTreemapsAndAskToSelectLocations();
            }
            return;
        }
    };

    this.updateTreemaps = function(selectedTreemap){
       currentInstance.checkIfNeedToHideTreemaps();
        for(var index in this.treemaps){
            var currentTreemap = this.treemaps[index];
            if (currentTreemap == selectedTreemap) continue;
            var updatedData =  getTreemapDataFromInstancesList(currentTreemap.root.name);
            currentTreemap.updateData(updatedData);
        }
    };

    this.selectTreemapOption = function(treemap, node){
        dataManager.setCategoryValueSelected(treemap.root.name, node.name);
    };

    this.unselectTreemapOption = function(treemap){
        dataManager.unsetCategory(treemap.root.name);
    };
    this.getTreemapByName = function(treemapName){
        for(var treemapIndex in currentInstance.treemaps){
            var treemap = currentInstance.treemaps[treemapIndex];
            if(treemap.root.name == treemapName){
                return treemap;
            }
        }
        return Error("Treemap name not found.")
    }
    this.clickOnTreemapGivenNameAndValue = function(treemapName, treemapValue){
        var treemap = currentInstance.getTreemapByName(treemapName);
        try{
            treemap.activateCellGivenValue(treemapValue);
        } catch (Exception){
            debugger
        }
    }



    this.getAllVisibleTreemapData = function () {
        var labelsScores = {}
        for(let treemapIndex in currentInstance.treemaps){
            var treemap = currentInstance.treemaps[treemapIndex];
            var activeCells = treemap.getCellsActiveCells();
            for(let cellIndex in activeCells){
                var cell = activeCells[cellIndex];
                var cellData = cell.children[0];
                labelsScores[cellData.name] = cellData;
            }

        }
        return labelsScores;
    };

    this.init();
}