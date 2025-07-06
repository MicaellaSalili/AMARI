const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Session configuration
app.use(session({
    secret: 'amari-admin-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Admin credentials (in production, store in database with hashed passwords)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'amari2024' // Change this to a secure password
};

// Authentication middleware
function requireAuth(req, res, next) {
    if (req.session && req.session.isAuthenticated) {
        next();
    } else {
        res.status(401).json({
            success: false,
            message: 'Unauthorized access'
        });
    }
}

// Path to JSON database file
const DB_PATH = path.join(__dirname, 'database', 'reservations.json');

// Ensure database directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database file if it doesn't exist
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2));
}

// Helper functions for database operations
function readDatabase() {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading database:', error);
        return [];
    }
}

function writeDatabase(data) {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing to database:', error);
        return false;
    }
}

// API Routes

// Authentication Routes
// Login endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        req.session.isAuthenticated = true;
        req.session.username = username;
        
        res.json({
            success: true,
            message: 'Login successful',
            user: { username }
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid username or password'
        });
    }
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: 'Could not log out'
            });
        } else {
            res.json({
                success: true,
                message: 'Logged out successfully'
            });
        }
    });
});

// Check authentication status
app.get('/api/auth/status', (req, res) => {
    res.json({
        authenticated: !!(req.session && req.session.isAuthenticated),
        user: req.session && req.session.isAuthenticated ? { username: req.session.username } : null
    });
});

// Reservation Routes (Protected)
// CREATE - Add new reservation
app.post('/api/reservations', (req, res) => {
    try {
        const reservations = readDatabase();
        const newReservation = {
            id: Date.now().toString(),
            ...req.body,
            createdAt: new Date().toISOString(),
            status: 'pending'
        };

        reservations.push(newReservation);
        
        if (writeDatabase(reservations)) {
            res.status(201).json({
                success: true,
                message: 'Reservation created successfully',
                reservation: newReservation
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to save reservation'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error: ' + error.message
        });
    }
});

// READ - Get all reservations (Admin only)
app.get('/api/reservations', requireAuth, (req, res) => {
    try {
        const reservations = readDatabase();
        res.json({
            success: true,
            reservations: reservations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error: ' + error.message
        });
    }
});

// READ - Get single reservation by ID
app.get('/api/reservations/:id', (req, res) => {
    try {
        const reservations = readDatabase();
        const reservation = reservations.find(r => r.id === req.params.id);
        
        if (reservation) {
            res.json({
                success: true,
                reservation: reservation
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Reservation not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error: ' + error.message
        });
    }
});

// UPDATE - Update reservation (Admin only)
app.put('/api/reservations/:id', requireAuth, (req, res) => {
    try {
        const reservations = readDatabase();
        const index = reservations.findIndex(r => r.id === req.params.id);
        
        if (index !== -1) {
            reservations[index] = {
                ...reservations[index],
                ...req.body,
                updatedAt: new Date().toISOString()
            };
            
            if (writeDatabase(reservations)) {
                res.json({
                    success: true,
                    message: 'Reservation updated successfully',
                    reservation: reservations[index]
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Failed to update reservation'
                });
            }
        } else {
            res.status(404).json({
                success: false,
                message: 'Reservation not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error: ' + error.message
        });
    }
});

// DELETE - Delete reservation (Admin only)
app.delete('/api/reservations/:id', requireAuth, (req, res) => {
    try {
        const reservations = readDatabase();
        const index = reservations.findIndex(r => r.id === req.params.id);
        
        if (index !== -1) {
            const deletedReservation = reservations.splice(index, 1)[0];
            
            if (writeDatabase(reservations)) {
                res.json({
                    success: true,
                    message: 'Reservation deleted successfully',
                    reservation: deletedReservation
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Failed to delete reservation'
                });
            }
        } else {
            res.status(404).json({
                success: false,
                message: 'Reservation not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error: ' + error.message
        });
    }
});

// Serve admin panel (Protected)
app.get('/admin', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

// Serve login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login', 'login.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Admin panel available at http://localhost:${PORT}/admin`);
});
