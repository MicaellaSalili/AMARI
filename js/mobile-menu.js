// Mobile Menu Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    
    if (mobileMenuToggle && mobileNavMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileNavMenu.classList.toggle('active');
            
            // Change hamburger icon to X when active
            const icon = mobileMenuToggle.querySelector('span');
            if (mobileNavMenu.classList.contains('active')) {
                icon.innerHTML = '✕';
            } else {
                icon.innerHTML = '☰';
            }
        });

        // Close mobile menu when clicking on a link
        const mobileNavLinks = mobileNavMenu.querySelectorAll('.nav-link, .book-now-btn');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileNavMenu.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('span');
                icon.innerHTML = '☰';
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuToggle.contains(event.target) && !mobileNavMenu.contains(event.target)) {
                mobileNavMenu.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('span');
                icon.innerHTML = '☰';
            }
        });

        // Close mobile menu on window resize to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                mobileNavMenu.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('span');
                icon.innerHTML = '☰';
            }
        });
    }
});

// Additional mobile optimizations
document.addEventListener('DOMContentLoaded', function() {
    // Prevent zoom on input focus on iOS
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (!input.style.fontSize) {
                input.style.fontSize = '16px';
            }
        });
    }

    // Add touch feedback for mobile buttons
    const buttons = document.querySelectorAll('button, .btn, .nav-link, .book-now-btn');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.opacity = '0.7';
        });
        
        button.addEventListener('touchend', function() {
            this.style.opacity = '1';
        });
        
        button.addEventListener('touchcancel', function() {
            this.style.opacity = '1';
        });
    });
});
