# AMARI Urban Escape - Booking System

This is a complete booking system for AMARI Urban Escape with a JSON-based database and admin panel for managing reservations.

## Features

- **Guest Booking System**: Allows guests to select dates, packages, and submit reservation requests
- **JSON Database**: Stores all reservation data in a local JSON file
- **Admin Panel**: Complete CRUD interface for managing reservations
- **Real-time Updates**: Instant updates when reservations are created, updated, or deleted

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Server

```bash
npm start
```

Or for development with auto-restart:

```bash
npm run dev
```

### 3. Access the Application

- **Main Website**: http://localhost:3000
- **Booking Page**: http://localhost:3000/book
- **Admin Panel**: http://localhost:3000/admin

## Database

The system uses a JSON file located at `database/reservations.json` to store all reservation data. This file is automatically created when the server first starts.

## API Endpoints

- `POST /api/reservations` - Create new reservation
- `GET /api/reservations` - Get all reservations
- `GET /api/reservations/:id` - Get specific reservation
- `PUT /api/reservations/:id` - Update reservation
- `DELETE /api/reservations/:id` - Delete reservation

## Admin Panel Features

### CRUD Operations
- **Create**: New reservations are automatically created when guests submit the booking form
- **Read**: View all reservations with filtering options (status, package, date)
- **Update**: Edit reservation details including guest info, dates, status, and special requests
- **Delete**: Remove reservations with confirmation dialog

### Filtering Options
- Filter by reservation status (pending, confirmed, cancelled, completed)
- Filter by package type (day tour, overnight, night tour)
- Filter by check-in date
- Clear all filters to view all reservations

### Reservation Statuses
- **Pending**: New reservations awaiting confirmation
- **Confirmed**: Approved reservations
- **Cancelled**: Cancelled reservations
- **Completed**: Past reservations that have been completed

## Package Types

1. **Day Tour** - ₱12,500 (8AM - 5PM, 9 hours)
2. **Overnight** - ₱16,500 (3PM - 12NN, 21 hours)
3. **Night Tour** - ₱13,500 (8PM - 6AM, 12 hours)

## Guest Information Collected

- Full Name
- Email Address
- Phone Number
- Number of Guests (1-20)
- Special Requests (optional)
- Check-in/Check-out Dates
- Selected Package

## Security Notes

- The admin panel is accessible without authentication (you may want to add login protection)
- All data is stored locally in JSON format
- No external database dependencies

## Customization

You can easily customize:
- Package prices and details in both `js/book.js` and `admin/admin.js`
- Styling in the respective CSS files
- Add more form fields as needed
- Implement email notifications
- Add authentication for admin access

## Troubleshooting

If you encounter any issues:

1. Make sure Node.js is installed
2. Check that port 3000 is available
3. Verify that the `database` directory has write permissions
4. Check the console for any error messages

## File Structure

```
├── server.js           # Main server file
├── package.json        # Node.js dependencies
├── database/
│   └── reservations.json  # JSON database file
├── admin/
│   ├── index.html      # Admin panel HTML
│   ├── admin.css       # Admin panel styles
│   └── admin.js        # Admin panel functionality
├── css/
│   └── book.css        # Booking page styles
├── js/
│   └── book.js         # Booking page functionality
└── [other website files]
```
