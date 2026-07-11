export function validateCsvFile(file) {
  if (!file) {
    return {
      isValid: false,
      message: 'Please select a CSV file to continue.',
    };
  }

  const fileName = file.name || '';
  const isCsvFile = fileName.toLowerCase().endsWith('.csv') || file.type === 'text/csv';

  if (!isCsvFile) {
    return {
      isValid: false,
      message: 'Only .csv files are supported. Please choose a valid CSV file.',
    };
  }

  return {
    isValid: true,
    message: '',
  };
}
