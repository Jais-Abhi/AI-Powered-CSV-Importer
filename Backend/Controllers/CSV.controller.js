import { parseCSVFile } from '../Services/csv.service.js';

const uploadCSV = async (req, res) => {
  try {
    if (!req.file || (!req.file.buffer && !req.file.path)) {
      return res.status(400).json({ message: 'No CSV file uploaded.' });
    }

    const csvSource = req.file.buffer || req.file.path;
    const records = await parseCSVFile(csvSource);

    return res.status(200).json({
      message: 'CSV parsed successfully',
      data: records,
    });
  } catch (error) {
    console.error('CSV upload error:', error.message);
    return res.status(500).json({ message: error.message || 'Failed to parse CSV file.' });
  }
};

export { uploadCSV };