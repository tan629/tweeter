/* eslint-disable no-undef */
$(document).ready(function() {

  //Update the character count (number of characters left to be used) based on how many characters are entered in the tweet text area
  
  $("#tweet-text").on('input', function() {
        
    const maxChars = 140;

    //Number of characters currently typed by the user
    let numCharUsed = $(this).val().length;
        
    //Calculate number of chars left to be used
    let adjustedCount =  maxChars - numCharUsed;

    const counter = $(this).siblings("div").children(".counter");
        
    counter.text(adjustedCount);

    //If there is less than zero characters left to be used, then make the counter text red
    if (adjustedCount < 0) {
      counter.addClass("counter-red");
    } else {
      counter.removeClass("counter-red");
    }
  });

});

