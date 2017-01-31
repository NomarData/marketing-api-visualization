fbInstancesWithInterests = [];
fbInstancesDemographic = [];
ROOT_DATA_PATH = "data/";
CURRENT_DATA_PATH = ROOT_DATA_PATH + "current_data/";
HISTORY_MAP_FILE_PATH =  ROOT_DATA_PATH  + "historic_data/history_map.csv";

colorRangeScale = ["#d73027", "#fc8d59", "#fee08b", '#ffffbf', '#d9ef8b', '#91cf60', '#1a9850'];
colorD3RangeScale = [d3.rgb("#d73027"), d3.rgb("#fc8d59"), d3.rgb("#fee08b"), d3.rgb('#ffffbf'), d3.rgb('#d9ef8b'), d3.rgb('#91cf60'), d3.rgb('#1a9850')];
domainLinear = [-1, -0.66, -0.33, 0, 0.33, 0.66, 1];
domainNotLinear = [-0.7, -0.3, -0.05, 0, 0.05, 0.3, 0.7];
colorFunction = d3.scale.linear().domain(domainNotLinear).interpolate(d3.interpolateRgb).range(colorD3RangeScale);
colorNotLinearFunction = d3.scale.linear().domain(domainNotLinear).interpolate(d3.interpolateRgb).range(colorD3RangeScale);
colorLinearFunction = d3.scale.linear().domain(domainLinear).interpolate(d3.interpolateRgb).range(colorD3RangeScale);
ALL_VALUE = "ALL";
DEFAULT_CATEGORIES_NAMES = ["gender", "age_range", "scholarity", "citizenship"];


healthTopics = [
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

luxuryTopics = ['luxury','luxury goods','cars vehicles','shopping','fast food','mobile phones gadgets'];

jewelInterests = ["jewel",
    "luxury goods",
    "mobile phones gadgets",
    "shopping",
    "Motor Vehicle",
    "Mobile Phones",
    "cars vehicles",
    "fast food",
    "luxury"
];
healthInterests = ["Physical exercise",
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
];

fakeData = [
    {
        "gender" : "Male",
        "age_range" : "18-24",
        "interest" : "jewel",
        "country_code" : "EGY",
        "audience" : 262
    },
    {
        "gender" : "Female",
        "age_range" : "18-24",
        "interest" : "jewel",
        "country_code" : "EGY",
        "audience" : 223
    },
    {
        "gender" : "Male",
        "age_range" : "25-44",
        "interest" : "jewel",
        "country_code" : "EGY",
        "audience" : 393
    },
    {
        "gender" : "Female",
        "age_range" : "25-44",
        "interest" : "jewel",
        "country_code" : "EGY",
        "audience" : 314
    },
    {
        "gender" : "Male",
        "age_range" : "18-24",
        "interest" : "health",
        "country_code" : "EGY",
        "audience" : 263
    },
    {
        "gender" : "Female",
        "age_range" : "18-24",
        "interest" : "health",
        "country_code" : "EGY",
        "audience" : 412
    },
    {
        "gender" : "Male",
        "age_range" : "25-44",
        "interest" : "health",
        "country_code" : "EGY",
        "audience" : 123
    },
    {
        "gender" : "Female",
        "age_range" : "25-44",
        "interest" : "health",
        "country_code" : "EGY",
        "audience" : 454
    },



    {
        "gender" : "Male",
        "age_range" : "18-24",
        "interest" : "jewel",
        "country_code" : "SAU",
        "audience" : 212
    },
    {
        "gender" : "Female",
        "age_range" : "18-24",
        "interest" : "jewel",
        "country_code" : "SAU",
        "audience" : 243
    },
    {
        "gender" : "Male",
        "age_range" : "25-44",
        "interest" : "jewel",
        "country_code" : "SAU",
        "audience" : 323
    },
    {
        "gender" : "Female",
        "age_range" : "25-44",
        "interest" : "jewel",
        "country_code" : "SAU",
        "audience" : 374
    },
    {
        "gender" : "Male",
        "age_range" : "18-24",
        "interest" : "health",
        "country_code" : "SAU",
        "audience" : 223
    },
    {
        "gender" : "Female",
        "age_range" : "18-24",
        "interest" : "health",
        "country_code" : "SAU",
        "audience" : 434
    },
    {
        "gender" : "Male",
        "age_range" : "25-44",
        "interest" : "health",
        "country_code" : "SAU",
        "audience" : 173
    },
    {
        "gender" : "Female",
        "age_range" : "25-44",
        "interest" : "health",
        "country_code" : "SAU",
        "audience" : 500
    }
]


countryCodeMap = {
    "DZ"  : {
        "name" : "Algeria",
        "_3letter_code" : "DZA",
        "_2letter_code" : "DZ"
    },
    "BH"  : {
        "name" : "Bahrain",
        "_3letter_code" : "BHR",
        "_2letter_code" : "BH"
    },
    "EG"  : {
        "name" : "Egypt",
        "_3letter_code" : "EGY",
        "_2letter_code" : "EG"
    },
    "IQ"  : {
        "name" : "Iraq",
        "_3letter_code" : "IRQ",
        "_2letter_code" : "IQ"
    },
    "JO"  : {
        "name" : "Jordan",
        "_3letter_code" : "JOR",
        "_2letter_code" : "JO"
    },
    "KW"  : {
        "name" : "Kuwait",
        "_3letter_code" : "KWT",
        "_2letter_code" : "KW"
    },
    "LB"  : {
        "name" : "Lebanon",
        "_3letter_code" : "LBN",
        "_2letter_code" : "LB"
    },
    "LY"  : {
        "name" : "Libya",
        "_3letter_code" : "LBY",
        "_2letter_code" : "LY"
    },
    "MA"  : {
        "name" : "Morocco",
        "_3letter_code" : "MAR",
        "_2letter_code" : "MA"
    },
    "OM"  : {
        "name" : "Oman",
        "_3letter_code" : "OMN",
        "_2letter_code" : "OM"
    },
    "PS"  : {
        "name" : "Palestine",
        "_3letter_code" : "PSE",
        "_2letter_code" : "PS"
    },
    "QA"  : {
        "name" : "Qatar",
        "_3letter_code" : "QAT",
        "_2letter_code" : "QA"
    },
    "SA"  : {
        "name" : "Saudi Arabia",
        "_3letter_code" : "SAU",
        "_2letter_code" : "SA"
    },
    "SO"  : {
        "name" : "Somalia",
        "_3letter_code" : "SOM",
        "_2letter_code" : "SO"
    },
    "TN"  : {
        "name" : "Tunisia",
        "_3letter_code" : "TUN",
        "_2letter_code" : "TN"
    },
    "AE"  : {
        "name" : "United Arab Emirates",
        "_3letter_code" : "ARE",
        "_2letter_code" : "AE"
    },
    "YE"  : {
        "name" : "Yemen",
        "_3letter_code" : "YEM",
        "_2letter_code" : "YE"
    },
};

mapValuesStringsTooltip = {
    "Female" : "Female",
    "Male" : "Male",
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
};

mapValuesTileTitle = {
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
    "health" : healthTopics,
        "luxury" : luxuryTopics,
        "gender" : ["Male", "Female"],
        "scholarity" : ["Graduated","No Degree","High School"],
        "age_range" : ["18-24", "25-44", "45+" ],
        "citizenship" : ["Expats", "Locals"],
        "country" : countryCodeMap,
};
