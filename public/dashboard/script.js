// Social Media redirect route
document.querySelector('.fa-icon').addEventListener('click', (event) => {
    console.log('Social Media Icon Clicked');
    if (event.target.classList.contains('fa-instagram')) {
        window.location.href = 'https://www.instagram.com/';
    } else if (event.target.classList.contains('fa-tiktok')) {
        window.location.href = 'https://www.tiktok.com/';
    } else if (event.target.classList.contains('fa-facebook')) {
        window.location.href = 'https://www.facebook.com/';
    } else if (event.target.classList.contains('fa-twitter')) {
        window.location.href = 'https://www.twitter.com/';
    } else if (event.target.classList.contains('fa-youtube')) {
        window.location.href = 'https://www.youtube.com/';
    }
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

// Redirecting when the user clicks 'Our Fireworks'
document.querySelector('.ourFireworksContainer').addEventListener('click', () => {
        elementTarget = document.getElementById('sparklers'); 
        elementTarget.scrollIntoView({ behavior:'smooth' });
    }
)
