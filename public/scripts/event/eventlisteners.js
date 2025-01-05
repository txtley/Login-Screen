import { getFilterDetails } from "../filter/filter.js";
import { IconDropdownRoutes, productRoutes, SocialMediaRoutes } from "../routes/routes.js";
import { searchBar, searchbarIcon } from "../search/search.js";
import { GetFields } from "../users/users.js";
import { whichButtonHasBeenClicked } from "../buttonhandler/buttonhandler.js";
import { closeVideo } from "../buttonhandler/buttonhandler.js";
const videoContainer = document.getElementById("video-container");
const videoPlayer = document.getElementById("video-player");
const videoButton = document.getElementById("video-close");
const addToCart = document.getElementById("AddToBasket"); 

// Filter Event Listener
export function filterEventListener() {
  // Event listener for the filters
  document.querySelectorAll(".filters-section").forEach((filter) => {
    filter.addEventListener("click", (event) => {
      let TagName = event.target.tagName;
      let target = event.target;
      console.log(target, TagName)
      getFilterDetails(TagName, target);
    });
  });
}

// Video Event Listener
export function videoEventListener() {
  // Ensure the close button only has one event listener
  try {
    videoButton.addEventListener("click", closeVideo);
  } catch {
    // Letting it pass
  }
}

// Add to cart
export function AddToCartEventListener() {
  // Ensure the close button only has one event listener
  try {
    addToCart.addEventListener("click", (event) => {
      addItemToCart(event.target)
    });
  } catch {
    // Letting it pass
  }
}


// Product Video Event Listener
export function ProductVideoEventListener() {
  // Checking if a product's icons gets clicked
  document.querySelectorAll(".product-item").forEach((product) => {
    product.addEventListener("click", (event) => {
      let target = event.target;
      whichButtonHasBeenClicked(product, target)
    });
  });
}

// Searchbar Event Listener
export function SearchbarEventListener() {
  document.querySelectorAll(".searchbar").forEach((search) => {
    search.addEventListener("keyup", searchBar);
  });
}

// Searchbar Icon Event Listener
export function SearchbarIconEventListener() {
  document.querySelectorAll(".searchbarIcon").forEach((search) => {
    search.addEventListener("click", () => {
      document.querySelectorAll(".searchtext").forEach((searchText) => {
        searchbarIcon(searchText);
      });
    });
  });
}

// Product Icon Event Listener
export function ProductEventListener() {
  document.querySelectorAll(".fa-product").forEach((product) => {
    product.addEventListener("click", (event) => {
      productRoutes(event.target);
    });
  });
}

// Social Media Icon Event Listener
export function SocialMediaEventListener() {
  document.querySelectorAll(".fa-icon").forEach((icon) => {
    icon.addEventListener("click", SocialMediaRoutes);
  });
}


const AccountDropdown = document.querySelector('.my-account-btn');
const CartDropdown = document.querySelector('.shopping-cart-btn');
const LogInDropdown = document.querySelector('.login-btn');

// Function to handle dropdown click
export function handleDropdownClick(event) {
    console.log('Dropdown clicked:', event.currentTarget);
    // Send the event to the routes.js 
    IconDropdownRoutes(event.currentTarget)
}

// Add event listeners to the dropdowns
if (AccountDropdown) {
  AccountDropdown.addEventListener('click', handleDropdownClick);
}

if (CartDropdown) {
  CartDropdown.addEventListener('click', handleDropdownClick);
}

if (LogInDropdown) {
  LogInDropdown.addEventListener('click', handleDropdownClick);
}


const buttons = ['personal-save-button', 'email-save-button', 'password-save-button']
// Event listener for the save button click 
export function MyAccountSaveButtonClickHandler () {
  document.querySelectorAll(".save-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      // Looping to check which button was clicked
      for (let buttonElement = 0; buttonElement < buttons.length; buttonElement++) {
        if (event.target.classList.contains(buttons[buttonElement])) {
          // Sending the relevent button to the handler so it can deal with it accordingly 
          GetFields(buttons[buttonElement]);   
        }
      }
    });
  })
}