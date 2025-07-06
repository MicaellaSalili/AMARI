# AMARI Booking System - Authentication Setup

## Overview
The booking system now includes a secure admin authentication system that protects the admin panel and reservation management features.

## Authentication Flow
1. **Login Required**: Only authenticated users can access the admin panel
2. **Session Management**: Uses express-session for secure session handling
3. **Auto-redirect**: Unauthorized users are automatically redirected to the login page
4. **Logout Function**: Secure logout that destroys the session

## Admin Credentials
- **Username**: `admin`
- **Password**: `amari2024`

⚠️ **Important**: Change the default password in `server.js` for production use!

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
# or for development with auto-restart:
npm run dev
```

### 3. Access the System

#### For Regular Users (Booking):
- Main website: `http://localhost:3000`
- Booking page: `http://localhost:3000/book.html`

#### For Admin Access:
- Login page: `http://localhost:3000/login`
- Admin panel: `http://localhost:3000/admin` (requires authentication)

## Security Features

### Protected Routes
- `/admin` - Admin panel (requires authentication)
- `/api/reservations` (GET) - View reservations (admin only)
- `/api/reservations/:id` (PUT) - Update reservations (admin only)
- `/api/reservations/:id` (DELETE) - Delete reservations (admin only)

### Public Routes
- `/api/reservations` (POST) - Create new bookings (public)
- `/login` - Login page (public)
- All static files and booking pages (public)

### Session Configuration
- Session timeout: 24 hours
- Secure cookie settings
- Session secret: Configurable in `server.js`

## File Structure
```
/login/
  ├── login.html     # Login page UI
  ├── login.css      # Login page styling
  └── login.js       # Login functionality

/admin/
  ├── index.html     # Admin panel UI
  ├── admin.css      # Admin panel styling
  └── admin.js       # Admin functionality (now with auth checks)

server.js            # Express server with authentication
package.json         # Dependencies including express-session
```

## API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/auth/status` - Check authentication status

### Reservations (Protected)
- `GET /api/reservations` - Get all reservations (admin)
- `PUT /api/reservations/:id` - Update reservation (admin)
- `DELETE /api/reservations/:id` - Delete reservation (admin)

### Reservations (Public)
- `POST /api/reservations` - Create new reservation (public)

## Development Notes

### Adding New Admin Users
To add more admin users, modify the `ADMIN_CREDENTIALS` object in `server.js` or implement a user database.

### Changing Admin Password
Edit the `ADMIN_CREDENTIALS` object in `server.js`:
```javascript
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'your-new-secure-password'
};
```

### Production Deployment
1. Set `cookie.secure = true` for HTTPS
2. Use environment variables for credentials
3. Implement password hashing
4. Add rate limiting for login attempts

## Troubleshooting

### Cannot Access Admin Panel
1. Ensure you're logged in at `/login`
2. Check if the session is active
3. Verify server is running on correct port

### Login Issues
1. Check username/password in `server.js`
2. Verify express-session is installed
3. Check browser console for errors

### Session Problems
1. Clear browser cookies
2. Restart the server
3. Check session configuration in `server.js`
