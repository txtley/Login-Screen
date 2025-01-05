const productArray = ['cakes', 'fountains', 'sparklers', 'rockets', 'selectionboxes']

// Function to route for the user's product request
export function productRoutes(event) {
    console.log(event)
    // Product routes
    console.log('Product Icon Clicked');
    for (let item = 0; item < productArray.length; item++) {
        console.log(productArray[item])

        // Checking the product the user has selected
        if (event.classList.contains(`fa-${productArray[item]}`)) {
            console.log(productArray[item])
            fetch('http://localhost:3000/product-routes', {  
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ product: productArray[item] }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.redirect) {
                    // Redirect the browser to the provided URL
                    window.location.href = data.url;
                }
            }); 
        }
    }    
}

// Handling the social media request
export function SocialMediaRoutes () {
    // Social Media redirect route
    console.log('Social Media Icon Clicked');
    if (event.target.closest('.fa-instagram')) {
        window.location.href = 'https://www.instagram.com/';
    } else if (event.target.closest('.fa-tiktok')) {
        window.location.href = 'https://www.tiktok.com/';
    } else if (event.target.closest('.fa-facebook')) {
        window.location.href = 'https://www.facebook.com/';
    } else if (event.target.closest('.fa-twitter')) {
        window.location.href = 'https://www.twitter.com/';
    } else if (event.target.closest('.fa-youtube')) {
        window.location.href = 'https://www.youtube.com/';
    }

}

// Handling the main menu routes for the different products
export function MainMenuRoutes() {
    // Add event listener to main menu icons
    document.querySelectorAll('.fa-main-menu').forEach(product => {
      product.addEventListener('click', (event) => {
        console.log('Product Clicked');
  
        // Array of product names
        const productArray = ['cakes', 'fountains', 'rockets', 'sparklers', 'selectionboxes'];
  
        for (let item = 0; item < productArray.length; item++) {
          console.log(productArray[item]);
  
          // Checking the product the user has selected
          if (event.target.classList.contains(`fa-${productArray[item]}`)) {
            const target = document.getElementsByClassName('product-item');
            if (target) {
              // Scrolls to the container of the first product item
              window.scrollTo({
                top: target[1].offsetTop,
                behavior: 'smooth',
              });
  
              // Then goes to the target product item
              const elementTarget = document.getElementById(productArray[item]);
              elementTarget.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }
  
        console.error('Element not found');
      });
    });
  }

export function IconDropdownRoutes(event) {
    console.log('IconDropdownRoutes', event)
    // Define possible target array
    const dropdownOptions = ['my-account-btn', 'login-btn', 'shopping-cart-btn']

    // Looping to see which option has been selected
    dropdownOptions.forEach(option => {
        console.log(option)
        if (event.classList.contains(option)) {
            console.log(`Redirecting to ${option} page`)
            
            // Send the option to the backend to get a URL back to redirect
            fetch('http://localhost:3000/dropdown-routes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ dropdownOption: option }),
            })
           .then(response => {
             if (!response.ok) {
                 throw new Error('Network response was not ok');
             }
             return response.json();
            })
            .then(data => {
                if (data.redirect) {
                    // Redirect the browser to the provided URL
                    window.location.href = data.url;
                }
            });
        }
    }); 
}