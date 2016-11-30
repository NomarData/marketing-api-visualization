function CountriesDataDatamap(){
    var currentInstance = this;
    this.countries = {};

    Datamap.prototype.worldTopo.objects.world.geometries.map(function(country){
        currentInstance.countries[country.id] = {
                jewelAudience: 0,
                healthAudience: 0,
            }
        });

    this.empty = function(){
        for(var country in currentInstance.countries){
            currentInstance.countries[country].jewelAudience = 0;
            currentInstance.countries[country].healthAudience = 0;
        }
    }

    this.addInstance = function(instance){
        if(getInstancePolarity(instance) == 1){
            currentInstance.countries[instance.country].healthAudience += instance.audience;
        } else {
            currentInstance.countries[instance.country].jewelAudience += instance.audience;
        }
    }

    this.addInstances = function(instances){
        for(var i in instances){
            currentInstance.addInstance(instances[i]);
        }
    }

    this.getCountryInclination = function(country){
        return (currentInstance.countries[country].healthAudience - currentInstance.countries[country].jewelAudience) / (currentInstance.countries[country].healthAudience + currentInstance.countries[country].jewelAudience);
    }
    this.getCountryAudience = function(country){
        return  (currentInstance.countries[country].healthAudience + currentInstance.countries[country].jewelAudience);
    }

    this.getDataMapColor = function(){
        var dataColor = {};
        for(var country in currentInstance.countries){
            if(currentInstance.getCountryAudience(country) > 0){
                var inclination = currentInstance.getCountryInclination(country);
                dataColor[country] = getGreenOrRedColorByInclination(inclination);
            }
        }
        return dataColor;
    }
}

countriesDataDatamap = new CountriesDataDatamap();


function emptyCountriesDatamap(){

}

function arabLeagueMap(){
    var currentInstace = this;
    this.setProjection = function(element){
        var projection = d3.geo.equirectangular()
            .center([24, 24])
            .rotate([0, 0])
            .scale(500)
            .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
        var path = d3.geo.path()
            .projection(projection);

        return {path: path, projection: projection};
    }

    this.geographyConfig = {
        dataUrl: null, //if not null, datamaps will fetch the map JSON (currently only supports topojson)
            hideAntarctica: true,
            borderWidth: 1,
            borderOpacity: 1,
            borderColor: '#FDFDFD',
            responsive: true,
            popupTemplate: function(geography, data) { //this function should just return a string
            return '<div class="hoverinfo"><strong>' + geography.properties.name + '</strong></div>';
        },
        popupOnHover: true, //disable the popup while hovering
            highlightOnHover: true,
            highlightFillColor: 'rgb(210, 210, 210, 0.2)',
            highlightBorderColor: 'rgba(0, 0, 0, 0.2)',
            highlightBorderWidth: 3,
            highlightBorderOpacity: 1
    }

    this.fills = {
        defaultFill: "#EEEEEE",
    };

    this.updateRandomColors = function(){
        this.datamap.updateChoropleth({
            'ZAF': getRandomGreenOrRedColor(),
            'ZWE': getRandomGreenOrRedColor(),
            'NGA': getRandomGreenOrRedColor(),
            'MOZ': getRandomGreenOrRedColor(),
            'MDG': getRandomGreenOrRedColor(),
            'EGY': getRandomGreenOrRedColor(),
            'TZA': getRandomGreenOrRedColor(),
            'LBY': getRandomGreenOrRedColor(),
            'DZA': getRandomGreenOrRedColor(),
            'SSD': getRandomGreenOrRedColor(),
            'SOM': getRandomGreenOrRedColor(),
            'GIB': getRandomGreenOrRedColor(),
            'AGO': getRandomGreenOrRedColor()
        });
    }

    this.data = {}

    this.init = function(){
        var datamap = new Datamap({
            element: document.getElementById("arabLeagueMapDiv"),
            scope: 'world',
            width:  "700px",
            height:'400px',
            setProjection : currentInstace.setProjection,
            geographyConfig : currentInstace.geographyConfig,
            fills: currentInstace.fills,
            data: currentInstace.data,
        });
        currentInstace.datamap = datamap;
        this.updateData();
    }


    this.updateData = function(){
        var instances = getSelectedInstances();
        countriesDataDatamap.empty();
        countriesDataDatamap.addInstances(instances);
        var dataColor = countriesDataDatamap.getDataMapColor();
        currentInstace.datamap.updateChoropleth(dataColor);
    }

    this.giveLife = function(){
        var datamap = currentInstace.datamap;

        window.setInterval(function() {
            // debugger
            currentInstance.updateRandomColors();
            datamap.bubbles([
                {name: 'Bubble 1', latitude: 21.32, longitude: -7.32, radius: 45*Math.random(), fillKey: 'gt500'},
                {name: 'Bubble 2', latitude: 12.32, longitude: 27.32, radius: 25*Math.random(), fillKey: 'eq0'},
                {name: 'Bubble 3', latitude: 0.32, longitude: 23.32, radius: 35*Math.random(), fillKey: 'lt25'},
                {name: 'Bubble 4', latitude: -31.32, longitude: 23.32, radius: 55*Math.random(), fillKey: 'eq50'},
            ], {
                popupTemplate: function(geo, data) {
                    return "<div class='hoverinfo'>Bubble for " + data.name + "</div>";
                }
            });
        }, 2000);
    }

}