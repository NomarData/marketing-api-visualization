//TEXTS: Some text that you might want to change
APPLICATION_TITLE = "Doha Health Awareness";
APPLICATION_DESCRIPTION = "This tool was created to allow users to explore the rich demographic detailed data provided by Facebook in order to compare visually and numerically the health-related interests to a baseline luxury-related interests from Arab League countries.";
AWARENESS_SCORE_TITLE = "Facebook Health Awareness Score";

//DATA PATH: Setting where the data is
ROOT_DATA_PATH = "data_doha/";
CURRENT_DATA_PATH = ROOT_DATA_PATH + "current_data/";
HISTORY_MAP_FILE_PATH =  ROOT_DATA_PATH  + "historic_data/history_map.csv";

//MAP: Setting variables
DOHA_MAP_CENTER_COORDINATES = [51.32, 25.17];
MAPS_CONFIGS = {
    "DOHA" : {
        "isSubRegionData" : true,
        "zoomLevel" : 11,
        "defaultSubRegionCenterLat": DOHA_MAP_CENTER_COORDINATES[0],
        "defaultSubRegionCenterLng": DOHA_MAP_CENTER_COORDINATES[1],
        "autoCenterMap" : true,
        "locationsData" :{
            "West Bay" : {"name":"West Bay" , "_2letters_code":"WB", "latitude": 25.3239, "longitude": 51.5314, "radius": 1000},
            "Educational City" : {"name":"Educational City" , "_2letters_code":"EC", "latitude": 25.3136, "longitude": 51.4320, "radius": 2000},
            "Labor City": {"name":"Labor City" , "_2letters_code":"LC", "latitude":  25.1881, "longitude": 51.4755, "radius": 2000},
            "Perl": {"name":"Pearl" , "_2letters_code":"OA", "latitude": 25.3682, "longitude": 51.5512, "radius": 2000}
        }
    }
};

MAPS_CONFIG_SELECTION_KEY = "DOHA";
allEnabledLocationsKeys = Object.keys(MAPS_CONFIGS[MAPS_CONFIG_SELECTION_KEY].locationsData);



//List the topics that should be considered in the "left" and which should be considered as "right".
leftTopics = [
    'health',
    'fitness and wellness',
    'health care',
    'obesity',
    'physical activity',
    'diabetes awareness',
    'mental disease depression',
    'stroke heart disease',
    'back pain'
];
rightTopics = [
    'luxury',
    'luxury goods',
    'cars vehicles',
    'shopping',
    'fast food',
    'mobile phones gadgets'
];


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
    "family_status" : "Parent",
    "Western-US-CA-EU-AU-NZ" : "Westerns",
    "Not Expats":"Locals",
    "access_device" : "Devices",
    "Others" : "Others"
};

mapValuesStringsTreemap = {
    "Western-US-CA-EU-AU-NZ" : "Westerns",
    "18-24" : "18-24",
    "25-44" : "25-44",
    "45+" : "45+",
    "HS" : "High Shc.",
    "ND" : "No Deg.",
    "GRAD" : "Grad"
};


//Which topic should be selected as default
DEFAULT_LEFT_TOPIC = 4;
DEFAULT_RIGHT_TOPIC = 4;



applicationPossibleStates = {
    "location" :  MAPS_CONFIGS[MAPS_CONFIG_SELECTION_KEY].locationsData,
};

applicationPossibleStates[LEFT_TOPIC] = leftTopics;
applicationPossibleStates[RIGHT_TOPIC] = rightTopics;
treemapPossibleStates = {
                            "genders" : ["Male", "Female"],
                            "scholarities" : ["Graduated","No Degree","High School"],
                            "ages_ranges" : ["18-24", "25-44", "45+" ],
                            "citizenship" : ["Others", "Locals","India","Bangladesh","Nepal","Philippines","Western"],
                            "access_device" : ["iOS", "Android", "Other"]
                        };
for(var key in treemapPossibleStates){
    applicationPossibleStates[key] = treemapPossibleStates[key];
}

//DATA COLUMNS: Define columns in the data that will become a treemap
dataColumnsToTreemaps = Object.keys(treemapPossibleStates);

//Set the index of a topic if it should be considered a super selection of all topics together
ALL_LEFT_TOPIC = null;
ALL_RIGHT_TOPIC = null;



