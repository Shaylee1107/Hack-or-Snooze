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
  if(currentUser.username !== undefined){
    formsContainer.addClass('hide');
    $navLogin.hide();
    $navLogOut.show();
    $navUserProfile.text(`${currentUser.username}`).show();
    checkingForLoggedInUser();
  }
  
}

//This controls the Submit tab on the navbar. The if statement tests if the Submit tab is opened or not to give it a toggling feature
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

    //This will grab the data from the story submission button once the User presses "Submit" to upload their story they added
    $('#submit-story-btn').on('click', function(evt){
      evt.preventDefault();
      getStorySubmitData(evt);
      clearSubmitInputValues();
    });

  }
  
    $div.attr('name', 'visible');
}

//resets the values of the form once the User has clicked "Submit"
function clearSubmitInputValues(){
  const storySubmitForm = $('#story-form');
  storySubmitForm.trigger("reset");
}

//Making the favorites list dissapear on the Hack or Snooze nav button
$('.navbar-brand').on('click', navHackOrSnoozeButton)
async function navHackOrSnoozeButton(){
  location.reload();
  $('#favorites-list').addClass('hide');
  $('#my-stories-list').addClass('hide');
}

$('#nav-favorites').on('click', navShowFavorites);
async function navShowFavorites(){
  $('#all-stories-list').css('display', 'none');
  $('#my-stories-list').addClass('hide');
  $('#favorites-list').removeClass('hide');
  const res = await axios({
    url: `${BASE_URL}/users/${currUser}?`,
    method: "GET",
    params: { token: userToken },
  });
  const userFavs = res.data.user.favorites; 

  const array = currentFavoritesOnPage();

  //for each favorite story in the User's favorite object, it gets prepended into the favoritesList 
  for(let favs of userFavs){
    const res2 = await axios({
      url: `${BASE_URL}/stories/${favs.storyId}`,
      method: "GET",
      params: { token: userToken },
    });
    const resolve = await Promise.resolve(res2);
    const story = resolve.data.story;

    //But i want to check if the story is already prepended into there first, and not let it be prepended again if so
    if(!(array.includes(story.storyId))){
      $('#favorites-list').prepend($(`
      <li id="${story.storyId}">
      <span class="star">
         <svg class="svg-inline--fa fa-star" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="star" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg="" name="colored">
            <path fill="currentColor" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path>
         </svg>
      </span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${story.url})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `));
    }
    
  }

  if($("#favorites-list").children("li").length > 0){
    $('#no-favs-msg').addClass('hide');
    } else {
      $("#no-favs-msg").removeClass('hide');
    }
  }

  //listens for a click on the "My Stories" tab in the navbar
$('#nav-my-stories').on('click', addingMyStoriesToTab);
// addingMyStorriesToTab first hides the the tabs to only show the user's uploaded stories tab. Then we grab the id's that are in the user's uploaded stories from the API, and store them in a variable called "userStories". We then make another variable called "array" which runs the function "getIdOfUserStories()" to grab the ids of the stories currently inside of My Stories tab, to prevent appending the same stories already there and append any newly created stories that aren't already in there with the markup in the for-of-loop.  
async function addingMyStoriesToTab(){
  $('#all-stories-list').css('display', 'none');
  $('#favorites-list').addClass('hide');
  $('#my-stories-list').removeClass('hide');
  const res = await axios({
    url: `${BASE_URL}/users/${currUser}?`,
    method: "GET",
    params: { token: userToken },
  });
  const userStories = res.data.user.stories; 
  const array = getIdOfUserStories();

  for(let story of userStories){
    if(!(array.includes(story.storyId))){
      $('#my-stories-list').prepend($(`
      <li id="${story.storyId}">
      <span class="trash-can">
      <i class="fas fa-trash-alt"></i>
    </span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${story.url})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `));
    } 
  }

  testingIfStoriesEmpty();
}



