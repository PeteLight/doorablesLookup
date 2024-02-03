const express = require('express');
const { fetchData } = require('../services/googleSheetService');
const { processData } = require('../utilities/dataProcessor');
const { paginateData } = require('../utilities/pagination'); // Adjust the path as needed

const router = express.Router();

router.get('/', (req, res) => {
  res.render('pages/index');
});

router.get('/search', async (req, res) => {
  try {
    const query = (req.query.query || '').toLowerCase();
    const selectedSheet = req.query.selectedSheet; // No default provided

    if (!selectedSheet) {
      throw new Error('Selected sheet is required');
    }

    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 20;

    // Fetch data based on the selected sheet and query
    const { sheetName, data } = await fetchData(selectedSheet, query);

    // Process and filter data based on the user's search query
    const filteredData = processData(data, query);

    // Paginate the results
    const { paginatedData, totalPages } = paginateData(
      filteredData,
      page,
      itemsPerPage
    );

    res.render('pages/search', {
      data: paginatedData,
      currentPage: page,
      totalPages: totalPages,
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

router.get('/search/page', async (req, res) => {
  try {
    const query = (req.query.query || '').toLowerCase();
    const selectedSheet = req.query.selectedSheet; // No default provided

    if (!selectedSheet) {
      throw new Error('Selected sheet is required');
    }

    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 20;

    // Fetch data based on the selected sheet and query
    const { data } = await fetchData(selectedSheet, query);

    // Process and filter data based on the user's search query
    const filteredData = processData(data, query);

    // Paginate the results for the requested page
    const { paginatedData, totalPages } = paginateData(
      filteredData,
      page,
      itemsPerPage
    );

    res.json({
      data: paginatedData,
      currentPage: page,
      totalPages: totalPages,
      itemsPerPage: itemsPerPage,
    });
  } catch (error) {
    console.error('Error fetching or rendering data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
