/**
 * Created by maraujo on 2/19/17.
 */
$.fn.triggerSVGEvent = function(eventName) {
    var event = document.createEvent('SVGEvents');
    event.initEvent(eventName,true,true);
    this[0].dispatchEvent(event);
    return $(this);
};

function SubRegionMap(){
    var currentInstance = this;
    this.locationsKeyToCoordinates = {};
    this.map;
    this.handleGeoCodeError = function(locationData, deferred){
        console.log("Error in Google GeoCode API:" + status);
        if (status == "OVER_QUERY_LIMIT") {
            console.log("Calling again in (ms):" + DELAY_BETWEEN_GEOCODE_CALL);
            setTimeout(function(){currentInstance.triggerGeoCodeCall(locationData,deferred)}, DELAY_BETWEEN_GEOCODE_CALL)
        } else{
            deferred.reject();
        }
    }
    this.triggerGeoCodeCall = function(locationData, deferred){
        GMaps.geocode({
            address: locationData.name,
            country: "United States",
            callback: function (results, status) {
                if (status == 'OK') {
                    var latlng = results[0].geometry.location;
                    var locationKey = getLocationKeyFromLocation2letter(locationData.location2LetterCode);
                    currentInstance.locationsKeyToCoordinates[locationKey] = [latlng.lat(), latlng.lng()];
                    console.log("Got:" + locationData.location2LetterCode);
                    deferred.resolve(locationData);
                } else {
                    currentInstance.handleGeoCodeError(locationData,deferred);
                }
            }
        });
    }
    this.getPutMarkerAndSaveCoodinatesFromLocationsData = function (locationsData) {
        var deferreds = [];
        $.map(locationsData,function (locationData, index) {
            var deferred = new $.Deferred();
            deferreds.push(deferred);
            setTimeout(function(){currentInstance.triggerGeoCodeCall(locationData,deferred)}, DELAY_BETWEEN_GEOCODE_CALL*index)
        });
        Promise.all(deferreds).then(function(locationsDataList){
            console.log("DONE! Updating Colors");
            $.map(locationsDataList,function(locationData){console.log("Got geodata from: " + locationData.name)});
            currentInstance.updateSubRegionColors();
        });
    };
    this.initializeMap = function(){
        var data = [[-23.6212, -46.7178],[-23.5577,-46.5435]];
        var center = getCenterFromCoodinates(data);
        this.map = new GMaps({
            div: '#subregionMapContainer',
            lat: center[0],
            lng: center[1],
            width: '98%',
            height: LOCATION_HEIGHT_THRESHOLD - 60 + "px",
            zoom: 11,
            zoomControl: false,
            zoomControlOpt: {
                style: 'SMALL',
                position: 'TOP_LEFT'
            },
            panControl: false
        });
    }

    this.init = function(){
        currentInstance.initializeMap();
    };
    this.updateSubRegionColors = function () {
        var locationsColors = locationsDataManager.getLocationsColors();
        currentInstance.map.removePolygons();
        $.map(currentInstance.locationsKeyToCoordinates,function(coordinate, locationKey){
            console.log("Cordinates:" + coordinate + " Color:" + locationsColors[locationKey] );
            if(locationKey == "Michigan"){
                coordinate[0] = -23.6212;
                coordinate[1] = -46.7178;
            }
            if(locationKey == "Minnesota"){
                coordinate[0] = -23.5577;
                coordinate[1] = -46.5435;
            }
            currentInstance.map.drawCircle({
                lat: coordinate[0],
                lng: coordinate[1],
                radius: 5000,
                fillColor: locationsColors[locationKey],
                fillOpacity: 0.7,
                strokeWeight: 1,
                mouseout: function(){
                    locationsDataManager.mouseoutTooltip();
                },
                mousemove: function(e){
                    d3.event = e.ya;
                    locationsDataManager.mousemoveTooltip(locationKey);
                },
                click : function (e) {
                    d3.event = e.ya;
                    onClickLocationFunctionByLocationKey(locationKey);
                }
            });
        });
    }
    this.updateData = function(){
        if($.isEmptyObject(currentInstance.locationsKeyToCoordinates)){
            var locationsData = dataManager.getSelectedLocationsData();
            locationsData = [locationsData["Michigan"], locationsData["Minnesota"]];
            currentInstance.getPutMarkerAndSaveCoodinatesFromLocationsData(locationsData);
        } else{
            currentInstance.updateSubRegionColors();
        }
    };
    this.init();
}
