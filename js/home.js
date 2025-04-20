/**
 * Home Page Specific JavaScript
 * Handles functionality unique to the home page
 */

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        // Get target element ID
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        // Find target element and scroll to it
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Account for header height
                behavior: 'smooth'
            });

            // Close mobile menu if open
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// Newsletter form submission handler
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get email input value
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        // Show success message (In production, this would send to a server)
        alert(`Thank you for subscribing with ${email}! We'll be in touch soon.`);
        
        // Reset form
        newsletterForm.reset();
    });
}

// Parallax scroll effect
document.addEventListener('DOMContentLoaded', function() {
    const parallaxImage = document.querySelector('.parallax-image');
    const parallaxContent = document.querySelector('.parallax-content');
    
    window.addEventListener('scroll', function() {
        if (parallaxImage) {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.5;
            
            // Create parallax effect
            parallaxImage.style.transform = `translate3d(0px, ${rate}px, 0px)`;
            
            // Add fade effect to content
            const opacity = Math.max(0, Math.min(1, 1 - (scrolled * 0.003)));
            parallaxContent.style.opacity = opacity;
        }
    });
});

// Intersection Observer for smooth animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

// Observe the parallax content
document.addEventListener('DOMContentLoaded', function() {
    const parallaxContent = document.querySelector('.parallax-content');
    if (parallaxContent) {
        observer.observe(parallaxContent);
    }
});

// Parallax effect for sticky background
document.addEventListener('DOMContentLoaded', function() {
    const stickyBg = document.querySelector('.sticky-bg');
    const aboutPreview = document.querySelector('.about-preview');
    
    window.addEventListener('scroll', function() {
        if (stickyBg && aboutPreview) {
            const rect = aboutPreview.getBoundingClientRect();
            const scrolled = window.pageYOffset;
            
            // Only show background when about section is in view
            if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                stickyBg.style.opacity = '1';
                // Optional: Add subtle parallax effect
                stickyBg.style.transform = `translateY(${scrolled * 0.2}px)`;
            } else {
                stickyBg.style.opacity = '0';
            }
        }
    });
});
