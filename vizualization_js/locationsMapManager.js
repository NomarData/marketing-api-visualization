DEFAULT_MAP_LOCATIONS_BACKGROUND_COLOR = "rgb(204, 204, 204)";
DEFAULT_MAP_NOT_ARAB_BACKGROUND_COLOR = "#FDFDFD";
DEFAULT_BORDER_COLOR = "#D1D1D1";

function datamapDataLayer(){
    var currentInstance = this;
    this.locationsDataInMap = {};
    this.init = function(){
        var scope = DATAMAPS_CONFIGS[DATAMAPS_CONFIG_KEY].scope;
        Datamap.prototype[scope + "Topo"].objects[scope].geometries.map(function(locationDatamapData){
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
        try {
            var locationDatamap_code = locationCodeMap[instance.location].datamaps_code;
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
    this.auxiliarDatamaps = [];
    this.scope = DATAMAPS_CONFIGS[DATAMAPS_CONFIG_KEY].scope;
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
            .center(DATAMAPS_CONFIGS[DATAMAPS_CONFIG_KEY].center)
            .rotate(DATAMAPS_CONFIGS[DATAMAPS_CONFIG_KEY].rotation)
            .scale(DATAMAPS_CONFIGS[DATAMAPS_CONFIG_KEY].scale)
            .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
        var path = d3.geo.path()
            .projection(projection);

        return {path: path, projection: projection};
    };

    this.setProjectionAuxiliarMap = function(element, options){
        var projection = d3.geo.equirectangular()
            .center(options.projectionParams.auxiliarCenter)
            .rotate(options.projectionParams.auxiliarRotation)
            .scale(options.projectionParams.auxiliarScale)
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
    this.createMainMap = function () {
        locationsDataDatamap = new datamapDataLayer();
        var elementContainer = $("#mainLocationsMapDiv");
        var datamap = new Datamap({
            element: elementContainer[0],
            scope: currentInstance.scope,
            width:  elementContainer.parent().parent().width() + "px",
            height:'400px',
            setProjection : currentInstance.setProjectionGeneralMap,
            geographyConfig : currentInstance.geographyConfig,
            fills: currentInstance.fills,
            data: currentInstance.data,
        });
        currentInstance.datamap = datamap;
    };
    this.createAuxiliarsMaps = function () {
        if("auxiliarMaps" in DATAMAPS_CONFIGS[DATAMAPS_CONFIG_KEY]){
            for(var auxiliarMapIndex in DATAMAPS_CONFIGS[DATAMAPS_CONFIG_KEY].auxiliarMaps){
                var containerId = "auxiliarMapDiv" + auxiliarMapIndex;
                $("#auxiliarsMapsDiv").append("<div id='" + containerId + "' class='auxiliarMapStyle'></div>");
                var auxiliarMapData = DATAMAPS_CONFIGS[DATAMAPS_CONFIG_KEY].auxiliarMaps[auxiliarMapIndex];
                var auxiliarDatamap = new Datamap({
                    projectionParams : auxiliarMapData,
                    element: document.getElementById(containerId),
                    scope: currentInstance.scope,
                    setProjection :  currentInstance.setProjectionAuxiliarMap,
                    geographyConfig : currentInstance.geographyConfig,
                    fills: currentInstance.fills,
                    data: currentInstance.data,
                    done: function(datamap) {
                        var saudiArabia = datamap.svg.selectAll(".datamaps-subunit.SAU");
                        saudiArabia.style("display","none");
                    }
                });
                currentInstance.auxiliarDatamaps.push(auxiliarDatamap);
            }
        }
    };

    this.buildLocationsMapManager = function () {
        currentInstance.createMainMap();
        currentInstance.createAuxiliarsMaps();
        currentInstance.initLocationBtns();
        currentInstance.updateData();
    }
    this.init = function(){
        currentInstance.buildLocationsMapManager();

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
        var locationData = locationsDataDatamap.getLocationSelectedData(locationDatamapsCode);
        var locationName = convertDatamapsCodeToName(locationDatamapsCode);
        var locationKey = convertDatamapsCodeToLocationKey(locationDatamapsCode);

        d3.select("#tooltip-locations").classed("hidden", false);
        var xPosition = d3.event.pageX + currentInstance.tooltipMargin;
        var yPosition = d3.event.pageY + currentInstance.tooltipMargin;
        d3.select("#tooltip-locations")
            .style("left", xPosition + "px")
            .style("top", yPosition + "px");

        d3.select("#tooltip-locations  #locationNameTooltip")
            .text(locationName);

        if(!dataManager.isLocationKeyAlreadySelected(locationKey)){
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
        $.map(currentInstance.auxiliarDatamaps, function(auxiliarDatamap){
            auxiliarDatamap.updateChoropleth(dataColor,{reset:true});
        });

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

        $("#fastLocationsSelectorBtn").click(function(){
            dataManager.selectFastLocationsBtn();
        });
        if("fastLocationSelection" in DATAMAPS_CONFIGS[DATAMAPS_CONFIG_KEY]){
            $("#fastLocationsSelectorBtn").show();
            $("#fastLocationsSelectorBtn").text(DATAMAPS_CONFIGS[DATAMAPS_CONFIG_KEY].fastLocationSelection.name);
        }
        $(".loader").fadeOut();
    };

    this.init();
}