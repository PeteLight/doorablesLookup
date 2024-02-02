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
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 20; // Set the maximum results per page

    // Fetch data if not already loaded
    if (!res.app.locals.sheetData) {
      await fetchData('Sheet1');
    }

    const data = res.app.locals.sheetData || [];

    // Filter data based on the user's search query
    const filteredData = data.filter((row) =>
      Object.values(row || {}).some((cell) =>
        (cell || '').toLowerCase().includes(query)
      )
    );

    // Paginate the results
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    res.render('pages/search', {
      data: paginatedData,
      currentPage: page,
      totalPages: Math.ceil(filteredData.length / itemsPerPage),
      query: req.query.query,
      page: page,
      itemsPerPage: itemsPerPage,
      filteredData: filteredData,
    });
  } catch (error) {
    console.error('Error fetching or rendering data:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
