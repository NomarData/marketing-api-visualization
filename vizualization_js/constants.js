currentData = [];
facebookPopulation = [];

colorRangeScale = ["#d73027", "#fc8d59", "#fee08b", '#ffffbf', '#d9ef8b', '#91cf60', '#1a9850'];
colorD3RangeScale = [d3.rgb("#d73027"), d3.rgb("#fc8d59"), d3.rgb("#fee08b"), d3.rgb('#ffffbf'), d3.rgb('#d9ef8b'), d3.rgb('#91cf60'), d3.rgb('#1a9850')];
domainLinear = [-1, -0.66, -0.33, 0, 0.33, 0.66, 1];
domainNotLinear = [-0.7, -0.3, -0.05, 0, 0.05, 0.3, 0.7];
breakPointsColor = buildBreakPoints(domainLinear, colorRangeScale);
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