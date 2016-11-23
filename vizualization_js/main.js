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

var treemapDataGender = {
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

var treemapDataAgeRange = {
    "name": "Age Range",
    "children": [{
        "name": "18-22",
        "children": [{
            "name": "18-22",
            "size": Math.random()
        }]
    },{
        "name": "23-30",
        "children": [{
            "name": "23-30",
            "size": Math.random()
        }]
    },{
        "name": "31-40",
        "children": [{
            "name": "31-40",
            "size": Math.random()
        }]
    }
    ]
};

var treemapDataScholarity = {
    "name": "Scholarity",
    "children": [{
        "name": "HighSchool",
        "children": [{
            "name": "18-22",
            "size": Math.random()
        }]
    },{
        "name": "Graduated",
        "children": [{
            "name": "23-30",
            "size": Math.random()
        }]
    }
    ]
};

var treemapDataLanguage = {
    "name": "Language",
    "children": [{
        "name": "18-22",
        "children": [{
            "name": "18-22",
            "size": 19830
        }]
    },{
        "name": "23-30",
        "children": [{
            "name": "23-30",
            "size": 15023
        }]
    }
    ]
};

var treemapDataNaturality = {
    "name": "Native",
    "children": [{
        "name": "18-22",
        "children": [{
            "name": "18-22",
            "size": 19830
        }]
    },{
        "name": "Expats",
        "children": [{
            "name": "23-30",
            "size": 15023
        }]
    }
    ]
};


$(document).ready(function () {
    // var treemapProperties = generateTreemapProperties(1280 - 80,800 - 180);
    var treemapDefaultHeight = 100;
    var colorFunction = d3.scale.category20();
    var colors = d3.scale.category10();

    genderTreemap = new Treemap($("#genderTreemapDiv").width(),treemapDefaultHeight,$("#genderTreemapDiv").get(0),colorFunction,treemapDataGender);
    genderTreemap.init();

    ageRangeTreemap = new Treemap($("#ageRangeTreemapDiv").width(),treemapDefaultHeight,$("#ageRangeTreemapDiv").get(0),colorFunction,treemapDataAgeRange);
    ageRangeTreemap.init();

    scholarityTreemap = new Treemap($("#scholarityTreemapDiv").width(),treemapDefaultHeight,$("#scholarityTreemapDiv").get(0),colorFunction,treemapDataScholarity);
    scholarityTreemap.init();

    var map = new Datamap({
        element: document.getElementById("arabLeagueMap"),
        scope: 'world',
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