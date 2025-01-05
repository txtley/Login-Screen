
// Setting display values
// Display the results text
const resultText = document.querySelectorAll('.fa-search-text'); 
resultText.forEach(text => {
    // Display all products
    text.style.display = 'none'; 
});  
// Hiding the our cakes text
const mainHeaderText = document.querySelectorAll('.fa-header-text'); 
mainHeaderText.forEach(text => {
    // Display all products
    text.style.display = 'block'; 
});  

// Import the necessary modules and functions
import {
  filterEventListener,
  videoEventListener,
  ProductVideoEventListener,
  SearchbarEventListener,
  SearchbarIconEventListener,
  ProductEventListener,
  SocialMediaEventListener,
  MyAccountSaveButtonClickHandler, 
} from './event/eventlisteners.js';

// // Initialize the necessary modules and functions
const eventListenersInit = () => {
  filterEventListener();
  videoEventListener();
  ProductVideoEventListener();
  SearchbarEventListener();
  SearchbarIconEventListener();
  ProductEventListener();
  SocialMediaEventListener();
  MyAccountSaveButtonClickHandler(); 
};

// Call the initialization function
eventListenersInit();
