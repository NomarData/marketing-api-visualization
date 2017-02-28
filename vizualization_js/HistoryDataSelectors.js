/**
 * Created by maraujo on 1/30/17.
 */
function HistoryDataSelector(){
    var currentInstance = this;
    this.init = function(){
        currentInstance.loadHistoryFile();
    };
    this.loadHistoryFile = function () {
        externalDataManager.getHistoricMapDataPromise().done(function(d){
            let lastUpdateDate = d.history[d.history.length -1].date;
            $("#lastUpdateText").text(lastUpdateDate);
            for(var historyIndex in d.history){
                var historyItem = d.history[historyIndex];
                if(historyItem.date != undefined && historyItem.path != undefined){
                    var dateText = d.history[historyIndex].date;
                    var datePath = d.history[historyIndex].path;
                    $("#selectDownloadDate").append("<option class='dateOption' data-path=" + datePath + "  value=" + historyIndex + ">" + dateText + "</option>");
                }
            }
        });
    }

    this.clickOnDate = function (value) {
        var optionIndex = parseInt(value);
        var optionElement = $("#selectDownloadDate option")[optionIndex];
        var option$ = $(optionElement);
        var newPath = option$.data("path");
        CURRENT_DATA_PATH = ROOT_DATA_PATH + newPath + "/";
        dataManager.updateDatasetAndGetPromise();
    }

    this.init();
}