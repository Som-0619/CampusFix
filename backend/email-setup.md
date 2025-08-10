# Email Setup Guide for ATR3 System

## 1. Create a New Gmail Account
Create a new Gmail account specifically for the ATR3 system:
- Email: atr3.system@gmail.com (or your preferred email)
- Password: [create a strong password]

## 2. Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password for this application

## 3. Create .env File
Create a `.env` file in the backend directory with the following content:

```
GMAIL_USER=atr3.system@gmail.com
GMAIL_PASS=your_app_password_here
```

## 4. Install dotenv Package
Add dotenv to your backend dependencies:

```bash
npm install dotenv
```

## 5. Update index.js
Add this line at the top of index.js:
```javascript
require('dotenv').config();
```

## 6. Test Email Configuration
Run the test-email.js script to verify your email setup works correctly.

## Important Notes:
- Never commit the .env file to version control
- Use App Passwords, not your regular Gmail password
- The system will send emails to:
  - All notifications: ajaydevgun445@gmail.com
  - Users: When their complaints are resolved 