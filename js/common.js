// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

/**
 * Common JavaScript functionality shared across all pages
 */

// Navigation active state handler
// Highlights the current page in the navigation menu
const currentLocation = window.location.pathname;
const navItems = document.querySelectorAll('.nav-links a');

navItems.forEach(item => {
    const itemPath = item.getAttribute('href');
    // Check if current path matches nav item, excluding home page special case
    if (currentLocation.includes(itemPath) && itemPath !== 'index.html') {
        item.classList.add('active');
    } 
    // Special handling for home page
    else if (currentLocation.endsWith('/') && itemPath === 'index.html') {
        item.classList.add('active');
    }
});

// Image lazy loading implementation
// Improves page load performance by loading images only when they're about to enter the viewport
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[data-src]');

    // Check if IntersectionObserver is supported by the browser
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    // Replace data-src with actual src
                    image.src = image.dataset.src;
                    image.removeAttribute('data-src');
                    imageObserver.unobserve(image);
                }
            });
        });

        // Observe all images with data-src attribute
        lazyImages.forEach(image => {
            imageObserver.observe(image);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        lazyImages.forEach(image => {
            image.src = image.dataset.src;
            image.removeAttribute('data-src');
        });
    }
});
