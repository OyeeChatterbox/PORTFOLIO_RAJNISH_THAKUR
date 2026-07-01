const { google } = require('googleapis');
require('dotenv').config();

// Function to initialize the Google Sheets API client
async function getAuthClient() {
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
        console.warn("Google credentials missing. Returning null client.");
        return null;
    }

    // Fix the private key if it's passed as a single line with \n
    const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: privateKey
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    return await auth.getClient();
}

/**
 * Appends a row to the configured Google Sheet
 */
async function appendRow(data) {
    const auth = await getAuthClient();
    if (!auth) {
        console.error("Failed to authenticate with Google Sheets.");
        return false;
    }

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // Construct the row array matching Columns A through J
    // A: Timestamp, B: Name, C: Phone, D: Email, E: Course Category, 
    // F: Selected Course, G: Message, H: Action Type, I: Source Page, J: Status
    const values = [
        [
            data.timestamp || '',
            data.name || '',
            data.phone || '',
            data.email || '',
            data.courseCategory || '',
            data.selectedCourse || '',
            data.message || '',
            data.actionType || '',
            data.sourcePage || '',
            data.status || 'New'
        ]
    ];

    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Sheet1!A:J', // Appends to the first available row
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values
            }
        });
        console.log("Successfully appended row to Google Sheet.");
        return true;
    } catch (error) {
        console.error("Error appending to Google Sheet:", error.message);
        return false;
    }
}

module.exports = { appendRow };
