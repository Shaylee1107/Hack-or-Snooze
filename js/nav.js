"use strict";

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);


function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);


function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  const formsContainer = $('.account-forms-container');
  formsContainer.addClass('hide');
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}


$('#nav-story').on('click', navStorySubmit);

function navStorySubmit(){
  const $div = $('<div id="story-div"></div>');
  if($('#story-div').attr("name")){
    $('#story-div').css('display', 'none');
    $('#story-div').removeAttr('name');
  } else {
    $('.stories-container').prepend($div);
    $('#story-div').prepend($(`
        <form id="story-form">
        <div class="story-submit-labels">
          <label for="story-author">Author:</label>
          <input name="story-author" id="story-author" type="text" placeholder="author name"></input>
        </div>
  
        <div class="story-submit-labels">
          <label for="story-title">Title:</label>
          <input name="story-title" id="story-title" type="text" placeholder="story title"></input>
        </div>
  
        <div class="story-submit-labels">
          <label for="story-url">Url:</label>
          <input name="story-url" id="story-url" type="text" placeholder="story url"></input>
        </div>
        <button id="submit-story-btn">Submit</button>
        </form>
       
        <hr>
    `))

    $('#submit-story-btn').on('click', function(evt){
      evt.preventDefault();
      getStorySubmitData(evt);
      clearSubmitInputValues();
    });

  }
  
    $div.attr('name', 'visible');
}

function clearSubmitInputValues(){
  const storySubmitForm = $('#story-form');
  storySubmitForm.trigger("reset");
}

//Making the favorites list dissapear on the Hack or Snooze nav button
$('.navbar-brand').on('click', function(){
  $('#favorites-list').addClass('hide');
  $('#my-stories-list').addClass('hide');
})


