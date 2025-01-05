import { displayFilterToScreen } from "../display/display.js";
const shotsFired = document.getElementById('shotsfired'); 
const price = document.getElementById('price');
const duration = document.getElementById('duration');
const brand = document.getElementById('brand');
const productArray = ['cakes', 'fountains', 'sparklers', 'rockets', 'selectionboxes']

// Array for all the different types of products
const cakes = [shotsFired, price, brand, duration]
const fountains = [price, duration, brand]
const rockets = [price, brand]
const sparklers = [price] 
const selectionBox = [price, brand]


// Function to get the product page the user is viewing
function getProductArray() {
    let currentUrl = window.location.href; 
    for (let product = 0; product < productArray.length; product++) {
        console.log(productArray[product])
        if (currentUrl === `http://127.0.0.1:5500/public/products/${productArray[product]}/${productArray[product]}.html`) {
            let currentProduct = productArray[product]
            console.log(currentProduct)

            // Checking the product page that the user is on and sending back the relevant filter details
            if (currentProduct === 'cakes') {
                return cakes
            } else if (currentProduct === 'fountains') {
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

const activeFilters = {}; 
// Function to get the checked filters and make a backend call 
function filterProducts(selectedFilter, filterArray) {
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

export function getFilterDetails (TagName, target) {
    console.log('Get Filter Details')
    if (TagName === 'INPUT') {
        // Getting the relevant product from the array
        const filterArray = getProductArray()
        console.log(filterArray)
        for (let option = 0; option < filterArray.length; option++) {
            console.log(filterArray[option])
            // Checking which filter has been selected by seeing if the checkbox is in that section
            if (filterArray[option].contains(target)) {
                const selectedFilter = (target.className)
                console.log(selectedFilter)       
                // Filter the products based on the selected filter
                filterProducts(selectedFilter, filterArray) 
            } 
        }
    } else {
        console.log('No filters selected')
    }
}