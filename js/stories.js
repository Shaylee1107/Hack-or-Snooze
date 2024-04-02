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

  if ($allStoriesList.attr('name')) {
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

//called on the nav.js to grab the values of the form after the User hits "Submit" to upload a story. We create a new instance of a story, then pass the values into the addStory method in the StoryList class. 
async function getStorySubmitData(evt) {
  evt.preventDefault();
  const story = new StoryList();
  const author = $('#story-author').val();
  const title = $('#story-title').val();
  const url = $('#story-url').val();

  story.addStory(title, author, url, currUser);
}

//where should this function be? 
function currentFavoritesOnPage() {
  const favsListUI = $('#favorites-list');
  const favsItemsUI = favsListUI.children();
  const array = [];
  for (let i = 0; i < favsItemsUI.length; i++) {
    const li = favsItemsUI[i];
    const id = li.getAttribute('id');
    array.push(id);
  }

  return array;
}

//this runs a check to see if any of the stars on the home page or in the favorites list, then it will color it's star
async function loadColoredStarsOnHome() {
  const ol = $('#all-stories-list');
  const olItems = ol.children();

  for (let i = 0; i < olItems.length; i++) {
    const story = olItems[i];
    const id = story.getAttribute('id');
    const array = getIdOfUserFavorites();
    const arrayR = Promise.resolve(array);
    const arrayA = await arrayR;

    if (arrayA.includes(id)) {
      const storySpan = story.children[0];
      const storySvg = storySpan.children[0];
      const storyPath = storySvg.children[0];
      storyPath.setAttribute('d', 'M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z');
    }

  }
}

//This tests the length of how many stories are inside the User's created Stories and shows or hides the message about no stories. 
function testingIfStoriesEmpty() {
  const myStoriesList = $('#my-stories-list');
  const children = myStoriesList.children();
  const noStoriesMsg = $('#no-stories-msg');

  if (children.length === 1) {
    noStoriesMsg.removeClass('hide');
  } else {
    noStoriesMsg.addClass('hide');
  }
}

//this loops through the stories currently in the user's personal story list to help pervent from loading the name stories over and over
function getIdOfUserStories() {
  const myStoriesList = $('#my-stories-list');
  const items = myStoriesList.children();
  const array = [];

  for (let story of items) {
    array.push(story.getAttribute('id'));
  }

  return array;
}

//this function creates the UI of the user's own stories being appended onto the page.
function createUserStoryUI(story) {
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

//this document.addEventListener checks if the user presses the trash button on the "My Stories tab"
document.addEventListener('click', User.removeUsersStory);

//MANAGING THE FAVORITES 
//below determines if the star you clicked is colored (meaning you already clicked it once) or not, to determine the correct action in updating the favorites tab. 
document.addEventListener('click', function (event) {
  const star = event.target.closest('.fa-star');
  if (star !== null) {
    //Removes the color of the star because it was clicked and colored
    if (star.hasAttribute('name')) {
      star.classList.remove('fas');
      star.classList.add('far');
      star.removeAttribute('name');

      updateFavoriteStories(star);
    } else {
      //Adds color to the star because it was unclicked and uncolored
      star.classList.remove('far');
      star.classList.add('fas');
      star.setAttribute('name', 'colored');

      updateFavoriteStories(star);
    }
  }
})

//First tests if the star is colored by if the class contains 'fas' (meaning the star is now colored since the user just clicked it). If the star is now colored, we add a clone of it to the favorites tab. 
function updateFavoriteStories(star) {
  const li = star.closest("li");
  const parentOl = star.closest('ol');
  const clone = li.cloneNode(true);
  const parentId = parentOl.getAttribute('id');
  const favsOl = $('#favorites-list');
  const favsLis = favsOl.children();
  
  if (star.classList.contains('fas')) {
    User.addStoryToFavorites(clone);
  } else {
    //If the star does NOT contain 'fas', we run another if statement to see the action of removing the star color was made in the Favorites tab OR the Hacker News tab. 
    //If it was in the Favorites Tab we we have to remove the star from the Hacker Snooze tab AND the Favorites tab while removing the whole story from the Favorites tab. (If the star was clicked on the Hacker Snooze tab the star was already removed, it was clicked on the Favorites tab that star was removed and we need to remove it from the Hacker Snooze tab also).
    if (parentId === 'favorites-list') {
      
      User.removeStarFromStoryList(li);
      User.removeStoryFromFavorites(li);
      if (favsLis.length === 2) {
        const noFavsMsg = $('#no-favs-msg');
        noFavsMsg.removeClass('hide');
      }
    } else {
      User.removeStoryFromFavorites(li);
      if (favsLis.length === 2) {
        const noFavsMsg = $('#no-favs-msg');
        noFavsMsg.removeClass('hide');
      }
    }

  }
}

//this finds the ids of the stories that are currently in the User's saved favorites object list
async function getIdOfUserFavorites() {
  const array = [];
  if (currUser) {
    const res = await axios.get(`${BASE_URL}/users/${currUser}?token=${userToken}`);
    const resR = Promise.resolve(res);
    const resA = await resR;
    const userFavs = resA.data.user.favorites;
    for (let fav of userFavs) {
      array.push(fav.storyId);
    }
  }

  return array;
}
