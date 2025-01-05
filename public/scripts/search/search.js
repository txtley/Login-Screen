import { displayFilterToScreen } from "../display/display.js";
// Search Bar functionality
export function searchBar(event) {
  // If user presses enter
  if (event.keyCode === 13) {
    // Get the search term
    const searchTerm = event.target.value;
    console.log(searchTerm);

    // Make a backend request to query the database for closest value to search term
    fetch("http://localhost:3000/match-products-to-search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ searchTerm: searchTerm }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Putting the message into an array
        const messages = Array.isArray(data.message)
          ? data.message.map((msg) => msg)
          : null;

        // Confirming message is in array
        if (messages.length > 0) {
          // Mapping the product to the product name
          let productNames = messages.flatMap((message) =>
            Array.isArray(message.recordset)
              ? message.recordset.map((product) => product.ProductName)
              : []
          );
          // Sending to function to filter on the frontend
          displayFilterToScreen(productNames);

          // Display the results text
          const resultText = document.querySelectorAll(".fa-search-text");
          resultText.forEach((text) => {
            text.innerHTML = "";
            text.innerHTML = "Results for : " + searchTerm;
            // Display all products
            text.style.display = "block";
          });
          // Hiding the our cakes text
          const mainHeaderText = document.querySelectorAll(".fa-header-text");
          mainHeaderText.forEach((text) => {
            // Display all products
            text.style.display = "none";
          });
        } else {
          // If no filter is specified
          const allProducts = document.querySelectorAll(".product-item");
          allProducts.forEach((product) => {
            // Display all products
            product.style.display = "block";
          });
        }
        return data.message === "True";
      });
  }
}

// SearchBar Icon functionality
export function searchbarIcon(searchText) {
  console.log(searchText);
  let searchTerm = searchText.value;

  // Make a backend request to query the database for closest value to search term
  fetch("http://localhost:3000/match-products-to-search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ searchTerm: searchTerm }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Putting the message into an array
      const messages = Array.isArray(data.message)
        ? data.message.map((msg) => msg)
        : null;

      // Confirming message is in array
      if (messages.length > 0) {
        // Mapping the product to the product name
        let productNames = messages.flatMap((message) =>
          Array.isArray(message.recordset)
            ? message.recordset.map((product) => product.ProductName)
            : []
        );
        // Sending to function to filter on the frontend
        displayFilterToScreen(productNames);

        // Display the results text
        const resultText = document.querySelectorAll(".fa-search-text");
        resultText.forEach((text) => {
          text.innerHTML = "";
          text.innerHTML = "Results for : " + searchTerm;
          // Display all products
          text.style.display = "block";
        });
        // Hiding the our cakes text
        const mainHeaderText = document.querySelectorAll(".fa-header-text");
        mainHeaderText.forEach((text) => {
          // Display all products
          text.style.display = "none";
        });
      } else {
        // If no filter is specified
        const allProducts = document.querySelectorAll(".product-item");
        allProducts.forEach((product) => {
          // Display all products
          product.style.display = "block";
        });
      }
      return data.message === "True";
    });
}
