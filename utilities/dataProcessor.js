function processData(data, query) {
  return data.filter((row) =>
    Object.values(row || {}).some((cell) =>
      (cell || '').toLowerCase().includes(query.toLowerCase())
    )
  );
}

module.exports = { processData };
