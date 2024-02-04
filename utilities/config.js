const fs = require('fs');

function readAndFormatPrivateKey() {
  const private_key = process.env.PRIVATE_KEY;

  // Check if PRIVATE_KEY has line breaks
  const hasLineBreaks = private_key.includes('\\n');

  if (hasLineBreaks) {
    console.log('Line breaks are present in PRIVATE_KEY');
  } else {
    console.log('Line breaks are not present in PRIVATE_KEY');
  }

  // Ensure PRIVATE_KEY is formatted correctly
  const formattedPrivateKey = private_key.replace(/\\n/g, '\n');

  return formattedPrivateKey;
}

module.exports = {
  SPREADSHEET_ID: process.env.SPREADSHEET_ID,
  CLIENT_EMAIL: process.env.CLIENT_EMAIL,
  CLIENT_ID: process.env.CLIENT_ID,
  readAndFormatPrivateKey: readAndFormatPrivateKey,
};
