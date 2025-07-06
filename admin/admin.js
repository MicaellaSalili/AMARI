// Admin Panel JavaScript for CRUD operations

let reservations = [];
let currentEditId = null;
let currentDeleteId = null;
let currentView = 'card'; // 'card' or 'table'

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication().then(isAuthenticated => {
        if (isAuthenticated) {
            loadReservations();
            setupEventListeners();
            setupLogoutButton();
        } else {
            // Redirect to login page
            window.location.href = '/login';
        }
    });
});

// Check if user is authenticated
async function checkAuthentication() {
    try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        return data.authenticated;
    } catch (error) {
        console.error('Error checking authentication:', error);
        return false;
    }
}

// Setup logout functionality
function setupLogoutButton() {
    // Add logout button to admin header
    const adminActions = document.querySelector('.admin-actions');
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'logout-btn';
    logoutBtn.innerHTML = '🚪 Logout';
    logoutBtn.onclick = handleLogout;
    adminActions.appendChild(logoutBtn);
}

// Handle logout
async function handleLogout() {
    try {
        const response = await fetch('/api/logout', {
            method: 'POST'
        });
        
        if (response.ok) {
            window.location.href = '/login';
        } else {
            console.error('Logout failed');
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Package information
const packages = {
    "day-tour": {
        title: "Day Tour",
        price: "₱12,500",
        duration: "8AM - 5PM (9 hours)"
    },
    "overnight": {
        title: "Overnight",
        price: "₱16,500",
        duration: "3PM - 12NN (21 hours)"
    },
    "night-tour": {
        title: "Night Tour",
        price: "₱13,500",
        duration: "8PM - 6AM (12 hours)"
    }
};

// Setup event listeners
function setupEventListeners() {
    // Modal close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.onclick = function() {
            closeEditModal();
            closeDeleteModal();
        };
    });

    // Close modals when clicking outside
    window.onclick = function(event) {
        const editModal = document.getElementById('edit-modal');
        const deleteModal = document.getElementById('delete-modal');
        if (event.target === editModal) {
            closeEditModal();
        }
        if (event.target === deleteModal) {
            closeDeleteModal();
        }
    };

    // Edit form submission
    document.getElementById('edit-form').addEventListener('submit', function(e) {
        e.preventDefault();
        updateReservation();
    });

    // Delete confirmation
    document.getElementById('confirm-delete').addEventListener('click', function() {
        deleteReservation();
    });

    // Payment method change listener for edit modal
    const editPaymentMethod = document.getElementById('edit-payment-method');
    if (editPaymentMethod) {
        editPaymentMethod.addEventListener('change', function() {
            const currentReservation = reservations.find(r => r.id === currentEditId);
            if (currentReservation) {
                populatePaymentDetails(this.value, currentReservation.paymentDetails);
            }
        });
    }
}

// Load all reservations from server
async function loadReservations() {
    try {
        showLoading(true);
        const response = await fetch('/api/reservations');
        
        if (response.status === 401) {
            // Unauthorized - redirect to login
            window.location.href = '/login';
            return;
        }
        
        const data = await response.json();
        
        if (data.success) {
            reservations = data.reservations;
            displayReservations(reservations);
            updateTotalCount(reservations.length);
        } else {
            showError('Failed to load reservations');
        }
    } catch (error) {
        console.error('Error loading reservations:', error);
        showError('Error connecting to server');
    } finally {
        showLoading(false);
    }
}

// Display reservations in the grid
function displayReservations(reservationList) {
    const container = document.getElementById('reservations-container');
    const noDataDiv = document.getElementById('no-data');
    
    if (reservationList.length === 0) {
        container.innerHTML = '';
        noDataDiv.style.display = 'block';
        return;
    }

    noDataDiv.style.display = 'none';
    
    if (currentView === 'card') {
        displayCardView(reservationList);
    } else {
        displayTableView(reservationList);
    }
}

// Display card view
function displayCardView(reservationList) {
    const container = document.getElementById('reservations-container');
    container.className = 'reservations-grid';
    container.innerHTML = reservationList.map(reservation => createReservationCard(reservation)).join('');
}

// Create reservation card HTML
function createReservationCard(reservation) {
    const packageInfo = packages[reservation.package] || { title: reservation.package, price: 'N/A' };
    const checkinDate = new Date(reservation.checkinDate).toLocaleDateString();
    const checkoutDate = new Date(reservation.checkoutDate).toLocaleDateString();
    const createdDate = new Date(reservation.createdAt).toLocaleDateString();
    const createdTime = new Date(reservation.createdAt).toLocaleString();
    
    // Format payment method display
    const paymentMethodDisplay = reservation.paymentMethod 
        ? reservation.paymentMethod.toUpperCase()
        : 'Not specified';
    
    // Format total amount display
    const totalAmountDisplay = reservation.totalAmount 
        ? `₱${reservation.totalAmount.toLocaleString()}`
        : packageInfo.price;
    
    return `
        <div class="reservation-card">
            <div class="card-header">
                <div class="card-id">ID: ${reservation.id}</div>
                <div class="status-badge status-${reservation.status}">${reservation.status.toUpperCase()}</div>
            </div>
            
            <div class="guest-name">${reservation.guestName}</div>
            
            <div class="card-details">
                <div class="detail-item">
                    <div class="detail-label">Package</div>
                    <div class="detail-value">
                        <span class="package-badge">${packageInfo.title}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Total Amount</div>
                    <div class="detail-value">${totalAmountDisplay}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Payment Method</div>
                    <div class="detail-value">${paymentMethodDisplay}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Check-in</div>
                    <div class="detail-value">${checkinDate}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Check-out</div>
                    <div class="detail-value">${checkoutDate}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Guests</div>
                    <div class="detail-value">${reservation.numberOfGuests} people</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Contact</div>
                    <div class="detail-value">${reservation.email}<br>${reservation.phone}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Created</div>
                    <div class="detail-value">${createdTime}</div>
                </div>
            </div>
            
            ${reservation.specialRequests ? `
                <div class="detail-item">
                    <div class="detail-label">Special Requests</div>
                    <div class="detail-value">${reservation.specialRequests}</div>
                </div>
            ` : ''}
            
            ${reservation.paymentDetails ? `
                <div class="detail-item">
                    <div class="detail-label">Payment Details</div>
                    <div class="detail-value payment-details">
                        ${formatPaymentDetails(reservation.paymentMethod, reservation.paymentDetails)}
                    </div>
                </div>
            ` : ''}
            
            <div class="card-actions">
                <button class="edit-btn" onclick="openEditModal('${reservation.id}')">✏️ Edit</button>
                <button class="delete-btn" onclick="openDeleteModal('${reservation.id}')">🗑️ Delete</button>
            </div>
        </div>
    `;
}

// Create mobile card view for small screens
function createMobileCard(reservation) {
    const packageInfo = packages[reservation.package] || { title: reservation.package };
    const checkinDate = new Date(reservation.checkinDate).toLocaleDateString();
    const checkoutDate = new Date(reservation.checkoutDate).toLocaleDateString();
    const totalAmountDisplay = reservation.totalAmount 
        ? `₱${reservation.totalAmount.toLocaleString()}`
        : 'N/A';
    const paymentMethodDisplay = reservation.paymentMethod 
        ? reservation.paymentMethod.toUpperCase()
        : 'Not specified';
    
    return `
        <div class="mobile-card">
            <div class="mobile-card-header">
                <div class="mobile-card-id">ID: ${reservation.id}</div>
                <span class="status-badge status-${reservation.status}">${reservation.status.toUpperCase()}</span>
            </div>
            <div class="mobile-card-name">${reservation.guestName}</div>
            <div class="mobile-card-details">
                <div class="mobile-card-detail">
                    <div class="mobile-card-label">Package</div>
                    <div class="mobile-card-value">
                        <span class="package-badge">${packageInfo.title}</span>
                    </div>
                </div>
                <div class="mobile-card-detail">
                    <div class="mobile-card-label">Amount</div>
                    <div class="mobile-card-value">${totalAmountDisplay}</div>
                </div>
                <div class="mobile-card-detail">
                    <div class="mobile-card-label">Payment</div>
                    <div class="mobile-card-value">${paymentMethodDisplay}</div>
                </div>
                <div class="mobile-card-detail">
                    <div class="mobile-card-label">Check-in</div>
                    <div class="mobile-card-value">${checkinDate}</div>
                </div>
                <div class="mobile-card-detail">
                    <div class="mobile-card-label">Guests</div>
                    <div class="mobile-card-value">${reservation.numberOfGuests}</div>
                </div>
                <div class="mobile-card-detail">
                    <div class="mobile-card-label">Contact</div>
                    <div class="mobile-card-value">${reservation.phone}</div>
                </div>
            </div>
            <div class="mobile-card-actions">
                <button class="edit-btn" onclick="openEditModal('${reservation.id}')">✏️ Edit</button>
                <button class="delete-btn" onclick="openDeleteModal('${reservation.id}')">🗑️ Delete</button>
            </div>
        </div>
    `;
}

// Display table view
function displayTableView(reservationList) {
    const container = document.getElementById('reservations-container');
    container.className = 'table-container';
    
    // Check if screen is mobile size using current breakpoint
    const isMobile = currentBreakpoint === 'xs' || currentBreakpoint === 'sm';
    
    if (isMobile) {
        container.classList.add('mobile-cards');
        container.innerHTML = reservationList.map(reservation => createMobileCard(reservation)).join('');
    } else {
        container.innerHTML = `
            <table class="reservations-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Guest Name</th>
                        <th>Contact</th>
                        <th>Package</th>
                        <th>Amount</th>
                        <th>Payment</th>
                        <th>Check-in</th>
                        <th>Check-out</th>
                        <th>Guests</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${reservationList.map(reservation => createReservationRow(reservation)).join('')}
                </tbody>
            </table>
        `;
    }
}

// Create reservation table row HTML
function createReservationRow(reservation) {
    const packageInfo = packages[reservation.package] || { title: reservation.package };
    const checkinDate = new Date(reservation.checkinDate).toLocaleDateString();
    const checkoutDate = new Date(reservation.checkoutDate).toLocaleDateString();
    const createdDateTime = new Date(reservation.createdAt).toLocaleString();
    
    // Format payment method and amount
    const paymentMethodDisplay = reservation.paymentMethod 
        ? reservation.paymentMethod.toUpperCase()
        : 'Not specified';
    
    const totalAmountDisplay = reservation.totalAmount 
        ? `₱${reservation.totalAmount.toLocaleString()}`
        : 'N/A';
    
    return `
        <tr>
            <td>${reservation.id}</td>
            <td>${reservation.guestName}</td>
            <td>${reservation.email}<br><small>${reservation.phone}</small></td>
            <td><span class="package-badge">${packageInfo.title}</span></td>
            <td>${totalAmountDisplay}</td>
            <td>${paymentMethodDisplay}</td>
            <td>${checkinDate}</td>
            <td>${checkoutDate}</td>
            <td>${reservation.numberOfGuests}</td>
            <td><span class="status-badge status-${reservation.status}">${reservation.status.toUpperCase()}</span></td>
            <td>${createdDateTime}</td>
            <td>
                <div class="table-actions">
                    <button class="edit-btn" onclick="openEditModal('${reservation.id}')">✏️ Edit</button>
                    <button class="delete-btn" onclick="openDeleteModal('${reservation.id}')">🗑️ Delete</button>
                </div>
            </td>
        </tr>
    `;
}

// Update total count display
function updateTotalCount(count) {
    document.getElementById('total-count').textContent = count;
}

// View switching
function switchView(view) {
    currentView = view;
    
    // Update button states
    document.getElementById('card-view-btn').classList.toggle('active', view === 'card');
    document.getElementById('table-view-btn').classList.toggle('active', view === 'table');
    
    // Redisplay with current data
    displayReservations(reservations);
}

// Filter functionality
function applyFilters() {
    const statusFilter = document.getElementById('status-filter').value;
    const packageFilter = document.getElementById('package-filter').value;
    const paymentFilter = document.getElementById('payment-filter').value;
    const dateFilter = document.getElementById('date-filter').value;
    
    let filteredReservations = [...reservations];
    
    if (statusFilter) {
        filteredReservations = filteredReservations.filter(r => r.status === statusFilter);
    }
    
    if (packageFilter) {
        filteredReservations = filteredReservations.filter(r => r.package === packageFilter);
    }
    
    if (paymentFilter) {
        filteredReservations = filteredReservations.filter(r => r.paymentMethod === paymentFilter);
    }
    
    if (dateFilter) {
        filteredReservations = filteredReservations.filter(r => 
            new Date(r.checkinDate).toDateString() === new Date(dateFilter).toDateString()
        );
    }
    
    displayReservations(filteredReservations);
    updateTotalCount(filteredReservations.length);
}

function clearFilters() {
    document.getElementById('status-filter').value = '';
    document.getElementById('package-filter').value = '';
    document.getElementById('payment-filter').value = '';
    document.getElementById('date-filter').value = '';
    
    displayReservations(reservations);
    updateTotalCount(reservations.length);
}

// Modal functions
function openEditModal(reservationId) {
    const reservation = reservations.find(r => r.id === reservationId);
    if (!reservation) return;
    
    currentEditId = reservationId;
    
    // Populate form fields
    document.getElementById('edit-guest-name').value = reservation.guestName;
    document.getElementById('edit-email').value = reservation.email;
    document.getElementById('edit-phone').value = reservation.phone;
    document.getElementById('edit-package').value = reservation.package;
    document.getElementById('edit-checkin').value = reservation.checkinDate;
    document.getElementById('edit-checkout').value = reservation.checkoutDate;
    document.getElementById('edit-guests').value = reservation.numberOfGuests;
    document.getElementById('edit-total-amount').value = reservation.totalAmount || '';
    document.getElementById('edit-payment-method').value = reservation.paymentMethod || '';
    document.getElementById('edit-status').value = reservation.status;
    document.getElementById('edit-requests').value = reservation.specialRequests || '';
    
    // Populate payment details
    populatePaymentDetails(reservation.paymentMethod, reservation.paymentDetails);
    
    const modal = document.getElementById('edit-modal');
    modal.style.display = 'block';
    
    // Adjust modal for current breakpoint
    setTimeout(() => adjustModalForBreakpoint(modal), 50);
    
    // Focus first input on larger screens, avoid on mobile to prevent keyboard issues
    if (currentBreakpoint !== 'xs' && currentBreakpoint !== 'sm') {
        setTimeout(() => document.getElementById('edit-guest-name').focus(), 100);
    }
}

function closeEditModal() {
    document.getElementById('edit-modal').style.display = 'none';
    currentEditId = null;
}

function openDeleteModal(reservationId) {
    currentDeleteId = reservationId;
    document.getElementById('delete-modal').style.display = 'block';
}

function closeDeleteModal() {
    document.getElementById('delete-modal').style.display = 'none';
    currentDeleteId = null;
}

// Populate payment details in edit modal
function populatePaymentDetails(paymentMethod, paymentDetails) {
    const container = document.getElementById('edit-payment-details');
    if (!container) return;
    
    // Clear existing content
    container.innerHTML = '';
    
    if (!paymentMethod || !paymentDetails) {
        container.innerHTML = '<p class="no-payment-info">No payment details available</p>';
        return;
    }
    
    let formHTML = '';
    
    switch (paymentMethod) {
        case 'gcash':
            formHTML = `
                <div class="form-group">
                    <label>GCash Number:</label>
                    <input type="text" id="edit-gcash-number" value="${paymentDetails.gcashNumber || ''}" readonly>
                </div>
                <div class="form-group">
                    <label>Account Name:</label>
                    <input type="text" id="edit-gcash-name" value="${paymentDetails.gcashName || ''}" readonly>
                </div>
            `;
            break;
        case 'maya':
            formHTML = `
                <div class="form-group">
                    <label>Maya Number:</label>
                    <input type="text" id="edit-maya-number" value="${paymentDetails.mayaNumber || ''}" readonly>
                </div>
                <div class="form-group">
                    <label>Account Name:</label>
                    <input type="text" id="edit-maya-name" value="${paymentDetails.mayaName || ''}" readonly>
                </div>
            `;
            break;
        case 'card':
            const maskedCardNumber = paymentDetails.cardNumber 
                ? paymentDetails.cardNumber.replace(/\d(?=\d{4})/g, '*')
                : '';
            formHTML = `
                <div class="form-group">
                    <label>Card Number:</label>
                    <input type="text" id="edit-card-number" value="${maskedCardNumber}" readonly>
                </div>
                <div class="form-group">
                    <label>Cardholder Name:</label>
                    <input type="text" id="edit-card-name" value="${paymentDetails.cardName || ''}" readonly>
                </div>
                <div class="form-group">
                    <label>Expiry Date:</label>
                    <input type="text" id="edit-card-expiry" value="${paymentDetails.cardExpiry || ''}" readonly>
                </div>
            `;
            break;
        case 'bank':
            const maskedAccountNumber = paymentDetails.accountNumber 
                ? paymentDetails.accountNumber.replace(/\d(?=\d{4})/g, '*')
                : '';
            formHTML = `
                <div class="form-group">
                    <label>Bank Name:</label>
                    <input type="text" id="edit-bank-name" value="${paymentDetails.bankName || ''}" readonly>
                </div>
                <div class="form-group">
                    <label>Account Number:</label>
                    <input type="text" id="edit-account-number" value="${maskedAccountNumber}" readonly>
                </div>
                <div class="form-group">
                    <label>Account Name:</label>
                    <input type="text" id="edit-account-name" value="${paymentDetails.accountName || ''}" readonly>
                </div>
            `;
            break;
        default:
            formHTML = '<p class="no-payment-info">Payment details not available</p>';
    }
    
    container.innerHTML = formHTML;
}

// CRUD operations
async function updateReservation() {
    const updatedData = {
        guestName: document.getElementById('edit-guest-name').value,
        email: document.getElementById('edit-email').value,
        phone: document.getElementById('edit-phone').value,
        package: document.getElementById('edit-package').value,
        checkinDate: document.getElementById('edit-checkin').value,
        checkoutDate: document.getElementById('edit-checkout').value,
        numberOfGuests: parseInt(document.getElementById('edit-guests').value),
        totalAmount: parseFloat(document.getElementById('edit-total-amount').value) || null,
        paymentMethod: document.getElementById('edit-payment-method').value || null,
        status: document.getElementById('edit-status').value,
        specialRequests: document.getElementById('edit-requests').value
    };
    
    try {
        const response = await fetch(`/api/reservations/${currentEditId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Reservation updated successfully!', 'success');
            closeEditModal();
            loadReservations();
        } else {
            showNotification('Failed to update reservation', 'error');
        }
    } catch (error) {
        console.error('Error updating reservation:', error);
        showNotification('Error updating reservation', 'error');
    }
}

async function deleteReservation() {
    try {
        const response = await fetch(`/api/reservations/${currentDeleteId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Reservation deleted successfully!', 'success');
            closeDeleteModal();
            loadReservations();
        } else {
            showNotification('Failed to delete reservation', 'error');
        }
    } catch (error) {
        console.error('Error deleting reservation:', error);
        showNotification('Error deleting reservation', 'error');
    }
}

// Format payment details for display
function formatPaymentDetails(paymentMethod, paymentDetails) {
    if (!paymentDetails || !paymentMethod) return 'Not available';
    
    switch (paymentMethod) {
        case 'gcash':
            return `GCash: ${paymentDetails.gcashNumber || 'N/A'}<br>Name: ${paymentDetails.gcashName || 'N/A'}`;
        case 'maya':
            return `Maya: ${paymentDetails.mayaNumber || 'N/A'}<br>Name: ${paymentDetails.mayaName || 'N/A'}`;
        case 'card':
            const maskedCardNumber = paymentDetails.cardNumber 
                ? paymentDetails.cardNumber.replace(/\d(?=\d{4})/g, '*')
                : 'N/A';
            return `Card: ${maskedCardNumber}<br>Name: ${paymentDetails.cardName || 'N/A'}<br>Expiry: ${paymentDetails.cardExpiry || 'N/A'}`;
        case 'bank':
            const maskedAccountNumber = paymentDetails.accountNumber 
                ? paymentDetails.accountNumber.replace(/\d(?=\d{4})/g, '*')
                : 'N/A';
            return `Bank: ${paymentDetails.bankName || 'N/A'}<br>Account: ${maskedAccountNumber}<br>Name: ${paymentDetails.accountName || 'N/A'}`;
        default:
            return 'Payment details not available';
    }
}

// Utility functions
function showLoading(show) {
    const loading = document.getElementById('loading');
    loading.style.display = show ? 'block' : 'none';
}

function showError(message) {
    const container = document.getElementById('reservations-container');
    container.innerHTML = `<div class="error-message">${message}</div>`;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#38a169' : type === 'error' ? '#e53e3e' : '#3182ce'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    `;
    
    notification.querySelector('button').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Enhanced responsive functionality
let resizeTimer;
let currentBreakpoint = getBreakpoint();

// Get current screen breakpoint
function getBreakpoint() {
    const width = window.innerWidth;
    if (width <= 320) return 'xs';
    if (width <= 480) return 'sm';
    if (width <= 768) return 'md';
    if (width <= 1024) return 'lg';
    return 'xl';
}

// Enhanced resize handler with debouncing
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        const newBreakpoint = getBreakpoint();
        
        // Only refresh if breakpoint changed
        if (newBreakpoint !== currentBreakpoint) {
            currentBreakpoint = newBreakpoint;
            
            // Refresh current view
            if (currentView === 'table') {
                displayReservations(reservations);
            }
            
            // Adjust modal if open
            const editModal = document.getElementById('edit-modal');
            const deleteModal = document.getElementById('delete-modal');
            if (editModal && editModal.style.display === 'block') {
                adjustModalForBreakpoint(editModal);
            }
            if (deleteModal && deleteModal.style.display === 'block') {
                adjustModalForBreakpoint(deleteModal);
            }
        }
    }, 150);
});

// Adjust modal layout for current breakpoint
function adjustModalForBreakpoint(modal) {
    const modalContent = modal.querySelector('.modal-content');
    const editForm = modal.querySelector('#edit-form');
    
    if (currentBreakpoint === 'xs' || currentBreakpoint === 'sm') {
        modalContent.style.width = '95%';
        modalContent.style.margin = '10px auto';
        modalContent.style.maxHeight = 'calc(100vh - 20px)';
        
        if (editForm) {
            editForm.style.maxHeight = 'calc(100vh - 140px)';
        }
    } else if (currentBreakpoint === 'md') {
        modalContent.style.width = '90%';
        modalContent.style.margin = '20px auto';
        modalContent.style.maxHeight = 'calc(100vh - 40px)';
        
        if (editForm) {
            editForm.style.maxHeight = 'calc(100vh - 160px)';
        }
    } else {
        modalContent.style.width = '';
        modalContent.style.margin = '';
        modalContent.style.maxHeight = '';
        
        if (editForm) {
            editForm.style.maxHeight = '';
        }
    }
}

// Enhanced mobile card creation with better touch interactions
function createEnhancedMobileCard(reservation) {
    const packageInfo = packages[reservation.package] || { title: reservation.package };
    const checkinDate = new Date(reservation.checkinDate).toLocaleDateString();
    const checkoutDate = new Date(reservation.checkoutDate).toLocaleDateString();
    const totalAmountDisplay = reservation.totalAmount 
        ? `₱${reservation.totalAmount.toLocaleString()}`
        : 'N/A';
    const paymentMethodDisplay = reservation.paymentMethod 
        ? reservation.paymentMethod.toUpperCase()
        : 'Not specified';
    
    return `
        <div class="mobile-card" data-id="${reservation.id}">
            <div class="mobile-card-header">
                <div class="mobile-card-id">ID: ${reservation.id.substring(0, 8)}...</div>
                <span class="status-badge status-${reservation.status}">${reservation.status.toUpperCase()}</span>
            </div>
            <div class="mobile-card-name">${reservation.guestName}</div>
            <div class="mobile-card-details">
                <div class="mobile-card-detail">
                    <div class="mobile-card-label">Package</div>
                    <div class="mobile-card-value">
                        <span class="package-badge">${packageInfo.title}</span>
                    </div>
                </div>
                <div class="mobile-card-detail">
                    <div class="mobile-card-label">Amount</div>
                    <div class="mobile-card-value">${totalAmountDisplay}</div>
                </div>
                <div class="mobile-card-detail">
                    <div class="mobile-card-label">Payment</div>
                    <div class="mobile-card-value">${paymentMethodDisplay}</div>
                </div>
                <div class="mobile-card-detail">
                    <div class="mobile-card-label">Check-in</div>
                    <div class="mobile-card-value">${checkinDate}</div>
                </div>
                <div class="mobile-card-detail">
                    <div class="mobile-card-label">Guests</div>
                    <div class="mobile-card-value">${reservation.numberOfGuests}</div>
                </div>
                <div class="mobile-card-detail">
                    <div class="mobile-card-label">Contact</div>
                    <div class="mobile-card-value">${reservation.phone}</div>
                </div>
            </div>
            <div class="mobile-card-actions">
                <button class="edit-btn" onclick="openEditModal('${reservation.id}')" 
                        aria-label="Edit reservation for ${reservation.guestName}">
                    ✏️ Edit
                </button>
                <button class="delete-btn" onclick="openDeleteModal('${reservation.id}')" 
                        aria-label="Delete reservation for ${reservation.guestName}">
                    🗑️ Delete
                </button>
            </div>
        </div>
    `;
}

// Add touch gesture support for mobile cards (swipe to reveal actions)
function addMobileCardGestures() {
    if (currentBreakpoint === 'xs' || currentBreakpoint === 'sm') {
        const mobileCards = document.querySelectorAll('.mobile-card');
        
        mobileCards.forEach(card => {
            let startX = 0;
            let startY = 0;
            let currentX = 0;
            let currentY = 0;
            let isDragging = false;
            
            card.addEventListener('touchstart', function(e) {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                isDragging = true;
            });
            
            card.addEventListener('touchmove', function(e) {
                if (!isDragging) return;
                
                currentX = e.touches[0].clientX;
                currentY = e.touches[0].clientY;
                
                const diffX = startX - currentX;
                const diffY = startY - currentY;
                
                // If horizontal swipe is more significant than vertical
                if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                    e.preventDefault();
                    
                    const actions = card.querySelector('.mobile-card-actions');
                    if (diffX > 0) {
                        // Swipe left - show actions
                        actions.style.transform = 'translateX(0)';
                        actions.style.opacity = '1';
                    } else {
                        // Swipe right - hide actions
                        actions.style.transform = 'translateX(100%)';
                        actions.style.opacity = '0';
                    }
                }
            });
            
            card.addEventListener('touchend', function() {
                isDragging = false;
            });
        });
    }
}

// Enhanced table display with better mobile handling
function displayEnhancedTableView(reservationList) {
    const container = document.getElementById('reservations-container');
    container.className = 'table-container';
    
    // Check if screen is mobile size
    const isMobile = currentBreakpoint === 'xs' || currentBreakpoint === 'sm';
    
    if (isMobile) {
        container.classList.add('mobile-cards');
        container.innerHTML = reservationList.map(reservation => createEnhancedMobileCard(reservation)).join('');
        
        // Add gesture support after rendering
        setTimeout(() => addMobileCardGestures(), 100);
    } else {
        container.innerHTML = `
            <table class="reservations-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Guest Name</th>
                        <th>Contact</th>
                        <th>Package</th>
                        <th>Amount</th>
                        <th>Payment</th>
                        <th>Check-in</th>
                        <th>Check-out</th>
                        <th>Guests</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${reservationList.map(reservation => createReservationRow(reservation)).join('')}
                </tbody>
            </table>
        `;
        
        // Add table scroll hint for tablet sizes
        if (currentBreakpoint === 'md' || currentBreakpoint === 'lg') {
            addScrollHint(container);
        }
    }
}

// Add scroll hint for tablet table view
function addScrollHint(container) {
    const table = container.querySelector('.reservations-table');
    if (table && table.scrollWidth > container.clientWidth) {
        const hint = document.createElement('div');
        hint.className = 'scroll-hint';
        hint.innerHTML = '← Scroll to see more →';
        hint.style.cssText = `
            text-align: center;
            padding: 8px;
            background: #f8f9fa;
            color: #6b7280;
            font-size: 0.75em;
            border-top: 1px solid #e2e8f0;
            position: sticky;
            bottom: 0;
            z-index: 10;
        `;
        container.appendChild(hint);
        
        // Remove hint after user scrolls
        container.addEventListener('scroll', function() {
            if (hint.parentNode) {
                hint.remove();
            }
        }, { once: true });
    }
}

// Enhanced modal opening with responsive adjustments
function openEnhancedEditModal(reservationId) {
    const reservation = reservations.find(r => r.id === reservationId);
    if (!reservation) return;
    
    currentEditId = reservationId;
    
    // Populate form fields
    document.getElementById('edit-guest-name').value = reservation.guestName || '';
    document.getElementById('edit-email').value = reservation.email || '';
    document.getElementById('edit-phone').value = reservation.phone || '';
    document.getElementById('edit-checkin-date').value = reservation.checkinDate || '';
    document.getElementById('edit-checkout-date').value = reservation.checkoutDate || '';
    document.getElementById('edit-guests').value = reservation.numberOfGuests || '';
    document.getElementById('edit-package').value = reservation.package || '';
    document.getElementById('edit-status').value = reservation.status || '';
    document.getElementById('edit-special-requests').value = reservation.specialRequests || '';
    document.getElementById('edit-total-amount').value = reservation.totalAmount || '';
    document.getElementById('edit-payment-method').value = reservation.paymentMethod || '';
    
    // Populate payment details based on method
    populatePaymentDetails(reservation.paymentMethod, reservation.paymentDetails);
    
    const modal = document.getElementById('edit-modal');
    modal.style.display = 'block';
    
    // Adjust modal for current breakpoint
    setTimeout(() => adjustModalForBreakpoint(modal), 50);
    
    // Focus first input on larger screens, avoid on mobile to prevent keyboard issues
    if (currentBreakpoint !== 'xs' && currentBreakpoint !== 'sm') {
        setTimeout(() => document.getElementById('edit-guest-name').focus(), 100);
    }
}

// Add keyboard navigation and accessibility support
document.addEventListener('keydown', function(e) {
    const editModal = document.getElementById('edit-modal');
    const deleteModal = document.getElementById('delete-modal');
    
    // ESC key closes modals
    if (e.key === 'Escape') {
        if (editModal && editModal.style.display === 'block') {
            closeEditModal();
        }
        if (deleteModal && deleteModal.style.display === 'block') {
            closeDeleteModal();
        }
    }
    
    // Enter key submits forms
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        if (editModal && editModal.style.display === 'block') {
            e.preventDefault();
            updateReservation();
        }
        if (deleteModal && deleteModal.style.display === 'block') {
            e.preventDefault();
            deleteReservation();
        }
    }
});

// Add haptic feedback for mobile interactions (if supported)
function addHapticFeedback() {
    if ('vibrate' in navigator && (currentBreakpoint === 'xs' || currentBreakpoint === 'sm')) {
        const buttons = document.querySelectorAll('.edit-btn, .delete-btn, .filter-btn, .view-btn');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                navigator.vibrate(50); // 50ms vibration
            });
        });
    }
}

// Initialize responsive enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Set initial breakpoint
    currentBreakpoint = getBreakpoint();
    
    // Add haptic feedback
    setTimeout(addHapticFeedback, 500);
});