const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Only add hamburger functionality if hamburger element exists
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
}));

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Book Now button functionality
document.querySelectorAll('.book-now-btn, .view-rates-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (btn.getAttribute('href') === '#book' || btn.classList.contains('view-rates-btn')) {
            e.preventDefault();
            alert('Booking system coming soon! Please contact us directly for reservations.');
        }
    });
});

// Gallery item click handlers
document.querySelectorAll('.gallery-item, .experience-item').forEach(item => {
    item.addEventListener('click', () => {
        alert('Image gallery feature coming soon!');
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Animate gallery items on scroll
document.querySelectorAll('.gallery-item, .experience-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;

    observer.observe(item);
});

// Floating chat button functionality
document.addEventListener('DOMContentLoaded', function() {
    const chatBtn = document.getElementById('chatBtn');

    // Floating chat button handler
    if (chatBtn) {
        chatBtn.addEventListener('click', function() {
            // Open Facebook Messenger
            const messengerUrl = 'https://m.me/amariurbanescape';
            window.open(messengerUrl, '_blank');
        });
    }
});