function GeneralScore(){
    var currentInstance = this;
    this.value = null;
    this.element = $("#GeneralScore");
    this.init = function(){
        this.updateData();
    }
    this.updateData = function(){
        var averageScore = dataManager.getAverageSelectedScore();
        currentInstance.value = averageScore.average;
        currentInstance.element.css("background",getGreenOrRedColorByScore(averageScore.average));
        currentInstance.element.html(scoreToPercentage(averageScore.average));
    }

    this.init();
}