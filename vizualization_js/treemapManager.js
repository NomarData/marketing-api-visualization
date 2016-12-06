/**
 * Created by maraujo on 11/28/16.
 */
/**
 * Created by maraujo on 11/22/16.
 */
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

function checkIfInstanceAgreeWithSelected(instance){
    for(var key in NODES_SELECTED){
        if(instance[key] != NODES_SELECTED[key]){
            return false;
        }
    }
    return true;
}

function getTreemapDataFromInstancesList(category, instancesList){
    var categoryAudience = {};
    for(var index in instancesList){
        var instance = instancesList[index];
        if(!checkIfInstanceAgreeWithSelected(instance)) continue;
        if(instance[category] in categoryAudience){
            categoryAudience[instance[category]].push(instance);
        } else {
            categoryAudience[instance[category]] = [instance];
        }
    }
    var children = generateTreemapChidren(categoryAudience);
    return {"name" : category , "children" : children};
}

function processSubCategoryList(subCategoryList){
    var jewelAudience = 0.0;
    var healthAudience = 0.0;
    var totalAudience = 0.0;
    for(var index in subCategoryList){
        var instance = subCategoryList[index];
        if (getInstancePolarity(instance) == -1){
            jewelAudience += instance.audience;
        } else if (getInstancePolarity(instance) == 1){
            healthAudience += instance.audience;
        }
        totalAudience += instance.audience;
    }
    return {
        "size" : totalAudience,
        "inclination" : (healthAudience - jewelAudience) / totalAudience
    }

}

function generateTreemapChidren(categoryAudience){
    var children = []
    for (var subCategory in categoryAudience){
        var treemapDataCell = processSubCategoryList(categoryAudience[subCategory]);
        children.push({
            "name" : subCategory,
            "children" : [{
                "name": subCategory,
                "size" : treemapDataCell.size,
                "inclination" : treemapDataCell.inclination
            }]
        });
    }
    return children;
}

function isInSelectedCategories(instance){
    for(category in NODES_SELECTED){
        if(instance[category] != NODES_SELECTED[category]) return false;
    }
    return true;
}

function getSelectedInstances(){
    var instances = []
    for(var indexData in currentData){
        var instance = currentData[indexData];
        if(isInSelectedCategories(instance)){
            instances.push(instance)
        }
    }
    return instances;
}

function getInstancePolarity(instance){
    var instancePolarity = getInterestPolarity(instance.interest);
    return instancePolarity;
}
function hasSubstringFromList(list,stringValue){
    if(stringValue === undefined) throw Error("String should be undefined: " + stringValue );
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
    this.treemaps = [];
    this.initTreemaps = function(){
        var treemapDefaultHeight = 100;
        var colorFunction = getRandomGreenOrRedColor;

        var genderTreemap = new Treemap($("#genderTreemapDiv").width(),treemapDefaultHeight,$("#genderTreemapDiv").get(0),colorFunction,getTreemapDataFromInstancesList("gender", currentData));
        genderTreemap.init();

        var ageRangeTreemap = new Treemap($("#ageRangeTreemapDiv").width(),treemapDefaultHeight,$("#ageRangeTreemapDiv").get(0),colorFunction,getTreemapDataFromInstancesList("age_range", currentData));
        ageRangeTreemap.init();

        // var scholarityTreemap = new Treemap($("#scholarityTreemapDiv").width(),treemapDefaultHeight,$("#scholarityTreemapDiv").get(0),colorFunction,treemapDataScholarity());
        // scholarityTreemap.init();
        //
        // var languageTreemap = new Treemap($("#languageTreemapDiv").width(),treemapDefaultHeight,$("#languageTreemapDiv").get(0),colorFunction,treemapDataLanguage());
        // languageTreemap.init();
        //
        // var citizenshipTreemap = new Treemap($("#citizenshipTreemapDiv").width(),treemapDefaultHeight,$("#citizenshipTreemapDiv").get(0),colorFunction,treemapDataCitizenship());
        // citizenshipTreemap.init();

        this.treemaps.push(genderTreemap);
        this.treemaps.push(ageRangeTreemap);
        // this.treemaps.push(scholarityTreemap);
        // this.treemaps.push(languageTreemap);
        // this.treemaps.push(citizenshipTreemap);
    }


    this.getAverageSelectedInclination = function(){
        var averageInclination = {"greenValue" : 0, "redValue":0};
        var selectedInstances = getSelectedInstances();
        var total = selectedInstances.map(function(instance){ return instance.audience}).reduce(function (total, num) { return total + num});

        averageInclination.greenAudience =  selectedInstances.map( function(instance){ return getInstancePolarity(instance) == 1 ? instance.audience : 0}).reduce(function (total, num) { return total + num});
        averageInclination.redAudience =  selectedInstances.map( function(instance){ return getInstancePolarity(instance) == -1 ? instance.audience : 0}).reduce(function (total, num) { return total + num});
        averageInclination.greenInclination = averageInclination.greenAudience / total;
        averageInclination.redInclination = averageInclination.redAudience  / total;
        // averageInclination.average = ((averageInclination.greenInclination * averageInclination.greenAudience) - (averageInclination.redInclination * averageInclination.redAudience) ) / total;
        averageInclination.average = ((averageInclination.greenAudience) - (averageInclination.redAudience)) / total;
        return averageInclination

    };
    this.updateLuxuriousHealthBar = function(){
        var luxuriousHealthData = this.getAverageSelectedInclination();
        luxuriousHealthBar.updateData(luxuriousHealthData);
    };

    this.updateTreemaps = function(selectedTreemap){
        for(var index in this.treemaps){
            var currentTreemap = this.treemaps[index];
            if (currentTreemap == selectedTreemap) continue;
            var updatedData =  getTreemapDataFromInstancesList(currentTreemap.root.name,currentData);
            console.log(currentTreemap.root.name);
            currentTreemap.updateData(updatedData);
        }
    }
    this.selectTreemapOption = function(treemap, node){
        NODES_SELECTED[treemap.root.name] = node.name;
        console.log(NODES_SELECTED);
        this.updateTreemaps(treemap);
        // selectedInstancesTable.updateData();
        inclinationScore.updateData();
    };

    this.unselectTreemapOption = function(treemap){
        delete NODES_SELECTED[treemap.root.name];
        console.log(NODES_SELECTED);
        this.updateTreemaps();
        selectedInstancesTable.updateData();
        inclinationScore.updateData();
    };

    this.updateTreemapsBasedSelectedNodes = function(){
        console.log(NODES_SELECTED);

    }

}

NODES_SELECTED = {};