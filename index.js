require('dotenv-safe').config({
  allowEmptyValues: true,
});
const express = require('express');
const sheetController = require('./controllers/sheetController');
const { getSheetNames, fetchData } = require('./services/googleSheetService');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.locals.sheetData = null;
app.locals.sheetNames = null;

app.use('/', sheetController);

async function startApp() {
  try {
    const sheetNames = await getSheetNames();
    app.locals.sheetNames = sheetNames;

    // Fetch data for the default sheet (e.g., the first sheet in the array)
    const defaultSheet = sheetNames[0]; // You can modify this based on your logic
    const { sheetName, data } = await fetchData(defaultSheet);

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
