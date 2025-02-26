/* eslint-disable no-undef */
/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {
  
  function scrollBarVisible() {
    var hContent = $("body").height(); // get the height of your content
    var hWindow = $(window).height();  // get the height of the visitor's browser window

    // if the height of your content is bigger than the height of the 
    // browser window, we have a scroll bar
    if(hContent>hWindow) { 
        return true;    
    }

    return false;
  }

  $("#arrow-btn").on('click', function() {
    $("#new-tweet-container").toggle(300);
    $("#tweet-text").focus();
  });

  $("#scrollToTopBtn").on('click', function() {
    $(window).scrollTop(0);
  });

  /*This function validates the tweet data entered by the user*/
  const validateForm = function() {

    $("#err").val('');

    //Validate tweet to see if it's too long
    if ($("#tweet-text").val().length > 140) {
      $("#err").text("Tweet must be less than 140 characters!");
      $("#tweet-text").focus();
      return false;
    }
    
    //Cannot send empty tweet
    if ($("#tweet-text").val().length === 0) {
      $("#err").text("Empty tweet cannot be posted!");
      $("#tweet-text").focus();
      return false;
    }
    
    return true;
  };
    
  /*This function fetches all the tweets from the server and displays it to the user*/
  const loadTweets = function() {

    //Get all the tweets from the server
    $.ajax({
      type: "GET",
      url: "/tweets",
      success: function(result) {
        renderTweets(result);
      }});
    
    //Clear the tweet input area and the reset the character count
    $("#tweet-text").val('');
    $("#counter").val('140');
  };
      
    //Load all tweets from the server when the page is loaded
    loadTweets();

  /*This submit event posts the new tweet to the server*/
  $("#submitBtn").on("click",function(event) {
        
    //Prevent default submit action
    event.preventDefault();

    if (!validateForm()) {
      $("#err").show();
      return;
    }

    //Serialize the tweet text
    let serializedData = $("#tweet-text").serialize();

    //Form data valid, so it can be posted to the server
    $.ajax({
      type: "POST",
      url: "/tweets",
      data: serializedData,
      encode: true,
    }).done(function() {
      loadTweets();
    });
  });

  /*This function fetches all the tweets from the server and displays them to the user*/
  /*Param: <tweets> - Array of tweet objects from the server*/

  const renderTweets = function(tweets) {
    // loops through tweets fetched from server
    // calls createTweetElement for each tweet
    // takes return value and prepends it to the tweets container
    
    $("#tweet-content-parent").empty();
    
    tweets.forEach(twtObj => {
  
      //Create HTML markup of a tweet object
      let htmlTweetElem = createTweetElement(twtObj);
  
      //Prepend the latest tweet (HTML markup) to the existing list of tweets so that the latest is shown first in the list
      $("#tweet-content-parent").prepend(`<br/><br/>`);
      $("#tweet-content-parent").prepend(htmlTweetElem);
        
    });

    if(scrollBarVisible()) {
      $("#scrollToTopBtn").show();
    }

    $("#new-tweet-container").hide();

  };
  
  /*This function takes a tweet object given by the server and creates an HTML markup of the tweet object to build up a list of tweets
  to be displayed to the user*/
  /*Param: <tweet> - a tweet object*/

  const createTweetElement = function(tweet) {
    
    //Create HTML markup to build list of tweets and return it to the caller

    let htmlTweet = `  
      <article class="tweet-content-container">
        <section class="tweet-user-info">
            <span id="avatar" class="pad-left-right pad-top tweet-user-info">
              <img src="${tweet.user.avatars}"/>
              <span id="username" class="pad-left-right">
              <b>${tweet.user.name}</b>
              </span>
            </span>       
            <span class="tweet-handle pad-left-right" id="tweet-handle"><b>${tweet.user.handle}</b></span>
        </section>
        <br/>
        <div>
            <textarea readonly class="tweet-content pad-left-right" name="tweet" id="tweet-content">${tweet.content.text}</textarea>
        </div>
        <footer class="footer">
            <span id="time-ago" class="pad-left-right">
              ${timeago.format(tweet.created_at)}
            </span>
            <section class="footer-icons">
                <i class="fa-solid fa-flag pad-left-right"></i>
                <i class="fa-solid fa-retweet pad-left-right"></i>
                <i class="fa-solid fa-heart pad-left-right"></i>
            </section>
        </footer>
      </article>`;
  
    return htmlTweet;
  };
});