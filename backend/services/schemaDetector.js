const fs = require('fs');
const csv = require('csv-parser');
const xlsx = require('xlsx');

function detectSchema(filePath, mimetype) {
    return new Promise((resolve, reject) => {
        const numericColumns = [];
        const categoricalColumns = [];
        const datetimeColumns = [];
        const geospatialData = []; // Very basic heuristic

        const analyzeRow = (row) => {
            // Need to look at first few rows to guess types
            // For simplicity, we just look at the first row keys and values
            // But usually we need to scan more. 
            // This function expects a single row object: { col1: 'val', col2: 123 }
            // In a real app we'd scan ~100 rows.
            return row;
        };

        // We will read the whole file into an array (for small demos) 
        // or just stream first N rows. For this MVP, let's load all and analyze columns.

        const processData = (data) => {
            if (data.length === 0) {
                return resolve({ numericColumns: [], categoricalColumns: [], datetimeColumns: [] });
            }

            const headers = Object.keys(data[0]);

            headers.forEach(header => {
                // Check a few values for this column
                let isNumeric = true;
                let isDate = true;

                // Sample up to 10 rows
                const sampleLimit = Math.min(data.length, 20);

                for (let i = 0; i < sampleLimit; i++) {
                    const val = data[i][header];
                    if (val === undefined || val === null || val === '') continue; // skip empty

                    // Check numeric
                    if (isNaN(Number(val))) {
                        isNumeric = false;
                    }

                    // Check date (very naive)
                    const dateParsed = Date.parse(val);
                    if (isNaN(dateParsed) || !isNaN(Number(val))) { // If it's just a number, Date.parse might accept it but we prefer number
                        // Heuristic: pure numbers are not dates usually suitable for charts unless specific formats
                        if (isNaN(dateParsed)) isDate = false;
                        // If it looks like a number, treat as number not date generally
                        if (!isNaN(Number(val))) isDate = false;
                    }
                }

                // Decide type
                if (isNumeric) {
                    numericColumns.push(header);
                    // maybe geo?
                    if (header.toLowerCase().includes('lat') || header.toLowerCase().includes('lon')) {
                        geospatialData.push(header);
                    }
                } else if (isDate) {
                    datetimeColumns.push(header);
                } else {
                    categoricalColumns.push(header);
                    // maybe geo (country names etc)?
                    if (['country', 'city', 'state', 'region'].includes(header.toLowerCase())) {
                        geospatialData.push(header);
                    }
                }
            });

            resolve({
                numericColumns,
                categoricalColumns,
                datetimeColumns,
                geospatialData
            });
        };

        if (mimetype.includes('csv') || filePath.endsWith('.csv')) {
            const results = [];
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => processData(results))
                .on('error', reject);
        } else if (mimetype.includes('sheet') || mimetype.includes('excel') || filePath.endsWith('.xlsx')) {
            try {
                const workbook = xlsx.readFile(filePath);
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const results = xlsx.utils.sheet_to_json(sheet);
                processData(results);
            } catch (err) {
                reject(err);
            }
        } else {
            reject(new Error('Unsupported file type'));
        }
    });
}

module.exports = { detectSchema };
