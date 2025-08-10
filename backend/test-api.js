const axios = require('axios');
const FormData = require('form-data');

const API_BASE = 'http://localhost:3000';

// Colors for console output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testServerStatus() {
    log('\n🔍 Testing Server Status...', 'blue');
    try {
        const response = await axios.post(`${API_BASE}/sendForm`, {
            name: 'Test User',
            email: 'test@example.com',
            location: 'Test Location',
            details: 'Test complaint',
            section: 'Security'
        });
        
        if (response.status === 200) {
            log('✅ Server is running and responding', 'green');
            return true;
        }
    } catch (error) {
        log('❌ Server error: ' + error.message, 'red');
        return false;
    }
}

async function testComplaintSubmission() {
    log('\n📝 Testing Complaint Submission...', 'blue');
    try {
        const formData = new FormData();
        formData.append('name', 'Test User');
        formData.append('email', 'test@example.com');
        formData.append('location', 'Room 101');
        formData.append('details', 'Test complaint for system verification');
        formData.append('section', 'Security');
        
        const response = await axios.post(`${API_BASE}/sendForm`, formData, {
            headers: formData.getHeaders()
        });
        
        log('✅ Complaint submitted successfully', 'green');
        log('Response: ' + JSON.stringify(response.data, null, 2), 'yellow');
        return true;
    } catch (error) {
        log('❌ Error submitting complaint: ' + error.message, 'red');
        return false;
    }
}

async function testSolvedEmail() {
    log('\n✅ Testing Resolution Email...', 'blue');
    try {
        const response = await axios.post(`${API_BASE}/sendSolvedEmail`, {
            email: 'test@example.com',
            name: 'Test User',
            section: 'Security',
            details: 'Test complaint resolved'
        });
        
        log('✅ Resolution email sent successfully', 'green');
        log('Response: ' + JSON.stringify(response.data, null, 2), 'yellow');
        return true;
    } catch (error) {
        log('❌ Error sending resolution email: ' + error.message, 'red');
        return false;
    }
}

async function testReminderEmail() {
    log('\n⏰ Testing Reminder Email...', 'blue');
    try {
        const response = await axios.post(`${API_BASE}/sendReminderEmail`, {
            email: 'test@example.com',
            name: 'Test User',
            section: 'Security',
            details: 'Test complaint pending',
            location: 'Room 101'
        });
        
        log('✅ Reminder email sent successfully', 'green');
        log('Response: ' + JSON.stringify(response.data, null, 2), 'yellow');
        return true;
    } catch (error) {
        log('❌ Error sending reminder email: ' + error.message, 'red');
        return false;
    }
}

async function runAllTests() {
    log('\n🚀 ATR3 System - API Testing Suite', 'bold');
    log('=====================================', 'blue');
    
    const results = {
        serverStatus: await testServerStatus(),
        complaintSubmission: await testComplaintSubmission(),
        solvedEmail: await testSolvedEmail(),
        reminderEmail: await testReminderEmail()
    };
    
    log('\n📊 Test Results Summary:', 'bold');
    log('========================', 'blue');
    
    Object.entries(results).forEach(([test, passed]) => {
        const status = passed ? '✅ PASS' : '❌ FAIL';
        const color = passed ? 'green' : 'red';
        log(`${status} - ${test}`, color);
    });
    
    const passedTests = Object.values(results).filter(Boolean).length;
    const totalTests = Object.keys(results).length;
    
    log(`\n🎯 Overall Result: ${passedTests}/${totalTests} tests passed`, 
        passedTests === totalTests ? 'green' : 'red');
    
    if (passedTests === totalTests) {
        log('\n🎉 All tests passed! The ATR3 system is working correctly.', 'green');
    } else {
        log('\n⚠️ Some tests failed. Check the server logs for details.', 'yellow');
    }
}

// Run tests if this script is executed directly
if (require.main === module) {
    runAllTests().catch(console.error);
}

module.exports = { runAllTests }; 