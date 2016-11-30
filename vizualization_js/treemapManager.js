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

function getTreemapDataFromFake(category){
    var categoryAudience = {};
    for(var index in fakeData){
        var instance = fakeData[index];
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
        if (jewelInterests.indexOf(instance.interest) != -1){
            jewelAudience += instance.audience;
        } else if (healthInterests.indexOf(instance.interest) != -1){
            healthAudience += instance.audience;
        } else {
            throw Error("The Interest Should be Jewel or Health : " + instance)
        }
        totalAudience += instance.audience;
    }
    return {
        "size" : totalAudience,
        "inclination" : (jewelAudience - healthAudience) / totalAudience
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

function TreemapManager(){
    this.treemaps = [];
    this.initTreemaps = function(){
        var treemapDefaultHeight = 100;
        var colorFunction = getRandomGreenOrRedColor;

        var genderTreemap = new Treemap($("#genderTreemapDiv").width(),treemapDefaultHeight,$("#genderTreemapDiv").get(0),colorFunction,getTreemapDataFromFake("gender"));
        genderTreemap.init();

        var ageRangeTreemap = new Treemap($("#ageRangeTreemapDiv").width(),treemapDefaultHeight,$("#ageRangeTreemapDiv").get(0),colorFunction,getTreemapDataFromFake("age"));
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

    this.getAverageLuxuriousVsHealth = function(){
        var cellInclinationAndAudience = [];
        var averageInclination = {"greenValue" : 0, "redValue":0};
        for(var treemapsIndex in this.treemaps){
            cellInclinationAndAudience = cellInclinationAndAudience.concat(this.treemaps[treemapsIndex].getCells());
        }
        console.log(cellInclinationAndAudience);


        var total = cellInclinationAndAudience.map(function(cell){ return cell.value}).reduce(function (total, num) { return total + num});
        averageInclination.greenValue =  cellInclinationAndAudience.map( function(cell){ return cell.children[0].inclination > 0 ? cell.value : 0}).reduce(function (total, num) { return total + num});
        averageInclination.redValue =  cellInclinationAndAudience.map( function(cell){ return cell.children[0].inclination < 0 ? cell.value : 0}).reduce(function (total, num) { return total + num});

        console.log(averageInclination);

        averageInclination.greenValue = averageInclination.greenValue / total;
        averageInclination.redValue = averageInclination.redValue / total;

        console.log(averageInclination);
        console.log(total);
        return averageInclination

    };
    this.updateLuxuriousHealthBar = function(){
        var luxuriousHealthData = this.getAverageLuxuriousVsHealth();
        luxuriousHealthBar.updateData(luxuriousHealthData);
    };

    this.updateTreemaps = function(selectedTreemap){
        for(var index in this.treemaps){
            var currentTreemap = this.treemaps[index];
            if (currentTreemap == selectedTreemap) continue;
            var updatedData =  getTreemapDataFromFake(currentTreemap.root.name);
            console.log(currentTreemap.root.name);
            currentTreemap.updateData(updatedData);
        }
    }
    this.selectTreemapOption = function(treemap, node){
        NODES_SELECTED[treemap.root.name] = node.name;
        console.log(NODES_SELECTED);
        this.updateTreemaps(treemap);
    };

    this.unselectTreemapOption = function(treemap){
        delete NODES_SELECTED[treemap.root.name];
        console.log(NODES_SELECTED);
        this.updateTreemaps();
    };

    this.updateTreemapsBasedSelectedNodes = function(){
        console.log(NODES_SELECTED);

    }

}

NODES_SELECTED = {};