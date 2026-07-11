import { parseCSVFile } from '../Services/csv.service.js';
import { createBatches } from '../utils/createBatches.js';

const uploadCSV = async (req, res) => {
  console.log(req.file)
  try {
    if (!req.file  ) {
      return res.status(400).json({ message: 'No CSV file uploaded.' });
    }

    const records = await parseCSVFile(req.file.buffer);
    const batches = createBatches(records, 50); // Adjust batch size as needed
    return res.status(200).json({
      message: 'CSV parsed successfully',
      data: batches,
    });
  } catch (error) {
    console.error('CSV upload error:', error.message);
    return res.status(500).json({ message: error.message || 'Failed to parse CSV file.' });
  }
};

export { uploadCSV };