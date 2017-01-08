function InclinationScore(){
    var currentInstance = this;
    this.value = null;
    this.element = $("#inclinationScore");
    this.init = function(){
        this.updateData();
    }
    this.updateData = function(){
        var averageInclination = dataManager.getAverageSelectedInclination();
        currentInstance.value = averageInclination.average;
        currentInstance.element.css("color",getGreenOrRedColorByInclination(averageInclination.average));
        currentInstance.element.html(averageInclination.average.toFixed(2));
    }

    this.init();
}