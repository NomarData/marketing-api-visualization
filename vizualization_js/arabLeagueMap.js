DEFAULT_MAP_ARAB_BACKGROUND_COLOR = "rgb(204, 204, 204)";
DEFAULT_MAP_NOT_ARAB_BACKGROUND_COLOR = "#FDFDFD";
DEFAULT_BORDER_COLOR = "#D1D1D1";

function datamapDataLayer(){
    var currentInstance = this;
    this.countries = {};
    this.init = function(){
        Datamap.prototype.worldTopo.objects.world.geometries.map(function(country){
            currentInstance.countries[country.id] = {
                rightAudience: 0,
                leftAudience: 0,
            }
        });
    };

    this.empty = function(){
        for(var country in currentInstance.countries) {
            currentInstance.countries[country] = {
                rightAudience: 0,
                leftAudience: 0
            }
        }
    };

    this.addInstance = function(instance){
        var countryCode_3letter = convert2LetterCodeToDatamapsCode(instance.location);
        try {
            if (getInstancePolarity(instance) == 1) currentInstance.countries[countryCode_3letter].leftAudience += instance.audience;
            else currentInstance.countries[countryCode_3letter].rightAudience += instance.audience;
        } catch (err){
            throw Error("Country code not found:" + countryCode_3letter);
        }


    };

    this.addInstances = function(instances){
        for(var i in instances){
            currentInstance.addInstance(instances[i]);
        }
    };

    this.getCountryScore = function(country3Letters){
        return currentInstance.getCountrySelectedData(country3Letters)["score"];
    };
    this.getCountrySelectedData = function(country3Letters){
        var leftAudience = currentInstance.countries[country3Letters].leftAudience;
        var rightAudience = currentInstance.countries[country3Letters].rightAudience;
        var audienceCoverage = currentInstance.getCountryAudience(country3Letters);
        return {
                "leftAudience" : leftAudience,
                "rightAudience" : rightAudience,
                "audienceCoverage" : audienceCoverage,
                "score" : (leftAudience - rightAudience) / audienceCoverage,
                "name" : convertDatamapsCodeToName(country3Letters)
            }
    };
    this.getCountryAudience = function(country){
        var _2letterCode = convertDatamapsCodeToLocationKey(country);
        return dataManager.getSumSelectedFacebookPopulationByCountry(_2letterCode);
    };

    this.getDataMapColor = function(){
        var dataColor = {};
        var countryCodes = getAllDatamapsCodeInLocationMap();
        var countryCodeIndex;
        var countryCode;
        //Paint all arab countries as unselected
        for(countryCodeIndex in countryCodes){
            countryCode = countryCodes[countryCodeIndex];
            dataColor[countryCode] = DEFAULT_MAP_ARAB_BACKGROUND_COLOR;
        }

        //Paint all selected countries as selected
        for(var selectedCountryIndex in dataManager.selectedLocations_2letters){
            var _2_letters_country_code = dataManager.selectedLocations_2letters[selectedCountryIndex];
            var _3_letters_country_code = convert2LetterCodeToDatamapsCode(_2_letters_country_code);

            if(currentInstance.getCountryAudience(_3_letters_country_code) > 0){
                var score = currentInstance.getCountryScore(_3_letters_country_code);
                dataColor[_3_letters_country_code] = getGreenOrRedColorByScore(score);
            }
        }

        //Update Btn Colors
        for(countryCodeIndex in countryCodes){
            countryCode = countryCodes[countryCodeIndex];
            updateBtnColor(countryCode, dataColor[countryCode]);
        }

        return dataColor;
    };
    this.init();
}

function arabLeagueDatamap(){
    var currentInstance = this;
    this.data = {};
    this.datamap = null;
    this.qatarBahreinDatamap = null;
    this.tooltipMargin = 10;
    this.geographyConfig = {
        dataUrl: null, //if not null, datamaps will fetch the map JSON (currently only supports topojson)
        hideAntarctica: true,
        borderWidth: 1,
        borderOpacity: 1,
        borderColor: DEFAULT_BORDER_COLOR,
        responsive: true,
        popupTemplate: function(geography, data) { //this function should just return a string
            currentInstance.removeHoverIfNotArabCountry(geography);
            if(isDatamapCodeInLocationMap(geography.id)){
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
    };

    this.fills = {
        defaultFill: "rgb(247, 247, 247)",
    };

    this.setProjectionGeneralMap = function(element){
        var projection = d3.geo.equirectangular()
            .center([25, 24])
            .rotate([0, 0])
            .scale(425)
            .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
        var path = d3.geo.path()
            .projection(projection);

        return {path: path, projection: projection};
    };

    this.setProjectionQatarMap = function(element){
        var projection = d3.geo.equirectangular()
            .center([51.2, 25.4])
            .rotate([0, 0])
            .scale(2400)
            .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
        var path = d3.geo.path()
            .projection(projection);

        return {path: path, projection: projection};
    }

    this.removeHoverIfNotArabCountry = function(hoverCountry){
        var countryCode3Letters = hoverCountry.id;
        var hoverCountryPath = $(".datamaps-subunit." + countryCode3Letters);
        if(isDatamapCodeInLocationMap(countryCode3Letters)){
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

    this.init = function(){
        countriesDataDatamap = new datamapDataLayer();

        var elementContainer = $("#arabLeagueMapDiv");
        var datamap = new Datamap({
            element: elementContainer[0],
            scope: 'world',
            width:  elementContainer.parent().parent().width() + "px",
            height:'400px',
            setProjection : currentInstance.setProjectionGeneralMap,
            geographyConfig : currentInstance.geographyConfig,
            fills: currentInstance.fills,
            data: currentInstance.data,
        });
        var qatarBahreinDatamap = new Datamap({
            element: document.getElementById('qatarBahreinMapDiv'),
            scope: 'world',
            width:  "75px",
            height:'75px',
            setProjection :  currentInstance.setProjectionQatarMap,
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
        currentInstance.initLocationBtns();
        currentInstance.updateData();
    };
    this.addClickFunctionToLocationsInMap = function(){
        d3.selectAll('.datamaps-subunit').on('click', function(geography) {
            var countryCode3Letters = geography.id;
            if(isDatamapCodeInLocationMap(countryCode3Letters)){
                onClickCountryFunctionBy3LettersCode(countryCode3Letters);
                // alert("Click disabled in the map for now, please use the list on the side.");
            } else{
                alert("Only arab countries supported");
            }

        });
    };
    this.addClickFunctionToLocationBtns = function(){
        $(".locationItem").click(function(){
            onClickCountryFunction($(this));
        });
    };
    this.addTooltipToLocationPath =  function(){
        d3.selectAll('.datamaps-subunit').on('mousemove', function(geography) {
            currentInstance.removeHoverIfNotArabCountry(geography);
            var datamaps_code = geography.id;
            if(isDatamapCodeInLocationMap(datamaps_code)){
                currentInstance.mousemoveTooltip(datamaps_code);
            }
        });

        d3.selectAll('.datamaps-subunit').on('mouseout', function(geography) {
            var datamaps_code = geography.id;
            if(isDatamapCodeInLocationMap(datamaps_code)){
                currentInstance.mouseoutTooltip();
            }
        });
    };

    this.addTooltipToLocationBtns =  function(){
        d3.selectAll('.locationItem').on('mousemove',function () {
            var locationBtn = $(this);
            var countryCode2Letters = locationBtn.data("code");
            var datamaps_code = convert2LetterCodeToDatamapsCode(countryCode2Letters);
            currentInstance.mousemoveTooltip(datamaps_code);
        });

        d3.selectAll('.locationItem').on('mouseout',function () {
            currentInstance.mouseoutTooltip();
        });

    };

    this.mousemoveTooltip = function(locationDatamapsCode){

        var location2Lettercode = convertDatamapsCodeToLocationKey(locationDatamapsCode);

        var locationData = countriesDataDatamap.getCountrySelectedData(locationDatamapsCode);
        var locationName = convert2LettersCodeToName(location2Lettercode);

        d3.select("#tooltip-locations").classed("hidden", false);
        var xPosition = d3.event.pageX + currentInstance.tooltipMargin;
        var yPosition = d3.event.pageY + currentInstance.tooltipMargin;
        d3.select("#tooltip-locations")
            .style("left", xPosition + "px")
            .style("top", yPosition + "px");

        d3.select("#tooltip-locations  #countryNameTooltip")
            .text(locationName);

        if(!dataManager.isLocationAlreadySelected(location2Lettercode)){
            d3.select("#locationDataTooltipContainer").classed("hidden",true);

        } else {
            d3.select("#locationDataTooltipContainer").classed("hidden",false);
            d3.select("#tooltip-locations #locationScoreTooltip").text(scoreToPercentage(locationData.score));
            d3.select("#tooltip-locations  #locationFacebookCoverage")
                .text(convertIntegerToReadable(locationData.audienceCoverage));

            d3.select("#tooltip-locations  #leftAudienceCountryTooltip")
                .text(convertIntegerToReadable(locationData.leftAudience));

            d3.select("#tooltip-locations  #rightAudienceCountryTooltip")
                .text(convertIntegerToReadable(locationData.rightAudience));
        }
    };

    this.mouseoutTooltip = function(d){
        d3.select("#tooltip-locations").classed("hidden", true);
    };

    this.updateData = function(){
        var instances = dataManager.getSelectedInstances();
        countriesDataDatamap.empty();
        countriesDataDatamap.addInstances(instances);
        var dataColor = countriesDataDatamap.getDataMapColor();
        currentInstance.datamap.updateChoropleth(dataColor,{reset:true});
        currentInstance.qatarBahreinDatamap.updateChoropleth(dataColor,{reset:true});
    };

    this.initLocationBtns = function () {
        externalDataManager.updateLocationList(fbInstancesDemographic);
        currentInstance.addClickFunctionToLocationsInMap();
        currentInstance.addClickFunctionToLocationBtns();
        currentInstance.addTooltipToLocationPath();
        currentInstance.addTooltipToLocationBtns();

        //Select All and Deselect All Behavior
        $("#selectedAllCountriesBtn").click(function(){
            dataManager.selectAllCountries();

        });
        $("#unSelectedAllCountriesBtn").click(function(){
            dataManager.deselectAllCountries();
        });

        $("#gccCountriesBtn").click(function(){
            dataManager.selectGCCCountries();
        });

        $(".loader").fadeOut();
    };

    this.init();
}