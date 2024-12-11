const videoContainer = document.getElementById('video-container');
const videoPlayer = document.getElementById('video-player');
const videoButton = document.getElementById('video-close');
const shotsFired = document.getElementById('shotsfired'); 
const price = document.getElementById('price');
const duration = document.getElementById('duration');
const brand = document.getElementById('brand');

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

// Redirecting when the user clicks 'Our Fireworks'
document.querySelector('.ourFireworksContainer').addEventListener('click', () => {
    console.log('Our Fireworks clicked');
    window.scrollTo ({
        top: 1000,
        behavior:'smooth'
    });
});

// Redirect down the page when user clicks a product 
document.querySelectorAll('.fa-product').forEach (product => {
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

function DisplayAllProducts () {
    console.log('Display all products')
}

const activeFilters = {}; 
function filterProducts(selectedFilter) {
    console.log("filterProducts triggered for:", selectedFilter);

    filterArray.forEach(filterSection => {
        console.log("Checked inputs:", filterSection.querySelectorAll('input:checked'));
            const filterType = filterSection.id; 
            // Collect all the checked inputs in the current filter section
            const checkedInputs = filterSection.querySelectorAll('input:checked')

            if (checkedInputs.length > 0) {
                activeFilters[filterType] = Array.from(checkedInputs).map(input => input.value)
            } else {
                const filterType = filterSection.id; 
                delete activeFilters[filterType]
            }
        }); 

    console.log('Updating activeFilters', JSON.stringify(activeFilters, null, 2))

            // Send the activeFilters to the backend server 
            fetch ('http://localhost:3000/filter-products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body:  JSON.stringify({ filters: activeFilters, specificFilters: selectedFilter }),
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
    

// Array for all the different possible filters 
const filterArray = [shotsFired, duration, price, brand]
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

// Event listener for the filters
document.querySelectorAll('.filters-section').forEach(filter => {
    filter.addEventListener('click', (event) => {
        if (event.target.tagName === 'INPUT') {
            for (let option = 0; option < filterArray.length; option++) {
                // Checking which filter has been selected by seeing if the checkbox is in that section
                if (filterArray[option].contains(event.target)) {
                    const selectedFilter = (event.target.className)
                    console.log(selectedFilter)       
                    // Change the filter class to active
                    // Filter the products based on the selected filter
                    setTimeout (() => filterProducts(selectedFilter), 0); 
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
// videoButton.addEventListener('click', ()  => {
//     videoLoaded = false;
//     videoContainer.style.display = 'none'; // Hide the container
//     videoPlayer.pause(); // Pause the video
//     videoPlayer.currentTime = 0; // Reset video to the beginning
// }); 


// Checking if a product gets clicked
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

