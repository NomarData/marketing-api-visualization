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
function buildTreemapLegends(colorFunction){
    var numberOfSteps = 50; //It should be dynamic according to the size of the display. It's good for now
    var max=1, data = [], min=-1;
    var step = (max-min)/numberOfSteps;
    for (var i=max - step;i > min;i=i-step){
        data.push(i);
    }

    var selection =  d3.select("#treemapLegend").selectAll("div.cell").data(data);
    selection.enter()
        .append("rect")
        .classed("legendCell",true)
        .append("div.test")
        .append("span");
    selection.data(data).exit().remove();
    selection.style("display","inline-block")
        .style("background-color",function(d){
            return colorFunction(d);
        })
        .select("span")
        .text(function(d,i){
            if(i%5 == 4){ //Put the number every 5 steps
                var numberToPrint = d.toFixed(1);
                if (numberToPrint == "-0.0") numberToPrint = "0.0";
                return numberToPrint;
            } else {
                return " ";
            }

        });
    putTreemapLegendsInCenter();
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
    var luxuryAudience = 0.0;
    var healthAudience = 0.0;
    var totalAudienceWithInterest = 0.0;
    var subCategoryList = categoryAudience["data"][subCategoryName];

    var totalAudienceGivenSelection = dataManager.getTotalFacebookUsersGivenActualSelectionAndACategoryAndSubcategory(categoryAudience["name"], subCategoryName);

    for(var index in subCategoryList){
        var instance = subCategoryList[index];
        if (getInstancePolarity(instance) == -1){
            luxuryAudience += instance.audience;
        } else if (getInstancePolarity(instance) == 1){
            healthAudience += instance.audience;
        }
        totalAudienceWithInterest += instance.audience;
    }
    return {
        "size" : totalAudienceGivenSelection + 1,
        "audienceWithInterest" : totalAudienceWithInterest,
        "fbPopulation" : totalAudienceGivenSelection,
        // "inclination" : (healthAudience - jewelAudience) / totalAudienceWithInterest
        "inclination" : (healthAudience - luxuryAudience) / (totalAudienceGivenSelection + 1), // (+ 1) Avoid divide by zero,
        "healthAudience" : healthAudience,
        "luxuryAudience" : luxuryAudience
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
                "size" : treemapDataCell.size,
                "audienceWithInterest" : treemapDataCell.audienceWithInterest,
                "inclination" : treemapDataCell.inclination,
                "healthAudience" : treemapDataCell.healthAudience,
                "luxuryAudience" : treemapDataCell.luxuryAudience,
                "fbPopulation" : treemapDataCell.fbPopulation
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
    if(hasSubstringFromList(healthInterests,interestName)){
        return 1;
    } else if(hasSubstringFromList(jewelInterests,interestName)){
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
        var treemapDefaultHeight = 100;

        var genderTreemap = new Treemap($("#genderTreemapDiv").width(),treemapDefaultHeight,$("#genderTreemapDiv").get(0),colorFunction,getTreemapDataFromInstancesList("gender"));
        genderTreemap.init();

        var ageRangeTreemap = new Treemap($("#ageRangeTreemapDiv").width(),treemapDefaultHeight,$("#ageRangeTreemapDiv").get(0),colorFunction,getTreemapDataFromInstancesList("age_range"));
        ageRangeTreemap.init();

        var scholarityTreemap = new Treemap($("#scholarityTreemapDiv").width(),treemapDefaultHeight,$("#scholarityTreemapDiv").get(0),colorFunction,getTreemapDataFromInstancesList("scholarity"));
        scholarityTreemap.init();

        // var languageTreemap = new Treemap($("#languageTreemapDiv").width(),treemapDefaultHeight,$("#languageTreemapDiv").get(0),colorFunction,getTreemapDataFromInstancesList("language"));
        // languageTreemap.init();

        var citizenshipTreemap = new Treemap($("#citizenshipTreemapDiv").width(),treemapDefaultHeight,$("#citizenshipTreemapDiv").get(0),colorFunction,getTreemapDataFromInstancesList("citizenship"));
        citizenshipTreemap.init();

        this.treemaps.push(genderTreemap);
        this.treemaps.push(ageRangeTreemap);
        this.treemaps.push(scholarityTreemap);
        // this.treemaps.push(languageTreemap);
        this.treemaps.push(citizenshipTreemap);

        //    Build Legend
        buildTreemapLegends(colorFunction);
    }



    this.updateLuxuriousHealthBar = function(){
        // var luxuriousHealthData = this.getAverageSelectedInclination();
        // luxuriousHealthBar.updateData(luxuriousHealthData);
    };
    
    this.hideTreemapsAndAskToSelectCountries = function(){
        for(var treemapIndex in currentInstance.treemaps){
            var treemapContainer = $(currentInstance.treemaps[treemapIndex].treemapContainer);
            var containerHeight = treemapContainer.height();
            var chart = treemapContainer.find(".chart");
            $("#alertToSelectCountry").removeClass("hidden");
            chart.hide();
        }
    }
    
    this.showTreemaps = function () {
        $("#alertToSelectCountry").addClass("hidden");
        for(var treemapIndex in currentInstance.treemaps){
            var treemapContainer = $(currentInstance.treemaps[treemapIndex].treemapContainer);
            var containerHeight = treemapContainer.height();
            var chart = treemapContainer.find(".chart");
            chart.show();
        }
    }

    this.checkIfNeedToHideTreemaps = function(){
        if(dataManager.selectedCountries_2letters.length > 0){
            if(!$(".chart").is(":visible")){
                currentInstance.showTreemaps();
            }
        } else{
            if($(".chart").is(":visible")){
                currentInstance.hideTreemapsAndAskToSelectCountries();
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
        treemap.activateCellGivenValue(treemapValue);
    }

    this.init();
}