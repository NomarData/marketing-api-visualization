DEFAULT_MAP_ARAB_BACKGROUND_COLOR = "rgb(204, 204, 204)";
DEFAULT_MAP_NOT_ARAB_BACKGROUND_COLOR = "#FDFDFD";
DEFAULT_BORDER_COLOR = "#D1D1D1";


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
    };

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
    };

    this.getCountryInclination = function(country3Letters){
        return currentInstance.getCountrySelectedData(country3Letters)["score"];
    };
    this.getCountrySelectedData = function(country3Letters){
        var healthAudience = currentInstance.countries[country3Letters].healthAudience;
        var jewelAudience = currentInstance.countries[country3Letters].jewelAudience;
        var audienceCoverage = currentInstance.getCountryAudience(country3Letters);
        return {
                "healthAudience" : healthAudience,
                "jewelAudience" : jewelAudience,
                "audienceCoverage" : audienceCoverage,
                "score" : (healthAudience - jewelAudience) / audienceCoverage
            }
    };
    this.getCountryAudience = function(country){
        // var audience =  (currentInstance.countries[country].healthAudience + currentInstance.countries[country].jewelAudience);
        var _2letterCode = convert3to2LettersCode(country);
        return dataManager.getSumSelectedFacebookPopulationByCountry(_2letterCode);
    };

    this.getDataMapColor = function(){
        var dataColor = {};
        var countryCodes = getAll3LettersCodeArabCountry();
        var countryCodeIndex;
        var countryCode;
        //Paint all arab countries as unselected
        for(countryCodeIndex in countryCodes){
            countryCode = countryCodes[countryCodeIndex];
            dataColor[countryCode] = DEFAULT_MAP_ARAB_BACKGROUND_COLOR;
        }

        //Paint all selected countries as selected
        for(var selectedCountryIndex in dataManager.country_codes2letters){
            var _2_letters_country_code = dataManager.country_codes2letters[selectedCountryIndex];
            var _3_letters_country_code = convert2to3LettersCode(_2_letters_country_code);

            if(currentInstance.getCountryAudience(_3_letters_country_code) > 0){
                var inclination = currentInstance.getCountryInclination(_3_letters_country_code);
                dataColor[_3_letters_country_code] = getGreenOrRedColorByInclination(inclination);
            }
        }

        //Update Btn Colors
        for(countryCodeIndex in countryCodes){
            countryCode = countryCodes[countryCodeIndex];
            updateBtnColor(countryCode, dataColor[countryCode]);
        }


        return dataColor;
    }
}

countriesDataDatamap = new CountriesDataDatamap(); //Put this in a better place


function emptyCountriesDatamap(){

}

function arabLeagueMap(){
    var currentInstance = this;
    this.datamap = null;
    this.qatarBahreinDatamap = null;
    this.tooltipMargin = 10;
    this.setProjection = function(element){
        var projection = d3.geo.equirectangular()
            .center([25, 24])
            .rotate([0, 0])
            .scale(425)
            .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
        var path = d3.geo.path()
            .projection(projection);

        return {path: path, projection: projection};
    };

    this.removeHoverIfNotArabCountry = function(hoverCountry){
        var countryCode3Letters = hoverCountry.id;
        var hoverCountryPath = $(".datamaps-subunit." + countryCode3Letters);
        if(isArabCountryCode3Letters(countryCode3Letters)){
            hoverCountryPath.css("stroke-width","8px");
            hoverCountryPath.css("stroke","rgba(140, 140, 140,0.5)");
            hoverCountryPath.css("cursor","pointer");
            hoverCountryPath.mouseout(function () {
                hoverCountryPath.css("stroke-width","1px");
                hoverCountryPath.css("stroke",DEFAULT_BORDER_COLOR);
                hoverCountryPath.css("cursor","");
            })
        }
    };

    this.geographyConfig = {
        dataUrl: null, //if not null, datamaps will fetch the map JSON (currently only supports topojson)
            hideAntarctica: true,
            borderWidth: 1,
            borderOpacity: 1,
            borderColor: DEFAULT_BORDER_COLOR,
            responsive: true,
            popupTemplate: function(geography, data) { //this function should just return a string
                currentInstance.removeHoverIfNotArabCountry(geography);
                if(isArabCountryCode3Letters(geography.id)){
                    return '<div class="hoverinfo"><strong>' + geography.properties.name + '</strong></div>';
                } else{
                    return null;
                }

        },
        popupOnHover: false, //disable the popup while hovering
        highlightOnHover: false,
        highlightFillColor: 'rgb(0, 0, 0, 0)',
        highlightBorderColor: 'rgba(0, 0, 0, 0.2)',
        highlightBorderWidth: 2,
        highlightBorderOpacity: 1,
    }

    this.fills = {
        defaultFill: "rgb(247, 247, 247)",
    };

    this.updateRandomColors = function(){

    };

    this.data = {};

    this.init = function(){
        var elementContainer = $("#arabLeagueMapDiv");
        var datamap = new Datamap({
            element: elementContainer[0],
            scope: 'world',
            width:  elementContainer.parent().parent().width() + "px",
            height:'400px',
            setProjection : currentInstance.setProjection,
            geographyConfig : currentInstance.geographyConfig,
            fills: currentInstance.fills,
            data: currentInstance.data,
        });
        var qatarBahreinDatamap = new Datamap({
            element: document.getElementById('qatarBahreinMapDiv'),
            scope: 'world',
            width:  "75px",
            height:'75px',
            setProjection : function(element){
                var projection = d3.geo.equirectangular()
                    .center([51.2, 25.4])
                    .rotate([0, 0])
                    .scale(2400)
                    .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
                var path = d3.geo.path()
                    .projection(projection);

                return {path: path, projection: projection};
            },
            geographyConfig : currentInstance.geographyConfig,
            fills: currentInstance.fills,
            data: currentInstance.data,
            done: function(datamap) {
                var saudiArabia = datamap.svg.selectAll(".datamaps-subunit.SAU");
                saudiArabia.style("display","none");
            }
        });
        currentInstance.datamap = datamap;
        currentInstance.qatarBahreinDatamap = qatarBahreinDatamap;
        currentInstance.initCountriesBtns();
        currentInstance.updateData();
    };
    this.addClickFunctionToCountries = function(){
        d3.selectAll('.datamaps-subunit').on('click', function(geography) {
            var countryCode3Letters = geography.id;
            if(isArabCountryCode3Letters(countryCode3Letters)){
                onClickCountryFunctionBy3LettersCode(geography.id);
                // alert("Click disabled in the map for now, please use the list on the side.");
            } else{
                alert("Only arab countries supported");
            }

        });
    };
    this.addClickFunctionToCountriesBtns = function(){
        $(".countryItem").click(function(){
            onClickCountryFunction($(this));
        });
    };
    this.addTooltipToCountriesPath =  function(){
        d3.selectAll('.datamaps-subunit').on('mousemove', function(geography) {
            currentInstance.removeHoverIfNotArabCountry(geography);
            var countryCode3Letters = geography.id;
            if(isArabCountryCode3Letters(countryCode3Letters)){
                currentInstance.mousemoveTooltip(countryCode3Letters);
            }
        });

        d3.selectAll('.datamaps-subunit').on('mouseout', function(geography) {
            var countryCode3Letters = geography.id;
            if(isArabCountryCode3Letters(countryCode3Letters)){
                currentInstance.mouseoutTooltip();
            }
        });
    };

    this.addTooltipToCountriesBtns =  function(){
        d3.selectAll('.countryItem').on('mousemove',function () {
            var countryBtn = $(this);
            var countryCode2Letters = countryBtn.data("code");
            var countryCode3Letters = convert2to3LettersCode(countryCode2Letters);
            currentInstance.mousemoveTooltip(countryCode3Letters);
        });

        d3.selectAll('.countryItem').on('mouseout',function () {
            currentInstance.mouseoutTooltip();
        });

    };

    this.mousemoveTooltip = function(countryCode3Letters){
        dataManager.isCountryAlreadySelected()
        var code2Letters = convert3to2LettersCode(countryCode3Letters);

        var countryData = countriesDataDatamap.getCountrySelectedData(countryCode3Letters);
        var countryName = convert2LettersCodeToName(code2Letters);

        d3.select("#tooltip-countries").classed("hidden", false);
        var xPosition = d3.event.pageX + currentInstance.tooltipMargin;
        var yPosition = d3.event.pageY + currentInstance.tooltipMargin;
        d3.select("#tooltip-countries")
            .style("left", xPosition + "px")
            .style("top", yPosition + "px");

        d3.select("#tooltip-countries  #countryNameTooltip")
            .text(countryName);

        if(!dataManager.isCountryAlreadySelected(code2Letters)){
            d3.select("#countryDataTooltipContainer").classed("hidden",true);

        } else {
            d3.select("#countryDataTooltipContainer").classed("hidden",false);
            d3.select("#tooltip-countries #countryScoreTooltip").text(countryData.score.toFixed(2));
            d3.select("#tooltip-countries  #countryFacebookCoverage")
                .text(convertIntegerToReadable(countryData.audienceCoverage));

            d3.select("#tooltip-countries  #healthAudienceCountryTooltip")
                .text(convertIntegerToReadable(countryData.healthAudience));

            d3.select("#tooltip-countries  #luxuryAudienceCountryTooltip")
                .text(convertIntegerToReadable(countryData.jewelAudience));
        }




    };
    this.mouseoutTooltip = function(d){
        d3.select("#tooltip-countries").classed("hidden", true);
    };

    this.selectCountryInMap = function(){
        var countryItem = $(".countryItem")
    };

    this.updateCountriesColor = function (dataColor){
        var countriesPaths = $(".datamaps-subunit");
        for(var countryCode in dataColor){
            var countryPath = countriesPaths.filter("." + countryCode);
            countryPath.css("fill",dataColor[countryCode]);
        }
    };

    this.getDataField = function (dataColor) {
        var dataField = {};
        for(var countryCode in dataColor){
            dataField[countryCode] = {"fillKey" : countryCode};
        }
        return dataField
    };


    this.updateData = function(){
        var instances = dataManager.getSelectedInstances();
        countriesDataDatamap.empty();
        countriesDataDatamap.addInstances(instances);
        var dataColor = countriesDataDatamap.getDataMapColor();
        // currentInstace.updateCountriesColor(dataColor);
        // var dataField = currentInstace.getDataField(dataColor);
        // currentInstace.datamap.fills = dataColor;
        currentInstance.datamap.updateChoropleth(dataColor,{reset:true});
        currentInstance.qatarBahreinDatamap.updateChoropleth(dataColor,{reset:true});
    }

    this.giveLife = function(){
        var datamap = currentInstance.datamap;

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
    };

    this.initCountriesBtns = function () {
        externalDataManager.updateCountriesList(facebookPopulation);
        currentInstance.addClickFunctionToCountries();
        currentInstance.addClickFunctionToCountriesBtns();
        currentInstance.addTooltipToCountriesPath();
        currentInstance.addTooltipToCountriesBtns();

        //Select All and Deselect All Behavior
        $("#selectedAllCountriesBtn").click(function(){
            dataManager.selectAllCountries();
        })
        $("#unSelectedAllCountriesBtn").click(function(){
            dataManager.deselectAllCountries();
        })

        $(".loader").fadeOut();
    }

    this.init();
}