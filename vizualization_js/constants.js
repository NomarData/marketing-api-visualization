FAVICON_PATH = "imgs/health-favicon.png";
SOCIAL_MEDIA_SUBJECT = "Health Awareness in the Arabic World";
EMAIL_BODY = "Hey my friend, look what a nice visualization.Link: LINK";
ROOT_DATA_PATH = "data/";
CURRENT_DATA_PATH = ROOT_DATA_PATH + "current_data/";
HISTORY_MAP_FILE_PATH =  ROOT_DATA_PATH  + "historic_data/history_map.csv";
USA_MAP_DATAMAPS_PATH = "vizualization_js/lib/datamaps-master/dist/datamaps.usa.min.js";
WORLD_MAP_DATAMAPS_PATH = "vizualization_js/lib/datamaps.all.hires.min.js";
USA_CENTER_COORDINATES = [-94,  35.8333333];
ARABIC_LEAGUE_CENTER_COODINATES = [25, 24];
QATAR_MAP_CENTER_COORDINATES = [51.2, 25.4];
QATAR_MAP_CENTER_ROTATION = [0, 0];
QATAR_MAP_CENTER_SCALE = 2400;
ALASKA_MAP_CENTER_COORDINATES = [-152.3, 64.5];
ALASKA_MAP_CENTER_ROTATION = [0, 0];
ALASKA_MAP_CENTER_SCALE = 100;
HAWAII_MAP_CENTER_COORDINATES = [-156.3, 20.29];
HAWAII_MAP_CENTER_ROTATION = [0, 0];
HAWAII_MAP_CENTER_SCALE = 1000;
gccCountriesKeys = ["BH", "KW", "QA", "SA", "OM","AE"];
DATAMAPS_CONFIGS = {
    "US" : {
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
    }
};
DATAMAPS_CONFIG_KEY = "ARABIC_LEAGUE";
//Defining Select All Btn
allUsaStatesKeys = ["Alabama"  ,"Alaska"  ,"Arizona"  ,"Arkansas"  ,"California"  ,"Colorado" ,"Connecticut" ,"Delaware" ,"District of Columbia" ,"Florida" ,"Georgia" ,"Hawaii" ,"Idaho" ,"Illinois" ,"Indiana" ,"Iowa" ,"Kansas" ,"Kentucky" ,"Louisiana" ,"Maine" ,"Maryland" ,"Massachusetts" ,"Michigan" ,"Minnesota" ,"Mississippi" ,"Missouri" ,"Montana" ,"Nebraska" ,"Nevada" ,"New Hampshire" ,"New Jersey" ,"New Mexico" ,"New York" ,"North Carolina" ,"North Dakota" ,"Ohio" ,"Oklahoma" ,"Oregon" ,"Pennsylvania" ,"Rhode Island" ,"South Carolina" ,"South Dakota" ,"Tennessee" ,"Texas" ,"Utah" ,"Vermont" ,"Virginia" ,"Washington" ,"West Virginia" ,"Wisconsin" ,"Wyoming"]
allArabicLeagueCountriesKeys = ["DZ","BH","EG","IQ","JO","KW","LB","LY","MA","OM","PS","QA","SA","SO","TN","AE","YE"];
allEnabledLocationsKeys = allArabicLeagueCountriesKeys;


colorRangeScale = ["#d73027", "#fc8d59", "#fee08b", '#ffffbf', '#d9ef8b', '#91cf60', '#1a9850'];
colorD3RangeScale = [d3.rgb("#d73027"), d3.rgb("#fc8d59"), d3.rgb("#fee08b"), d3.rgb('#ffffbf'), d3.rgb('#d9ef8b'), d3.rgb('#91cf60'), d3.rgb('#1a9850')];
domainLinear = [-1, -0.66, -0.33, 0, 0.33, 0.66, 1];
domainNotLinear = [-0.7, -0.3, -0.05, 0, 0.05, 0.3, 0.7];
colorFunction = d3.scale.linear().domain(domainNotLinear).interpolate(d3.interpolateRgb).range(colorD3RangeScale);
colorNotLinearFunction = d3.scale.linear().domain(domainNotLinear).interpolate(d3.interpolateRgb).range(colorD3RangeScale);
colorLinearFunction = d3.scale.linear().domain(domainLinear).interpolate(d3.interpolateRgb).range(colorD3RangeScale);
ALL_VALUE = "ALL";
DEFAULT_CATEGORIES_NAMES = ["gender", "age_range", "scholarity", "citizenship"];
APPLICATION_TITLE = "Health Awareness on Facebook in the Arab World";
APPLICATION_DESCRIPTION = "This tool was created to allow users to explore the rich demographic detailed data provided by Facebook in order to compare visually and numerically the health-related interests to a baseline luxury-related interests from Arab League countries.";
AWARENESS_SCORE_TITLE = "Facebook Health Awareness Score";
DEFAULT_LEFT_TOPIC = 4;
DEFAULT_RIGHT_TOPIC = 4;
LOCATION_HEIGHT_THRESHOLD = 680;
LOCATION_BTNS_WIDTH = 90;
columnsToTreemaps = [
    "genders",
    "ages_ranges",
    "scholarities",
    "behavior"
];
leftTopics = [
    'health',
    'fitness and wellness',
    'health care',
    'obesity',
    'physical activity',
    // 'smoking awareness',
    'diabetes awareness',
    'mental disease depression',
    'stroke heart disease',
    // 'respiratory asthma',
    'back pain'
];
rightTopics = ['luxury','luxury goods','cars vehicles','shopping','fast food','mobile phones gadgets'];
HEALTH_ICON_PATH = "imgs/heart.svg";
JEWEL_ICON_PATH = "imgs/jewel.svg";
WAR_ICON_PATH = "imgs/war-icon.png";
PEACE_ICON_PATH = "imgs/peace-icon.png";

LEFT_ICON_PATH = HEALTH_ICON_PATH;
RIGHT_ICON_PATH = JEWEL_ICON_PATH;


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
    "fitness and wellness"
].concat(leftTopics);
jewelInterests = ["jewel",
    "luxury goods",
    "mobile phones gadgets",
    "shopping",
    "Motor Vehicle",
    "Mobile Phones",
    "cars vehicles",
    "fast food",
    "luxury"].concat(rightTopics);

locationCodeMap = {
    "Alabama"  : {"name":"Alabama" , "_2letters_code":"AL","datamaps_code":"AL"},
    "Alaska"  : {"name":"Alaska" , "_2letters_code":"AK","datamaps_code":"AK"},
    "Arizona"  : {"name":"Arizona" , "_2letters_code":"AZ","datamaps_code":"AZ"},
    "Arkansas"  : {"name":"Arkansas" , "_2letters_code":"AR","datamaps_code":"AR"},
    "California"  : {"name":"California" , "_2letters_code":"CA","datamaps_code":"CA"},
    "Colorado" : {"name":"Colorado", "_2letters_code":"CO","datamaps_code":"CO"},
    "Connecticut" : {"name":"Connecticut", "_2letters_code":"CT","datamaps_code":"CT"},
    "Delaware" : {"name":"Delaware", "_2letters_code":"DE","datamaps_code":"DE"},
    "District of Columbia" : {"name":"District of Columbia", "_2letters_code":"DC","datamaps_code":"DC"},
    "Florida" : {"name":"Florida", "_2letters_code":"FL","datamaps_code":"FL"},
    "Georgia" : {"name":"Georgia", "_2letters_code":"GA","datamaps_code":"GA"},
    "Hawaii" : {"name":"Hawaii", "_2letters_code":"HI","datamaps_code":"HI"},
    "Idaho" : {"name":"Idaho", "_2letters_code":"ID","datamaps_code":"ID"},
    "Illinois" : {"name":"Illinois", "_2letters_code":"IL","datamaps_code":"IL"},
    "Indiana" : {"name":"Indiana", "_2letters_code":"IN","datamaps_code":"IN"},
    "Iowa" : {"name":"Iowa", "_2letters_code":"IA","datamaps_code":"IA"},
    "Kansas" : {"name":"Kansas", "_2letters_code":"KS","datamaps_code":"KS"},
    "Kentucky" : {"name":"Kentucky", "_2letters_code":"KY","datamaps_code":"KY"},
    "Louisiana" : {"name":"Louisiana", "_2letters_code":"LA","datamaps_code":"LA"},
    "Maine" : {"name":"Maine", "_2letters_code":"ME","datamaps_code":"ME"},
    "Maryland" : {"name":"Maryland", "_2letters_code":"MD","datamaps_code":"MD"},
    "Massachusetts" : {"name":"Massachusetts", "_2letters_code":"MA","datamaps_code":"MA"},
    "Michigan" : {"name":"Michigan", "_2letters_code":"MI","datamaps_code":"MI"},
    "Minnesota" : {"name":"Minnesota", "_2letters_code":"MN","datamaps_code":"MN"},
    "Mississippi" : {"name":"Mississippi", "_2letters_code":"MS","datamaps_code":"MS"},
    "Missouri" : {"name":"Missouri", "_2letters_code":"MO","datamaps_code":"MO"},
    "Montana" : {"name":"Montana", "_2letters_code":"MT","datamaps_code":"MT"},
    "Nebraska" : {"name":"Nebraska", "_2letters_code":"NE","datamaps_code":"NE"},
    "Nevada" : {"name":"Nevada", "_2letters_code":"NV","datamaps_code":"NV"},
    "New Hampshire" : {"name":"New Hampshire", "_2letters_code":"NH","datamaps_code":"NH"},
    "New Jersey" : {"name":"New Jersey", "_2letters_code":"NJ","datamaps_code":"NJ"},
    "New Mexico" : {"name":"New Mexico", "_2letters_code":"NM","datamaps_code":"NM"},
    "New York" : {"name":"New York", "_2letters_code":"NY","datamaps_code":"NY"},
    "North Carolina" : {"name":"North Carolina", "_2letters_code":"NC","datamaps_code":"NC"},
    "North Dakota" : {"name":"North Dakota", "_2letters_code":"ND","datamaps_code":"ND"},
    "Ohio" : {"name":"Ohio", "_2letters_code":"OH","datamaps_code":"OH"},
    "Oklahoma" : {"name":"Oklahoma", "_2letters_code":"OK","datamaps_code":"OK"},
    "Oregon" : {"name":"Oregon", "_2letters_code":"OR","datamaps_code":"OR"},
    "Pennsylvania" : {"name":"Pennsylvania", "_2letters_code":"PA","datamaps_code":"PA"},
    "Rhode Island" : {"name":"Rhode Island", "_2letters_code":"RI","datamaps_code":"RI"},
    "South Carolina" : {"name":"South Carolina", "_2letters_code":"SC","datamaps_code":"SC"},
    "South Dakota" : {"name":"South Dakota", "_2letters_code":"SD","datamaps_code":"SD"},
    "Tennessee" : {"name":"Tennessee", "_2letters_code":"TN","datamaps_code":"TN"},
    "Texas" : {"name":"Texas", "_2letters_code":"TX","datamaps_code":"TX"},
    "Utah" : {"name":"Utah", "_2letters_code":"UT","datamaps_code":"UT"},
    "Vermont" : {"name":"Vermont", "_2letters_code":"VT","datamaps_code":"VT"},
    "Virginia" : {"name":"Virginia", "_2letters_code":"VA","datamaps_code":"VA"},
    "Washington" : {"name":"Washington", "_2letters_code":"WA","datamaps_code":"WA"},
    "West Virginia" : {"name":"West Virginia", "_2letters_code":"WV","datamaps_code":"WV"},
    "Wisconsin" : {"name":"Wisconsin", "_2letters_code":"WI","datamaps_code":"WI"},
    "Wyoming" : {"name":"Wyoming", "_2letters_code":"WY","datamaps_code":"WY"},
    "DZ"  : {
        "name" : "Algeria",
        "datamaps_code" : "DZA",
        "_2letters_code" : "DZ"
    },
    "BH"  : {
        "name" : "Bahrain",
        "datamaps_code" : "BHR",
        "_2letters_code" : "BH"
    },
    "EG"  : {
        "name" : "Egypt",
        "datamaps_code" : "EGY",
        "_2letters_code" : "EG"
    },
    "IQ"  : {
        "name" : "Iraq",
        "datamaps_code" : "IRQ",
        "_2letters_code" : "IQ"
    },
    "JO"  : {
        "name" : "Jordan",
        "datamaps_code" : "JOR",
        "_2letters_code" : "JO"
    },
    "KW"  : {
        "name" : "Kuwait",
        "datamaps_code" : "KWT",
        "_2letters_code" : "KW"
    },
    "LB"  : {
        "name" : "Lebanon",
        "datamaps_code" : "LBN",
        "_2letters_code" : "LB"
    },
    "LY"  : {
        "name" : "Libya",
        "datamaps_code" : "LBY",
        "_2letters_code" : "LY"
    },
    "MA"  : {
        "name" : "Morocco",
        "datamaps_code" : "MAR",
        "_2letters_code" : "MA"
    },
    "OM"  : {
        "name" : "Oman",
        "datamaps_code" : "OMN",
        "_2letters_code" : "OM"
    },
    "PS"  : {
        "name" : "Palestine",
        "datamaps_code" : "PSE",
        "_2letters_code" : "PS"
    },
    "QA"  : {
        "name" : "Qatar",
        "datamaps_code" : "QAT",
        "_2letters_code" : "QA"
    },
    "SA"  : {
        "name" : "Saudi Arabia",
        "datamaps_code" : "SAU",
        "_2letters_code" : "SA"
    },
    "SO"  : {
        "name" : "Somalia",
        "datamaps_code" : "SOM",
        "_2letters_code" : "SO"
    },
    "TN"  : {
        "name" : "Tunisia",
        "datamaps_code" : "TUN",
        "_2letters_code" : "TN"
    },
    "AE"  : {
        "name" : "United Arab Emirates",
        "datamaps_code" : "ARE",
        "_2letters_code" : "AE"
    },
    "YE"  : {
        "name" : "Yemen",
        "datamaps_code" : "YEM",
        "_2letters_code" : "YE"
    },
};

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

listOfValues = {
        "health" : leftTopics,
        "luxury" : rightTopics,
        "gender" : ["Male", "Female"],
        "scholarity" : ["Graduated","No Degree","High School"],
        "age_range" : ["18-24", "25-44", "45+" ],
        "citizenship" : ["Expats", "Locals"],
        "country" : locationCodeMap,
};

fbInstancesWithInterests = [];
fbInstancesDemographic = [];
LEFT_TOPIC = "leftTopic";
RIGHT_TOPIC = "rightTopic";
