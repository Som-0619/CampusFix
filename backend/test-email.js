const nodemailer = require('nodemailer');

// Test email configuration
async function testEmail() {
    console.log('=== Testing Email Configuration ===');
    
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
        console.log('❌ Email credentials not found!');
        console.log('Please set GMAIL_USER and GMAIL_PASS environment variables');
        return;
    }
    
    console.log('✅ Email credentials found');
    console.log('Gmail User:', process.env.GMAIL_USER);
    console.log('Gmail Pass:', process.env.GMAIL_PASS ? '***' + process.env.GMAIL_PASS.slice(-4) : 'Not set');
    
    // Create transporter
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });
    
    // Test email
    let mailOptions = {
        from: process.env.GMAIL_USER,
        to: 'rbssajjan@gmail.com',
        subject: '🧪 ATR3 Email Test',
        text: 'This is a test email from ATR3 backend server.',
        html: '<h2>🧪 ATR3 Email Test</h2><p>This is a test email from ATR3 backend server.</p>'
    };
    
    try {
        console.log('📧 Sending test email...');
        await transporter.sendMail(mailOptions);
        console.log('✅ Test email sent successfully!');
    } catch (err) {
        console.log('❌ Email test failed:', err.message);
    }
}

testEmail(); 