# 🏨 AMARI Urban Escape - Booking System

A comprehensive web-based reservation platform for AMARI Urban Escape, a private resort in Pandi, Bulacan. This system enables guests to browse packages, check availability, make reservations, and process payments, while providing administrators with complete booking management capabilities.

![AMARI Logo](images/logo.jpg)

## 📋 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [✨ Features](#-features)
- [🛠️ Technology Stack](#️-technology-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Installation & Setup](#-installation--setup)
- [📊 Database Schema](#-database-schema)
- [🎪 User Journey](#-user-journey)
- [👨‍💼 Admin Panel](#-admin-panel)
- [📱 API Endpoints](#-api-endpoints)
- [🌐 Deployment Guide](#-deployment-guide)
- [🔧 Configuration](#-configuration)
- [🐛 Troubleshooting](#-troubleshooting)
- [📞 Support](#-support)

## 🎯 Project Overview

AMARI Urban Escape Booking System is a modern, responsive web application designed to streamline the reservation process for a private resort. The system replaces traditional manual booking methods with an automated, user-friendly online platform.

### 🌟 Key Benefits
- **24/7 Availability** - Guests can book anytime
- **Real-time Updates** - Instant availability checking
- **Automated Management** - Reduced administrative overhead
- **Multiple Payment Options** - Flexible payment processing
- **Mobile-Friendly** - Responsive design for all devices

## ✨ Features

### 🎯 Customer Features
- **Interactive Calendar** - Real-time availability checking with date blocking
- **Package Selection** - Choose from Day Tour, Overnight, or Night Tour packages
- **Guest Information Form** - Comprehensive booking details collection
- **Multiple Payment Methods** - Support for GCash, Maya, Credit/Debit Cards, and Bank Transfer
- **Booking Confirmation** - Instant confirmation with booking ID
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices

### 👨‍💼 Admin Features
- **Dashboard Overview** - Complete reservation management interface
- **CRUD Operations** - Create, Read, Update, Delete reservations
- **Filtering & Search** - Filter by status, package, payment method, and dates
- **Dual View Modes** - Card view and table view for reservations
- **Real-time Updates** - Live data synchronization
- **Secure Authentication** - Session-based admin access

### 🏖️ Resort Packages
1. **Day Tour** - ₱12,500 (Weekdays) / ₱15,000 (Weekends) - 8AM to 5PM (9 hours)
2. **Overnight** - ₱19,500 (Weekdays) / ₱22,500 (Weekends) - 3PM to 12NN (21 hours)
3. **Night Tour** - ₱13,500 (Weekdays) / ₱16,000 (Weekends) - 8PM to 6AM (12 hours)

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox/Grid
- **JavaScript (ES6+)** - Dynamic functionality
- **Responsive Design** - Mobile-first approach

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **Express-Session** - Session management

### Database
- **JSON File Storage** - Simple, lightweight data persistence
- **File System Operations** - Direct file read/write operations

### Development Tools
- **Nodemon** - Development server with auto-reload
- **Git** - Version control

## 📁 Project Structure

```
AMARI/
├── 📄 server.js                 # Main server file
├── 📄 package.json             # Dependencies and scripts
├── 📄 README.md                # Project documentation
├── 📄 index.html               # Homepage
├── 📄 about.html               # About page
├── 📄 contact.html             # Contact page
├── 📄 rooms.html               # Rooms & amenities page
├── 📄 rates.html               # Rates & packages page
├── 📄 book.html                # Booking page
├── 📁 admin/                   # Admin panel
│   ├── 📄 index.html           # Admin dashboard
│   ├── 📄 admin.css            # Admin styles
│   └── 📄 admin.js             # Admin functionality
├── 📁 login/                   # Authentication
│   ├── 📄 login.html           # Login page
│   ├── 📄 login.css            # Login styles
│   └── 📄 login.js             # Login functionality
├── 📁 css/                     # Stylesheets
│   ├── 📄 index.css            # Homepage styles
│   ├── 📄 about.css            # About page styles
│   ├── 📄 contact.css          # Contact page styles
│   ├── 📄 rooms.css            # Rooms page styles
│   ├── 📄 rates.css            # Rates page styles
│   └── 📄 book.css             # Booking page styles
├── 📁 js/                      # JavaScript files
│   ├── 📄 index.js             # Homepage functionality
│   ├── 📄 about.js             # About page functionality
│   ├── 📄 contact.js           # Contact page functionality
│   ├── 📄 rooms.js             # Rooms page functionality
│   ├── 📄 rates.js             # Rates page functionality
│   └── 📄 book.js              # Booking functionality
├── 📁 database/                # Data storage
│   └── 📄 reservations.json    # Booking records
└── 📁 images/                  # Static assets
    ├── 📄 logo.jpg             # Resort logo
    ├── 📄 bg1.jpg              # Background images
    ├── 📄 pool.jpg             # Pool images
    └── 📄 ...                  # Other resort images
```

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** (Node Package Manager)
- **Git** (for version control)

### Step-by-Step Installation

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd AMARI
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   *or*
   ```bash
   npm start
   ```

4. **Access the Application**
   - **Website:** http://localhost:3000
   - **Admin Panel:** http://localhost:3000/admin
   - **Login Page:** http://localhost:3000/login

### Default Admin Credentials
- **Username:** `admin`
- **Password:** `amari2024`

⚠️ **Security Note:** Change the default admin credentials in production!

## 📊 Database Schema

### Reservations Collection

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `id` | String | Unique timestamp-based identifier | ✓ |
| `guestName` | String | Full name of the guest | ✓ |
| `email` | String | Guest email address | ✓ |
| `phone` | String | Guest phone number | ✓ |
| `numberOfGuests` | Number | Number of guests (1-20) | ✓ |
| `specialRequests` | String | Additional guest requests | ✗ |
| `package` | String | Package type (day-tour/overnight/night-tour) | ✓ |
| `checkinDate` | String | Check-in date (YYYY-MM-DD) | ✓ |
| `checkoutDate` | String | Check-out date (YYYY-MM-DD) | ✓ |
| `paymentMethod` | String | Payment type (gcash/maya/card/bank) | ✓ |
| `paymentDetails` | Object | Payment-specific information | ✓ |
| `totalAmount` | Number | Total booking cost in PHP | ✓ |
| `bookingDate` | String | Date booking was made | ✓ |
| `createdAt` | String | ISO timestamp of creation | ✓ |
| `updatedAt` | String | ISO timestamp of last update | ✗ |
| `status` | String | Booking status (pending/confirmed/cancelled/completed) | ✓ |

### Payment Details Schema

**GCash/Maya:**
```json
{
  "gcashNumber": "09XXXXXXXXX",
  "gcashName": "Customer Name"
}
```

**Credit/Debit Card:**
```json
{
  "cardNumber": "1234 5678 9012 3456",
  "cardName": "Cardholder Name",
  "cardExpiry": "MM/YY",
  "cardCvv": "123"
}
```

**Bank Transfer:**
```json
{
  "bankName": "Bank Name",
  "accountNumber": "1234567890",
  "accountName": "Account Holder"
}
```

## 🎪 User Journey

### Customer Booking Flow

1. **Landing Page** (`index.html`)
   - Hero section with resort overview
   - Rooms & amenities gallery
   - Guest testimonials

2. **Package Selection** (`rates.html`)
   - View available packages
   - Compare pricing (weekday/weekend)
   - Select preferred package

3. **Booking Process** (`book.html`)
   - **Step 1:** Date Selection
     - Interactive calendar
     - Real-time availability check
     - Date range selection
   - **Step 2:** Guest Information
     - Personal details form
     - Guest count selection
     - Special requests
   - **Step 3:** Payment Method
     - Choose payment option
     - Enter payment details
   - **Step 4:** Confirmation
     - Review booking summary
     - Submit reservation
     - Receive booking ID

### Navigation Structure
```
Home → Rooms → Rates → Book → Confirmation
  ↓      ↓       ↓       ↓         ↓
About  Contact  Admin   Login   Success
```

## 👨‍💼 Admin Panel

### Access & Authentication
- **URL:** `/admin`
- **Login:** Session-based authentication
- **Session Timeout:** 24 hours

### Dashboard Features

1. **Reservations Overview**
   - Total reservation count
   - Quick statistics
   - Recent bookings

2. **View Modes**
   - **Card View:** Visual card layout
   - **Table View:** Detailed spreadsheet view

3. **Filtering Options**
   - Status filter (All/Pending/Confirmed/Cancelled/Completed)
   - Package filter (All/Day Tour/Overnight/Night Tour)
   - Payment method filter
   - Date range filter

4. **CRUD Operations**
   - **Create:** Add new reservations manually
   - **Read:** View reservation details
   - **Update:** Edit booking information
   - **Delete:** Cancel/remove reservations

5. **Data Management**
   - Export functionality
   - Real-time updates
   - Bulk operations

## 📱 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/login` | Admin login | Public |
| POST | `/api/logout` | Admin logout | Admin |
| GET | `/api/auth/status` | Check auth status | Public |

### Reservation Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/reservations` | Get all reservations | Admin |
| POST | `/api/reservations` | Create new reservation | Public |
| GET | `/api/reservations/:id` | Get single reservation | Public |
| PUT | `/api/reservations/:id` | Update reservation | Admin |
| DELETE | `/api/reservations/:id` | Delete reservation | Admin |
| GET | `/api/booked-dates` | Get booked dates | Public |

### API Request Examples

**Create Reservation:**
```javascript
POST /api/reservations
Content-Type: application/json

{
  "guestName": "John Doe",
  "email": "john@example.com",
  "phone": "09123456789",
  "numberOfGuests": 4,
  "package": "overnight",
  "checkinDate": "2025-07-15",
  "checkoutDate": "2025-07-16",
  "paymentMethod": "gcash",
  "paymentDetails": {
    "gcashNumber": "09123456789",
    "gcashName": "John Doe"
  },
  "totalAmount": 22500
}
```

**Response:**
```javascript
{
  "success": true,
  "message": "Reservation created successfully",
  "reservation": {
    "id": "1625456789123",
    "guestName": "John Doe",
    "email": "john@example.com",
    // ... other fields
    "status": "pending",
    "createdAt": "2025-07-07T10:30:00.000Z"
  }
}
```

## 🌐 Deployment Guide

### Recommended Hosting Platforms

1. **Vercel** (Recommended)
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

2. **Railway**
   ```bash
   # Connect to Railway
   npx @railway/cli login
   
   # Deploy
   railway up
   ```

3. **Render**
   - Connect GitHub repository
   - Set build command: `npm install`
   - Set start command: `npm start`

### Environment Configuration

Create a `.env` file for production:
```env
NODE_ENV=production
PORT=3000
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password
SESSION_SECRET=your_super_secret_session_key
```

### Pre-deployment Checklist

- [ ] Update admin credentials
- [ ] Set secure session secret
- [ ] Test all functionality
- [ ] Verify responsive design
- [ ] Check API endpoints
- [ ] Validate form submissions
- [ ] Test payment flows
- [ ] Ensure database integrity

## 🔧 Configuration

### Server Configuration (`server.js`)

```javascript
// Default settings
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = 'amari-admin-secret-key-2024';

// Admin credentials
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'amari2024'
};
```

### Package Configuration (`package.json`)

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "express-session": "^1.17.3"
  }
}
```

### Customization Options

1. **Pricing Updates**
   - Edit package prices in `js/book.js`
   - Update display prices in `rates.html`

2. **Contact Information**
   - Update contact details in `contact.html`
   - Modify footer information across all pages

3. **Branding**
   - Replace logo in `images/logo.jpg`
   - Update resort name throughout the application

4. **Additional Features**
   - Add new package types
   - Implement email notifications
   - Integrate payment gateways
   - Add reporting features

## 🐛 Troubleshooting

### Common Issues

**1. Server Won't Start**
```bash
# Check if port is in use
netstat -an | findstr :3000

# Kill process using port
taskkill /PID <process_id> /F
```

**2. Database File Not Found**
- Ensure `database/` directory exists
- Check file permissions
- Verify server has write access

**3. Login Not Working**
- Clear browser cache and cookies
- Check admin credentials
- Verify session configuration

**4. Booking Form Issues**
- Check JavaScript console for errors
- Verify API endpoints are responding
- Test form validation

**5. Mobile Display Problems**
- Clear browser cache
- Test in different browsers
- Check responsive CSS

### Debug Mode

Enable debug logging by setting:
```javascript
// Add to server.js
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
});
```

### Performance Optimization

1. **Image Optimization**
   - Compress images in `/images/` folder
   - Use appropriate formats (WebP, JPEG)

2. **CSS Minification**
   - Combine CSS files
   - Remove unused styles

3. **JavaScript Optimization**
   - Minify JavaScript files
   - Implement lazy loading

## 📞 Support

### Getting Help

1. **Documentation Issues**
   - Check this README thoroughly
   - Review code comments
   - Check browser console

2. **Technical Support**
   - Create GitHub issue
   - Include error messages
   - Provide steps to reproduce

3. **Feature Requests**
   - Submit enhancement requests
   - Describe use case clearly
   - Provide mockups if possible

### Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

### License

This project is licensed under the ISC License. See the package.json file for details.

---

## 🎉 Quick Start Summary

```bash
# 1. Clone and install
git clone <repo-url> && cd AMARI && npm install

# 2. Start development
npm run dev

# 3. Access application
# Website: http://localhost:3000
# Admin: http://localhost:3000/admin 

**🏨 AMARI Urban Escape** - *Creating memorable experiences through technology*

---

*Last updated: July 7, 2025*