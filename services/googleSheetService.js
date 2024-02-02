const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const serviceAccountPath =
  process.env.SERVICE_ACCOUNT_PATH || '../credentials.json';

// Use path.join to create an absolute path based on the project's root directory
const absolutePath = path.join(__dirname, serviceAccountPath);

// Use fs.readFileSync to load the JSON file securely
const serviceAccountCredentials = JSON.parse(
  fs.readFileSync(absolutePath, 'utf8')
);

async function fetchData(SHEET_NAME) {
  const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
  const auth = await authorize();
  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID, // Fixed property name
      range: SHEET_NAME,
    });

    const values = response.data.values;
    const header = values[0];
    const data = values.slice(1).map((row) => {
      return header.reduce((obj, key, index) => {
        obj[key] = row[index];
        return obj;
      }, {});
    });

    return data; // Instead of modifying app.locals.sheetData directly
  } catch (error) {
    console.error('Error fetching data:', error.message);
    throw error;
  }
}

async function authorize() {
  const { client_email, private_key } = serviceAccountCredentials;
  const jwtClient = new google.auth.JWT({
    email: serviceAccountCredentials.client_email,
    key: serviceAccountCredentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  try {
    await jwtClient.authorize();
    return jwtClient;
  } catch (error) {
    console.error('Error authorizing with service account:', error);
    throw error;
  }
}

module.exports = { fetchData, authorize };
