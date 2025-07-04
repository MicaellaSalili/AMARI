let currentDate = new Date();
let selectedCheckin = null;
let selectedCheckout = null;
let isSelectingCheckout = false;

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function generateCalendar(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const calendar = document.getElementById('calendar-grid');
  calendar.innerHTML = '';

  dayNames.forEach(day => {
    const dayHeader = document.createElement('div');
    dayHeader.className = 'calendar-day-header';
    dayHeader.textContent = day;
    calendar.appendChild(dayHeader);
  });

  for (let i = 0; i < startingDayOfWeek; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.className = 'calendar-day other-month';
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    emptyDay.textContent = prevMonthLastDay - startingDayOfWeek + i + 1;
    calendar.appendChild(emptyDay);
  }

  const today = new Date();
  today.setHours(0,0,0,0);

  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    dayElement.textContent = day;
    const currentDateObj = new Date(year, month, day);
    currentDateObj.setHours(0,0,0,0);

    // Disable previous dates
    if (currentDateObj < today) {
      dayElement.classList.add('disabled');
      dayElement.style.pointerEvents = 'none';
      dayElement.style.opacity = '0.4';
    } else {
      dayElement.addEventListener('click', () => selectDate(currentDateObj, dayElement));
    }

    if (currentDateObj.toDateString() === today.toDateString()) {
      dayElement.classList.add('today');
    }

    if (selectedCheckin && currentDateObj.toDateString() === selectedCheckin.toDateString()) {
      dayElement.classList.add('selected');
    }
    if (selectedCheckout && currentDateObj.toDateString() === selectedCheckout.toDateString()) {
      dayElement.classList.add('selected');
    }

    calendar.appendChild(dayElement);
  }

  document.getElementById('current-month').textContent = `${monthNames[month]} ${year}`;
}

function selectDate(date, element) {
  if (!selectedCheckin || isSelectingCheckout) {
    if (!selectedCheckin) {
      selectedCheckin = date;
      isSelectingCheckout = true;
      document.getElementById('checkin-date').value = formatDate(date);
    } else if (isSelectingCheckout) {
      if (date > selectedCheckin) {
        selectedCheckout = date;
        document.getElementById('checkout-date').value = formatDate(date);
        isSelectingCheckout = false;
        document.getElementById('confirm-reservation').disabled = false;
      } else {
        alert('Check-out date must be after check-in date');
        return;
      }
    }
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
  }
}

function formatDate(date) {
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
}

document.getElementById('prev-month').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
});

document.getElementById('next-month').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
});

document.getElementById('clear-dates').addEventListener('click', () => {
  selectedCheckin = null;
  selectedCheckout = null;
  isSelectingCheckout = false;
  document.getElementById('checkin-date').value = '';
  document.getElementById('checkout-date').value = '';
  document.getElementById('confirm-reservation').disabled = true;
  generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
});

document.getElementById('select-dates').addEventListener('click', () => {
  if (selectedCheckin && selectedCheckout) {
    alert(`Selected dates:\nCheck-in: ${formatDate(selectedCheckin)}\nCheck-out: ${formatDate(selectedCheckout)}`);
  } else {
    alert('Please select both check-in and check-out dates');
  }
});

document.getElementById('confirm-reservation').addEventListener('click', () => {
  if (selectedCheckin && selectedCheckout) {
    // Show the guest form
    const guestForm = document.getElementById('guest-form');
    const confirmBtn = document.getElementById('confirm-reservation');
    
    if (guestForm.style.display === 'none') {
      guestForm.style.display = 'block';
      confirmBtn.textContent = 'Submit Reservation';
      confirmBtn.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Validate and submit the form
      submitReservation();
    }
  }
});

async function submitReservation() {
  const form = document.getElementById('reservation-form');
  const formData = new FormData(form);
  
  // Validate required fields
  const guestName = formData.get('guestName')?.trim();
  const email = formData.get('email')?.trim();
  const phone = formData.get('phone')?.trim();
  const numberOfGuests = formData.get('numberOfGuests');
  
  if (!guestName || !email || !phone || !numberOfGuests) {
    alert('Please fill in all required fields.');
    return;
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }
  
  // Phone validation (basic)
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
  if (!phoneRegex.test(phone)) {
    alert('Please enter a valid phone number.');
    return;
  }
  
  // Get current package info
  const params = new URLSearchParams(window.location.search);
  const pkg = params.get('package') || 'overnight';
  
  const reservationData = {
    guestName: guestName,
    email: email,
    phone: phone,
    numberOfGuests: parseInt(numberOfGuests),
    specialRequests: formData.get('specialRequests')?.trim() || '',
    package: pkg,
    checkinDate: selectedCheckin.toISOString().split('T')[0],
    checkoutDate: selectedCheckout.toISOString().split('T')[0]
  };
  
  try {
    // Disable the button and show loading
    const confirmBtn = document.getElementById('confirm-reservation');
    const originalText = confirmBtn.textContent;
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Submitting...';
    
    const response = await fetch('/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reservationData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Show success message
      alert(`Reservation submitted successfully!\n\nReservation ID: ${result.reservation.id}\nPackage: ${packages[pkg]?.title || pkg}\nCheck-in: ${formatDate(selectedCheckin)}\nCheck-out: ${formatDate(selectedCheckout)}\nGuest: ${guestName}\nTotal: ${packages[pkg]?.price || 'Contact for pricing'}\n\nWe will contact you soon to confirm your reservation.`);
      
      // Reset the form
      resetBookingForm();
    } else {
      alert('Failed to submit reservation: ' + (result.message || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error submitting reservation:', error);
    alert('Error submitting reservation. Please check your internet connection and try again.');
  } finally {
    // Re-enable the button
    const confirmBtn = document.getElementById('confirm-reservation');
    confirmBtn.disabled = false;
    confirmBtn.textContent = originalText;
  }
}

function resetBookingForm() {
  // Reset date selection
  selectedCheckin = null;
  selectedCheckout = null;
  isSelectingCheckout = false;
  document.getElementById('checkin-date').value = '';
  document.getElementById('checkout-date').value = '';
  
  // Reset guest form
  document.getElementById('reservation-form').reset();
  document.getElementById('guest-form').style.display = 'none';
  
  // Reset button
  const confirmBtn = document.getElementById('confirm-reservation');
  confirmBtn.disabled = true;
  confirmBtn.textContent = 'Confirm Reservation';
  
  // Regenerate calendar
  generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
}

generateCalendar(currentDate.getFullYear(), currentDate.getMonth());

const params = new URLSearchParams(window.location.search);
const pkg = params.get('package');

const packages = {
  "day-tour": {
    title: "DAY TOUR",
    price: "₱ 12,500",
    duration: "8AM - 5PM (9 hours)",
    features: [
      "20 pax maximum",
      "Php 350 per additional pax",
      "Security Deposit of Php 3,000 per booking",
      "Air-conditioned room with 2 double sized bunk beds with pull out",
      "Air-conditioned room with 2 queen sized bunk beds with TV and T&B",
      "Infinity pool and karaoke",
      "Jacuzzi (free use for 30 minutes)",
      "Fully functional kitchen with equipment",
      "Portable griller",
      "Water dispenser with free 1 gallon",
      "Outdoor shower",
      "Toilet and bath with heater",
      "Tables and Chairs",
      "10-car parking space",
      "Free use of WiFi"
    ]
  },
  "overnight": {
    title: "OVERNIGHT",
    price: "₱ 16,500",
    duration: "3PM - 12NN (21 hours)",
    features: [
      "20 pax maximum",
      "Php 350 per additional pax",
      "Security Deposit of Php 3,000 per booking",
      "Air-conditioned room with 2 double sized bunk beds with pull out",
      "Air-conditioned room with 2 queen sized bunk beds with TV and T&B",
      "Infinity pool and karaoke",
      "Jacuzzi (free use for 30 minutes)",
      "Fully functional kitchen with equipment",
      "Portable griller",
      "Water dispenser with free 1 gallon",
      "Outdoor shower",
      "Toilet and bath with heater",
      "Tables and Chairs",
      "10-car parking space",
      "Free use of WiFi"
    ]
  },
  "night-tour": {
    title: "NIGHT TOUR",
    price: "₱ 13,500",
    duration: "8PM - 6AM (12 hours)",
    features: [
      "20 pax maximum",
      "Php 350 per additional pax",
      "Security Deposit of Php 3,000 per booking",
      "Air-conditioned room with 2 double sized bunk beds with pull out",
      "Air-conditioned room with 2 queen sized bunk beds with TV and T&B",
      "Infinity pool and karaoke",
      "Jacuzzi (free use for 30 minutes)",
      "Fully functional kitchen with equipment",
      "Portable griller",
      "Water dispenser with free 1 gallon",
      "Outdoor shower",
      "Toilet and bath with heater",
      "Tables and Chairs",
      "10-car parking space",
      "Free use of WiFi"
    ]
  }
};

if (pkg && packages[pkg]) {
  document.querySelector('.package-title').textContent = packages[pkg].title;
  document.querySelector('.package-price').textContent = packages[pkg].price;
  if (document.querySelector('.package-duration')) {
    document.querySelector('.package-duration').textContent = packages[pkg].duration;
  }
  const featuresList = document.querySelector('.features-list');
  if (featuresList) {
    featuresList.innerHTML = packages[pkg].features.map(f => `<li>${f}</li>`).join('');
  }
}

// Map package to image
const packageImages = {
  "day-tour": "/images/day.jpg",
  "overnight": "images/overnight.jpg",
  "night-tour": "/images/night.jpg"
};

const resortImageDiv = document.getElementById('resort-image');
if (pkg && packageImages[pkg] && resortImageDiv) {
  resortImageDiv.style.backgroundImage = `url('${packageImages[pkg]}')`;
  resortImageDiv.style.backgroundSize = "cover";
  resortImageDiv.style.backgroundPosition = "center";
  resortImageDiv.style.height = "300px"; // or your preferred height
  resortImageDiv.style.borderRadius = "16px"; // optional for rounded corners
}

// Prevent selecting previous dates for check-in (for <input type="date"> if present)
document.addEventListener('DOMContentLoaded', function() {
  const checkinInput = document.getElementById('checkin-date');
  if (checkinInput) {
    // Set today's date in YYYY-MM-DD format
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const minDate = `${yyyy}-${mm}-${dd}`;

    // If using <input type="date">
    if (checkinInput.type === 'date') {
      checkinInput.setAttribute('min', minDate);
    }

    // If using a text input with a custom calendar, block manual entry of past dates
    checkinInput.addEventListener('change', function() {
      const selected = new Date(this.value);
      const todayDate = new Date();
      todayDate.setHours(0,0,0,0);
      if (selected < todayDate) {
        alert('You cannot select a previous date for check-in.');
        this.value = '';
      }
    });
  }
});

// Floating chat button handler
document.addEventListener('DOMContentLoaded', function() {
    const chatBtn = document.getElementById('chatBtn');
    if (chatBtn) {
        chatBtn.addEventListener('click', function() {
            // Open Facebook Messenger
            const messengerUrl = 'https://m.me/amariurbanescape';
            window.open(messengerUrl, '_blank');
        });
    }
});