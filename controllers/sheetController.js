// sheetController.js

const express = require('express');
const { fetchData, getSheetNames } = require('../services/googleSheetService');

const router = express.Router();

router.get('/', async (req, res) => {
  const sheetNames = await getSheetNames();
  res.render('pages/index', { sheetNames });
});

router.get('/search', async (req, res) => {
  try {
    const query = (req.query.query || '').toLowerCase();
    const selectedSheet = req.query.selectedSheet || 'Sheet1'; // Default to Sheet1 if not provided
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 20;

    // Fetch data based on the selected sheet and query
    const { sheetName, data } = await fetchData(selectedSheet, query);

    // Filter data based on the user's search query and the selected sheet
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
      sheetName: sheetName,
      selectedSheet: selectedSheet,
    });
  } catch (error) {
    console.error('Error fetching or rendering data:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
