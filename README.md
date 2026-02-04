# CampusFix - College Complaint Redressal System

A comprehensive complaint management system for colleges with admin dashboard, email notifications, and automated workflows.

## 🚀 Features

### User Features
- **Complaint Submission**: Submit complaints across 4 categories (Security, Housekeeping, Store, Maintenance)
- **Email Integration**: Mandatory email field for notifications
- **Image Attachment**: Capture photos or select from gallery
- **Local Storage**: View previous complaints offline
- **Status Tracking**: Real-time complaint status updates


### Admin Features
- **Secure Login**: Admin authentication system
- **Dashboard**: Comprehensive admin dashboard with 4 main functions
- **View All Complaints**: See all submitted complaints with status
- **Mark as Solved**: Resolve complaints and send confirmation emails
- **Status Overview**: Track pending vs solved complaints
- **Logout**: Secure session management


### Principal Features
- **Principal Dashboard**: View all complaints across departments
- **Status Monitoring**: Track pending and resolved complaints
- **Department Overview**: Filter complaints by department

### Notification System
- **Automated Notifications**: Send emails to maintenance team
- **Resolution Confirmations**: Email users when complaints are resolved
- **Reminder System**: Auto-reminders for 24+ hour pending complaints
- **Professional Templates**: HTML-formatted emails with branding

## 📱 Screenshots

### Home Screen
- Category selection grid
- Admin Login button
- Principal Dashboard button
- Previous Complaints access

  <img width="317" height="664" alt="Screenshot 2026-02-04 at 10 44 56 AM" src="https://github.com/user-attachments/assets/7e841627-37d7-4c44-8daf-05afb2530f42" />

### Admin Dashboard
- View All Complaints
- Mark as Solved
- Check Status
- Logout

  <img width="317" height="664" alt="Screenshot 2026-02-04 at 10 47 51 AM" src="https://github.com/user-attachments/assets/63dd06e1-9cd2-4ab2-975b-e1b353ac1011" />

### Complaint Form
- Name, Location, Details fields
- **Mandatory Email field**
- Image attachment options
- Form validation

## 🛠️ Technical Stack

### Frontend (Android)
- **Language**: Kotlin
- **UI Framework**: Jetpack Compose
- **Architecture**: Single Activity with Navigation
- **Storage**: SharedPreferences for local data
- **Networking**: OkHttp for API calls
- **Permissions**: Camera and Internet access

### Backend (Node.js)
- **Framework**: Express.js
- **Email**: Nodemailer with Gmail SMTP
- **File Upload**: Multer for image processing
- **Environment**: dotenv for configuration
- **Port**: 3000

## 📋 Installation

### Prerequisites
- Android Studio (for Android development)
- Node.js (for backend)
- Gmail account with App Password

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd ATR3/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```
   GMAIL_USER=your_email@gmail.com
   GMAIL_PASS=your_app_password
   PRINCIPAL_EMAIL=principal@atria.edu.in
   ```

4. Start the server:
   ```bash
   node index.js
   ```

### Android Setup
1. Open project in Android Studio
2. Sync Gradle files
3. Build and run on device/emulator

## 🔐 Admin Credentials

**Default Admin Login:**
- Username: `admin`
- Password: `admin123`

*Note: These are hardcoded for development. For production, implement proper authentication.*

## 📧 Email Configuration

### Required Setup
1. Create a new Gmail account for the system
2. Enable 2-Factor Authentication
3. Generate App Password
4. Update `.env` file with credentials

<img width="317" height="664" alt="Screenshot 2026-02-04 at 10 50 06 AM" src="https://github.com/user-attachments/assets/4aff9373-ddbe-40a3-8f4a-097b0b16494f" />

## 🔄 Workflow

### Complaint Submission
1. User selects complaint category
2. Fills form with details and email
3. Optionally attaches image
4. Data saved locally and sent to backend
5. Email notification sent to maintenance team

<img width="317" height="664" alt="Screenshot 2026-02-04 at 10 49 25 AM" src="https://github.com/user-attachments/assets/26f6bc5d-870a-4f8c-a189-c4e2b8e1e765" />

### Admin Resolution
1. Admin logs in to dashboard
2. Views all complaints with status
3. Clicks "Mark as Solved" on pending complaints
4. Confirmation email sent to user
5. Status updated to "solved"

### Automated Reminders
- 24-hour timer for pending complaints
- Automatic reminder email to principal
- Prevents duplicate reminders for solved complaints

## 📊 API Endpoints

### POST /sendForm
- Accepts complaint data with image
- Sends notification email to maintenance team

### POST /sendSolvedEmail
- Sends resolution confirmation to user
- Includes complaint details and resolution status

### POST /sendReminderEmail
- Sends reminder to principal for pending complaints
- Triggered after 24 hours without resolution

## 🎨 UI Components

### Material Design 3
- Modern card-based layouts
- Consistent color scheme
- Smooth animations and transitions
- Responsive grid layouts

### Navigation
- Single Activity architecture
- Navigation Compose for screen management
- Back stack handling
- Deep linking support

## 🔒 Security Features

### Permissions
- Internet access for API calls
- Camera access for photo capture
- File provider for secure file sharing

### Data Protection
- Local storage encryption
- Secure email transmission
- Input validation and sanitization

## 🚀 Deployment

### Backend Deployment
1. Deploy to cloud platform (Heroku, AWS, etc.)
2. Set environment variables
3. Update ngrok URL in Android app
4. Test email functionality

### Android Deployment
1. Generate signed APK
2. Test on multiple devices
3. Upload to Google Play Store
4. Configure production email settings

## 📈 Future Enhancements

### Planned Features
- Firebase Authentication
- Push notifications
- Real-time status updates
- Department-specific dashboards
- Analytics and reporting
- Multi-language support

### Technical Improvements
- Database integration (MongoDB/PostgreSQL)
- Image compression and optimization
- Offline-first architecture
- Unit and integration tests
- CI/CD pipeline

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

---

**ATR3 System** - Making college complaint management efficient and transparent. 
