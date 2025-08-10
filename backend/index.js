require('dotenv').config(); // Enable dotenv configuration
const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const multer = require('multer');
const upload = multer({ dest: '/tmp' });

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/sendForm', upload.single('image'), async (req, res) => {
    console.log('=== NEW FORM SUBMISSION RECEIVED ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Received form data:', req.body);
    console.log('Received file:', req.file);
    console.log('Headers:', req.headers);
    
    // Extract form fields - they should be available in req.body
    const name = req.body.name || 'Not provided';
    const location = req.body.location || 'Not provided';
    const details = req.body.details || 'Not provided';
    const email = req.body.email || 'Not provided';
    const section = req.body.section || 'Not provided';
    const image = req.file;
    const timestamp = new Date().toLocaleString('en-IN', { 
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    // Set up nodemailer transporter (Gmail example)
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER || 'test@example.com',
            pass: process.env.GMAIL_PASS || 'testpass'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // Create nicely formatted HTML email content with comprehensive details
    const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd;">
        <div style="background-color: #d32f2f; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🚨 URGENT: NEW COMPLAINT RAISED</h1>
            <h2 style="margin: 10px 0 0 0; font-size: 18px;">CAMPUSFIX SYSTEM NOTIFICATION</h2>
        </div>
        
        <div style="padding: 20px;">
            <h3 style="color: #333;">Dear Maintenance Team & Principal,</h3>
            
            <p style="color: #555; line-height: 1.6;">A new complaint has been raised through the <strong>CampusFix mobile application</strong>. Please review the comprehensive details below and take necessary action as soon as possible.</p>
            
            <div style="background-color: #f5f5f5; border-left: 4px solid #d32f2f; padding: 15px; margin: 20px 0;">
                <h3 style="margin: 0 0 15px 0; color: #d32f2f;">📋 COMPLAINT DETAILS</h3>
                
                <div style="margin: 10px 0;">
                    <span style="font-weight: bold; color: #d32f2f;">👤 Reported By:</span> ${name}
                </div>
                
                <div style="margin: 10px 0;">
                    <span style="font-weight: bold; color: #d32f2f;">📧 Contact Email:</span> ${email}
                </div>
                
                <div style="margin: 10px 0;">
                    <span style="font-weight: bold; color: #d32f2f;">🏢 Department:</span> ${section}
                </div>
                
                <div style="margin: 10px 0;">
                    <span style="font-weight: bold; color: #d32f2f;">📍 Location:</span> ${location}
                </div>
                
                <div style="margin: 10px 0;">
                    <span style="font-weight: bold; color: #d32f2f;">📝 Issue Description:</span> ${details}
                </div>
                
                <div style="margin: 10px 0;">
                    <span style="font-weight: bold; color: #d32f2f;">🕒 Reported At:</span> ${timestamp}
                </div>
                
                <div style="margin: 10px 0;">
                    <span style="font-weight: bold; color: #d32f2f;">📎 Attachment:</span> ${image ? 'Image attached' : 'No image provided'}
                </div>
            </div>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <h4 style="margin: 0 0 10px 0; color: #856404;">⚠️ ACTION REQUIRED</h4>
                <ul style="margin: 0; padding-left: 20px; color: #856404;">
                    <li>Please acknowledge receipt of this complaint</li>
                    <li>Assign appropriate personnel to investigate</li>
                    <li>Provide estimated resolution timeline</li>
                    <li>Update status in the CampusFix system</li>
                </ul>
            </div>
            
            <p style="color: #d32f2f; font-weight: bold; font-size: 16px;">🚨 Please prioritize this issue and provide an update on the resolution status within 24 hours.</p>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; border-top: 1px solid #ddd;">
            <p style="margin: 0; color: #666;">
                <strong>Best regards,</strong><br>
                CampusFix System<br>
                Automated Notification Service
            </p>
        </div>
    </div>
    `;

    // Plain text version as fallback
    const emailText = `
URGENT: NEW COMPLAINT RAISED - CAMPUSFIX SYSTEM NOTIFICATION

Dear Maintenance Team & Principal,

A new complaint has been raised through the CampusFix mobile application. Please review the comprehensive details below and take necessary action as soon as possible.

COMPLAINT DETAILS:
═══════════════════════════════════════════════════════════════

👤 Reported By: ${name}
📧 Contact Email: ${email}
🏢 Department: ${section}
📍 Location: ${location}
📝 Issue Description: ${details}
🕒 Reported At: ${timestamp}
📎 Attachment: ${image ? 'Image attached' : 'No image provided'}

═══════════════════════════════════════════════════════════════

ACTION REQUIRED:
- Please acknowledge receipt of this complaint
- Assign appropriate personnel to investigate
- Provide estimated resolution timeline
- Update status in the CampusFix system

Please prioritize this issue and provide an update on the resolution status within 24 hours.

Best regards,
CampusFix System
Automated Notification Service
`;

    // Send email to maintenance team
    let maintenanceMailOptions = {
        from: process.env.GMAIL_USER,
        to: 'ajaydevgun445@gmail.com', // Updated email address
        subject: '🚨 URGENT: New Complaint Raised - CampusFix System',
        text: emailText,
        html: emailHtml,
        attachments: image ? [{ path: image.path, filename: image.originalname }] : []
    };

    // Send confirmation email to user
    let userConfirmationHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd;">
        <div style="background-color: #2196F3; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">📝 COMPLAINT RECEIVED</h1>
            <h2 style="margin: 10px 0 0 0; font-size: 18px;">Your issue has been registered</h2>
        </div>
        
        <div style="padding: 20px;">
            <h3 style="color: #333;">Dear ${name},</h3>
            
            <p style="color: #555; line-height: 1.6;">Thank you for submitting your complaint through the CampusFix system. We have received your issue and it has been assigned to the appropriate department for resolution.</p>
            
            <div style="background-color: #f5f5f5; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0;">
                <h3 style="margin: 0 0 15px 0; color: #2196F3;">📋 COMPLAINT DETAILS</h3>
                
                <div style="margin: 10px 0;">
                    <span style="font-weight: bold; color: #2196F3;">🏢 Department:</span> ${section}
                </div>
                
                <div style="margin: 10px 0;">
                    <span style="font-weight: bold; color: #2196F3;">📍 Location:</span> ${location}
                </div>
                
                <div style="margin: 10px 0;">
                    <span style="font-weight: bold; color: #2196F3;">📝 Issue:</span> ${details}
                </div>
                
                <div style="margin: 10px 0;">
                    <span style="font-weight: bold; color: #2196F3;">🕒 Reported At:</span> ${timestamp}
                </div>
                
                <div style="margin: 10px 0;">
                    <span style="font-weight: bold; color: #2196F3;">📎 Attachment:</span> ${image ? 'Image attached' : 'No image provided'}
                </div>
            </div>
            
            <p style="color: #2196F3; font-weight: bold; font-size: 16px;">📋 Your complaint has been registered and is being processed. You will receive an update once it's resolved.</p>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <p style="margin: 0; color: #856404;">
                    <strong>⏰ Expected Resolution Time:</strong> 24-48 hours<br>
                    <strong>📞 For urgent matters:</strong> Contact the respective department directly
                </p>
            </div>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; border-top: 1px solid #ddd;">
            <p style="margin: 0; color: #666;">
                <strong>Best regards,</strong><br>
                CampusFix System
            </p>
        </div>
    </div>
    `;

    let userConfirmationText = `
COMPLAINT RECEIVED - Your issue has been registered

Dear ${name},

Thank you for submitting your complaint through the CampusFix system. We have received your issue and it has been assigned to the appropriate department for resolution.

COMPLAINT DETAILS:
═══════════════════════════════════════════════════════════════

🏢 Department: ${section}
📍 Location: ${location}
📝 Issue: ${details}
🕒 Reported At: ${timestamp}
📎 Attachment: ${image ? 'Image attached' : 'No image provided'}

═══════════════════════════════════════════════════════════════

Your complaint has been registered and is being processed. You will receive an update once it's resolved.

Expected Resolution Time: 24-48 hours
For urgent matters: Contact the respective department directly

Best regards,
CampusFix System
    `;

    let userConfirmationOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: '📝 COMPLAINT RECEIVED - CampusFix System',
        text: userConfirmationText,
        html: userConfirmationHtml
    };

    try {
        // Log the complaint data for now (email verification removed)
        console.log('=== COMPLAINT RECEIVED ===');
        console.log('Timestamp:', timestamp);
        console.log('Complaint Details:', { name, email, section, location, details, hasImage: !!image });
        
        // Log email content for reference
        console.log('\n=== EMAIL CONTENT (ADMIN) ===');
        console.log('To: ajaydevgun445@gmail.com');
        console.log('Subject: 🚨 URGENT: New Complaint Raised - CampusFix System');
        console.log('Content Preview:', emailHtml.substring(0, 200) + '...');
        
        if (email && email !== 'Not provided' && email !== '') {
            console.log('\n=== EMAIL CONTENT (USER) ===');
            console.log('To:', email);
            console.log('Subject: 📝 COMPLAINT RECEIVED - CampusFix System');
            console.log('Content Preview:', userConfirmationHtml.substring(0, 200) + '...');
        }
        
        res.json({ 
            success: true, 
            message: 'Complaint registered successfully!',
            data: { name, location, details, section, hasImage: !!image, email }
        });
    } catch (err) {
        console.error('Error processing complaint:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Endpoint to send solved email confirmation
app.post('/sendSolvedEmail', async (req, res) => {
    console.log('=== SOLVED EMAIL REQUEST RECEIVED ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Received data:', req.body);
    
    const { email, name, section, details, location } = req.body;
    
    // Set up nodemailer transporter
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });
    
    // Create solved email content
    const solvedEmailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd;">
        <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">✅ COMPLAINT RESOLVED</h1>
            <h2 style="margin: 10px 0 0 0; font-size: 18px;">Your issue has been addressed</h2>
        </div>
        
        <div style="padding: 20px;">
            <h3 style="color: #333;">Dear ${name},</h3>
            
            <p style="color: #555; line-height: 1.6;">Good news! Your complaint has been successfully resolved by our maintenance team.</p>
            
            <div style="background-color: #f5f5f5; border-left: 4px solid #4CAF50; padding: 15px; margin: 20px 0;">
                <h3 style="margin: 0 0 15px 0; color: #4CAF50;">📋 RESOLVED COMPLAINT DETAILS</h3>
                
                <div style="margin: 10px 0;">
                    <span style="font-weight: bold; color: #4CAF50;">🏢 Department:</span> ${section}
                </div>
                
                <div style="margin: 10px 0;">
                    <span style="font-weight: bold; color: #4CAF50;">📍 Location:</span> ${location}
                </div>
                
                <div style="margin: 10px 0;">
                    <span style="font-weight: bold; color: #4CAF50;">📝 Issue:</span> ${details}
                </div>
            </div>
            
            <p style="color: #4CAF50; font-weight: bold; font-size: 16px;">✅ Your issue has been resolved. Thank you for your patience!</p>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; border-top: 1px solid #ddd;">
            <p style="margin: 0; color: #666;">
                <strong>Best regards,</strong><br>
                ATR3 Maintenance Team
            </p>
        </div>
    </div>
    `;
    
    const solvedEmailText = `
COMPLAINT RESOLVED - Your issue has been addressed

Dear ${name},

Good news! Your complaint has been successfully resolved by our maintenance team.

RESOLVED COMPLAINT DETAILS:
═══════════════════════════════════════════════════════════════

🏢 Department: ${section}
📍 Location: ${location}
📝 Issue: ${details}

═══════════════════════════════════════════════════════════════

Your issue has been resolved. Thank you for your patience!

Best regards,
ATR3 Maintenance Team
`;
    
    let mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: '✅ RESOLVED: Your complaint has been addressed - ATR3 System',
        text: solvedEmailText,
        html: solvedEmailHtml
    };
    
    try {
        if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
            console.log('Email credentials not configured - skipping solved email send');
            res.json({ 
                success: true, 
                message: 'Solved email not sent due to missing credentials.',
                data: { email, name, section, details }
            });
            return;
        }
        
        await transporter.sendMail(mailOptions);
        console.log('Solved email sent successfully');
        res.json({ success: true, message: 'Solved email sent!' });
    } catch (err) {
        console.error('Solved email send error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Endpoint to send confirmation email to problem uploader
app.post('/sendConfirmationEmail', async (req, res) => {
    console.log('=== CONFIRMATION EMAIL REQUEST RECEIVED ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Received data:', req.body);
    
    const { email, name, section, details, location } = req.body;
    
    // Set up nodemailer transporter
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });
    
    // Create confirmation email content
    const confirmationEmailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd;">
        <div style="background-color: #2196F3; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">📝 COMPLAINT RECEIVED</h1>
            <h2 style="margin: 10px 0 0 0; font-size: 18px;">Your issue has been registered</h2>
        </div>
        
        <div style="padding: 20px;">
            <h3 style="color: #333;">Dear ${name},</h3>
            
            <p style="color: #555; line-height: 1.6;">Thank you for submitting your complaint through the CampusFix system. We have received your issue and it has been assigned to the appropriate department for resolution.</p>
            
            <div style="background-color: #f5f5f5; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0;">
                <h3 style="margin: 0 0 15px 0; color: #2196F3;">📋 COMPLAINT DETAILS</h3>
                
                <div style="margin: 10px 0;">
                    <span style="font-weight: bold; color: #2196F3;">🏢 Department:</span> ${section}
                </div>
                
                <div style="margin: 10px 0;">
                    <span style="font-weight: bold; color: #2196F3;">📍 Location:</span> ${location}
                </div>
                
                <div style="margin: 10px 0;">
                    <span style="font-weight: bold; color: #2196F3;">📝 Issue:</span> ${details}
                </div>
                
                <div style="margin: 10px 0;">
                    <span style="font-weight: bold; color: #2196F3;">📧 Your Email:</span> ${email}
                </div>
            </div>
            
            <p style="color: #2196F3; font-weight: bold; font-size: 16px;">📋 Your complaint has been registered and is being processed. You will receive an update once it's resolved.</p>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <p style="margin: 0; color: #856404;">
                    <strong>⏰ Expected Resolution Time:</strong> 24-48 hours<br>
                    <strong>📞 For urgent matters:</strong> Contact the respective department directly
                </p>
            </div>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; border-top: 1px solid #ddd;">
            <p style="margin: 0; color: #666;">
                <strong>Best regards,</strong><br>
                ATR3 CampusFix Team
            </p>
        </div>
    </div>
    `;
    
    const confirmationEmailText = `
COMPLAINT RECEIVED - Your issue has been registered

Dear ${name},

Thank you for submitting your complaint through the CampusFix system. We have received your issue and it has been assigned to the appropriate department for resolution.

COMPLAINT DETAILS:
═══════════════════════════════════════════════════════════════

🏢 Department: ${section}
📍 Location: ${location}
📝 Issue: ${details}
📧 Your Email: ${email}

═══════════════════════════════════════════════════════════════

Your complaint has been registered and is being processed. You will receive an update once it's resolved.

Expected Resolution Time: 24-48 hours
For urgent matters: Contact the respective department directly

Best regards,
ATR3 CampusFix Team
`;
    
    let mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: '📝 RECEIVED: Your complaint has been registered - CampusFix System',
        text: confirmationEmailText,
        html: confirmationEmailHtml
    };
    
    try {
        if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
            console.log('Email credentials not configured - skipping confirmation email send');
            res.json({ 
                success: true, 
                message: 'Confirmation email not sent due to missing credentials.',
                data: { email, name, section, details }
            });
            return;
        }
        
        await transporter.sendMail(mailOptions);
        console.log('Confirmation email sent successfully');
        res.json({ success: true, message: 'Confirmation email sent!' });
    } catch (err) {
        console.error('Confirmation email send error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Endpoint to send notification to department admin
app.post('/sendDepartmentNotification', async (req, res) => {
    console.log('=== DEPARTMENT NOTIFICATION REQUEST RECEIVED ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Received data:', req.body);
    
    const { email, name, section, details, location, departmentEmail } = req.body;
    
    // Set up nodemailer transporter
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });
    
    // Create department notification email content
    const departmentEmailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd;">
        <div style="background-color: #FF9800; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🚨 NEW COMPLAINT ASSIGNED</h1>
            <h2 style="margin: 10px 0 0 0; font-size: 18px;">Action required from ${section} Department</h2>
        </div>
        
        <div style="padding: 20px;">
            <h3 style="color: #333;">Dear ${section} Department Admin,</h3>
            
            <p style="color: #555; line-height: 1.6;">A new complaint has been assigned to your department. Please review the details below and take necessary action as soon as possible.</p>
            
            <div style="background-color: #f5f5f5; border-left: 4px solid #FF9800; padding: 15px; margin: 20px 0;">
                <h3 style="margin: 0 0 15px 0; color: #FF9800;">📋 COMPLAINT DETAILS</h3>
                
                <div style="margin: 10px 0;">
                    <span style="font-weight: bold; color: #FF9800;">👤 Reported By:</span> ${name}
                </div>
                
                <div style="margin: 10px 0;">
                    <span style="font-weight: bold; color: #FF9800;">📧 Contact Email:</span> ${email}
                </div>
                
                <div style="margin: 10px 0;">
                    <span style="font-weight: bold; color: #FF9800;">📍 Location:</span> ${location}
                </div>
                
                <div style="margin: 10px 0;">
                    <span style="font-weight: bold; color: #FF9800;">📝 Issue:</span> ${details}
                </div>
                
                <div style="margin: 10px 0;">
                    <span style="font-weight: bold; color: #FF9800;">🏢 Department:</span> ${section}
                </div>
            </div>
            
            <p style="color: #FF9800; font-weight: bold; font-size: 16px;">⚠️ Please prioritize this issue and provide an update on the resolution status within 24 hours.</p>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <p style="margin: 0; color: #856404;">
                    <strong>⏰ Priority:</strong> High<br>
                    <strong>📅 Expected Resolution:</strong> Within 24 hours<br>
                    <strong>📞 For questions:</strong> Contact the principal's office
                </p>
            </div>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; border-top: 1px solid #ddd;">
            <p style="margin: 0; color: #666;">
                <strong>Best regards,</strong><br>
                ATR3 CampusFix System
            </p>
        </div>
    </div>
    `;
    
    const departmentEmailText = `
NEW COMPLAINT ASSIGNED - Action required from ${section} Department

Dear ${section} Department Admin,

A new complaint has been assigned to your department. Please review the details below and take necessary action as soon as possible.

COMPLAINT DETAILS:
═══════════════════════════════════════════════════════════════

👤 Reported By: ${name}
📧 Contact Email: ${email}
📍 Location: ${location}
📝 Issue: ${details}
🏢 Department: ${section}

═══════════════════════════════════════════════════════════════

Please prioritize this issue and provide an update on the resolution status within 24 hours.

Priority: High
Expected Resolution: Within 24 hours
For questions: Contact the principal's office

Best regards,
ATR3 CampusFix System
`;
    
    let mailOptions = {
        from: process.env.GMAIL_USER,
        to: departmentEmail,
        subject: `🚨 URGENT: New ${section} complaint assigned - CampusFix System`,
        text: departmentEmailText,
        html: departmentEmailHtml
    };
    
    try {
        if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
            console.log('Email credentials not configured - skipping department notification send');
            res.json({ 
                success: true, 
                message: 'Department notification not sent due to missing credentials.',
                data: { email, name, section, details }
            });
            return;
        }
        
        await transporter.sendMail(mailOptions);
        console.log('Department notification sent successfully');
        res.json({ success: true, message: 'Department notification sent!' });
    } catch (err) {
        console.error('Department notification send error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Endpoint to send 24-hour escalation email to principal
app.post('/sendEscalationEmail', async (req, res) => {
    console.log('=== ESCALATION EMAIL REQUEST RECEIVED ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Received data:', req.body);
    
    const { email, name, section, details, location, complaintId } = req.body;
    
    // Set up nodemailer transporter
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });
    
    // Create escalation email content
    const escalationEmailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd;">
        <div style="background-color: #f44336; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🚨 ESCALATION ALERT</h1>
            <h2 style="margin: 10px 0 0 0; font-size: 18px;">Complaint unresolved for 24+ hours</h2>
        </div>
        
        <div style="padding: 20px;">
            <h3 style="color: #333;">Dear Principal,</h3>
            
            <p style="color: #555; line-height: 1.6;">A complaint has been unresolved for more than 24 hours and requires your immediate attention.</p>
            
            <div style="background-color: #f5f5f5; border-left: 4px solid #f44336; padding: 15px; margin: 20px 0;">
                <h3 style="margin: 0 0 15px 0; color: #f44336;">📋 ESCALATED COMPLAINT DETAILS</h3>
                
                <div style="margin: 10px 0;">
                    <span style="font-weight: bold; color: #f44336;">🆔 Complaint ID:</span> ${complaintId}
                </div>
                
                <div style="margin: 10px 0;">
                    <span style="font-weight: bold; color: #f44336;">👤 Reported By:</span> ${name}
                </div>
                
                <div style="margin: 10px 0;">
                    <span style="font-weight: bold; color: #f44336;">📧 Contact Email:</span> ${email}
                </div>
                
                <div style="margin: 10px 0;">
                    <span style="font-weight: bold; color: #f44336;">🏢 Department:</span> ${section}
                </div>
                
                <div style="margin: 10px 0;">
                    <span style="font-weight: bold; color: #f44336;">📍 Location:</span> ${location}
                </div>
                
                <div style="margin: 10px 0;">
                    <span style="font-weight: bold; color: #f44336;">📝 Issue:</span> ${details}
                </div>
                
                <div style="margin: 10px 0;">
                    <span style="font-weight: bold; color: #f44336;">⏰ Time Since Submission:</span> 24+ hours
                </div>
            </div>
            
            <p style="color: #f44336; font-weight: bold; font-size: 16px;">🚨 This complaint requires immediate intervention. Please contact the ${section} department and ensure resolution.</p>
            
            <div style="background-color: #ffebee; border: 1px solid #ffcdd2; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <p style="margin: 0; color: #c62828;">
                    <strong>⚠️ URGENT ACTION REQUIRED:</strong><br>
                    • Contact ${section} department immediately<br>
                    • Ensure resolution within next 12 hours<br>
                    • Update complainant on progress
                </p>
            </div>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; border-top: 1px solid #ddd;">
            <p style="margin: 0; color: #666;">
                <strong>Best regards,</strong><br>
                ATR3 CampusFix System
            </p>
        </div>
    </div>
    `;
    
    const escalationEmailText = `
ESCALATION ALERT - Complaint unresolved for 24+ hours

Dear Principal,

A complaint has been unresolved for more than 24 hours and requires your immediate attention.

ESCALATED COMPLAINT DETAILS:
═══════════════════════════════════════════════════════════════

🆔 Complaint ID: ${complaintId}
👤 Reported By: ${name}
📧 Contact Email: ${email}
🏢 Department: ${section}
📍 Location: ${location}
📝 Issue: ${details}
⏰ Time Since Submission: 24+ hours

═══════════════════════════════════════════════════════════════

This complaint requires immediate intervention. Please contact the ${section} department and ensure resolution.

URGENT ACTION REQUIRED:
• Contact ${section} department immediately
• Ensure resolution within next 12 hours
• Update complainant on progress

Best regards,
ATR3 CampusFix System
`;
    
    let mailOptions = {
        from: process.env.GMAIL_USER,
        to: 'principal@atr3.edu', // Replace with actual principal email
        subject: `🚨 ESCALATION: Complaint unresolved for 24+ hours - ${section} Department`,
        text: escalationEmailText,
        html: escalationEmailHtml
    };
    
    try {
        if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
            console.log('Email credentials not configured - skipping escalation email send');
            res.json({ 
                success: true, 
                message: 'Escalation email not sent due to missing credentials.',
                data: { email, name, section, details }
            });
            return;
        }
        
        await transporter.sendMail(mailOptions);
        console.log('Escalation email sent successfully');
        res.json({ success: true, message: 'Escalation email sent!' });
    } catch (err) {
        console.error('Escalation email send error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Endpoint to send reminder email to principal
app.post('/sendReminderEmail', async (req, res) => {
    console.log('=== REMINDER EMAIL REQUEST RECEIVED ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Received data:', req.body);
    
    const { name, email, section, details, location } = req.body;
    
    // Set up nodemailer transporter
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });
    
    // Create reminder email content
    const reminderEmailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd;">
        <div style="background-color: #FF9800; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">⏰ REMINDER: Pending Complaint</h1>
            <h2 style="margin: 10px 0 0 0; font-size: 18px;">24+ hours without resolution</h2>
        </div>
        
        <div style="padding: 20px;">
            <h3 style="color: #333;">Dear Principal,</h3>
            
            <p style="color: #555; line-height: 1.6;">This is an automated reminder about a complaint that has been pending for more than 24 hours and requires your attention.</p>
            
            <div style="background-color: #f5f5f5; border-left: 4px solid #FF9800; padding: 15px; margin: 20px 0;">
                <h3 style="margin: 0 0 15px 0; color: #FF9800;">📋 PENDING COMPLAINT DETAILS</h3>
                
                <div style="margin: 10px 0;">
                    <span style="font-weight: bold; color: #FF9800;">👤 Reported By:</span> ${name}
                </div>
                
                <div style="margin: 10px 0;">
                    <span style="font-weight: bold; color: #FF9800;">📧 Email:</span> ${email}
                </div>
                
                <div style="margin: 10px 0;">
                    <span style="font-weight: bold; color: #FF9800;">🏢 Department:</span> ${section}
                </div>
                
                <div style="margin: 10px 0;">
                    <span style="font-weight: bold; color: #FF9800;">📍 Location:</span> ${location}
                </div>
                
                <div style="margin: 10px 0;">
                    <span style="font-weight: bold; color: #FF9800;">📝 Issue:</span> ${details}
                </div>
            </div>
            
            <p style="color: #FF9800; font-weight: bold; font-size: 16px;">⚠️ Please ensure this complaint is addressed promptly.</p>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; border-top: 1px solid #ddd;">
            <p style="margin: 0; color: #666;">
                <strong>Best regards,</strong><br>
                ATR3 Automated System
            </p>
        </div>
    </div>
    `;
    
    const reminderEmailText = `
REMINDER: Pending Complaint - 24+ hours without resolution

Dear Principal,

This is an automated reminder about a complaint that has been pending for more than 24 hours and requires your attention.

PENDING COMPLAINT DETAILS:
═══════════════════════════════════════════════════════════════

👤 Reported By: ${name}
📧 Email: ${email}
🏢 Department: ${section}
📍 Location: ${location}
📝 Issue: ${details}

═══════════════════════════════════════════════════════════════

Please ensure this complaint is addressed promptly.

Best regards,
ATR3 Automated System
`;
    
    let mailOptions = {
        from: process.env.GMAIL_USER,
        to: 'principal@atria.edu.in', // Principal's email
        subject: '⏰ REMINDER: Pending complaint requires attention - ATR3 System',
        text: reminderEmailText,
        html: reminderEmailHtml
    };
    
    try {
        if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
            console.log('Email credentials not configured - skipping reminder email send');
            res.json({ 
                success: true, 
                message: 'Reminder email not sent due to missing credentials.',
                data: { name, email, section, details, location }
            });
            return;
        }
        
        await transporter.sendMail(mailOptions);
        console.log('Reminder email sent successfully');
        res.json({ success: true, message: 'Reminder email sent!' });
    } catch (err) {
        console.error('Reminder email send error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000')); 