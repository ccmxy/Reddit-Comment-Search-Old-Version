$(document).ready(function() {

    var currentRequest = null;
    var SERVER_ADDRESS = "http://localhost:8000/";

    // Function to check if the input search box isn't empty
    function checkInput() {
        if ($('#search_terms').val() == "" && $('#subreddit').val() == "" && $('#user').val() == "") {
            alert('Please enter a something into one, two, or all three boxes to perform a comment search.');
            return false;
        } else {
            return true;
        }
    }

    //When the search button is clicked
    $('#search').click(function() {
        if (checkInput()) {
            search();
        }
    });


    //Changing the view when search button is clicked
    function search() {
        var username, searchterms, subreddit = "";
        if ($('#user').val() != "") {$('#after_search').val($('#after_search').val() + " user=" + $('#user').val() + "::");}
        if ($('#search_terms').val() != "") {$('#after_search').val($('#after_search').val() + " search=" + $('#search_terms').val() + "::");}
        if ($('#subreddit').val() != "") {$('#after_search').val($('#after_search').val() + " subreddit=" + $('#subreddit').val() + "::");}

        username = $('#user').val();
        searchterms = $('#search_terms').val();
        subreddit = $('#subreddit').val();

        $('.wrapper').addClass('hidden');
        $('#searched_results_display').removeClass('hidden');
        getComments(username, searchterms, subreddit);

    }

    function getMyServerResults(my_server_url, searchterms, username, subreddit){
        currentRequest = $.ajax({

            url: my_server_url,
            dataType: "json",
            success: function(commentResponse) {
                showLocalServerResults(commentResponse, searchterms, username, subreddit);
            },
            error: function() {
                    showNoMatchMessege(searchterms, username, subreddit);
            }
        });
    }

    function showNoMatchMessege(searchterms, username, subreddit){
        if (username == ""){delete username;}
        if (searchterms == "") {delete searchterms;}
        if (subreddit == "") {delete subreddit;}
         $('.search_results_section').html("");
        if(username && subreddit && searchterms){ $('.search_results_section').append("<div class='error'><div>Your search for comments containing <b>" + searchterms + "</b> by user <b><a href='https://www.reddit.com/u/" + username + "'>/u/" + username + " </a></b> in <b><a href='https://www.reddit.com/r/" + subreddit + "'>r/ " + subreddit + "</a> </b> - did not return any matches.</div></div>");}
         else if (username && searchterms){ $('.search_results_section').append("<div class='error'><div>Your search for comments containing <b>" + searchterms + "</b> by user <b><a href='https://www.reddit.com/u/" + username + "'>/u/" + username + " </a></b> - did not return any matches.</div>");}
         else if (username && subreddit ){ $('.search_results_section').append("<div class='error'><div>Your search for comments by user <b><a href='https://www.reddit.com/u/" + username + "'>/u/" + username + " </a></b> in <b><a href='https://www.reddit.com/r/" + subreddit + "'>r/ " + subreddit + "</a> </b>- did not return any matches.</div>");}
         else if (searchterms && subreddit){ $('.search_results_section').append("<div class='error'><div>Your search for comments containing <b>" + searchterms + "</b> in <b><a href='https://www.reddit.com/r/" + subreddit + "'>r/ " + subreddit + "</a> </b>- did not return any matches.</div>");}
         else if (searchterms){ $('.search_results_section').append("<div class='error'><div>Your search for comments containing <b>" + searchterms + "</b> - did not return any matches.</div>");}
         else if (username){ $('.search_results_section').append("<div class='error'><div>Your search for comments by <b><a href='https://www.reddit.com/u/" + username + "'>/u/" + username + " </a></b> - did not return any matches.</div>");}
         else if (subreddit){ $('.search_results_section').append("<div class='error'><div>Your search for comments in <b><a href='https://www.reddit.com/r/" + subreddit + "'>r/ " + subreddit + "</a> </b> - did not return any matches.</div>");}
         $('.search_results_section').append("<br>" +"<div>Possible issues:</div>" + "<br>" + "<ul>");
         $('.search_results_section').append("<li>If you're searching from this page, remember that options are search=, user= and subreddit=. </li> <li>Make sure that all queiries end in '::'. For example, user=spez::</li> ");
         $('.search_results_section').append("<li>Example 1: <b>search=I have:: user=spez:: subreddit=ModSupport::</b></li><li>Example 2: <b>subreddit=all:: search=i wonder:: </b></li></ul></div>"); 

    }


     function showLocalServerResults(commentResponse, searchterms, username, subreddit) {
        $('.search_results_section').html("");
        $('.search_results_section').append("<div>Query complete. Results found: <b> <span id='res_number'>" + commentResponse.length + "</span></b> <br><br></div>");
        if (commentResponse.length == 0){
             showNoMatchMessege(searchterms, username, subreddit);
         }

         else{
        for (var j = 0; j < commentResponse.length; j++) {
            var titleElement = $(".short_url_" + j + "");
            var url = commentResponse[j].comment_link;
            $.ajax({
                url: url + '.json',
                dataType: "json",
                success: function(thisText) {
                    var title = thisText[0].data.children[0].data.permalink;
                    var body;
                    var permalink = "https://www.reddit.com" + title;

                    if(!thisText[1].data.children[0]){
                        body = "<span class=removed><b>[ERROR]</b></span>";
                        for (var i = 0; i < commentResponse.length; i++){
                                if(commentResponse[i].comment_link + ".json" == this.url){
                                    permalink = commentResponse[i].comment_link;
                                    body = "<span class=removed><b>[NOTE: THIS COMMENT HAS BEEN REMOVED] </b></span> " +  commentResponse[i].comment_text + "";
                                }
                        }

                    }
                    else {
                        body = clean(thisText[1].data.children[0].data.body_html);
                        permalink = permalink + thisText[1].data.children[0].data.id;
                    }

                    if(searchterms){ body = body.replaceAll(searchterms, '<span class=highlight><b>' + searchterms + '</b></span>');}
                    $('.search_results_section').append("<div class='short_url'>" + "<a href='" + permalink + "' target='_blank'>" + title + "</a>" + "</div>" + "<div class='comment_body'>" + body + "</div>");
                }
            });
        }
        }
    }

    //Function which does the magic of getting the wiki data according to the username user searches for
    function getComments(username, searchterms, subreddit) {
        $('.search_results_section').html("");

        if (username == ""){delete username;}
        if (searchterms == "") {delete searchterms;}
        if (subreddit == "") {delete subreddit;}

        if(username && subreddit && searchterms){
         $('.search_results_section').append("<div class='error'><div>We are looking for comments by <b><a href='https://www.reddit.com/u/" + username + "'>/u/" + username + " </a></b> in <b><a href='https://www.reddit.com/r/" + subreddit + "'>r/ " + subreddit + "</a> </b> containing the phrase <b>" + searchterms + "</b></div>" + "<br>" + "<div>Please wait, this could take a bit of time....</div>");
         my_server_url = SERVER_ADDRESS + "comments?search=" + searchterms + "&user_name=" + username + "&subreddit=" + subreddit;
         getMyServerResults(my_server_url, searchterms, username, subreddit);
     }


        else if (username && searchterms){
         $('.search_results_section').append("<div class='error'><div>We are looking for comments by <b><a href='https://www.reddit.com/u/" + username + "'>/u/" + username + " </a></b> containing the phrase <b>" + searchterms + "</b></div>" + "<br>" + "<div>Please wait, this could take a bit of time....</div>");
         my_server_url = SERVER_ADDRESS + "comments?search=" + searchterms + "&user_name=" + username;
         getMyServerResults(my_server_url, searchterms, username, subreddit);
     }


      else if (subreddit && searchterms){
         $('.search_results_section').append("<div class='error'><div>We are looking for comments in <b><a href='https://www.reddit.com/r/" + subreddit + "'>r/ " + subreddit + "</a> </b> containing the phrase <b>" + searchterms + "</b></div>" + "<br>" + "<div>Please wait, this could take a bit of time....</div>");
         my_server_url = SERVER_ADDRESS + "comments?search=" + searchterms + "&subreddit=" + subreddit;
         getMyServerResults(my_server_url, searchterms, username, subreddit);

     }

      else if (subreddit  && username){
         $('.search_results_section').append("<div class='error'><div>We are looking for comments by <b><a href='https://www.reddit.com/u/" + username + "'>/u/" + username + " </a></b> in <b><a href='https://www.reddit.com/r/" + subreddit + "'>r/ " + subreddit + "</a> </b> </div>" + "<br>" + "<div>Please wait, this could take a bit of time....</div>");
          my_server_url = SERVER_ADDRESS + "comments?user_name=" + username + "&subreddit=" + subreddit;
         getMyServerResults(my_server_url, searchterms, username, subreddit);

     }

        else if (searchterms){
         $('.search_results_section').append("<div class='error'><div>We are looking for comments containing the phrase <b>" + username + "</b> containing the phrase <b>" + searchterms + "</b></div>" + "<br>" + "<div>Please wait, this could take a bit of time....</div>");
         my_server_url = SERVER_ADDRESS + "comments?search=" + searchterms;
         getMyServerResults(my_server_url, searchterms, username, subreddit);

     }

        else if (username){
         $('.search_results_section').append("<div class='error'><div>We are looking for comments by <b><a href='https://www.reddit.com/u/" + username + "'>/u/" + username + " </a></b>" + "<br>" + "<div>Please wait, this could take a bit of time....</div>");
          my_server_url = SERVER_ADDRESS + "comments?user_name=" + username;
         getMyServerResults(my_server_url, searchterms, username, subreddit);

     }

    else if (subreddit){
         $('.search_results_section').append("<div class='error'><div>We are looking for comments in <b><a href='https://www.reddit.com/r/" + subreddit + "'>r/ " + subreddit + "</a> </b> " + "<br>" + "<div>Please wait, this could take a bit of time....</div>");
          my_server_url = SERVER_ADDRESS + "comments?subreddit=" + subreddit;
         getMyServerResults(my_server_url);

     }

     else {
        console.log("Hmm they are all undefined");
     }
    }


    //When user clicks the search icon on the display section where the wiki results are appended
    $('.after_search_container span').click(function() {
        if ($('#after_search').val() == "") {
            alert('No query entered');
        } else {
            var search_terms, user, subreddit = "";
            var fullSearchString = $('#after_search').val();
            if(fullSearchString.includes("user=")){
              var user = getStringBetween(fullSearchString, "user=", '::');
              console.log("u: " + user + '\n');
            }

              if(fullSearchString.includes("subreddit=")){
              var subreddit = getStringBetween(fullSearchString, "subreddit=", '::');
              console.log("sub: " + subreddit);
            }

              if(fullSearchString.includes("search=")){
              var  search_terms = getStringBetween(fullSearchString, 'search=', '::');
              console.log("search: " + search_terms);
            } 

            $('.search_results_section').html("");
            if (checkInput()) {
                 if(currentRequest != null) {
                    currentRequest.abort();
                }
                getComments(user, search_terms, subreddit);
            }
        }
    });

});

    function clean(string) {
        var ret = string.replace(/&gt;/g, '>');
        ret = ret.replace(/&lt;/g, '<');
        ret = ret.replace(/&quot;/g, '"');
        ret = ret.replace(/&apos;/g, "'");
        ret = ret.replace(/&amp;/g, '&');
        return ret;
    }


String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.replace(new RegExp(search, 'ig'), replacement);
    };


    function getStringBetween (fullSearchString, preString, postString) {
        var preIndex = fullSearchString.indexOf(preString);
        var postStringIndex = preIndex + fullSearchString.substring(preIndex).indexOf(postString);
        return fullSearchString.substring(preIndex + preString.length, postStringIndex);
    };
