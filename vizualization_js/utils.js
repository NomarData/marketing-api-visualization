/**
 * Created by maraujo on 11/21/16.
 */


function getFacebookPopulationInstanceByValue(value){
    for(var instanceIndex in fbInstancesDemographic){
        var instance = fbInstancesDemographic[instanceIndex];
        if(instance[""] == value.toString()){
            return instance;
        }
    }
    return null;
}

function getRectIDFromName(name){
    return name.replace(" ","_").replace(".","_")
}

function removeValueFromArray(array,valueToRemove){
    return $.grep(array, function(value) {
        return value != valueToRemove;
    });
}

function scoreToPercentage(score){
    return (score * 100).toFixed(1) + "%"
}



function buildBreakPoints(domainBreakpoints, colorRange){
    breakPointsColor = buildBreakPoints(domainLinear, colorRangeScale);
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

function getCenterFromCoodinates(data){
    if (!(data.length > 0)){
        return false;
    }

    var num_coords = data.length;

    var X = 0.0;
    var Y = 0.0;
    var Z = 0.0;

    for(i = 0; i < data.length; i++){
        var lat = data[i][0] * Math.PI / 180;
        var lon = data[i][1] * Math.PI / 180;

        var a = Math.cos(lat) * Math.cos(lon);
        var b = Math.cos(lat) * Math.sin(lon);
        var c = Math.sin(lat);

        X += a;
        Y += b;
        Z += c;
    }

    X /= num_coords;
    Y /= num_coords;
    Z /= num_coords;

    var lon = Math.atan2(Y, X);
    var hyp = Math.sqrt(X * X + Y * Y);
    var lat = Math.atan2(Z, hyp);

    var newX = (lat * 180 / Math.PI);
    var newY = (lon * 180 / Math.PI);

    return new Array(newX, newY);
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

function onClickLocationFunctionByLocationKey(locationKey) {
    //Of course this can be optimized, but not deal with this now.
    var locationDatamapCode = getLocationDatamapCodeFromLocationKey(locationKey);
    onClickLocationFunctionByDatamapCode(locationDatamapCode);
}

function onClickLocationFunctionByDatamapCode(locationDatamaps_code){
    var location2Letter = convertDatamapsCodeTo2LetterCode(locationDatamaps_code);
    var locationItem = locationsBtns.getJqueryLocationBtnByCode2Letters(location2Letter);
    onClickLocationFunction(locationItem);
}

function onClickLocationFunctionBy2LettersCode(_2_letters_code){
    var locationItem = locationsBtns.getJqueryLocationBtnByCode2Letters(_2_letters_code);
    onClickLocationFunction(locationItem);
}



function onClickLocationFunction(locationItem){
    var location2letters = locationItem.data("code");
    var locationKey = getLocationKeyFromLocation2letter(location2letters);
    if(dataManager.isLocationKeyAlreadySelected(locationKey)){
        dataManager.removeLocation2Letters(location2letters);
        locationItem.css("background-color", DEFAULT_MAP_LOCATIONS_BACKGROUND_COLOR);
    } else{
        dataManager.insertLocation2Letter(location2letters);
    }
}

function getAllDatamapsCodeInLocationMap(){
    var locationsDatamap_codes = $.map(locationCodeMap,function (item) {
        if("datamaps_code" in item ){
            return item.datamaps_code;
        }
    });
    return locationsDatamap_codes;
}

function isDatamapCodeInLocationMap(locationDatamapCode){
    var allDatamapsCodeinLocation = getAllDatamapsCodeInLocationMap();
    for(var locationIndex in allDatamapsCodeinLocation){
        var locationDatamapCodeInList = allDatamapsCodeinLocation[locationIndex];
        if(locationDatamapCodeInList == locationDatamapCode){
            return true;
        }
    }
    return false;
}
function filterJustLocationKeysFromLocationCodeMap(list_locations_codes){
    for(var locationKey in locationCodeMap){
        if(list_locations_codes.indexOf(locationKey) == -1){
            delete locationCodeMap[locationKey];
            console.log("Deleting")
        }
    }
}

function getLocationsDataGivenKeys(listLocationKeys){
    var listLocationsData = [];
    for(var keyIndex in listLocationKeys){
        var locationKey = listLocationKeys[keyIndex];
        if(locationKey in locationCodeMap){
            listLocationsData.push(locationCodeMap[locationKey]);
        }
    }
    return listLocationsData
}

function sortDictListGivenAttribute(list, attribute) {
    return list.sort(function(a, b) {
        var x = a[attribute]; var y = b[attribute];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}



function updateSocialLinkFields(){
    var SUBJECT = encodeURIComponent(SOCIAL_MEDIA_SUBJECT);
    var body = encodeURIComponent(EMAIL_BODY);
    var fbOriginalURL = "https://www.facebook.com/sharer/sharer.php?u=$LINK&t=" + SUBJECT;
    var twitterOriginalUrl = "https://twitter.com/intent/tweet?source=$LINK&text=" + SUBJECT+ ":%20$LINK";

    var emailOriginalUrl = "mailto:?subject=" + SUBJECT + "&body=" + body;
    var currentUrl = encodeURIComponent(window.location.href);
    var currentFbHref = fbOriginalURL.replace("$LINK", currentUrl);
    var currentTwitterHref = twitterOriginalUrl.replace("$LINK", currentUrl).replace("$LINK", currentUrl);
    var currentEmailHref = emailOriginalUrl.replace("LINK", currentUrl);

    $("#facebookShareLink").attr("href",currentFbHref);
    $("#twitterShareLink").attr("href",currentTwitterHref);
    $("#emailShareLink").attr("href",currentEmailHref);

    $("#openGraphImg").attr("content", window.location.origin + window.location.pathname + "imgs/opengraph_sample.png");
    $("#openGraphUrl").attr("content", window.location.href);
}

function convert2LetterCodeToDatamapsCode(_2letters_code){
    for(let key in locationCodeMap) {
        if (locationCodeMap[key]._2letters_code.toUpperCase() == _2letters_code.toUpperCase()) {
            return locationCodeMap[key].datamaps_code;
        }
    }
    Error("2 Letter Code not found:" + _2letters_code);
}
function convertDatamapsCodeTo2LetterCode(datamaps_code){
    try{
        var locationKey = convertDatamapsCodeToLocationKey(datamaps_code);
        return locationCodeMap[locationKey]._2letters_code;
    } catch (err){
        Error("Datamaps Code not found:" + datamaps_code);
    }
}

function convertDatamapsCodeToName(datamaps_code){
    try{
        var locationKey = convertDatamapsCodeToLocationKey(datamaps_code);
        return locationCodeMap[locationKey].name;
    }catch (err){
        throw Error("3 Letter Code not found:" + datamaps_code);
    }
}

function convert2LettersCodeToName(_2letters_code){
    for(let key in locationCodeMap) {
        if (locationCodeMap[key]._2letters_code.toUpperCase() == _2letters_code.toUpperCase()) {
            return locationCodeMap[key].name;
        }
    }
    throw Error("2 Letter Code not found:" + _2letters_code);
}

function convertDatamapsCodeToLocationKey(datamaps_code){
    for(var key in locationCodeMap){
        if(locationCodeMap[key].datamaps_code.toUpperCase() == datamaps_code.toUpperCase()){
            return key
        }
    }
    throw Error("3 Letter Code not found:" + datamaps_code);
}

function convertLocationsColorsToDatamapsColors(locationsColors){
    var datamapsColors = {};
    $.map(locationsColors,function(locationColor, locationKey){
        datamapsColors[getLocationDatamapCodeFromLocationKey(locationKey)] = locationColor;
    });
    return datamapsColors;
}

function datenum(v, date1904) {
    if(date1904) v+=1462;
    var epoch = Date.parse(v);
    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function  initApplicationStaticTexts() {
    $("#applicationTitle").text(APPLICATION_TITLE);
    $("#applicationDescription").text(APPLICATION_DESCRIPTION);
    $(".AwarenessScoreTitle").text(AWARENESS_SCORE_TITLE);
    $("#leftIconImg").attr("src",LEFT_ICON_PATH);
    $("#rightIconImg").attr("src",RIGHT_ICON_PATH);
    $("#favicon").attr("href", FAVICON_PATH);
    document.title = APPLICATION_TITLE;
}

function getLocation2letterFromLocationKey(locationKey){
    return locationCodeMap[locationKey]._2letters_code;
}

function getLocationNameFromLocationKey(locationKey){
    return locationCodeMap[locationKey].name;
}

function getLocationDatamapCodeFromLocationKey(locationKey){
    return locationCodeMap[locationKey].datamaps_code;
}

function getLocationKeyFromLocation2letter(location2letter){
    for(var key in locationCodeMap){
        if(locationCodeMap[key]._2letters_code.toUpperCase() == location2letter.toUpperCase()){
            return key
        }
    }
    throw Error("2 Letter Code not found:" + location2letter);
}

function getAllKeysInLocationMap(){
    return Object.keys(locationCodeMap);
}