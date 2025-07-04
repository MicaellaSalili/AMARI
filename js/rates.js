const pricing = {
    weekdays: {
        'day-tour': '₱ 12,500',
        'overnight': '₱ 19,500',
        'night-tour': '₱ 13,500'
    },
    weekends: {
        'day-tour': '₱ 15,000',
        'overnight': '₱ 22,500',
        'night-tour': '₱ 16,000'
    }
};

let currentRate = 'weekdays';

function toggleRates(rateType) {
    if (currentRate === rateType) return;

    // Update button states
    document.getElementById('weekdays-btn').classList.toggle('active');
    document.getElementById('weekends-btn').classList.toggle('active');

    // Add fade out effect
    const cards = document.querySelectorAll('.rate-card');
    cards.forEach(card => card.classList.add('fade-out'));

    // Update prices after fade out
    setTimeout(() => {
        document.getElementById('day-tour-price').textContent = pricing[rateType]['day-tour'];
        document.getElementById('overnight-price').textContent = pricing[rateType]['overnight'];
        document.getElementById('night-tour-price').textContent = pricing[rateType]['night-tour'];

        // Remove fade out effect
        cards.forEach(card => card.classList.remove('fade-out'));
        
        currentRate = rateType;
    }, 250);
}

function bookNow(packageType) {
    const rateText = currentRate === 'weekdays' ? 'Weekdays' : 'Weekend';
    alert(`Booking ${packageType.replace('-', ' ').toUpperCase()} package for ${rateText}. Redirecting to booking form...`);
}

function bookNow(rateType) {
        // Redirect to booking.html with rate info in query string
        window.location.href = `booking.html?rate=${encodeURIComponent(rateType)}`;
}

// Add scroll animations
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

// Initialize animations and chat button
document.addEventListener('DOMContentLoaded', () => {
    // Rate cards animation
    const cards = document.querySelectorAll('.rate-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(card);
    });

    // Floating chat button handler
    const chatBtn = document.getElementById('chatBtn');
    if (chatBtn) {
        chatBtn.addEventListener('click', function() {
            // Open Facebook Messenger
            const messengerUrl = 'https://m.me/amariurbanescape';
            window.open(messengerUrl, '_blank');
        });
    }
});