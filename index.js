require('dotenv-safe').config({
  allowEmptyValues: true,
});
const express = require('express');
const sheetController = require('./controllers/sheetController');
const { getSheetNames, fetchData } = require('./services/googleSheetService');

let app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');

// Use middleware to fetch and set sheet names
app.use(async (req, res, next) => {
  try {
    const sheetNames = await getSheetNames();
    app.locals.sheetNames = sheetNames;

    // Continue with the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error fetching sheet names:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.use('/', sheetController);

async function startApp() {
  try {
    // Concurrently fetch sheet names and data
    const [sheetNames, { sheetName, data }] = await Promise.all([
      app.locals.sheetNames || getSheetNames(),
      app.locals.sheetNames
        ? fetchData(app.locals.sheetNames[0])
        : fetchData((await getSheetNames())[0]),
    ]);

    app.locals.sheetNames = sheetNames;
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
