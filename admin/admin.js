// Admin Panel JavaScript for CRUD operations

let reservations = [];
let currentEditId = null;
let currentDeleteId = null;
let currentView = 'card'; // 'card' or 'table'

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

// Load reservations when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadReservations();
    setupEventListeners();
});

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
}

// Load all reservations from server
async function loadReservations() {
    try {
        showLoading(true);
        const response = await fetch('/api/reservations');
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

// Display table view
function displayTableView(reservationList) {
    const container = document.getElementById('reservations-container');
    container.className = 'table-container';
    container.innerHTML = `
        <table class="reservations-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Guest Name</th>
                    <th>Contact</th>
                    <th>Package</th>
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

// Create reservation card HTML
function createReservationCard(reservation) {
    const packageInfo = packages[reservation.package] || { title: reservation.package, price: 'N/A' };
    const checkinDate = new Date(reservation.checkinDate).toLocaleDateString();
    const checkoutDate = new Date(reservation.checkoutDate).toLocaleDateString();
    const createdDate = new Date(reservation.createdAt).toLocaleDateString();
    const createdTime = new Date(reservation.createdAt).toLocaleString();
    
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
                    <div class="detail-label">Price</div>
                    <div class="detail-value">${packageInfo.price}</div>
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
            
            <div class="card-actions">
                <button class="edit-btn" onclick="openEditModal('${reservation.id}')">✏️ Edit</button>
                <button class="delete-btn" onclick="openDeleteModal('${reservation.id}')">🗑️ Delete</button>
            </div>
        </div>
    `;
}

// Create reservation table row HTML
function createReservationRow(reservation) {
    const packageInfo = packages[reservation.package] || { title: reservation.package };
    const checkinDate = new Date(reservation.checkinDate).toLocaleDateString();
    const checkoutDate = new Date(reservation.checkoutDate).toLocaleDateString();
    const createdDateTime = new Date(reservation.createdAt).toLocaleString();
    
    return `
        <tr>
            <td>${reservation.id}</td>
            <td>${reservation.guestName}</td>
            <td>${reservation.email}<br><small>${reservation.phone}</small></td>
            <td><span class="package-badge">${packageInfo.title}</span></td>
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
    const dateFilter = document.getElementById('date-filter').value;
    
    let filteredReservations = [...reservations];
    
    if (statusFilter) {
        filteredReservations = filteredReservations.filter(r => r.status === statusFilter);
    }
    
    if (packageFilter) {
        filteredReservations = filteredReservations.filter(r => r.package === packageFilter);
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
    document.getElementById('edit-status').value = reservation.status;
    document.getElementById('edit-requests').value = reservation.specialRequests || '';
    
    document.getElementById('edit-modal').style.display = 'block';
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
