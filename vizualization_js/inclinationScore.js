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
        currentInstance.element.css("background",getGreenOrRedColorByInclination(averageInclination.average));
        currentInstance.element.html(scoreToPercentage(averageInclination.average));
    }

    this.init();
}