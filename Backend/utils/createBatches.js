const createBatches = (records, batchSize) => {
  if (!Array.isArray(records)) {
    return [];
  }

  if (!Number.isInteger(batchSize) || batchSize <= 0) {
    return [];
  }

  const batches = [];

  for (let i = 0; i < records.length; i += batchSize) {
    batches.push(records.slice(i, i + batchSize));
  }

  return batches;
};

export { createBatches };