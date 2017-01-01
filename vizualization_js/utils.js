/**
 * Created by maraujo on 11/21/16.
 */

countryCodeMap = {
    "DZ"  : {
        "name" : "Algeria",
        "_3letter_code" : "DZA"
    },
    "BH"  : {
        "name" : "Bahrain",
        "_3letter_code" : "BHR"
    },
    "EG"  : {
        "name" : "Egypt",
        "_3letter_code" : "EGY"
    },
    "IQ"  : {
        "name" : "Iraq",
        "_3letter_code" : "IRQ"
    },
    "JO"  : {
        "name" : "Jordan",
        "_3letter_code" : "JOR"
    },
    "KW"  : {
        "name" : "Kuwait",
        "_3letter_code" : "KWT"
    },
    "LB"  : {
        "name" : "Lebanon",
        "_3letter_code" : "LBN"
    },
    "LY"  : {
        "name" : "Libya",
        "_3letter_code" : "LBY"
    },
    "MA"  : {
        "name" : "Morocco",
        "_3letter_code" : "MAR"
    },
    "OM"  : {
        "name" : "Oman",
        "_3letter_code" : "OMN"
    },
    "PS"  : {
        "name" : "Palestine",
        "_3letter_code" : "PSE"
    },
    "QA"  : {
        "name" : "Qatar",
        "_3letter_code" : "QAT"
    },
    "SA"  : {
        "name" : "Saudi Arabia",
        "_3letter_code" : "SAU"
    },
    "SO"  : {
        "name" : "Somalia",
        "_3letter_code" : "SOM"
    },
    "TN"  : {
        "name" : "Tunisia",
        "_3letter_code" : "TUN"
    },
    "AE"  : {
        "name" : "United Arab Emirates",
        "_3letter_code" : "ARE"
    },
    "YE"  : {
        "name" : "Yemen",
        "_3letter_code" : "YEM"
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

function removeValueFromArray(array,valueToRemove){
    return $.grep(array, function(value) {
        return value != valueToRemove;
    });
}

function buildAndInitVisualComponents(){
    console.log("Building visual components");
    treemapManager = new TreemapManager();
    luxuriousHealthBar = new stackedHorizontalBar();
    inclinationScore = new InclinationScore();
    arabMap = new arabLeagueMap();
    btnsTopicsSelectors = new BtnsTopicsSelectors();
    sharebleLink = new SharebleLink();
    console.log("Builded visual components");
}


function buildBreakPoints(domainBreakpoints, colorRange){
    var breakPoints = [];
    for(var index = 0 in domainBreakpoints){
        var domain = domainBreakpoints[index];
        var color = colorRange[index];
        breakPoints.push({
            "position":domain,
            "color":color
        });
    }
    return breakPoints;
}

function getTooltipLabel(value){
    if(value in mapValuesStringsTooltip){
        return mapValuesStringsTooltip[value];
    } else{
        return value
    }
}

function generateUUID(a){return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,generateUUID)}

function isDemographicCategoryName(name){
    // demographicCategoriesNames = ["age_range","gender","language","exclude_expats","scholarity"]
    demographicCategoriesNames = ["age_range","gender","exclude_expats","scholarity"];
    return demographicCategoriesNames.indexOf(name) >= 0;
}

function convertDataRowsFirstSecondValueToKeyValueDictionary(data){
    var finalDictionary = {};
    for(var subCategoriesIndex = data.rows.length - 1; subCategoriesIndex >= 0; subCategoriesIndex--){
        var rowItem = data.rows[subCategoriesIndex];
        finalDictionary[rowItem[0]] = rowItem[1];
    }
    return finalDictionary;
}

function convertIntegerToReadable(number){
    return numeral(number).format('0.0a');
}

function cloneObject(obj){
    return JSON.parse(JSON.stringify(obj));
}
function removeAllParentheses(string){
    string = string.replace(/\(/g,"");
    string = string.replace(/\)/g,"");
    return string
}

function getJqueryCountryBtnByCode2Letters(countryCode){
    return $("div[data-code='"+ countryCode +"']");
}

function onClickCountryFunctionBy3LettersCode(_3_letters_code){
    var countryCode = convert3to2LettersCode(_3_letters_code);
    var countryItem = getJqueryCountryBtnByCode2Letters(countryCode);
    onClickCountryFunction(countryItem);
}

function onClickCountryFunctionBy2LettersCode(_2_letters_code){
    var countryItem = getJqueryCountryBtnByCode2Letters(_2_letters_code);
    onClickCountryFunction(countryItem);
}

function updateBtnColor(countryCode3Letters, color){
    var _2LetterCountryCode = convert3to2LettersCode(countryCode3Letters);
    var countryItem = getJqueryCountryBtnByCode2Letters(_2LetterCountryCode);
    return countryItem.css("background-color",color);
}

function onClickCountryFunction(countryItem){
    var countryCode2Letters = countryItem.data("code");
    if(dataManager.isCountryAlreadySelected(countryCode2Letters)){
        countryItem.css("text-decoration","");
        dataManager.removeCountryCode(countryCode2Letters);
        countryItem.css("background-color", DEFAULT_MAP_ARAB_BACKGROUND_COLOR);
    } else{
        countryItem.css("text-decoration","underline");
        dataManager.insertCountryCode(countryCode2Letters);
    }
    console.log(dataManager.country_codes2letters);
}

getAll3LettersCodeArabCountry = function(){
    var countryCodes = $.map(countryCodeMap,function (item) {
        return item._3letter_code;
    });
    return countryCodes;
}

function isArabCountryCode3Letters(countryCode){
    var arabCountriesCode3Letters = getAll3LettersCodeArabCountry();
    for(var countryIndex in arabCountriesCode3Letters){
        var arabCountryCode = arabCountriesCode3Letters[countryIndex];
        if(arabCountryCode == countryCode){
            return true;
        }
    }
    return false;
}
function updateFilteringCountryCodeMap(list_country_codes){
    for(var countryCode in countryCodeMap){
        if(list_country_codes.indexOf(countryCode) == -1){
            delete countryCodeMap[countryCode];
        }
    }
}


function updateSocialLinkFields(){
    var fbOriginalURL = "https://www.facebook.com/sharer/sharer.php?u=$LINK&t=Health%20Awareness%20in%20the%20Arab%20World";
    var twitterOriginalUrl = "https://twitter.com/intent/tweet?source=$LINK&text=Health%20Awareness%20in%20the%20Arab%20World:%20$LINK";
    var emailOriginalUrl = "mailto:?subject=Health%20Awareness%20in%20the%20Arab%20World&body=Link:%20$LINK";
    var currentUrl = encodeURIComponent(window.location.href);
    var currentFbHref = fbOriginalURL.replace("$LINK", currentUrl);
    var currentTwitterHref = twitterOriginalUrl.replace("$LINK", currentUrl).replace("$LINK", currentUrl);
    var currentEmailHref = emailOriginalUrl.replace("$LINK", currentUrl);

    $("#facebookShareLink").attr("href",currentFbHref);
    $("#twitterShareLink").attr("href",currentTwitterHref);
    $("#emailShareLink").attr("href",currentEmailHref);

    $("#openGraphImg").attr("content", window.location.origin + window.location.pathname + "imgs/opengraph_sample.png");
    $("#openGraphUrl").attr("content", window.location.href);
}

function convert2to3LettersCode(_2letters_code){
    _2letters_code = _2letters_code.toUpperCase();
    try{
        return countryCodeMap[_2letters_code]._3letter_code;
    }catch (err){
        throw Error("2 Letter Code not found:" + _2letters_code);
    }

}

function convert2LettersCodeToName(_2letters_code){
    _2letters_code = _2letters_code.toUpperCase();
    try{
        return countryCodeMap[_2letters_code].name;
    }catch (err){
        throw Error("2 Letter Code not found:" + _2letters_code);
    }
}

function convert3to2LettersCode(_3letters_code){
    _3letters_code = _3letters_code.toUpperCase();
    for(var key in countryCodeMap){
        if(countryCodeMap[key]._3letter_code == _3letters_code){
            return key
        }
    }
    throw Error("3 Letter Code not found:" + _3letters_code);
}

