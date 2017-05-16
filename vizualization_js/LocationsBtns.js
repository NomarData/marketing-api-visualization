/**
 * Created by maraujo on 2/20/17.
 */
function LocationsBtns(){
    var currentInstance = this;
    this.locationBtnsListContainer = null;
    this.locationsPopulationSparklinesSvg = null;
    this.locationsPopulationSparklinesAxis = null;
    this.locationsPopulationSparklinesScale = null;
    this.generateNewScale = function(max){
        return d3.scale.linear().domain([0, max]).range([0, MAX_WIDTH_LOCATIONS_BAR_CHART]);
    }
    this.generateNewXAxis = function(scale,max){
        var ticks = [0, max];
        return d3.svg.axis().orient("bottom").tickFormat(function(d) {
            return convertIntegerToReadable(d).replace("-","");
        }).tickPadding(0).scale(scale).tickValues(ticks);
    }
    this.updatePopulationSparkline = function(){
        var locationsData = locationsDataManager.getAllLocationsData();
        var maximumSize = 0;
        //Get Largest Population
        $.map(locationsData, function(locationData){
            if(locationData.audienceCoverage > maximumSize){
                maximumSize = locationData.audienceCoverage
            }
        });
        var svgPadding = 10;
        if(!currentInstance.locationsPopulationSparklinesAxis) {
            var axisSvg = d3.select(".btnsHeader").append("svg:svg").attr("width", "110%").attr("height", 18);
            //Draw axis
            var xScale = currentInstance.generateNewScale(maximumSize);
            // define the y axis
            var xAxis = currentInstance.generateNewXAxis(xScale,maximumSize);
            // draw y axis with labels and move in from the size by the amount of padding
            axisSvg.append("g").attr("class", "populationSparklineAxis").attr("transform", "translate("+ svgPadding +",0)").call(xAxis);
            currentInstance.locationsPopulationSparklinesAxis = xAxis;
            currentInstance.locationsPopulationSparklinesScale = xScale;
            currentInstance.locationsPopulationSparklinesSvg = axisSvg;
        }else{
            $(".populationSparklineAxis").remove();
            var newScale = currentInstance.generateNewScale(maximumSize);
            var newAxis = currentInstance.generateNewXAxis(newScale, maximumSize);
            currentInstance.locationsPopulationSparklinesSvg.append("g").attr("class", "populationSparklineAxis").attr("transform", "translate("+ svgPadding +",0)").call(newAxis);
        }

        //Clean the sparklines
        currentInstance.cleanPopulationSparklines();

        //Compute Sparklines width
        if(dataManager.isAnyLocationSelected()){
            $.map(locationsData, function(locationData){
                var location2letters = locationData.location2LetterCode;
                var sparklineContainer = currentInstance.getJqueryPopulationSparklineByCode2Letters(location2letters);
                sparklineContainer.text(" ");
                sparklineContainer.width((locationData.audienceCoverage * MAX_WIDTH_LOCATIONS_BAR_CHART) / maximumSize);
                sparklineContainer.height(HEIGHT_LOCATIONS_BAR_CHART);
            });
        }

    };
    this.setScrollbarIfNecessary = function () {
        if(currentInstance.locationBtnsListContainer.height() > LOCATION_HEIGHT_THRESHOLD){
            currentInstance.locationBtnsListContainer.css("height", LOCATION_HEIGHT_THRESHOLD + "px");
            currentInstance.locationBtnsListContainer.addClass("locationBtnsListOverflow");
        }
    };
    this.createLocationBtnsAndPopulationSparkline = function () {
        var locationBtnList = externalDataManager.updateLocationList(fbInstancesDemographic);
        currentInstance.locationBtnsListContainer = $("#locationBtnList");
        currentInstance.locationBtnsListContainer.empty();
        currentInstance.locationBtnsListContainer.append("<div class='btnsHeader'><div class='btnsHeaderTitle'>Facebook Audience</div></div>");
        for(var locationIndex in locationBtnList){
            var locationInfo = locationBtnList[locationIndex];
            currentInstance.locationBtnsListContainer.append("<div class='row'>" +
                "<span class='locationItem btn btn-location ' data-code=\""+ locationInfo._2letters_code +"\">" + locationInfo.name + "</span>" +
                "<span class='populationSparkline' data-code=\""+ locationInfo._2letters_code +"\"></span>" +
                "</div>");
        }
    };
    this.initLocationsBtns = function(){
        currentInstance.createLocationBtnsAndPopulationSparkline();
        currentInstance.setScrollbarIfNecessary();
        currentInstance.addClickFunctionToLocationBtns();
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
        if("fastLocationSelection" in MAPS_CONFIGS[MAPS_CONFIG_SELECTION_KEY]){
            $("#fastLocationsSelectorBtn").show();
            $("#fastLocationsSelectorBtn").text(MAPS_CONFIGS[MAPS_CONFIG_SELECTION_KEY].fastLocationSelection.name);
        }
        $(".loader").fadeOut();
    };

    this.addClickFunctionToLocationBtns = function(){
        $(".locationItem").click(function(){
            onClickLocationFunction($(this));
        });
    };

    this.addTooltipToLocationBtns = function(){
        d3.selectAll('.locationItem').on('mousemove',function () {
            var locationBtn = $(this);
            var location2letters = locationBtn.data("code");
            var locationKey = getLocationKeyFromLocation2letter(location2letters);
            locationsDataManager.mousemoveTooltip(locationKey);
        });

        d3.selectAll('.locationItem').on('mouseout',function () {
            locationsDataManager.mouseoutTooltip();
        });
    };

    this.updateData = function(){
        var locationsColors = locationsDataManager.getLocationsColors();
        var locationsKeys = getAllKeysInLocationMap();
        //Update Btn Colors
        for(var locationKeyIndex in locationsKeys){
            var locationKey = locationsKeys[locationKeyIndex];
            currentInstance.updateBtnColor(locationKey, locationsColors[locationKey]);
            currentInstance.updateSparklineColor(locationKey, locationsColors[locationKey]);
        }
        currentInstance.updatePopulationSparkline();
    };

    this.updateBtnColor =function (locationKey, color){
        var location2letters = getLocation2letterFromLocationKey(locationKey);
        var locationItem = currentInstance.getJqueryLocationBtnByCode2Letters(location2letters);
        locationItem.css("background-color",color);
        if(color == DEFAULT_MAP_LOCATIONS_BACKGROUND_COLOR){
            locationItem.css("text-decoration","");
        } else {
            locationItem.css("text-decoration","underline");
        }
    };

    this.updateSparklineColor =function (locationKey, color){
        var location2letters = getLocation2letterFromLocationKey(locationKey);
        var locationItem = currentInstance.getJqueryPopulationSparklineByCode2Letters(location2letters);
        locationItem.css("background-color",color);
        if(color == DEFAULT_MAP_LOCATIONS_BACKGROUND_COLOR){
            locationItem.css("text-decoration","");
        } else {
            locationItem.css("text-decoration","underline");
        }
    };

    this.getJqueryLocationBtnByCode2Letters = function(location2Letters){
        return $(".locationItem[data-code='"+ location2Letters +"']");
    };
    this.getJqueryPopulationSparklineByCode2Letters = function(location2Letters){
        return $(".populationSparkline[data-code='"+ location2Letters +"']");
    };

    this.cleanPopulationSparklines = function () {
        $(".populationSparkline").width(0);
        $(".populationSparkline").height(0);
    };


    this.initLocationsBtns();
}
