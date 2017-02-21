SOCIAL_MEDIA_SUBJECT = "Dengue and Depression in São Paulo";
EMAIL_BODY = "Hey my friend, look what a nice visualization.Link: LINK";
fbInstancesWithInterests = [];
fbInstancesDemographic = [];
ROOT_DATA_PATH = "data_sao_paulo/";
CURRENT_DATA_PATH = ROOT_DATA_PATH + "current_data/";
HISTORY_MAP_FILE_PATH =  ROOT_DATA_PATH  + "historic_data/history_map.csv";
USA_MAP_DATAMAPS_PATH = "vizualization_js/lib/datamaps-master/dist/datamaps.usa.min.js";
WORLD_MAP_DATAMAPS_PATH = "vizualization_js/lib/datamaps.all.hires.min.js";
// locationsDataMapFile = USA_MAP_DATAMAPS_PATH;
USA_CENTER_COORDINATES = [-94,  35.8333333];
ARABIC_LEAGUE_CENTER_COODINATES = [25, 24];
// MAIN_MAP_CENTER_COORDINATES = USA_CENTER_COORDINATES;
// MAIN_MAP_CENTER_ROTATION = [0, 0];
// MAIN_MAP_CENTER_SCALE = 425;
QATAR_MAP_CENTER_COORDINATES = [51.2, 25.4];
QATAR_MAP_CENTER_ROTATION = [0, 0];
QATAR_MAP_CENTER_SCALE = 2400;
ALASKA_MAP_CENTER_COORDINATES = [-152.3, 64.5];
ALASKA_MAP_CENTER_ROTATION = [0, 0];
ALASKA_MAP_CENTER_SCALE = 100;
gccCountriesKeys = ["BH", "KW", "QA", "SA", "OM","AE"];
MAPS_CONFIGS = {
    "US" : {
        "isSubRegionData" : false,
        "mapFilePath" : USA_MAP_DATAMAPS_PATH,
        "center" : USA_CENTER_COORDINATES,
        "rotation" : [0,0],
        "scale" : 550,
        "auxiliarMaps" : [
            {
                "auxiliarCenter" : ALASKA_MAP_CENTER_COORDINATES,
                "auxiliarRotation" : ALASKA_MAP_CENTER_ROTATION,
                "auxiliarScale" : ALASKA_MAP_CENTER_SCALE,
            },
            {
                "auxiliarCenter" : HAWAII_MAP_CENTER_COORDINATES,
                "auxiliarRotation" : HAWAII_MAP_CENTER_ROTATION,
                "auxiliarScale" : HAWAII_MAP_CENTER_SCALE,
            },

        ],
        "auxiliarCenter" : ALASKA_MAP_CENTER_COORDINATES,
        "auxiliarRotation" : ALASKA_MAP_CENTER_ROTATION,
        "auxiliarScale" : ALASKA_MAP_CENTER_SCALE,
        "scope" : "usa"
    },
    "ARABIC_LEAGUE" : {
        "isSubRegionData" : false,
        "mapFilePath" : WORLD_MAP_DATAMAPS_PATH,
        "center" : ARABIC_LEAGUE_CENTER_COODINATES,
        "rotation" : [0,0],
        "scale" : 425,
        "auxiliarMaps" : [
            {
                "auxiliarCenter" : QATAR_MAP_CENTER_COORDINATES,
                "auxiliarRotation" : QATAR_MAP_CENTER_ROTATION,
                "auxiliarScale" : QATAR_MAP_CENTER_SCALE,
            }

        ],
        "auxiliarCenter" : QATAR_MAP_CENTER_COORDINATES,
        "auxiliarRotation" : QATAR_MAP_CENTER_ROTATION,
        "auxiliarScale" : QATAR_MAP_CENTER_SCALE,
        "fastLocationSelection" : {
            "name" : "GCC",
            "locations2letters" : gccCountriesKeys
        },
        "scope" : "world"
    },
    "SAOPAULO" : {
        "isSubRegionData" : true,
        "zoomLevel" : 11,
        "defaultSubRegionCenterLat": 0,
        "defaultSubRegionCenterLng": 0,
        "autoCenterMap" : true
    }
};
locationCodeMap["West Zone (rich)"] = {"name":"West Zone" , "_2letters_code":"WE", "latitude": -23.6212, "longitude": -46.7178, "radius": 5000};
locationCodeMap["East Zone (poor)"] = {"name":"East Zone" , "_2letters_code":"ES", "latitude": -23.5577, "longitude": -46.5435, "radius": 4000};

MAPS_CONFIG_SELECTION_KEY = "SAOPAULO";
allUsaStatesKeys = ["Alabama"  ,"Alaska"  ,"Arizona"  ,"Arkansas"  ,"California"  ,"Colorado" ,"Connecticut" ,"Delaware" ,"District of Columbia" ,"Florida" ,"Georgia" ,"Hawaii" ,"Idaho" ,"Illinois" ,"Indiana" ,"Iowa" ,"Kansas" ,"Kentucky" ,"Louisiana" ,"Maine" ,"Maryland" ,"Massachusetts" ,"Michigan" ,"Minnesota" ,"Mississippi" ,"Missouri" ,"Montana" ,"Nebraska" ,"Nevada" ,"New Hampshire" ,"New Jersey" ,"New Mexico" ,"New York" ,"North Carolina" ,"North Dakota" ,"Ohio" ,"Oklahoma" ,"Oregon" ,"Pennsylvania" ,"Rhode Island" ,"South Carolina" ,"South Dakota" ,"Tennessee" ,"Texas" ,"Utah" ,"Vermont" ,"Virginia" ,"Washington" ,"West Virginia" ,"Wisconsin" ,"Wyoming"]
allArabicLeagueCountriesKeys = ["DZ","BH","EG","IQ","JO","KW","LB","LY","MA","OM","PS","QA","SA","SO","TN","AE","YE"];
allSaoPauloSubRegionsKeys = ["West Zone (rich)", "East Zone (poor)"];
allEnabledLocationsKeys = allSaoPauloSubRegionsKeys;
colorRangeScale = ["#d73027", "#fc8d59", "#fee08b", '#ffffbf', '#d9ef8b', '#91cf60', '#1a9850'];
colorD3RangeScale = [d3.rgb("#d73027"), d3.rgb("#fc8d59"), d3.rgb("#fee08b"), d3.rgb('#ffffbf'), d3.rgb('#d9ef8b'), d3.rgb('#91cf60'), d3.rgb('#1a9850')];
domainLinear = [-1, -0.66, -0.33, 0, 0.33, 0.66, 1];
domainNotLinear = [-0.7, -0.3, -0.05, 0, 0.05, 0.3, 0.7];
colorFunction = d3.scale.linear().domain(domainNotLinear).interpolate(d3.interpolateRgb).range(colorD3RangeScale);
colorNotLinearFunction = d3.scale.linear().domain(domainNotLinear).interpolate(d3.interpolateRgb).range(colorD3RangeScale);
colorLinearFunction = d3.scale.linear().domain(domainLinear).interpolate(d3.interpolateRgb).range(colorD3RangeScale);
ALL_VALUE = "ALL";
DEFAULT_CATEGORIES_NAMES = ["gender", "age_range", "scholarity", "citizenship"];
APPLICATION_TITLE = "Dengue and Depression in São Paulo";
APPLICATION_DESCRIPTION = "Just an example of usiong subRegion data from Facebook API.";
AWARENESS_SCORE_TITLE = "Facebook Peace Awareness Score";
DEFAULT_LEFT_TOPIC = 1;
DEFAULT_RIGHT_TOPIC = 0;
LOCATION_HEIGHT_THRESHOLD = 500;
LOCATION_BTNS_WIDTH = 90;
columnsToTreemaps = [
    "genders",
    "ages_ranges",
    "scholarities",
    "behavior"
];
// leftTopics = [
//     'health',
//     'fitness and wellness',
//     'health care',
//     'obesity',
//     'physical activity',
//     // 'smoking awareness',
//     'diabetes awareness',
//     'mental disease depression',
//     'stroke heart disease',
//     // 'respiratory asthma',
//     'back pain'
// ];
// rightTopics = ['luxury','luxury goods','cars vehicles','shopping','fast food','mobile phones gadgets'];
HEALTH_ICON_PATH = "imgs/heart.svg";
JEWEL_ICON_PATH = "imgs/jewel.svg";
WAR_ICON_PATH = "imgs/war-icon.png";
PEACE_ICON_PATH = "imgs/peace-icon.png";

LEFT_ICON_PATH = HEALTH_ICON_PATH;
RIGHT_ICON_PATH = JEWEL_ICON_PATH;
filtersNameList = [""];
leftTopics = [
    "Dengue Fever",
    "Majot depressive disorder awareness"
];


rightTopics = [
    "Luxury Goods"
];

healthInterests = [
    "Physical exercise",
    "Physical fitness",
    "Gym",
    "Weight Training",
    "Running",
    "Obesity awarenes",
    "Dieting",
    "Weight loss (Fitness And wellness",
    "Healthy Die",
    "Low-carbohydrate diet",
    "Health Care",
    "Fitness and wellnes",
    "smoking awarenes",
    "health car",
    "healt",
    "all healt",
    "back pai",
    "diabetes awarenes",
    "fitness and wellnes",
    "mental disease depression",
    "obesity",
    "physical activit",
    "respiratory asthm",
    "stroke heart disease",
    "stroke",
    "pneumonia",
    "asthma",
    "Lung cancer awareness",
    "Diabetes mellitus",
    "fitness and wellness",
    "Dengue Fever",
    "Majot depressive disorder awareness"
].concat(leftTopics);
jewelInterests = ["jewel",
    "luxury goods",
    "mobile phones gadgets",
    "shopping",
    "Motor Vehicle",
    "Mobile Phones",
    "cars vehicles",
    "fast food",
    "Luxury Goods",
    "luxury"].concat(rightTopics);

mapValuesStringsTooltip = {
    "Female" : "Female",
    "Male" : "Male",
    "1.0" : "Male",
    "2.0" : "Female",
    "18-24" : "18 to 24 years old",
    "25-44" : "25 to 44 years old",
    "45+" : "45 years old or more",
    "HS" : "High School",
    "ND" : "No degree",
    "GRAD" : "Graduate",
    "European" : "European Languages",
    "Indian" : "Indian Languages",
    "SE Asia" : "South East Asian Languages",
    "Expats" : "Expats",
    "Locals" : "Locals",
    "citizenship" : "Citizenship",
    "language" : "Language",
    "scholarity" : "Scholarity",
    "age_range" : "Age Range",
    "gender" : "Gender",
    "scholarities" : "Education",
    "ages_ranges" : "Age Range",
    "genders" : "Gender",
    "behavior" : "Citizenship",
    "family_status" : "Parent"
};

mapValuesTileTitle = {
    "1.0" : "Male",
    "2.0" : "Female",
    "Female" : "Female",
    "Male" : "Male",
    "18-24" : "18-24",
    "25-44" : "25-44",
    "45+" : "45+",
    "HS" : "HS",
    "ND" : "ND",
    "Graduated" : "Grad",
    "High School" : "HS",
    "No Degree" : "ND",
    "GRAD" : "Grad",
    "Expats" : "Expats",
    "Locals" : "Locals",
};

applicationPossibleStates = {
        "health" : leftTopics,
        "luxury" : rightTopics,
        "gender" : ["Male", "Female"],
        "scholarity" : ["Graduated","No Degree","High School"],
        "age_range" : ["18-24", "25-44", "45+" ],
        "citizenship" : ["Expats", "Locals"],
        "country" : locationCodeMap,
};
