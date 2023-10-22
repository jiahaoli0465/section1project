"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  
  // Determine if the story is a favorite
  const isFavorite = currentUser.favorites.some(fav => fav.storyId === story.storyId);
  const starType = isFavorite ? 'checked' : '';
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
        <input class="star" type="checkbox" ${starType}>

          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function generateStoryMarkupTrash(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  
  // Determine if the story is a favorite
  const isFavorite = currentUser.favorites.some(fav => fav.storyId === story.storyId);
  const starType = isFavorite ? 'checked' : '';

  const isOwnStory = story.username === currentUser.username;
  const showTrash = isOwnStory ? '<i class="fas fa-trash-alt"></i>' : '';

  
  return $(`
      <li id="${story.storyId}">
        ${showTrash}

        <a href="${story.url}" target="a_blank" class="story-link">
        
        <input class="star" type="checkbox" ${starType}>

          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}


//favorite handling

$("#all-stories-list").on("change", ".star", handleStarClick);

function handleStarClick(event) {
  const $checkbox = $(event.target);

  const $storyItem = $checkbox.closest("li");

  const storyId = $storyItem.attr("id");

  console.log("Star of story with ID:", storyId, "was clicked.");

  const clickedStory = storyList.stories.find(story => story.storyId === storyId);


  if ($checkbox.prop("checked")) {
    currentUser.addFav(clickedStory);
    
    console.log('added fav');


  } else {
      currentUser.remFav(clickedStory);
      console.log('removed fav');



  }
}



/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}


$("#new-story-form").on("submit", addForm);

async function addForm (evt){
  evt.preventDefault();
  const title = $("#new-story-title").val();
  const author = $("#new-story-author").val();
  const url = $("#new-story-url").val();
  
  
 
  


  const story = {title, author, url};
  const newStory = await storyList.addStory(currentUser, story);
  const readyStory = generateStoryMarkup(newStory);
  $allStoriesList.append(readyStory);
  putStoriesOnPage();

}
