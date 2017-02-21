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
    this.locationsKeyToSubRegionsParameters = {};
    this.map = null;
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
                    currentInstance.locationsKeyToSubRegionsParameters[locationKey] = {
                        "latitude" : latlng.lat(),
                        "longitude" : latlng.lng(),
                        "radius" : 5000, //TODO: Redifine this hardcoded and wrong radius
                    };
                    console.log("Got:" + locationData.location2LetterCode);
                    deferred.resolve(locationData);
                } else {
                    currentInstance.handleGeoCodeError(locationData,deferred);
                }
            }
        });
    }
    this.getAndSaveCoodinatesFromLocationsDataUsingGoogleGeocoding = function (locationsData) {
        var deferreds = [];
        $.map(locationsData,function (locationData, index) {
            var deferred = new $.Deferred();
            deferreds.push(deferred);
            setTimeout(function(){currentInstance.triggerGeoCodeCall(locationData,deferred)}, DELAY_BETWEEN_GEOCODE_CALL*index)
        });
        Promise.all(deferreds).then(function(locationsDataList){
            console.log("DONE! Updating Colors");
            $.map(locationsDataList,function(locationData){console.log("Got geodata from: " + locationData.name)});
        });
    };
    this.getAndSaveCoodinatesFromLocationsData = function (locationsData) {
        $.map(locationsData,function (locationData, index) {
            var locationKey = getLocationKeyFromLocation2letter(locationData.location2LetterCode);
            var locationLatitude = getAttributeFromLocationKey(locationKey, "latitude");
            var locationLongitude= getAttributeFromLocationKey(locationKey, "longitude");
            var locationRadius = getAttributeFromLocationKey(locationKey, "radius");
            currentInstance.locationsKeyToSubRegionsParameters[locationKey] = {
                "latitude" : locationLatitude,
                "longitude" : locationLongitude,
                "radius" : locationRadius,
            }
            console.log("Got:" + locationData.location2LetterCode);
        });
    };
    this.initializeMap = function(){
        this.map = new GMaps({
            div: '#subregionMapContainer',
            lat: MAPS_CONFIGS[MAPS_CONFIG_SELECTION_KEY].defaultSubRegionCenterLat,
            lng: MAPS_CONFIGS[MAPS_CONFIG_SELECTION_KEY].defaultSubRegionCenterLng,
            width: '98%',
            height: LOCATION_HEIGHT_THRESHOLD - 60 + "px",
            zoom: MAPS_CONFIGS[MAPS_CONFIG_SELECTION_KEY].zoomLevel,
            zoomControl: false,
            zoomControlOpt: {
                style: 'SMALL',
                position: 'TOP_LEFT'
            },
            panControl: false
        });
    };

    this.init = function(){
        if(isSubregionMode()){
            currentInstance.initializeMap();
        } else{
            console.log("Ignore: SubRegion Map was not initiate");
        }
    };
    this.addCicleToMap = function(locationKey,locationsColors){
        var subRegionParameters = currentInstance.locationsKeyToSubRegionsParameters[locationKey];
        currentInstance.map.drawCircle({
            lat: subRegionParameters.latitude,
            lng: subRegionParameters.longitude,
            radius: subRegionParameters.radius,
            fillColor: locationsColors[locationKey],
            fillOpacity: 0.7,
            content: "test",
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
    }
    this.addScoreTexyToMap = function(locationKey){
        var subRegionParameters = currentInstance.locationsKeyToSubRegionsParameters[locationKey];
        var locationData = locationsDataManager.getLocationSelectedData(locationKey);
        if(!isNaN(locationData.score) && isFinite(locationData.score)){
            currentInstance.map.drawOverlay({
                lat: subRegionParameters.latitude,
                lng: subRegionParameters.longitude,
                content: '<div class="scoreInMap">' + "Score: " + scoreToPercentage(locationData.score) + '</div>',
                verticalAlign: 'middle'
            });
        }
    };

    this.updateSubRegionColors = function () {
        var locationsColors = locationsDataManager.getLocationsColors();
        currentInstance.map.removePolygons();
        currentInstance.map.removeOverlays();
        for(var locationKey in currentInstance.locationsKeyToSubRegionsParameters){
            currentInstance.addCicleToMap(locationKey, locationsColors);
            currentInstance.addScoreTexyToMap(locationKey);
        }
    };
    this.isEmptySubregionParameters = function(){
        return $.isEmptyObject(currentInstance.locationsKeyToSubRegionsParameters);
    }

    this.reCenterBasedOnSubregionsCoordinates = function(){
        var coordinatesArray = [];
        $.map(currentInstance.locationsKeyToSubRegionsParameters, function(subRegionParameters){
            coordinatesArray.push([subRegionParameters.latitude,subRegionParameters.longitude]);
        });
        var center = getCenterFromCoodinates(coordinatesArray);
        currentInstance.map.setCenter(center[0],center[1]);
    }

    this.updateData = function(){
        if(currentInstance.map){
            if(currentInstance.isEmptySubregionParameters()){
                var locationsData = dataManager.getSelectedLocationsData();
                currentInstance.getAndSaveCoodinatesFromLocationsData(locationsData);
                if(MAPS_CONFIGS[MAPS_CONFIG_SELECTION_KEY].autoCenterMap){
                    currentInstance.reCenterBasedOnSubregionsCoordinates();
                }
            }
            currentInstance.updateSubRegionColors();
        }
    };
    this.init();
}
