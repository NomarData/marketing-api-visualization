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
        for(var country in currentInstance.countries) {
            currentInstance.countries[country] = {
                jewelAudience: 0,
                healthAudience: 0
            }
        }
    }

    this.addInstance = function(instance){
        var country_code = instance.country_code;
        if(country_code.length == 2){
            country_code = convert2to3LettersCode(country_code);
        }
        try {
            if (getInstancePolarity(instance) == 1) currentInstance.countries[country_code].healthAudience += instance.audience;
            else currentInstance.countries[country_code].jewelAudience += instance.audience;
        } catch (err){
            if(country_code == "BHR") console.log("Ignore Bahrein for now");
            else throw Error("Country code not found:" + country_code);
        }


    };

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
        var country_codes = getAll3LettersCodeArabCountry();
        for(var _3_letters_country_code in country_codes){ TODO
            if(currentInstance.getCountryAudience(_3_letters_country_code) > 0){
                dataColor[_3_letters_country_code] = "#EEE";
            }
        }

        for(var selectedCountryIndex in NODES_SELECTED.country_codes){
            var _2_letters_country_code = NODES_SELECTED.country_codes[selectedCountryIndex];
            var _3_letters_country_code = convert2to3LettersCode(_2_letters_country_code);

            if(currentInstance.getCountryAudience(_3_letters_country_code) > 0){
                var inclination = currentInstance.getCountryInclination(_3_letters_country_code);
                dataColor[_3_letters_country_code] = getGreenOrRedColorByInclination(inclination);
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
            .center([30, 24])
            .rotate([0, 0])
            .scale(350)
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
            highlightFillColor: 'rgb(210, 210, 210, 1)',
            highlightBorderColor: 'rgba(0, 0, 0, 0.2)',
            highlightBorderWidth: 3,
            highlightBorderOpacity: 1,
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
        var elementContainer = $("#arabLeagueMapDiv");
        var datamap = new Datamap({
            element: elementContainer[0],
            scope: 'world',
            width:  elementContainer.parent().parent().width() + "px",
            height:'400px',
            setProjection : currentInstace.setProjection,
            geographyConfig : currentInstace.geographyConfig,
            fills: currentInstace.fills,
            data: currentInstace.data,
            done: function(datamap) {
                    datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
                    var country_code = convert3to2LettersCode(geography.id);
                    var countryItem = $("ul[data-code='"+ country_code +"']");
                    onClickCountryFunction(countryItem);
                });
            }
        });
        currentInstace.datamap = datamap;
        this.updateData();
    }

    this.selectCountryInMap = function(){
        var countryItem = $(".countryItem")
    }


    this.updateData = function(){
        var instances = NODES_SELECTED.getSelectedInstances();
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