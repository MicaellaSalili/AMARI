// Contact functionality
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

    // Contact item click handlers
    const contactItems = document.querySelectorAll('.contact-item[data-action]');
    contactItems.forEach(item => {
        item.addEventListener('click', function() {
            const action = this.dataset.action;
            const value = this.dataset.value;

            switch(action) {
                case 'call':
                    window.location.href = `tel:${value}`;
                    break;
                case 'email':
                    window.location.href = `mailto:${value}`;
                    break;
                case 'directions':
                    window.open(`https://maps.google.com/maps?q=${encodeURIComponent(value)}`, '_blank');
                    break;
                case 'facebook':
                    window.open(value, '_blank');
                    break;
            }
        });
    });
});

// Initialize map (if using Google Maps)
function initMap() {
    // Replace with actual coordinates
    const location = { lat: 14.5995, lng: 120.9842 }; // Manila, Philippines
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: location,
        styles: [
            {
                "featureType": "all",
                "elementType": "geometry.fill",
                "stylers": [{"weight": "2.00"}]
            },
            {
                "featureType": "all",
                "elementType": "geometry.stroke",
                "stylers": [{"color": "#9c9c9c"}]
            }
        ]
    });
    
    const marker = new google.maps.Marker({
        position: location,
        map: map,
        title: 'AMARI Urban Escape'
    });
}
