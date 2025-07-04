const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

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

// READ - Get all reservations
app.get('/api/reservations', (req, res) => {
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

// UPDATE - Update reservation
app.put('/api/reservations/:id', (req, res) => {
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

// DELETE - Delete reservation
app.delete('/api/reservations/:id', (req, res) => {
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

// Serve admin panel
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Admin panel available at http://localhost:${PORT}/admin`);
});
