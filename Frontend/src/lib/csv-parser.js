import Papa from 'papaparse';

export async function parseCsvFile(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        const rows = Array.isArray(results.data) ? results.data : [];
        const headers = results.meta?.fields?.length
          ? results.meta.fields
          : Object.keys(rows[0] || {});

        resolve({
          headers,
          rows,
          fileName: file.name,
          fileSize: file.size,
          totalRows: rows.length,
          totalColumns: headers.length,
        });
      },
      error: (error) => {
        reject(new Error(error.message || 'Unable to parse this CSV file.'));
      },
    });
  });
}
