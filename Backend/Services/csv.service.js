import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import csv from 'csv-parser';

const parseCSVFile = async (fileInput) => {
  if (!fileInput) {
    throw new Error('A valid CSV file path or buffer is required.');
  }

  if (Buffer.isBuffer(fileInput)) {
    return parseCsvStream(Readable.from([fileInput.toString('utf8')]));
  }

  if (typeof fileInput !== 'string') {
    throw new Error('A valid CSV file path or buffer is required.');
  }

  const absolutePath = path.resolve(fileInput);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`CSV file not found: ${absolutePath}`);
  }

  return parseCsvStream(fs.createReadStream(absolutePath));
};

const parseCsvStream = (stream) => {
  return new Promise((resolve, reject) => {
    const results = [];

    stream
      .pipe(
        csv({
          mapHeaders: ({ header }) => header,
        })
      )
      .on('data', (row) => {
        const hasValue = Object.values(row).some((value) => {
          if (typeof value === 'string') {
            return value.trim() !== '';
          }
          return value !== undefined && value !== null && value !== '';
        });

        if (hasValue) {
          results.push(row);
        }
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(new Error(`Failed to parse CSV: ${error.message}`));
      });
  });
};

export { parseCSVFile };
