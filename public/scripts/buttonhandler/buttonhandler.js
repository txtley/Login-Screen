const videoContainer = document.getElementById('video-container');
const videoPlayer = document.getElementById('video-player');
const videoButton = document.getElementById('video-close');
// Function to open the video
export function openVideo(videoLoaded) {
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

// Function to close the video
export function closeVideo (videoLoaded) {
    videoLoaded = false;
    videoContainer.style.display = 'none'; // Hide the container
    videoPlayer.pause(); // Pause the video
    videoPlayer.currentTime = 0; // Reset video to the beginning
}

// Function to check if the video button is selected
export function whichButtonHasBeenClicked (product, target) {
    // Check for video button click
    if (target.classList.contains('Video')) {
        console.log('Video is selected')
            // Get the product from the item details
        const targetProduct = product.getAttribute('product');

        // Open the video player with the product details
        const videoLoaded = true; 
        openVideo(targetProduct, videoLoaded); 
        } else if (target.classList.contains('AddToBasket')) { // Check for AddToBasket
            const targetProduct = product.getAttribute('product');
            // Send the product to a function to add it to the basket
            addToBasket(targetProduct);
        }
}

// Define a local array to store the products to be added to the cart
const productsToBeAddedToCart = []; 
function addToBasket(targetProduct) {
    // Add the product to the array
    productsToBeAddedToCart.push(targetProduct) 
    console.log('Products to be added to basket:', productsToBeAddedToCart);
    return productsToBeAddedToCart
}

// Function to get the contents of the cart
export function getCartContents() {
    return productsToBeAddedToCart
}