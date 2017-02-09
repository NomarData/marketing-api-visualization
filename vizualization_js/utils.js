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

function buildAndInitVisualComponents(){
    console.log("Building visual components");
    treemapManager = new TreemapManager();
    luxuriousHealthBar = new stackedHorizontalBar();
    GeneralScore = new GeneralScore();
    arabMap = new locationsDatamap();
    sharebleLink = new SharebleLink();
    btnsTopicsSelectors = new BtnsTopicsSelectors();
    historyDataSelector = new HistoryDataSelector();
    findingsFinder = new FindingFinder();
    downloadReport = new DownloadReport();
    console.log("Builded visual components");
    sharebleLink.init();
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

function getJqueryLocationBtnByCode2Letters(location2Letters){

    return $("div[data-code='"+ location2Letters +"']");
}

function onClickLocationFunctionByDatamapCode(locationDatamaps_code){
    var location2Letter = convertDatamapsCodeTo2LetterCode(locationDatamaps_code);
    var locationItem = getJqueryLocationBtnByCode2Letters(location2Letter);
    onClickLocationFunction(locationItem);
}

function onClickLocationFunctionBy2LettersCode(_2_letters_code){
    var locationItem = getJqueryLocationBtnByCode2Letters(_2_letters_code);
    onClickLocationFunction(locationItem);
}

function updateBtnColor(locationDatamaps_code, color){
    var location2letters = convertDatamapsCodeTo2LetterCode(locationDatamaps_code);
    var locationItem = getJqueryLocationBtnByCode2Letters(location2letters);
    locationItem.css("background-color",color);
    if(color == DEFAULT_MAP_LOCATIONS_BACKGROUND_COLOR){
        locationItem.css("text-decoration","");
    } else {
        locationItem.css("text-decoration","underline");
    }
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
        return item.datamaps_code;
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

function getLocationKeyFromLocation2letter(location2letter){
    for(var key in locationCodeMap){
        if(locationCodeMap[key]._2letters_code.toUpperCase() == location2letter.toUpperCase()){
            return key
        }
    }
    throw Error("2 Letter Code not found:" + location2letter);
}