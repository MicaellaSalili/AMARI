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

// Update summary dates in booking summary when user selects dates
function updateSummaryDates() {
  const summaryDates = document.getElementById('summary-dates');
  const checkinInput = document.getElementById('checkin-date');
  const checkoutInput = document.getElementById('checkout-date');
  if (checkinInput && checkoutInput && summaryDates) {
    if (checkinInput.value && checkoutInput.value) {
      summaryDates.textContent = `${checkinInput.value} - ${checkoutInput.value}`;
    } else if (checkinInput.value) {
      summaryDates.textContent = checkinInput.value;
    } else {
      summaryDates.textContent = 'Select dates';
    }
  }
  // Update price if date changes
  updatePackageDisplay();
}

function selectDate(date, element) {
  if (!selectedCheckin || isSelectingCheckout) {
    if (!selectedCheckin) {
      selectedCheckin = date;
      isSelectingCheckout = true;
      document.getElementById('checkin-date').value = formatDate(date);
    } else if (isSelectingCheckout) {
      const params = new URLSearchParams(window.location.search);
      const selectedPackage = params.get('package') || 'overnight';
      
      // For day tour, allow same check-in and check-out date
      if (selectedPackage === 'day-tour') {
        if (date >= selectedCheckin) {
          selectedCheckout = date;
          document.getElementById('checkout-date').value = formatDate(date);
          isSelectingCheckout = false;
          document.getElementById('confirm-reservation').disabled = false;
        } else {
          alert('Check-out date must be on or after check-in date');
          return;
        }
      } else {
        // For other packages, check-out must be after check-in
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
    }
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
    updateSummaryDates(); // <-- Add this line to sync summary dates
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
    const guestFormActions = document.getElementById('guest-form-actions');
    const paymentSection = document.getElementById('payment-section');
    const confirmBtn = document.getElementById('confirm-reservation');
    
    if (guestForm.style.display === 'none') {
      guestForm.style.display = 'block';
      guestFormActions.style.display = 'block';
      confirmBtn.textContent = 'Continue to Payment';
      confirmBtn.scrollIntoView({ behavior: 'smooth' });
    } else if (paymentSection.style.display === 'none') {
      // Validate guest form first
      const form = document.getElementById('reservation-form');
      const formData = new FormData(form);
      
      const guestName = formData.get('guestName')?.trim();
      const email = formData.get('email')?.trim();
      const phone = formData.get('phone')?.trim();
      const numberOfGuests = formData.get('numberOfGuests');
      
      if (!guestName || !email || !phone || !numberOfGuests) {
        alert('Please fill in all required guest information first.');
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }
      
      // Hide guest form actions and show payment section
      guestFormActions.style.display = 'none';
      paymentSection.style.display = 'block';
      confirmBtn.textContent = 'Complete Booking';
      
      // Update booking summary
      updateBookingSummary();
      paymentSection.scrollIntoView({ behavior: 'smooth' });
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

  // Get payment information
  const selectedPaymentMethod = document.querySelector('.payment-method.active');
  const paymentMethod = selectedPaymentMethod ? selectedPaymentMethod.dataset.method : 'gcash';
  
  let paymentDetails = {};
  
  // Capture payment details based on selected method
  switch (paymentMethod) {
    case 'gcash':
      paymentDetails = {
        gcashNumber: document.getElementById('gcash-number')?.value?.trim() || '',
        gcashName: document.getElementById('gcash-name')?.value?.trim() || ''
      };
      break;
    case 'maya':
      paymentDetails = {
        mayaNumber: document.getElementById('maya-number')?.value?.trim() || '',
        mayaName: document.getElementById('maya-name')?.value?.trim() || ''
      };
      break;
    case 'card':
      paymentDetails = {
        cardNumber: document.getElementById('card-number')?.value?.trim() || '',
        cardName: document.getElementById('card-name')?.value?.trim() || '',
        cardExpiry: document.getElementById('card-expiry')?.value?.trim() || '',
        cardCvv: document.getElementById('card-cvv')?.value?.trim() || ''
      };
      break;
    case 'bank':
      paymentDetails = {
        bankName: document.getElementById('bank-name')?.value?.trim() || '',
        accountNumber: document.getElementById('account-number')?.value?.trim() || '',
        accountName: document.getElementById('account-name')?.value?.trim() || ''
      };
      break;
  }
  
  // Get current package info and pricing
  const params = new URLSearchParams(window.location.search);
  const pkg = params.get('package') || 'overnight';
  const packageInfo = getSelectedPackagePrice();
  
  const reservationData = {
    guestName: guestName,
    email: email,
    phone: phone,
    numberOfGuests: parseInt(numberOfGuests),
    specialRequests: formData.get('specialRequests')?.trim() || '',
    package: pkg,
    checkinDate: selectedCheckin.toISOString().split('T')[0],
    checkoutDate: selectedCheckout.toISOString().split('T')[0],
    paymentMethod: paymentMethod,
    paymentDetails: paymentDetails,
    totalAmount: packageInfo.price,
    bookingDate: new Date().toISOString().split('T')[0]
  };
  
  try {
    // Disable the button and show loading
    const confirmBtn = document.getElementById('confirm-reservation');
    const completeBookingBtn = document.getElementById('complete-booking-btn');
    const activeBtn = completeBookingBtn || confirmBtn; // Use whichever button is available
    
    if (activeBtn) {
      const originalText = activeBtn.textContent;
      activeBtn.disabled = true;
      activeBtn.textContent = 'Submitting...';
      
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reservationData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Show success modal
        showSuccessModal({
          reservationId: result.reservation.id,
          package: packages[pkg]?.title || pkg,
          checkin: formatDate(selectedCheckin),
          checkout: formatDate(selectedCheckout),
          guest: guestName,
          guests: numberOfGuests,
          paymentMethod: paymentMethod.toUpperCase(),
          total: getSelectedPackagePrice().formatted
        });
      } else {
        alert('Failed to submit reservation: ' + (result.message || 'Unknown error'));
      }
      
      // Re-enable the button
      activeBtn.disabled = false;
      activeBtn.textContent = originalText;
    }
  } catch (error) {
    console.error('Error submitting reservation:', error);
    alert('Error submitting reservation. Please check your internet connection and try again.');
    
    // Re-enable the button in case of error
    const confirmBtn = document.getElementById('confirm-reservation');
    const completeBookingBtn = document.getElementById('complete-booking-btn');
    const activeBtn = completeBookingBtn || confirmBtn;
    if (activeBtn) {
      activeBtn.disabled = false;
      activeBtn.textContent = activeBtn.id === 'complete-booking-btn' ? 'Complete Booking' : 'Confirm Reservation';
    }
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
  
  // Reset guest form actions
  const guestFormActions = document.getElementById('guest-form-actions');
  if (guestFormActions) {
    guestFormActions.style.display = 'none';
  }
  
  // Reset payment section
  const paymentSection = document.getElementById('payment-section');
  if (paymentSection) {
    paymentSection.style.display = 'none';
  }
  
  // Reset button
  const confirmBtn = document.getElementById('confirm-reservation');
  confirmBtn.disabled = true;
  confirmBtn.textContent = 'Confirm Reservation';
  
  // Regenerate calendar
  generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
}

// --- Payment Section Logic ---
document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const guestFormSection = document.getElementById('guest-form');
  const guestFormActions = document.getElementById('guest-form-actions');
  const paymentSection = document.getElementById('payment-section');
  const reservationForm = document.getElementById('reservation-form');
  const confirmBtn = document.getElementById('confirm-reservation');
  const paymentMethods = document.querySelectorAll('.payment-method');
  const numGuestsInput = document.getElementById('num-guests');
  const summaryGuests = document.getElementById('summary-guests');
  const summaryDates = document.getElementById('summary-dates');
  const checkinInput = document.getElementById('checkin-date');
  const checkoutInput = document.getElementById('checkout-date');

  // Show guest form by default
  if (guestFormSection) guestFormSection.style.display = 'block';
  
  // Hide guest form actions and payment section initially
  if (guestFormActions) guestFormActions.style.display = 'none';
  if (paymentSection) paymentSection.style.display = 'none';

  // Update summary guests
  if (numGuestsInput && summaryGuests) {
    numGuestsInput.addEventListener('input', function() {
      summaryGuests.textContent = this.value;
    });
  }

  // Update summary dates if you have date pickers
  if (checkinInput && checkoutInput) {
    checkinInput.addEventListener('change', updateSummaryDates);
    checkoutInput.addEventListener('change', updateSummaryDates);
  }

  // Form validation - removed automatic payment section show
  function validateGuestForm() {
    let valid = true;
    if (!reservationForm) return false;
    reservationForm.querySelectorAll('input[required]').forEach(field => {
      if (!field.value.trim()) valid = false;
    });
    return valid;
  }

  // Update confirm button state based on guest form validation
  if (reservationForm) {
    reservationForm.addEventListener('input', function() {
      if (validateGuestForm() && selectedCheckin && selectedCheckout) {
        if (confirmBtn) confirmBtn.disabled = false;
        if (guestFormActions) guestFormActions.style.display = 'block';
      } else {
        if (confirmBtn) confirmBtn.disabled = true;
        if (guestFormActions) guestFormActions.style.display = 'none';
      }
    });
  }

  // Payment method switching
  if (paymentMethods.length) {
    paymentMethods.forEach(method => {
      method.addEventListener('click', function() {
        paymentMethods.forEach(m => m.classList.remove('active'));
        this.classList.add('active');
        document.querySelectorAll('#payment-form > div').forEach(form => {
          form.style.display = 'none';
        });
        const selectedForm = document.getElementById(this.dataset.method + '-form');
        if (selectedForm) selectedForm.style.display = 'block';
      });
    });
  }

  // Card formatting
  const cardNumberInput = document.getElementById('card-number');
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
      e.target.value = formattedValue;
    });
  }
  const expiryInput = document.getElementById('card-expiry');
  if (expiryInput) {
    expiryInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
      e.target.value = value;
    });
  }

  // Initial state
  if (confirmBtn) confirmBtn.disabled = true;
  updateSummaryDates();
});

generateCalendar(currentDate.getFullYear(), currentDate.getMonth());

// --- PACKAGE LOGIC WITH WEEKDAY/WEEKEND PRICING ---
const params = new URLSearchParams(window.location.search);
const pkg = params.get('package');

const packages = {
  "day-tour": {
    title: "DAY TOUR",
    price_weekday: 12500,
    price_weekend: 15000,
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
    price_weekday: 19500,
    price_weekend: 22500,
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
    price_weekday: 13500,
    price_weekend: 16000,
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

// Helper to determine if a date is weekend
function isWeekend(dateStr) {
  let date;
  // Try to detect format: yyyy-mm-dd (from <input type="date">)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split('-').map(Number);
    date = new Date(year, month - 1, day);
  } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    // dd/mm/yyyy
    const [day, month, year] = dateStr.split('/').map(Number);
    date = new Date(year, month - 1, day);
  } else {
    return false; // Unknown format
  }
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
}

// Helper to get the correct price based on selected package and date
function getSelectedPackagePrice() {
  const params = new URLSearchParams(window.location.search);
  const pkgKey = params.get('package') || 'overnight';
  const dayType = params.get('daytype'); // 'weekday' or 'weekend'
  const pkg = packages[pkgKey];
  if (!pkg) return { price: 0, formatted: "₱ 0" };

  let price = pkg.price_weekday;

  // Priority: URL daytype param > check-in date
  if (dayType === 'weekend') {
    price = pkg.price_weekend;
  } else if (dayType === 'weekday') {
    price = pkg.price_weekday;
  } else {
    // Fallback to check-in date logic
    const checkinInput = document.getElementById('checkin-date');
    if (checkinInput && checkinInput.value) {
      if (isWeekend(checkinInput.value)) {
        price = pkg.price_weekend;
      }
    }
  }
  return { price, formatted: `₱ ${price.toLocaleString()}` };
}

// Update package info and summary when package or date changes
function updatePackageDisplay() {
  const params = new URLSearchParams(window.location.search);
  const pkgKey = params.get('package') || 'overnight';
  const pkg = packages[pkgKey];

  if (!pkg) return;

  // Update package info section (if you have these elements)
  const titleElem = document.querySelector('.package-title');
  const priceElem = document.querySelector('.package-price');
  const durationElem = document.querySelector('.package-duration');
  const featuresList = document.querySelector('.features-list');
  if (titleElem) titleElem.textContent = pkg.title;
  if (priceElem) priceElem.textContent = getSelectedPackagePrice().formatted;
  if (durationElem) durationElem.textContent = pkg.duration;
  if (featuresList) featuresList.innerHTML = pkg.features.map(f => `<li>${f}</li>`).join('');

  // Update booking summary details
  const summaryPackage = document.getElementById('summary-package');
  const summaryDuration = document.getElementById('summary-duration');
  if (summaryPackage) summaryPackage.textContent = pkg.title;
  if (summaryDuration) summaryDuration.textContent = pkg.duration;

  updateSummaryGuestsAndTotal();
}

function updateSummaryGuestsAndTotal() {
  const numGuestsInput = document.getElementById('num-guests');
  const summaryGuests = document.getElementById('summary-guests');
  const summarySubtotal = document.getElementById('summary-subtotal');
  const summaryTotal = document.getElementById('summary-total');
  if (numGuestsInput && summaryGuests) {
    summaryGuests.textContent = numGuestsInput.value;
  }
  if (summarySubtotal && summaryTotal) {
    const pkgPrice = getSelectedPackagePrice();
    summarySubtotal.textContent = pkgPrice.formatted;
    summaryTotal.textContent = pkgPrice.formatted;
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

function updateBookingSummary() {
  const form = document.getElementById('reservation-form');
  const formData = new FormData(form);
  const params = new URLSearchParams(window.location.search);
  const pkg = params.get('package') || 'overnight';
  const packageInfo = packages[pkg];
  const pricing = getSelectedPackagePrice();
  
  // Update summary fields
  document.getElementById('summary-package').textContent = packageInfo?.title || pkg.toUpperCase();
  document.getElementById('summary-duration').textContent = packageInfo?.duration || '';
  document.getElementById('summary-guests').textContent = formData.get('numberOfGuests') || '1';
  document.getElementById('summary-dates').textContent = `${formatDate(selectedCheckin)} - ${formatDate(selectedCheckout)}`;
  document.getElementById('summary-subtotal').textContent = pricing.formatted;
  document.getElementById('summary-total').textContent = pricing.formatted;
}

// Handle Complete Booking button click (separate from main confirm button)
document.addEventListener('DOMContentLoaded', function() {
  const completeBookingBtn = document.getElementById('complete-booking-btn');
  if (completeBookingBtn) {
    completeBookingBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Complete Booking button clicked'); // Debug log
      submitReservation();
    });
  }
});

// Success Modal Functions
function showSuccessModal(data) {
  const modal = document.getElementById('successModal');
  
  // Populate modal with reservation data
  document.getElementById('modal-reservation-id').textContent = data.reservationId;
  document.getElementById('modal-package').textContent = data.package;
  document.getElementById('modal-checkin').textContent = data.checkin;
  document.getElementById('modal-checkout').textContent = data.checkout;
  document.getElementById('modal-guest').textContent = data.guest;
  document.getElementById('modal-guests').textContent = data.guests;
  document.getElementById('modal-payment').textContent = data.paymentMethod;
  document.getElementById('modal-total').textContent = data.total;
  
  // Show modal with animation
  modal.style.display = 'flex';
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
  
  // Disable body scroll
  document.body.style.overflow = 'hidden';
}

function hideSuccessModal() {
  const modal = document.getElementById('successModal');
  modal.classList.remove('show');
  
  setTimeout(() => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }, 300);
}

// Modal Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('successModal');
  const closeBtn = document.getElementById('closeSuccessModal');
  const newReservationBtn = document.getElementById('newReservationBtn');
  
  // Close modal button
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      hideSuccessModal();
      resetBookingForm();
    });
  }
  
  // New reservation button
  if (newReservationBtn) {
    newReservationBtn.addEventListener('click', function() {
      hideSuccessModal();
      resetBookingForm();
    });
  }
  
  // Close modal when clicking overlay
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        hideSuccessModal();
        resetBookingForm();
      }
    });
  }
  
  // Close modal with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      hideSuccessModal();
      resetBookingForm();
    }
  });
});

// Responsive functionality for booking page
let currentBreakpoint = getBookingBreakpoint();
let bookingResizeTimer;

// Get current screen breakpoint for booking page
function getBookingBreakpoint() {
    const width = window.innerWidth;
    if (width <= 320) return 'xs';
    if (width <= 480) return 'sm';
    if (width <= 768) return 'md';
    if (width <= 1024) return 'lg';
    return 'xl';
}

// Enhanced responsive calendar sizing
function adjustCalendarForBreakpoint() {
    const calendar = document.getElementById('calendar-grid');
    const calendarDays = calendar.querySelectorAll('.calendar-day');
    
    if (currentBreakpoint === 'xs') {
        calendar.style.gap = '0.15rem';
        calendarDays.forEach(day => {
            day.style.height = '30px';
            day.style.fontSize = '0.7rem';
        });
    } else if (currentBreakpoint === 'sm') {
        calendar.style.gap = '0.2rem';
        calendarDays.forEach(day => {
            day.style.height = '35px';
            day.style.fontSize = '0.8rem';
        });
    } else {
        calendar.style.gap = '';
        calendarDays.forEach(day => {
            day.style.height = '';
            day.style.fontSize = '';
        });
    }
}

// Enhanced payment method selection for mobile
function enhancePaymentMethodsForMobile() {
    if (currentBreakpoint === 'xs' || currentBreakpoint === 'sm') {
        const paymentMethods = document.querySelectorAll('.payment-method');
        paymentMethods.forEach(method => {
            // Add touch-friendly sizing
            method.style.minHeight = '56px';
            method.style.padding = '12px';
            
            // Add haptic feedback if available
            method.addEventListener('click', function() {
                if ('vibrate' in navigator) {
                    navigator.vibrate(50);
                }
            });
        });
    }
}

// Responsive form validation messages
function showResponsiveValidationMessage(element, message) {
    // Remove existing message
    const existingMessage = element.parentNode.querySelector('.validation-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageElement = document.createElement('div');
    messageElement.className = 'validation-message';
    messageElement.textContent = message;
    
    // Style based on breakpoint
    if (currentBreakpoint === 'xs' || currentBreakpoint === 'sm') {
        messageElement.style.cssText = `
            color: #e53e3e;
            font-size: 12px;
            margin-top: 4px;
            padding: 6px;
            background: #fed7d7;
            border-radius: 4px;
            border: 1px solid #feb2b2;
        `;
    } else {
        messageElement.style.cssText = `
            color: #e53e3e;
            font-size: 13px;
            margin-top: 6px;
            padding: 8px;
            background: #fed7d7;
            border-radius: 6px;
            border: 1px solid #feb2b2;
        `;
    }
    
    element.parentNode.appendChild(messageElement);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
        }
    }, 5000);
}

// Enhanced booking flow navigation for mobile
function enhanceBookingFlowForMobile() {
    if (currentBreakpoint === 'xs' || currentBreakpoint === 'sm') {
        // Add progress indicator
        const progressIndicator = document.createElement('div');
        progressIndicator.className = 'booking-progress';
        progressIndicator.innerHTML = `
            <div class="progress-step active" data-step="1">
                <span class="step-number">1</span>
                <span class="step-label">Dates</span>
            </div>
            <div class="progress-step" data-step="2">
                <span class="step-number">2</span>
                <span class="step-label">Guest Info</span>
            </div>
            <div class="progress-step" data-step="3">
                <span class="step-number">3</span>
                <span class="step-label">Payment</span>
            </div>
            <div class="progress-step" data-step="4">
                <span class="step-number">4</span>
                <span class="step-label">Confirm</span>
            </div>
        `;
        progressIndicator.style.cssText = `
            display: flex;
            justify-content: space-between;
            padding: 16px;
            background: white;
            border-radius: 12px;
            margin-bottom: 16px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        `;
        
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.insertBefore(progressIndicator, mainContent.firstChild);
        }
    }
}

// Update progress indicator
function updateBookingProgress(step) {
    const progressSteps = document.querySelectorAll('.progress-step');
    progressSteps.forEach((stepEl, index) => {
        if (index < step) {
            stepEl.classList.add('completed');
            stepEl.classList.remove('active');
        } else if (index === step - 1) {
            stepEl.classList.add('active');
            stepEl.classList.remove('completed');
        } else {
            stepEl.classList.remove('active', 'completed');
        }
    });
}

// Responsive resize handler for booking page
window.addEventListener('resize', function() {
    clearTimeout(bookingResizeTimer);
    bookingResizeTimer = setTimeout(function() {
        const newBreakpoint = getBookingBreakpoint();
        
        if (newBreakpoint !== currentBreakpoint) {
            currentBreakpoint = newBreakpoint;
            
            // Re-adjust calendar
            adjustCalendarForBreakpoint();
            
            // Re-enhance payment methods
            enhancePaymentMethodsForMobile();
            
            // Re-enhance booking flow
            enhanceBookingFlowForMobile();
        }
    }, 150);
});

// Enhanced keyboard navigation for booking form
document.addEventListener('keydown', function(e) {
    // Tab navigation enhancement for mobile
    if (e.key === 'Tab' && (currentBreakpoint === 'xs' || currentBreakpoint === 'sm')) {
        const focusableElements = document.querySelectorAll(
            'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        
        const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
        
        if (e.shiftKey) {
            // Shift+Tab - go to previous element
            if (currentIndex > 0) {
                e.preventDefault();
                focusableElements[currentIndex - 1].focus();
            }
        } else {
            // Tab - go to next element
            if (currentIndex < focusableElements.length - 1) {
                e.preventDefault();
                focusableElements[currentIndex + 1].focus();
            }
        }
    }
});

// Initialize responsive enhancements when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    currentBreakpoint = getBookingBreakpoint();
    
    // Initial setup
    setTimeout(() => {
        adjustCalendarForBreakpoint();
        enhancePaymentMethodsForMobile();
        enhanceBookingFlowForMobile();
    }, 100);
});