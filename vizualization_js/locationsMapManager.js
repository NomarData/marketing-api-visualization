DEFAULT_MAP_LOCATIONS_BACKGROUND_COLOR = "rgb(204, 204, 204)";
DEFAULT_MAP_NOT_ARAB_BACKGROUND_COLOR = "#FDFDFD";
DEFAULT_BORDER_COLOR = "#D1D1D1";

function datamapDataLayer(){
    var currentInstance = this;
    this.locationsDataInMap = {};
    this.init = function(){
        Datamap.prototype.worldTopo.objects.world.geometries.map(function(locationDatamapData){
            currentInstance.locationsDataInMap[locationDatamapData.id] = {
                rightAudience: 0,
                leftAudience: 0,
            }
        });
    };

    this.empty = function(){
        for(var location in currentInstance.locationsDataInMap) {
            currentInstance.locationsDataInMap[location] = {
                rightAudience: 0,
                leftAudience: 0
            }
        }
    };

    this.addInstanceAudienceToLocationDataInMap = function(instance){
        var locationDatamap_code = convert2LetterCodeToDatamapsCode(instance.location);
        try {
            if (getInstancePolarity(instance) == 1) currentInstance.locationsDataInMap[locationDatamap_code].leftAudience += instance.audience;
            else currentInstance.locationsDataInMap[locationDatamap_code].rightAudience += instance.audience;
        } catch (err){
            throw Error("Location datamap_code not found:" + locationDatamap_code);
        }

    };

    this.addInstances = function(instances){
        for(var i in instances){
            currentInstance.addInstanceAudienceToLocationDataInMap(instances[i]);
        }
    };

    this.getLocationScore = function(locationDatamap_code){
        return currentInstance.getLocationSelectedData(locationDatamap_code)["score"];
    };
    this.getLocationSelectedData = function(locationDatamap_code){
        var leftAudience = currentInstance.locationsDataInMap[locationDatamap_code].leftAudience;
        var rightAudience = currentInstance.locationsDataInMap[locationDatamap_code].rightAudience;
        var audienceCoverage = currentInstance.getLocationAudience(locationDatamap_code);
        return {
                "leftAudience" : leftAudience,
                "rightAudience" : rightAudience,
                "audienceCoverage" : audienceCoverage,
                "score" : (leftAudience - rightAudience) / audienceCoverage,
                "name" : convertDatamapsCodeToName(locationDatamap_code)
            }
    };
    this.getLocationAudience = function(locationDatamap_code){
        var _2letterCode = convertDatamapsCodeToLocationKey(locationDatamap_code);
        return dataManager.getSumSelectedFacebookPopulationByLocation2letters(_2letterCode);
    };

    this.getDataMapColor = function(){
        var dataColor = {};
        var locationsDatamap_codes = getAllDatamapsCodeInLocationMap();
        var locationDatamap_codesIndex;
        var locationDatamap_code;
        //Paint all locations as unselected
        for(locationDatamap_codesIndex in locationsDatamap_codes){
            locationDatamap_code = locationsDatamap_codes[locationDatamap_codesIndex];
            dataColor[locationDatamap_code] = DEFAULT_MAP_LOCATIONS_BACKGROUND_COLOR;
        }

        //Paint all selected locations as selected
        for(var selectedLocationIndex in dataManager.selectedLocations_2letters){
            var location2Letters = dataManager.selectedLocations_2letters[selectedLocationIndex];
            var locationDatamap_code = convert2LetterCodeToDatamapsCode(location2Letters);

            if(currentInstance.getLocationAudience(locationDatamap_code) > 0){
                var score = currentInstance.getLocationScore(locationDatamap_code);
                dataColor[locationDatamap_code] = getGreenOrRedColorByScore(score);
            }
        }

        //Update Btn Colors
        for(locationDatamap_codesIndex in locationsDatamap_codes){
            locationDatamap_code = locationsDatamap_codes[locationDatamap_codesIndex];
            updateBtnColor(locationDatamap_code, dataColor[locationDatamap_code]);
        }

        return dataColor;
    };
    this.init();
}

function locationsDatamap(){
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
            currentInstance.removeHoverIfNotEnabledLocation(geography);
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

    this.removeHoverIfNotEnabledLocation = function(hoverLocation){
        var locationDatamap_code = hoverLocation.id;
        var hoverLocationPath = $(".datamaps-subunit." + locationDatamap_code);
        if(isDatamapCodeInLocationMap(locationDatamap_code)){
            hoverLocationPath.css("stroke-width","8px");
            hoverLocationPath.css("stroke","rgba(140, 140, 140,0.5)");
            hoverLocationPath.css("cursor","pointer");
            hoverLocationPath.mouseout(function () {
                hoverLocationPath.css("stroke-width","1px");
                hoverLocationPath.css("stroke",DEFAULT_BORDER_COLOR);
                hoverLocationPath.css("cursor","");
            })
        }
    };

    this.init = function(){
        locationsDataDatamap = new datamapDataLayer();

        var elementContainer = $("#mainLocationsMapDiv");
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
            var locationDatamap_code = geography.id;
            if(isDatamapCodeInLocationMap(locationDatamap_code)){
                onClickLocationFunctionByDatamapCode(locationDatamap_code);
                // alert("Click disabled in the map for now, please use the list on the side.");
            } else{
                alert("Location not supported");
            }

        });
    };
    this.addClickFunctionToLocationBtns = function(){
        $(".locationItem").click(function(){
            onClickLocationFunction($(this));
        });
    };
    this.addTooltipToLocationPath =  function(){
        d3.selectAll('.datamaps-subunit').on('mousemove', function(geography) {
            currentInstance.removeHoverIfNotEnabledLocation(geography);
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
            var location2letters = locationBtn.data("code");
            var datamaps_code = convert2LetterCodeToDatamapsCode(location2letters);
            currentInstance.mousemoveTooltip(datamaps_code);
        });

        d3.selectAll('.locationItem').on('mouseout',function () {
            currentInstance.mouseoutTooltip();
        });

    };

    this.mousemoveTooltip = function(locationDatamapsCode){

        var location2Lettercode = convertDatamapsCodeToLocationKey(locationDatamapsCode);

        var locationData = locationsDataDatamap.getLocationSelectedData(locationDatamapsCode);
        var locationName = convert2LettersCodeToName(location2Lettercode);

        d3.select("#tooltip-locations").classed("hidden", false);
        var xPosition = d3.event.pageX + currentInstance.tooltipMargin;
        var yPosition = d3.event.pageY + currentInstance.tooltipMargin;
        d3.select("#tooltip-locations")
            .style("left", xPosition + "px")
            .style("top", yPosition + "px");

        d3.select("#tooltip-locations  #locationNameTooltip")
            .text(locationName);

        if(!dataManager.isLocationAlreadySelected(location2Lettercode)){
            d3.select("#locationDataTooltipContainer").classed("hidden",true);

        } else {
            d3.select("#locationDataTooltipContainer").classed("hidden",false);
            d3.select("#tooltip-locations #locationScoreTooltip").text(scoreToPercentage(locationData.score));
            d3.select("#tooltip-locations  #locationFacebookCoverage")
                .text(convertIntegerToReadable(locationData.audienceCoverage));

            d3.select("#tooltip-locations  #leftAudienceLocationTooltip")
                .text(convertIntegerToReadable(locationData.leftAudience));

            d3.select("#tooltip-locations  #rightAudienceLocationTooltip")
                .text(convertIntegerToReadable(locationData.rightAudience));
        }
    };

    this.mouseoutTooltip = function(d){
        d3.select("#tooltip-locations").classed("hidden", true);
    };

    this.updateData = function(){
        var instances = dataManager.getSelectedInstances();
        locationsDataDatamap.empty();
        locationsDataDatamap.addInstances(instances);
        var dataColor = locationsDataDatamap.getDataMapColor();
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
        $("#selectedAllLocationsBtn").click(function(){
            dataManager.selectAllLocations();

        });
        $("#unselectedAllLocationsBtn").click(function(){
            dataManager.deselectAllLocations();
        });

        $("#gccCountriesBtn").click(function(){
            dataManager.selectGCCCountries();
        });

        $(".loader").fadeOut();
    };

    this.init();
}