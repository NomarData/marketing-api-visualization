function LocationsMapDatamap(){
    var currentInstance = this;
    this.data = {};
    this.datamap = null;
    this.auxiliarDatamaps = [];
    this.scope = DATAMAPS_CONFIGS[DATAMAPS_CONFIG_KEY].scope;
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
        currentInstance.initMouseInteractionInMap();
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

    this.addTooltipToLocationPath =  function(){
        d3.selectAll('.datamaps-subunit').on('mousemove', function(geography) {
            currentInstance.removeHoverIfNotEnabledLocation(geography);
            var datamaps_code = geography.id;
            if(isDatamapCodeInLocationMap(datamaps_code)){
                let locationKey = convertDatamapsCodeToLocationKey(datamaps_code);
                locationsDataManager.mousemoveTooltip(locationKey);
            }
        });

        d3.selectAll('.datamaps-subunit').on('mouseout', function(geography) {
            var datamaps_code = geography.id;
            if(isDatamapCodeInLocationMap(datamaps_code)){
                locationsDataManager.mouseoutTooltip();
            }
        });
    };

    this.mainMapGivenLocationsColors = function(datamapsColor){
        currentInstance.datamap.updateChoropleth(datamapsColor,{reset:true});
    };

    this.auxiliarMapGivenLocationsColors = function(datamapsColor){
        $.map(currentInstance.auxiliarDatamaps, function(auxiliarDatamap){
            auxiliarDatamap.updateChoropleth(datamapsColor,{reset:true});
        });
    };

    this.updateAllMapsColors = function(){
        var locationsColors = locationsDataManager.getLocationsColors();
        var datamapsColor = convertLocationsColorsToDatamapsColors(locationsColors);
        currentInstance.mainMapGivenLocationsColors(datamapsColor);
        currentInstance.auxiliarMapGivenLocationsColors(datamapsColor);
    };

    this.updateData = function(){
        currentInstance.updateAllMapsColors()
    };

    this.initMouseInteractionInMap = function(){
        currentInstance.addClickFunctionToLocationsInMap();
        currentInstance.addTooltipToLocationPath();
    };

    this.init();
}