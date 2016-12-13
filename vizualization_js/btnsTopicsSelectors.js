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
        if(NODES_SELECTED.selectedLuxury){
            $(".btn-interest[data-interest='"+ NODES_SELECTED.selectedLuxury +"']").addClass("btn-selected"); //UpdateLuxury
        }
        if(NODES_SELECTED.selectedHealth){
            $(".btn-interest[data-interest='"+ NODES_SELECTED.selectedHealth +"']").addClass("btn-selected"); //UpdateHealth
        }
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
        var luxuryBtnsContainerHeader = $("#btnsLuxuryContainerHeader");
        var healthBtnsContainer = $("#btnsHealthContainer");
        var healthBtnsContainerHeader = $("#btnsHealthContainerHeader");
        var newBtn;

        for(var luxuryIndex in luxuryTopics){
            var luxuryTopic = luxuryTopics[luxuryIndex];
            newBtn = $("<span class='btn btn-interest btn-luxury ' data-interest='" + luxuryTopic + "'>" + luxuryTopic + "</span>");
            if(luxuryTopic == "luxury"){
                newBtn.addClass("btn-interest-header");
                luxuryBtnsContainerHeader.append(newBtn);
            } else {
                luxuryBtnsContainer.append(newBtn);
            }
        }
        for(var healthIndex in healthTopics){
            var healthTopic = healthTopics[healthIndex];
            newBtn = $("<span class='btn btn-interest btn-health' data-interest='" + healthTopic + "'>" + healthTopic + "</span>");
            if(healthTopic == "health"){
                newBtn.addClass("btn-interest-header");
                healthBtnsContainerHeader.append(newBtn);
            } else{
                newBtn = $("<span class='btn btn-interest btn-health' data-interest='" + healthTopic + "'>" + healthTopic + "</span>");
                healthBtnsContainer.append(newBtn);
            }
        }
        currentInstance.setSelectedByBtnsClick();
        currentInstance.setDefault();

        //Select All and Deselect All Behavior
        $("#selectedAllCountriesBtn").click(function(){
            NODES_SELECTED.selectAllCountries();
        })
        $("#unSelectedAllCountriesBtn").click(function(){
            NODES_SELECTED.deselectAllCountries();
        })
    }
}