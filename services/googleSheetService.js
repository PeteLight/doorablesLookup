const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const serviceAccountPath =
  process.env.SERVICE_ACCOUNT_PATH || '../credentials.json';
const absolutePath = path.join(__dirname, serviceAccountPath);
const serviceAccountCredentials = JSON.parse(
  fs.readFileSync(absolutePath, 'utf8')
);

async function fetchData(sheetName, query) {
  const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
  const auth = await authorize();
  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const sheetsArray = response.data.sheets || [];

    // Find the selected sheet in the sheetsArray
    const selectedSheet = sheetsArray.find(
      (sheet) => sheet.properties.title === sheetName
    );

    if (!selectedSheet) {
      throw new Error(`Sheet '${sheetName}' not found`);
    }

    const values = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: selectedSheet.properties.title,
    });

    const header = values.data.values[0];
    const data = values.data.values.slice(1).map((row) => {
      return header.reduce((obj, key, index) => {
        obj[key] = row[index];
        return obj;
      }, {});
    });

    return { sheetName: selectedSheet.properties.title, data };
  } catch (error) {
    console.error('Error fetching data:', error.message);
    throw error;
  }
}

async function getSheetNames() {
  const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
  const auth = await authorize();
  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const spreadsheetInfo = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const sheetNames = spreadsheetInfo.data.sheets.map(
      (sheet) => sheet.properties.title
    );
    return sheetNames;
  } catch (error) {
    console.error('Error fetching sheet names:', error.message);
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

module.exports = { fetchData, getSheetNames, authorize };
