// About page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Floating chat button functionality
    const chatBtn = document.getElementById('chatBtn');

    // Floating chat button handler
    if (chatBtn) {
        chatBtn.addEventListener('click', function() {
            // Open Facebook Messenger
            const messengerUrl = 'https://m.me/amariurbanescape';
            window.open(messengerUrl, '_blank');
        });
    }

    // Mobile navigation functionality (if needed in future)
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }

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

    // CTA Button click handlers
    document.querySelectorAll('.cta-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Add a subtle animation effect
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 150);
        });
    });

    // Story and feature items hover effects enhancement
    const storyItems = document.querySelectorAll('.story-item');
    const featureItems = document.querySelectorAll('.feature-item');

    [...storyItems, ...featureItems].forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(8px) scale(1.02)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = '';
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
                
                // Add staggered animation for items in grids
                if (entry.target.closest('.features-grid')) {
                    const items = entry.target.parentElement.querySelectorAll('.feature-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    document.querySelectorAll('.story-item, .feature-item, .mission-section, .team-message-section, .cta-section').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        observer.observe(item);
    });

    // Enhanced parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        
        if (hero && heroContent) {
            // Subtle parallax effect
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            heroContent.style.transform = `translateY(${scrolled * -0.2}px)`;
        }
    });

    // Book Now button enhanced functionality
    document.querySelectorAll('.book-now-btn, .cta-btn.primary').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.getAttribute('href') === 'rates.html' || btn.classList.contains('cta-btn')) {
                // Add a success feedback animation
                const originalText = btn.textContent;
                btn.textContent = 'Redirecting...';
                btn.style.background = '#28a745';
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                }, 1000);
            }
        });
    });

    // Add subtle floating animation to icons
    const icons = document.querySelectorAll('.story-icon, .feature-icon');
    icons.forEach(icon => {
        icon.style.animation = 'float 3s ease-in-out infinite';
    });

    // CSS for floating animation (added dynamically)
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-5px) rotate(2deg); }
        }
    `;
    document.head.appendChild(style);

    // Add loading state management
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Trigger initial animations
        setTimeout(() => {
            document.querySelectorAll('.about-content, .features-section').forEach(element => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            });
        }, 300);
    });
});

// Utility function for smooth reveal animations
function revealOnScroll() {
    const reveals = document.querySelectorAll('.story-item, .feature-item');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('revealed');
        }
    });
}

// Add scroll event listener for reveal animations
window.addEventListener('scroll', revealOnScroll);

// Initialize reveal on page load
window.addEventListener('load', revealOnScroll);
