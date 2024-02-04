function paginateData(data, page, itemsPerPage) {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  return {
    paginatedData,
    totalPages: Math.ceil(data.length / itemsPerPage),
  };
}

module.exports = { paginateData };
