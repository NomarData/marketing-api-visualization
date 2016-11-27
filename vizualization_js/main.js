/**
 * Created by maraujo on 11/20/16.
 */
//Global Variables
var INTEREST_COLUMN_NAME = "topic";
var COUNTRY_COLUMN_NAME = "location";
var countries_container = $("#countries_list");
var interests_container = $("#interests_list");
var demographicCategoriesContainer = $("#demographic_categories_list");
var countries_interest_data = [];
var defaultsPropertiesTreemap = {
    margin: {top: 24, right: 0, bottom: 0, left: 0},
    rootname: "TOP",
    format: ",d",
    title: "",
    height: 100
};

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


$(document).ready(function () {
    // var treemapProperties = generateTreemapProperties(1280 - 80,800 - 180);

    var colors = d3.scale.category10();
    initializeDataLayerModule();
    initTreemaps();


    luxuriousHealthBar = new stackedHorizontalBar();
    luxuriousHealthBar.init();



    // setInterval(function () {
        genderTreemap.updateData(treemapDataGender());
        ageRangeTreemap.updateData(treemapDataAgeRange());
        scholarityTreemap.updateData(treemapDataScholarity());
        citizenshipTreemap.updateData(treemapDataCitizenship());
        languageTreemap.updateData(treemapDataLanguage());
    // },5000);

    var map = new Datamap({
        element: document.getElementById("arabLeagueMapDiv"),
        scope: 'world',
        width:  "700px",
        height:'400px',
        // Zoom in on Africa
        setProjection: function(element) {
            var projection = d3.geo.equirectangular()
                .center([24, 24])
                .rotate([0, 0])
                .scale(500)
                .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
            var path = d3.geo.path()
                .projection(projection);

            return {path: path, projection: projection};
        },
        geographyConfig: {
            dataUrl: null, //if not null, datamaps will fetch the map JSON (currently only supports topojson)
            hideAntarctica: true,
            borderWidth: 1,
            borderOpacity: 1,
            borderColor: '#FDFDFD',
            responsive: true,
            popupTemplate: function(geography, data) { //this function should just return a string
                return '<div class="hoverinfo"><strong>' + geography.properties.name + '</strong></div>';
            },
            popupOnHover: true, //disable the popup while hovering
            highlightOnHover: true,
            highlightFillColor: '#FC8D59',
            highlightBorderColor: 'rgba(250, 15, 160, 0.2)',
            highlightBorderWidth: 2,
            highlightBorderOpacity: 1
        },
        fills: {
            defaultFill: "#EEEEEE",
            gt50: colors(Math.random() * 20),
            eq50: colors(Math.random() * 20),
            lt25: colors(Math.random() * 10),
            gt75: colors(Math.random() * 200),
            lt50: colors(Math.random() * 20),
            eq0: colors(Math.random() * 1),
            pink: '#0fa0fa',
            gt500: colors(Math.random() * 1)
        },
        data: {
            'ZAF': { fillKey: 'gt50' },
            'ZWE': { fillKey: 'lt25' },
            'NGA': { fillKey: 'lt50' },
            'MOZ': { fillKey: 'eq50' },
            'MDG': { fillKey: 'eq50' },
            'EGY': { fillKey: 'gt75' },
            'TZA': { fillKey: 'gt75' },
            'LBY': { fillKey: 'eq0' },
            'DZA': { fillKey: 'gt500' },
            'SSD': { fillKey: 'pink' },
            'SOM': { fillKey: 'gt50' },
            'GIB': { fillKey: 'eq50' },
            'AGO': { fillKey: 'lt50' }
        }
    });

    map.bubbles([
        {name: 'Bubble 1', latitude: 21.32, longitude: -7.32, radius: 45, fillKey: 'gt500'},
        {name: 'Bubble 2', latitude: 12.32, longitude: 27.32, radius: 25, fillKey: 'eq0'},
        {name: 'Bubble 3', latitude: 0.32, longitude: 23.32, radius: 35, fillKey: 'lt25'},
        {name: 'Bubble 4', latitude: -31.32, longitude: 23.32, radius: 55, fillKey: 'eq50'},
    ], {
        popupTemplate: function(geo, data) {
            return "<div class='hoverinfo'>Bubble for " + data.name + "</div>";
        }
    });

});