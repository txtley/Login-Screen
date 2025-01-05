const videoContainer = document.getElementById('video-container');
const videoPlayer = document.getElementById('video-player');
const videoButton = document.getElementById('video-close');
const shotsFired = document.getElementById('shotsfired'); 
const price = document.getElementById('price');
const duration = document.getElementById('duration');
const brand = document.getElementById('brand');
const productArray = ['cakes', 'fountains', 'sparklers', 'rockets', 'selectionboxes']

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

// Social Media redirect route
document.querySelectorAll('.fa-icon').forEach (icon => {
    icon.addEventListener('click', (event) => {
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
    });
}); 

// Product routes
document.querySelectorAll('.fa-product').forEach(product => {
    product.addEventListener('click', (event) => {
        console.log('Product Icon Clicked');
        for (let item = 0; item < productArray.length; item++) {
            console.log(productArray[item])

            // Checking the product the user has selected
            if (event.target.classList.contains(`fa-${productArray[item]}`)) {
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
    })
})

// Redirecting when the user clicks 'Our Fireworks'
// document.querySelector('.ourFireworksContainer').addEventListener('click', () => {
//     console.log('Our Fireworks clicked');
//     window.scrollTo ({
//         top: 1000,
//         behavior:'smooth'
//     });
// });

// Redirect down the page when user clicks a product 
document.querySelectorAll('.fa-main-menu').forEach (product => {
    product.addEventListener('click', (event) => {
        console.log('Product Clicked'); 
        if (event.target.classList.contains('fa-sparklers')) {
            const target = document.getElementsByClassName('product-item');
            if (target) {
                // Scrolls to the container of the first product item
                window.scrollTo ({
                    top: target[1].offsetTop,
                    behavior:'smooth'
                });
                // Then goes to the target product item
                elementTarget = document.getElementById('sparklers');
                elementTarget.scrollIntoView({ behavior:'smooth' });
            } 
        } else if (event.target.classList.contains('fa-fountains')) {
            const target = document.getElementsByClassName('product-item');
            if (target) {
                window.scrollTo ({
                    top: target[1].offsetTop,
                    behavior:'smooth'
                });
                elementTarget = document.getElementById('fountains');
                elementTarget.scrollIntoView({ behavior:'smooth' });
            } 
        } else if (event.target.classList.contains('fa-rockets')) {
            const target = document.getElementsByClassName('product-item');
            if (target) {
                window.scrollTo ({
                    top: target[1].offsetTop,
                    behavior:'smooth'
                });
                elementTarget = document.getElementById('rockets');
                elementTarget.scrollIntoView({ behavior:'smooth' });
            } 
        } else if (event.target.classList.contains('fa-cakes')) {
            const target = document.getElementsByClassName('product-item');
            if (target) {
                window.scrollTo ({
                    top: target[1].offsetTop,
                    behavior:'smooth'
                });
                elementTarget = document.getElementById('cakes');
                elementTarget.scrollIntoView({ behavior:'smooth' });
            } 
            console.error('Element not found');
        } else if (event.target.classList.contains('fa-selectionboxes')) {
            const target = document.getElementsByClassName('product-item');
            if (target) {
                window.scrollTo ({
                    top: target[1].offsetTop,
                    behavior:'smooth'
                });
                elementTarget = document.getElementById('selectionBoxes');
                elementTarget.scrollIntoView({ behavior:'smooth' });
            } 
        }
        console.error('Element not found');
    })
}); 


const activeFilters = {}; 
// Function to get the checked filters and make a backend call 
function filterProducts(selectedFilter) {
    console.log("filterProducts triggered for:", selectedFilter);


    filterArray.forEach(filterSection => {
        console.log("Checked inputs:", filterSection.querySelectorAll('input:checked'));
            const filterType = filterSection.id; 
            // Collect all the checked inputs in the current filter section
            const checkedInputs = filterSection.querySelectorAll('input:checked')

            // Checking if there is a value checked 
            if (checkedInputs.length > 0) {
                activeFilters[filterType] = Array.from(checkedInputs).map(input => input.value)
            } else {
                const filterType = filterSection.id; 
                delete activeFilters[filterType]
            }
        }); 

    console.log('Updating activeFilters', JSON.stringify(activeFilters, null, 2))
    
    // Get current URL
    let currentUrl = window.location.href; 
 
    // Send the activeFilters to the backend server 
    fetch ('http://localhost:3000/filter-products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body:  JSON.stringify({ filters: activeFilters, specificFilters: selectedFilter, url: currentUrl }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        // Putting the message into an array
        const messages = Array.isArray(data.message) ? data.message.map(msg => msg) : null;


        // Confirming message is in array
        if (messages.length > 0) {
            // Mapping the product to the product name
            const productNames = messages.flatMap(message => Array.isArray(message.recordset) ? message.recordset.map(product => product.ProductName) : []);
            // Sending to function to filter on the frontend
            displayFilterToScreen(productNames)
        } else {
            // If no filter is specified
            const allProducts = document.querySelectorAll('.product-item'); 
            allProducts.forEach(product => {
                // Display all products
                product.style.display = 'block'; 
            }); 
        }
        return data.message === 'True'; 
    })
    .catch(err => {
        console.log('Error', err)
    });
}

// Array for all the products
const cakes = [shotsFired, price, brand, duration]
const fountains = [price, duration, brand]
const rockets = [price, brand]
const sparklers = [price] 
const selectionBox = [price, brand]



productsCurrentlySelected = []; 
// Function to display the filtered products on the frontend
function displayFilterToScreen (productNames) {
    // Clearing the list of products to update the new products coming in
    productsCurrentlySelected = []; 

    // Concatting the product names into the array and making a flat version
    productsCurrentlySelected = productsCurrentlySelected.concat(productNames);

    const productsToDisplay = new Set(productsCurrentlySelected.flat())

    // Looping through all the products to filter out the ones that arent in the productsToDisplay array 
    const allProducts = document.querySelectorAll('.product-item'); 
    allProducts.forEach(product => {
        console.log(productsToDisplay)
        if (productsToDisplay.has(product.id)) {
            product.style.display = 'inline';
        } else {
            product.style.display = 'none';
        }
    });
} 

// Function to get the product page the user is viewing
function getProductArray() {
    let currentUrl = window.location.href; 
    for (let product = 0; product < productArray.length; product++) {
        console.log(productArray[product])
        if (currentUrl === `http://127.0.0.1:5500/public/products/${productArray[product]}/${productArray[product]}.html`) {
            currentProduct = productArray[product]

            // Checking the product page that the user is on and sending back the relevant filter details
            if (currentProduct === 'cakes') {
                return cakes
            } else if (currentProduct === 'fountain') {
                return fountains
            } else if (currentProduct === 'rockets') {
                return rockets
            } else if (currentProduct === 'sparklers') {
                return sparklers
            } else if (currentProduct === 'selectionboxes') {
                return selectionBox
            } 
        }
    }
}

function getProductVideoArray() {
    let currentUrl = window.location.href; 
    for (let product = 0; product < productArray.length; product++) {
        console.log(productArray[product])
        if (currentUrl === `http://127.0.0.1:5500/public/products/${productArray[product]}/${productArray[product]}.html`) {
            currentProduct = productArray[product]

            // Checking the product page that the user is on and sending back the relevant filter details
            if (currentProduct === 'cakes') {
                return cakesVideo
            } else if (currentProduct === 'fountain') {
                return fountainsVideo
            } else if (currentProduct === 'rockets') {
                return rocketsVideo
            } else if (currentProduct === 'sparklers') {
                return sparklersVideo
            } else if (currentProduct === 'selectionboxes') {
                return selectionBoxVideo
            } 
        }
    }
}

// Event listener for the filters
document.querySelectorAll('.filters-section').forEach(filter => {
    filter.addEventListener('click', (event) => {
        if (event.target.tagName === 'INPUT') {
            filterArray = getProductArray()
            console.log(filterArray)
            for (let option = 0; option < filterArray.length; option++) {
                console.log(filterArray[option])
                console.log(event.target)
                // Checking which filter has been selected by seeing if the checkbox is in that section
                if (filterArray[option].contains(event.target)) {
                    const selectedFilter = (event.target.className)
                    console.log(selectedFilter)       
                    // Filter the products based on the selected filter
                    filterProducts(selectedFilter) 
                } 
            }
        } else {
            console.log('No filters selected')
        }
    });
});

// Function to open and close the videos
function openVideo(videoLoaded) {
    console.log('Video Loaded State:', videoLoaded);

    if (videoLoaded) {
        console.log('True')
            // Display the video container and play the video
            videoContainer.style.display = 'block';
            videoPlayer.play();
            window.scrollTo({
                top: videoContainer.offsetHeight,
                behavior:'smooth'
            }); 
    } else {
        console.log('Video is not loaded.');
        return false;
    }
}


// Ensure the close button only has one event listener
videoButton.addEventListener('click', ()  => {
    videoLoaded = false;
    videoContainer.style.display = 'none'; // Hide the container
    videoPlayer.pause(); // Pause the video
    videoPlayer.currentTime = 0; // Reset video to the beginning
}); 


// Checking if a product's icons gets clicked
document.querySelectorAll('.product-item').forEach(product => {
    product.addEventListener('click', (event) => {
        // Check for button click
        console.log(event.target) 

        // Check for video button click
        if (event.target.classList.contains('Video')) {
                // Get the product from the item details
            const targetProduct = product.getAttribute('product');

            // Open the video player with the product details
            videoLoaded = true; 
            openVideo(targetProduct); 
            } else if (event.target.classList.contains('AddToBasket')) { // Check for AddToBasket
                // Get the product from the item details 
            }
    });
});

// Search bar functionality
document.querySelectorAll('.searchbar').forEach(search => {
    search.addEventListener('keyup', (event) => {
        
        // If user presses enter
        if (event.keyCode === 13) {
            // Get the search term
            const searchTerm = event.target.value
            console.log(searchTerm);

            // Make a backend request to query the database for closest value to search term
            fetch ("http://localhost:3000/match-products-to-search", {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ searchTerm: searchTerm }),
            })
            .then (response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); 
            })
            .then (data => {
                // Putting the message into an array
                const messages = Array.isArray(data.message) ? data.message.map(msg => msg) : null;

                // Confirming message is in array
                if (messages.length > 0) {
                    // Mapping the product to the product name
                    let productNames = messages.flatMap(message => Array.isArray(message.recordset) ? message.recordset.map(product => product.ProductName) : []);
                    // Sending to function to filter on the frontend
                    displayFilterToScreen(productNames)
                    
                    // Display the results text
                    const resultText = document.querySelectorAll('.fa-search-text'); 
                    resultText.forEach(text => {
                        text.innerHTML = ""
                        text.innerHTML= "Results for : "+searchTerm
                        // Display all products
                        text.style.display = 'block'; 
                    });  
                    // Hiding the our cakes text
                    const mainHeaderText = document.querySelectorAll('.fa-header-text'); 
                    mainHeaderText.forEach(text => {
                        // Display all products
                        text.style.display = 'none'; 
                    });  
                } else {

                    // If no filter is specified
                    const allProducts = document.querySelectorAll('.product-item'); 
                    allProducts.forEach(product => {
                        // Display all products
                        product.style.display = 'block'; 
                    });
                }
                return data.message === 'True'; 
            })
        }
    }); 
}); 


// Functionality for the searchbar icon
document.querySelectorAll('.searchbarIcon').forEach(search => {
    search.addEventListener('click', () => {
        document.querySelectorAll('.searchtext').forEach(searchText => {
            console.log(searchText)
            let searchTerm = searchText.value

                // Make a backend request to query the database for closest value to search term
            fetch ("http://localhost:3000/match-products-to-search", {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ searchTerm: searchTerm }),
            })
            .then (response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); 
            })
            .then (data => {
                // Putting the message into an array
                const messages = Array.isArray(data.message) ? data.message.map(msg => msg) : null;


                // Confirming message is in array
                if (messages.length > 0) {
                    // Mapping the product to the product name
                    let productNames = messages.flatMap(message => Array.isArray(message.recordset) ? message.recordset.map(product => product.ProductName) : []);
                    // Sending to function to filter on the frontend
                    displayFilterToScreen(productNames)

                    // Display the results text
                    const resultText = document.querySelectorAll('.fa-search-text'); 
                    resultText.forEach(text => {
                        text.innerHTML = ""
                        text.innerHTML= "Results for : "+searchTerm
                        // Display all products
                        text.style.display = 'block'; 
                    });  
                    // Hiding the our cakes text
                    const mainHeaderText = document.querySelectorAll('.fa-header-text'); 
                    mainHeaderText.forEach(text => {
                        // Display all products
                        text.style.display = 'none'; 
                    });  
                } else {
                    // If no filter is specified
                    const allProducts = document.querySelectorAll('.product-item'); 
                    allProducts.forEach(product => {
                        // Display all products
                        product.style.display = 'block'; 
                    }); 
                }
                return data.message === 'True'; 
            }); 
        }); 
    }); 
}); 

