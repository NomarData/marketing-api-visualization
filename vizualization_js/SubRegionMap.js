/**
 * Created by maraujo on 2/19/17.
 */
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
        this.map = new GMaps({
            div: '#subregionMapContainer',
            lat: USA_CENTER_COORDINATES[1],
            lng: USA_CENTER_COORDINATES[0],
            width: '100%',
            height: LOCATION_HEIGHT_THRESHOLD + "px",
            zoom: 4,
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
            currentInstance.map.drawCircle({
                lat: coordinate[0],
                lng: coordinate[1],
                radius: 200000,
                fillColor: locationsColors[key],
                fillOpacity: 0.7,
                strokeWeight: 1,
                click: function(e){
                    alert('You are inside 5 radius of Stonehenge')
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
