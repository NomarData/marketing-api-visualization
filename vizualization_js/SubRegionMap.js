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
    this._2LetterCodeToCordinates = {};
    this.map;
    this.getPutMarkerAndSaveCoodinatesFromLocationsData = function (locationsData) {
        var deferreds = [];
        $.map(locationsData,function (locationData) {
            var deferred = new $.Deferred();
            deferreds.push(deferred);
            GMaps.geocode({
                address: locationData.name,
                country: "United States",
                callback: function (results, status) {
                    if (status == 'OK') {
                        var latlng = results[0].geometry.location;
                        currentInstance._2LetterCodeToCordinates[locationData.location2LetterCode] = [latlng.lat(), latlng.lng()];
                        console.log("Got:" + locationData.location2LetterCode);
                        deferred.resolve();
                    } else {
                        console.log("Error in Google GeoCode API:" + status);
                        deferred.reject();
                    }
                }
            });
        });
        Promise.all(deferreds).then(function(){
            console.log("DONE! Updating Colors");
            console.log(currentInstance._2LetterCodeToCordinates["MI"]);
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
        var locationsColors = locationsDataDatamap.getDataMapColor();
        currentInstance.map.removePolygons();
        $.map(currentInstance._2LetterCodeToCordinates,function(coordinate, key){
            console.log("Cordinates:" + coordinate + " Color:" + locationsColors[key] );
            if(key == "MI"){
                coordinate[0] = -23.6212;
                coordinate[1] = -46.7178;
            }
            if(key == "MN"){
                coordinate[0] = -23.5577;
                coordinate[1] = -46.5435;
            }
            currentInstance.map.drawCircle({
                lat: coordinate[0],
                lng: coordinate[1],
                radius: 5000,
                fillColor: locationsColors[key],
                fillOpacity: 0.7,
                strokeWeight: 1,
                mouseout: function(){
                    arabMap.mouseoutTooltip();
                },
                mousemove: function(e){
                    d3.event = e.ya;
                    var datamapCode = convert2LetterCodeToDatamapsCode(key);
                    arabMap.mousemoveTooltip(datamapCode);
                },
                click : function (e) {
                    d3.event = e.ya;
                    var datamapCode = convert2LetterCodeToDatamapsCode(key);
                    onClickLocationFunctionByDatamapCode(datamapCode);
                }
            });
        });
    }
    this.updateData = function(){
        if($.isEmptyObject(currentInstance._2LetterCodeToCordinates)){
            var locationsData = dataManager.getSelectedLocationsData();
            locationsData = [locationsData["MI"], locationsData["MN"]];
            currentInstance.getPutMarkerAndSaveCoodinatesFromLocationsData(locationsData);
        } else{
            currentInstance.updateSubRegionColors();
        }
    };
    this.init();
}
