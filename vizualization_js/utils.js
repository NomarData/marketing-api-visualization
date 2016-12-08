/**
 * Created by maraujo on 11/21/16.
 */
function checkAllDefined(...variables){
    $.map(variables,function(variable){
        if (typeof(variable)==='undefined') throw new Error("A variable is not defined at checkAllDefined");
    });
}


function generateUUID(a){return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,generateUUID)}

function isDemographicCategoryName(name){
    demographicCategoriesNames = ["age_range","gender","language","exclude_expats","scholarity"]
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
    if(NODES_SELECTED.isCountryAlreadySelected(countryCode2Letters)){
        countryItem.css("text-decoration","none");
        NODES_SELECTED.removeCountryCode(countryCode2Letters);
        countryItem.css("background-color", DEFAULT_MAP_ARAB_BACKGROUND_COLOR);
    } else{
        countryItem.css("text-decoration","underline");
        NODES_SELECTED.insertCountryCode(countryCode2Letters);
    }
    console.log(NODES_SELECTED.country_codes);
}

function getAll3LettersCodeArabCountry(){
    var countryCodes = $.map(countryCodeMap,function (item) {
        return item._3letter_code;
    });
    countryCodes = removeValueFromArray(countryCodes,"BHR") //removing bahrein for now
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

countryCodeMap = {
    "DZ"  : {
        "name" : "Algeria",
        "_3letter_code" : "DZA"
    },
    // "BH"  : {
    //     "name" : "Bahrain",
    //     "_3letter_code" : "BHR"
    // },
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

