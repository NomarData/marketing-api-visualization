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
    for (var i=-1.0 + step;i<max;i=i+step){
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
            if(i%5 == 4){
                return d.toFixed(1);
            } else {
                return " ";
            }

        });
    putTreemapLegendsInCenter();
}

var treemapDataGender = function(){
    return  {
        "name": "Gender",
        "children": [{
            "name": "Male",
            "children": [{
                "name": "Male",
                "size": Math.random()
            }]
        },{
            "name": "Female",
            "children": [{
                "name": "Female",
                "size": Math.random()
            }]
        }
        ]
    };
};
var treemapDataAgeRange = function(){
    return {
        "name": "Age Range",
        "children": [{
            "name": "18-24",
            "children": [{
                "name": "18-24",
                "size": Math.random()
            }]
        },{
            "name": "25-44",
            "children": [{
                "name": "25-44",
                "size": Math.random()
            }]
        },{
            "name": "45+",
            "children": [{
                "name": "45+",
                "size": Math.random()
            }]
        }
        ]
    }
};

var treemapDataScholarity = function(){
    return {
        "name": "Scholarity",
        "children": [{
            "name": "No Degree",
            "children": [{
                "name": "No Degree",
                "size": Math.random()
            }]
        },{
            "name": "Some Degree",
            "children": [{
                "name": "Some Degree",
                "size": Math.random()
            }]},
            {
                "name": "Graduated",
                "children": [{
                    "name": "Graduated",
                    "size": Math.random()
                }]
            }
        ]
    }
};

var treemapDataLanguage = function(){
    return {
        "name": "Language",
        "children": [{
            "name": "Arabic",
            "children": [{
                "name": "Arabic",
                "size": Math.random()
            }]
        },{
            "name": "English",
            "children": [{
                "name": "English",
                "size": Math.random()
            }]
        },
            {
                "name": "French",
                "children": [{
                    "name": "French",
                    "size": Math.random()
                }]
            },
            {
                "name": "Indian",
                "children": [{
                    "name": "Indian",
                    "size": Math.random()
                }]
            },
            {
                "name": "Asian",
                "children": [{
                    "name": "Asian",
                    "size": Math.random()
                }]
            },
            {
                "name": "European",
                "children": [{
                    "name": "European",
                    "size": Math.random()
                }]
            }
        ]
    }
};

function treemapDataGenerator(treemap){
    switch (treemap.root.name){
        case "Scholarity":
            return treemapDataScholarity();
            break;
        case "Gender":
            return treemapDataGender();
            break;
        case "Language":
            return treemapDataLanguage();
            break;
        case "Age Range":
            return treemapDataAgeRange();
            break;
        case "Citizenship":
            return treemapDataCitizenship();
            break;
        default:
            throw Error(treemap.node.name + " is not a valid treemap name")
    }

}

var treemapDataCitizenship = function(){
    return {
        "name": "Citizenship",
        "children": [{
            "name": "Local",
            "children": [{
                "name": "Local",
                "size": Math.random()
            }]
        },{
            "name": "Expats",
            "children": [{
                "name": "Expats",
                "size": Math.random()
            }]
        }
        ]
    }
};

function updateTreemaps(treemapTrigger) {
    $.map(all_treemaps, function(treemap){
        if(treemap != treemapTrigger){
            var newData = treemapDataGenerator(treemap);
            treemap.updateData(newData);
        }
    });
}

function getTreemapDataFromInstancesList(category){
    var categoryAudience = {};
    categoryAudience["name"] = category;
    categoryAudience["data"] = {}
    var instancesList = NODES_SELECTED.getSelectedInstances();
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

    var totalAudienceGivenSelection = NODES_SELECTED.getTotalFacebookUsersGivenActualSelectionAndACategoryAndSubcategory(categoryAudience["name"], subCategoryName);

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
    this.initTreemaps = function(){
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


    this.getAverageSelectedInclination = function(){
        var averageInclination = {"greenAudience" : 0, "redAudience":0, "greenInclination":0,"redInclination":0,"average":0};
        if(NODES_SELECTED.country_codes2letters.length == 0){
            return averageInclination;
        } else{
            var selectedInstances = NODES_SELECTED.getSelectedInstances();
            // var total = selectedInstances.map(function(instance){ return instance.audience}).reduce(function (total, num) { return total + num});
            var total = NODES_SELECTED.selectedFacebookPopulationSum;
            averageInclination.greenAudience =  selectedInstances.map( function(instance){ return getInstancePolarity(instance) == 1 ? instance.audience : 0}).reduce(function (total, num) { return total + num});
            averageInclination.redAudience =  selectedInstances.map( function(instance){ return getInstancePolarity(instance) == -1 ? instance.audience : 0}).reduce(function (total, num) { return total + num});
            averageInclination.greenInclination = averageInclination.greenAudience / total;
            averageInclination.redInclination = averageInclination.redAudience  / total;
            // averageInclination.average = ((averageInclination.greenInclination * averageInclination.greenAudience) - (averageInclination.redInclination * averageInclination.redAudience) ) / total;
            averageInclination.average = averageInclination.greenInclination - averageInclination.redInclination;
            return averageInclination
        }

    };
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
        if(NODES_SELECTED.country_codes2letters.length > 0){
            if(!$(".chart").is(":visible")){
                currentInstance.showTreemaps();
            }
        } else{
            if($(".chart").is(":visible")){
                currentInstance.hideTreemapsAndAskToSelectCountries();
            }
            return;
        }
    }

    this.updateTreemaps = function(selectedTreemap){
       currentInstance.checkIfNeedToHideTreemaps();
        for(var index in this.treemaps){
            var currentTreemap = this.treemaps[index];
            if (currentTreemap == selectedTreemap) continue;
            var updatedData =  getTreemapDataFromInstancesList(currentTreemap.root.name);
            console.log(currentTreemap.root.name);
            currentTreemap.updateData(updatedData);
        }
    }
    this.selectTreemapOption = function(treemap, node){
        NODES_SELECTED.setCategoryValueSelected(treemap.root.name, node.name);
    };

    this.unselectTreemapOption = function(treemap){
        NODES_SELECTED.unsetCategory(treemap.root.name);
    };
}