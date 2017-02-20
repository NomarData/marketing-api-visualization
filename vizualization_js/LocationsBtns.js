/**
 * Created by maraujo on 2/20/17.
 */
function LocationsBtns(){
    var currentInstance = this;
    this.initLocationsBtns = function(){
        externalDataManager.updateLocationList(fbInstancesDemographic);

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
        }
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


    this.getJqueryLocationBtnByCode2Letters = function(location2Letters){
        return $("div[data-code='"+ location2Letters +"']");
    }


    this.initLocationsBtns();
}
