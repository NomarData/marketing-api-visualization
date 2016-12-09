/**
 * Created by matheus on 09/12/16.
 */
function BtnsTopicsSelectors(){
    var currentInstance = this;

    this.setDefault = function(){
        $(".btn-interest[data-interest='"+ NODES_SELECTED.selectedLuxury +"']").addClass("btn-selected"); //UpdateLuxury
        $(".btn-interest[data-interest='"+ NODES_SELECTED.selectedHealth +"']").addClass("btn-selected"); //UpdateHealth
    };
    this.updateData = function(){
        $(".btn-selected").removeClass("btn-selected"); //Remove all selected
        $(".btn-interest[data-interest='"+ NODES_SELECTED.selectedLuxury +"']").addClass("btn-selected"); //UpdateLuxury
        $(".btn-interest[data-interest='"+ NODES_SELECTED.selectedHealth +"']").addClass("btn-selected"); //UpdateHealth
    };

    this.setSelectedByBtnsClick = function(){
        $(".btn-interest").click(function(){
            var btnElement = $(this);
            if(btnElement.hasClass("btn-luxury")){
                NODES_SELECTED.updateSelectedLuxury(btnElement.data("interest"));
                currentInstance.updateData();
            } else if(btnElement.hasClass("btn-health")){
                NODES_SELECTED.updateSelectedHealth(btnElement.data("interest"));
                currentInstance.updateData();
            } else {
                throw Error("Should be luxury or health");
            }
        });
    };
    this.init = function(){
        var luxuryBtnsContainer = $("#btnsLuxuryContainer");
        var healthBtnsContainer = $("#btnsHealthContainer");

        for(var luxuryIndex in luxuryTopics){
            var luxuryTopic = luxuryTopics[luxuryIndex];
            var newBtn = $("<span class='btn btn-interest btn-luxury' data-interest='" + luxuryTopic + "'>" + luxuryTopic + "</span>");
            luxuryBtnsContainer.append(newBtn);
        }
        for(var healthIndex in healthTopics){
            var healthTopic = healthTopics[healthIndex];
            var newBtn = $("<span class='btn btn-interest btn-health' data-interest='" + healthTopic + "'>" + healthTopic + "</span>");
            healthBtnsContainer.append(newBtn);
        }
        currentInstance.setSelectedByBtnsClick();
        currentInstance.setDefault();
    }
}