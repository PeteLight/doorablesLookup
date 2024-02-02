// sheetController.js
const express = require('express');
const { fetchData } = require('../services/googleSheetService');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('pages/index');
});

router.get('/search', async (req, res) => {
  try {
    const query = (req.query.query || '').toLowerCase();

    // Fetch data if not already loaded
    if (!res.app.locals.sheetData) {
      await fetchData('Sheet1'); // Specify the sheet name
    }

    const data = res.app.locals.sheetData || [];

    // Filter data based on the user's search query (customize this based on your data structure)
    const filteredData = data.filter((row) =>
      Object.values(row || {}).some((cell) =>
        (cell || '').toLowerCase().includes(query)
      )
    );

    res.render('pages/search', { data: filteredData });
  } catch (error) {
    console.error('Error fetching or rendering data:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
