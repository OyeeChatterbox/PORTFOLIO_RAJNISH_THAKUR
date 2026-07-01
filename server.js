const express = require('express');
const cors = require('cors');
const moment = require('moment-timezone');
require('dotenv').config();

const { appendRow } = require('./googleSheets');
const { sendNotification } = require('./email');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple in-memory rate limiting to prevent spam
const rateLimitStore = new Map();

function isRateLimited(ip) {
    const now = Date.now();
    const lastRequest = rateLimitStore.get(ip);
    
    // Limit to 1 request per 30 seconds per IP
    if (lastRequest && (now - lastRequest) < 30000) {
        return true;
    }
    rateLimitStore.set(ip, now);
    return false;
}

// Helpers
function getISTTimestamp() {
    return moment().tz("Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss');
}

function validatePhone(phone) {
    const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
    return phoneRegex.test(phone);
}

// Route 1: Website Entry (Popup)
app.post('/api/entry', async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (isRateLimited(ip)) {
        return res.status(429).json({ error: "Too many requests. Please try again later." });
    }

    const { name, phone } = req.body;

    if (!name || !phone || !validatePhone(phone)) {
        return res.status(400).json({ error: "Valid Name and Phone are required." });
    }

    const data = {
        timestamp: getISTTimestamp(),
        name,
        phone,
        actionType: 'Website Entry',
        sourcePage: 'Homepage',
        subject: 'New Website Visitor'
    };

    // Store in Google Sheets & Send Email asynchronously
    await Promise.all([
        appendRow(data),
        sendNotification(data)
    ]);

    res.status(200).json({ success: true, message: "Entry logged successfully." });
});

// Route 2: Course Enrollment
app.post('/api/enroll', async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (isRateLimited(ip)) {
        return res.status(429).json({ error: "Too many requests. Please try again later." });
    }

    const { name, phone, email, selectedCourse, message } = req.body;

    if (!name || !phone || !validatePhone(phone) || !selectedCourse) {
        return res.status(400).json({ error: "Name, valid Phone, and Course Selection are required." });
    }

    // Determine Course Category based on selection
    let courseCategory = 'Other';
    let actionType = 'Course Enrollment';
    let subject = 'New Course Enrollment Request';

    if (selectedCourse.toLowerCase().includes('video editing')) {
        courseCategory = 'Video Editing';
        actionType = 'Video Editing Enrollment';
        subject = 'New Video Editing Enrollment Request';
    } else if (selectedCourse.toLowerCase().includes('photoshop')) {
        courseCategory = 'Photoshop';
        actionType = 'Photoshop Enrollment';
        subject = 'New Photoshop Enrollment Request';
    }

    const data = {
        timestamp: getISTTimestamp(),
        name,
        phone,
        email: email || '',
        courseCategory,
        selectedCourse,
        message: message || '',
        actionType,
        sourcePage: 'Course Section',
        subject
    };

    // Store in Google Sheets & Send Email asynchronously
    await Promise.all([
        appendRow(data),
        sendNotification(data)
    ]);

    res.status(200).json({ success: true, message: "Enrollment logged successfully." });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    console.log(`Ready to capture leads in IST.`);
});
