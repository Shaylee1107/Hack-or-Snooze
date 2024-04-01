"use strict";

let storyList;

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
  loadColoredStarsOnHome();
}


function generateStoryMarkup(story) {
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      <span class="star">
      <i class="far fa-star"></i>
      </span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
      <hr>
    `);
}

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  if($allStoriesList.attr('name')){
    $allStoriesList.show();
    console.log('has attr');
  } else {

    for (let story of storyList.stories) {
      const $story = generateStoryMarkup(story);
      $allStoriesList.append($story);
    }

    $allStoriesList.show();
    $allStoriesList.attr('name', 'loaded');
  }

}

async function getStorySubmitData(evt){
  evt.preventDefault();
  const story = new StoryList();
  const author = $('#story-author').val();
  const title = $('#story-title').val();
  const url = $('#story-url').val();

  story.addStory(title, author, url, currUser);
}

$('#nav-favorites').on('click', navShowFavorites);

async function navShowFavorites(){
  $('#all-stories-list').css('display', 'none');
  $('#my-stories-list').addClass('hide');
  $('#favorites-list').removeClass('hide');
  const res = await axios.get(`${BASE_URL}/users/${currUser}?token=${userToken}`);
  const userFavs = res.data.user.favorites; 

  const array = currentFavoritesOnPage();

  //for each favorite story in the User's favorite object, it gets prepended into the favoritesList 
  for(let favs of userFavs){
    const res2 = axios.get(`${BASE_URL}/stories/${favs.storyId}`);
    const storyR = Promise.resolve(res2);
    const storyA = await storyR; 
    const story = storyA.data.story;

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

  //where should this function be? 
  function currentFavoritesOnPage(){
    const favsListUI = $('#favorites-list');
    const favsItemsUI = favsListUI.children();
    const array = [];
    for(let i = 0; i < favsItemsUI.length; i++){
      const li = favsItemsUI[i];
      const id = li.getAttribute('id');
      array.push(id);
    }

    return array; 
  }

  //this runs a check to see if any of the stars on the home page or in the favorites list, then it will color it's star
  async function loadColoredStarsOnHome(){
    const ol = $('#all-stories-list');
    const olItems = ol.children();

    for(let i = 0; i < olItems.length; i++){
      const story = olItems[i];
      const id = story.getAttribute('id');
      const array = getIdOfUserFavorites();
      const arrayR = Promise.resolve(array);
      const arrayA = await arrayR;
     
      if(arrayA.includes(id)){
        const storySpan = story.children[0];
        const storySvg = storySpan.children[0];
        const storyPath = storySvg.children[0];
        storyPath.setAttribute('d', 'M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z');
      }

    } 
  }

  //this finds the ids of the stories that are currently in the User's saved favorites object list
  async function getIdOfUserFavorites(){
    const res = await axios.get(`${BASE_URL}/users/${currUser}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNoYXlsZWUxMTA3NyIsImlhdCI6MTcwOTE2MTk5OX0.JjOIcnQg_b8G99fsLO3PnO6RS2oAKtMVACwL30sMgQ8`);
    const resR = Promise.resolve(res);
    const resA = await resR; 
    const userFavs = resA.data.user.favorites; 
    const array = [];
    
    for(let fav of userFavs){
      array.push(fav.storyId);
    }

    return array; 
  }

$('#nav-my-stories').on('click', addingMyStoriesToTab);

async function addingMyStoriesToTab(){
  console.log('THIS IS FIRED UP');
  $('#all-stories-list').css('display', 'none');
  $('#favorites-list').addClass('hide');
  $('#my-stories-list').removeClass('hide');
  const res = await axios.get(`${BASE_URL}/users/${currUser}?token=${userToken}`);
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

//This tests the length of how many stories are inside the User's created Stories and shows or hides the message about no stories. 

function testingIfStoriesEmpty(myStoriesChildren){
  const myStoriesList = $('#my-stories-list');
  const children = myStoriesList.children();
  const noStoriesMsg = $('#no-stories-msg');

  if(children.length === 1){
    noStoriesMsg.removeClass('hide');
  } else {
    noStoriesMsg.addClass('hide');
  }
}

//this loops through the stories currently in the user's personal story list to help pervent from loading the name stories over and over
function getIdOfUserStories(){
  const myStoriesList = $('#my-stories-list');
  const items = myStoriesList.children();
  const array = [];
  
  for(let story of items){
    array.push(story.getAttribute('id'));
  }

  return array; 
}

//this function creates the UI of the user's own stories being appended onto the page.
function createUserStoryUI(story){
  const li = $(`
  <li id="${story.storyId}" name="myStory" class="story-li">
  <span class="star">
  <i class="far fa-star"></i>
  </span>
    <a href="${story.url}" target="a_blank" class="story-link">
      ${story.title}
    </a>
    <small class="story-hostname">(${story.url})</small>
    <small class="story-author">by ${story.author}</small>
    <small class="story-user">posted by ${story.username}</small>
  </li>
  <hr>
`);

$('#all-stories-list').prepend(li);
}

