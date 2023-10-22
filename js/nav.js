"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}



function makeForm(evt) {
  evt.preventDefault();
  $("#new-story-form").toggleClass("hidden");
}

$("#makeForm").on("click", makeForm);



//show Fav


function putFavoriteStoriesOnPage() {

  console.debug("putFavoriteStoriesOnPage");

  $allStoriesList.empty();

  // If the user has no favorites, display a message
  if (currentUser.favorites.length === 0) {
      $allStoriesList.append("<h5>No favorites added!</h5>");
  } else {
      // Loop through all of the user's favorited stories and generate HTML for them
      for (let story of currentUser.favorites) {
          const $story = generateStoryMarkup(story);
          $allStoriesList.append($story);
      }
  }

  $allStoriesList.show();
}

$("#favStory").on("click", putFavoriteStoriesOnPage );



//show user story

function putUserStoriesOnPage() {

  console.debug("putUserStoriesOnPage");

  $allStoriesList.empty();

  // If the user hasn't written any stories, display a message
  if (currentUser.ownStories.length === 0) {
      $allStoriesList.append("<h5>You haven't written any stories yet!</h5>");
  } else {
      // Loop through all of the user's stories and generate HTML for them
      for (let story of currentUser.ownStories) {
          const $story = generateStoryMarkupTrash(story, true);  // Pass `true` here



          $allStoriesList.append($story);
      }
  }

  $allStoriesList.show();
}


$("#myStory").on("click", putUserStoriesOnPage);



$("#all-stories-list").on("click", ".fa-trash-alt", async function(evt) {

  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");
  

  await storyList.deleteStory(currentUser, storyId);
  

  $closestLi.remove();
});