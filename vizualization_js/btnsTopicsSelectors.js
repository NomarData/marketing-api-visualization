/**
 * Created by matheus on 09/12/16.
 */
function BtnsTopicsSelectors(){
    var currentInstance = this;

    this.setDefault = function(){
        $(".btn-interest[data-interest='"+ dataManager.selectedRightTopic +"']").addClass("btn-selected"); //UpdateLuxury
        $(".btn-interest[data-interest='"+ dataManager.selectedLeftTopic +"']").addClass("btn-selected"); //UpdateHealth
    };
    this.updateData = function(){
        $(".btn-selected").removeClass("btn-selected"); //Remove all selected
        if(dataManager.selectedRightTopic){
            $(".btn-interest[data-interest='"+ dataManager.selectedRightTopic +"']").addClass("btn-selected"); //UpdateLuxury
        }
        if(dataManager.selectedLeftTopic){
            $(".btn-interest[data-interest='"+ dataManager.selectedLeftTopic +"']").addClass("btn-selected"); //UpdateHealth
        }
    };

    this.setSelectedByBtnsClick = function(){
        $(".btn-interest").click(function(){
            var btnElement = $(this);
            if(btnElement.hasClass("btn-luxury")){
                dataManager.flipSelectedRightTopic(btnElement.data("interest"));
                currentInstance.updateData();
            } else if(btnElement.hasClass("btn-health")){
                dataManager.flipSelectedLeftTopic(btnElement.data("interest"));
                currentInstance.updateData();
            } else {
                throw Error("Should be luxury or health");
            }
        });
    };
    this.init = function(){

        currentInstance.addTopicsBtns(rightTopics, RIGHT_TOPIC);
        currentInstance.addTopicsBtns(leftTopics, LEFT_TOPIC);

        currentInstance.setSelectedByBtnsClick();
        currentInstance.setDefault();


    }

    this.addTopicsBtns = function(listTopicsNames, topicType){
        var luxuryBtnsContainer = $("#btnsRightTopicContainer");
        var luxuryBtnsContainerHeader = $("#btnsRightTopicContainerHeader");
        var healthBtnsContainer = $("#btnsLeftTopicContainer");
        var healthBtnsContainerHeader = $("#btnsLeftTopicContainerHeader");
        for(var topicIndex in listTopicsNames){
            var topicName = listTopicsNames[topicIndex];
            if(topicType == RIGHT_TOPIC){
                var newBtn = $("<span class='btn btn-interest btn-luxury ' data-interest='" + topicName + "'>" + currentInstance.convertBtnTopicName(topicName) + "</span>");
                if(topicName == RIGHT_TOPIC){
                    newBtn.addClass("btn-interest-header");
                    luxuryBtnsContainerHeader.append(newBtn);
                } else {
                    luxuryBtnsContainer.append(newBtn);
                }
            } else if (topicType == LEFT_TOPIC){
                var newBtn = $("<span class='btn btn-interest btn-health ' data-interest='" + topicName + "'>" + currentInstance.convertBtnTopicName(topicName) + "</span>");
                if(topicName == LEFT_TOPIC){
                    newBtn.addClass("btn-interest-header");
                    healthBtnsContainerHeader.append(newBtn);
                } else{
                    newBtn = $("<span class='btn btn-interest btn-health' data-interest='" + topicName + "'>" + currentInstance.convertBtnTopicName(topicName) + "</span>");
                    healthBtnsContainer.append(newBtn);
                }
            } else{
                throw Error("Should be health or luxury");
            }


        }
    }

    this.convertBtnTopicName = function(topicName){
        var topicNameMap = {
            "luxury": "All Luxury Interests",
            'luxury goods' : "Luxury Goods",
            'cars vehicles' : "Cars or Vehicles",
            'shopping' : "Shopping",
            'fast food' : "Fast Foods",
            'mobile phones gadgets' : "Mobile Devices",
            "health": "All Health Interests",
            "obesity": "Obesity Awareness",
            'fitness and wellness' : "Fitness and Wellness",
            'health care' : "Health Care",
            'physical activity' : "Physical Activity",
            'smoking awareness' : "Smoking Awareness",
            'diabetes awareness' : "Diabetes Awareness",
            'mental disease depression' : "Mental Disease Aw.",
            'stroke heart disease' : "Stroke Heart Disease Aw.",
            'respiratory asthma' : "Respiratory Asthma Aw.",
            'back pain' : "Back Pain Aw."
        }

        if(topicName in topicNameMap){
            return topicNameMap[topicName];
        } else {
            return topicName;
        }
    }

    this.init();
}