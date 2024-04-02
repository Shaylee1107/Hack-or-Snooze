"use strict";
const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";

let currUser = localStorage.username;
let userToken = localStorage.token; 

class Story {
  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }
  //This is the parens that appear after the title of the stories the User uploads. 
  getHostName() {
    return "hostname.com";
  }
}

class StoryList {
  constructor(stories) {
    this.stories = stories;
  }

  static async getStories() {
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "GET",
    });

    const stories = response.data.stories.map(story => new Story(story));

    return new StoryList(stories);
  }

  async addStory(title, author, url, username) {
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "POST",
      data: { token: userToken, story: {author: `${author}`, title: `${title}`, url: `${url}`} },
    });
   
    const story = new StoryList();
    const storyId = await story.getStoryId();
    const createdAt = await story.getDateAndTime();
    const newStory = new Story({ storyId, title, author, url, createdAt, username });
    createUserStoryUI(newStory);
    response; 

    //below tests if the submit button to add a story was pressed while ON the "My Stores" tab and prepends the story right then (instead of waiting for the "My Stories" button to be clicked to prepend the story)
    const userStories = $('#my-stories-list');
    if(!(userStories.hasClass('hide'))){
      addingMyStoriesToTab();
    }

  }

  async getStoryId(){
    const response = await axios({
      url: `${BASE_URL}/users/${currUser}`,
      method: "GET",
      params: {token: userToken}
    });

    const myUser = response.data.user.stories;
    const lastItem = myUser[myUser.length -1];
    const myId = lastItem.storyId; 

    return myId; 
  }

  async getDateAndTime(){
    const response = await axios({
      url: `${BASE_URL}/users/${currUser}`,
      method: "GET",
      params: {token: userToken}
    });

    const myUser = response.data.user.stories;
    const lastItem = myUser[myUser.length -1];
    const dateAndTime = lastItem.createdAt; 

    return dateAndTime; 
  }

}

class User {
  constructor({
                username,
                name,
                createdAt,
                favorites = [],
                ownStories = []
              },
              token) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;

    this.favorites = favorites.map(s => new Story(s));
    this.ownStories = ownStories.map(s => new Story(s));

    this.loginToken = token;
  }

  static async signup(username, password, name) {
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: "POST",
      data: { user: { username, password, name } },
    });

    let { user } = response.data

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  static async login(username, password) {
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: "POST",
      data: { user: { username, password } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      let { user } = response.data;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }
  
  static async removeStoryFromFavorites(li){
    const starId = li.getAttribute('id');
    const favs = $('#favorites-list');
    const items = favs.children();
  
      for(let i = 0; i < items.length; i++){
        const index = items[i];
        const indexId = index.getAttribute('id');
  
        if(indexId === starId){
          index.remove();
          const removeFavorite = axios.delete(`${BASE_URL}/users/${currUser}/favorites/${indexId}?token=${userToken}`);
          removeFavorite; 
        }
      }
  }
  
  static async removeStarFromStoryList(li){
    const storiesContainer = $('#all-stories-list');
    const itemsj = storiesContainer.children();
    const starId = li.getAttribute('id');
  
    for(let j = 0; j < itemsj.length; j++){
      const indexj = itemsj[j];
      const indexIdj = indexj.getAttribute('id');
  
        if(starId === indexIdj){
          const span = indexj.children[0];
          const svg = span.children[0];
          const path = svg.children[0];
          path.setAttribute('d', 'M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z');
        }
    } 
  }

  static async addStoryToFavorites(clone){
    const storyId = clone.getAttribute('id');

    const cloneStar = clone.childNodes.item(1);
    const makingStar = cloneStar.children[0];
    const pathStar = makingStar.children[0];
    pathStar.setAttribute('d', 'M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z');
    makingStar.setAttribute('data-prefix', 'fas');
   
    const updateFavs = await axios.post(`${BASE_URL}/users/${currUser}/favorites/${storyId}?token=${userToken}`);
    updateFavs; 
  }

  static async removeUsersStory(event){
    const trash = event.target.closest('.trash-can');
    const usersStories = $('#my-stories-list');
    const storiesChildren = usersStories.children();
  
    if (trash !== null) {
      const li = trash.closest('li');
      const id = li.getAttribute('id');
      const res = axios.delete(`${BASE_URL}/stories/${id}?token=${userToken}`);
      res;

      li.remove();
     
        if(storiesChildren.length === 2){
          const noStoriesMsg = $('#no-stories-msg');
          noStoriesMsg.removeClass('hide');
        }
    
    }
  }
}


