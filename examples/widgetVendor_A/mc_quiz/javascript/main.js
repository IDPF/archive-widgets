/*
*   This file is a sample quiz widget authored for the IDPF
*   Author: Greg Davis
*   Member company: Pearson
*   
*   This quiz widget uses simple templating to show the
*   possible structure of a widget using modern
*   web application methodologies and scripting
*/

!function($){
    // DOM ready
    $(document).ready(function(){
        // precompile the template
        var html = _.template($("#template").html())
        
        // init the page and render the template on callback
        init(function(data){
            theData = data
            theData.genUUID = genUUID

            $(".attach-point").html(html(theData))

            $("#checkAnswers").click(function(e){
                e.preventDefault()
                checkMe()
            })            
        })
        
    })
    
    var theData = {},
        score = 0
    
    function init(callback){
        // load in the data json file pointed to by the calling iframe
        var url = window.location.search.split("=")[1]
        $.ajax({
            url : url,
            method : "GET",
            dataType : "json"
        }).done(function(data){
            // fire the callback
            callback(data)
        })
    }
    
    function checkMe(){
        // check the answers
        for(var key in theData.questions){
            var question = theData.questions[key]
            // now loop the answers
            checkAnswer(question.answers)
        }
        // disable all inputs
        $("input").prop("disabled", true)
        $("button").prop("disabled", true)
        
        //post score
        $("button").after("<span class=\"score\">Good job. Your score was: "+score+"/"+theData.questions.length+"</span>")
    }
    
    function checkAnswer(answers){
        for(var key in answers){
            var answer = answers[key]
            if(answer.correct === "true"){
                $("#"+answer.id).parents(".answer").addClass("correct")
                if($("#"+answer.id).is(":checked") === true){
                    score++
                }
            } else {
                $("#"+answer.id).parents(".answer").addClass("wrong")                
            }
        }
    }
    
    function genUUID(){
        var d = new Date().getTime();
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == "x" ? r : (r & 0x7 | 0x8)).toString(16);
        });
    }
    
}(window.jQuery)
