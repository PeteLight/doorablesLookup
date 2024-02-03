// require('dotenv-safe').config({
//   allowEmptyValues: true,
// });
// const express = require('express');
// const sheetController = require('./controllers/sheetController');
// const { fetchData, authorize } = require('./services/googleSheetService');

// const app = express();

// app.use(express.static('public'));
// app.set('view engine', 'ejs');

// const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
// const SHEET_NAME = 'Sheet1';

// app.locals.sheetData = null;

// app.use('/', sheetController);

// async function startApp() {
//   try {
//     const data = await fetchData(SHEET_NAME); // Specify the sheet name
//     app.locals.sheetData = data;
//     app.listen(3000 || process.env.PORT, () => {
//       console.log('Up and Running!');
//     });
//   } catch (error) {
//     console.error('Error starting the app:', error);
//   }
// }

// startApp();

require('dotenv-safe').config({
  allowEmptyValues: true,
});
const express = require('express');
const sheetController = require('./controllers/sheetController');
const { fetchData, authorize } = require('./services/googleSheetService');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.locals.sheetData = null;
app.locals.sheetName = null;

app.use('/', sheetController);

async function startApp() {
  try {
    const { sheetName, data } = await fetchData();
    app.locals.sheetData = data;
    app.locals.sheetName = sheetName;
    app.listen(3000 || process.env.PORT, () => {
      console.log('Up and Running!');
    });
  } catch (error) {
    console.error('Error starting the app:', error);
  }
}

startApp();
