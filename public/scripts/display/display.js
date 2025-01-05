let productsCurrentlySelected = []; 
// Function to display the filtered products on the frontend
export function displayFilterToScreen (productNames) {
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