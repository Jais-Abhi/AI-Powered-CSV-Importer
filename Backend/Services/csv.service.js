import { Readable } from "stream";
import csv from "csv-parser";

const parseCSVFile = (buffer) => {
    return new Promise((resolve, reject) => {

        const records = [];

        Readable.from(buffer)
            .pipe(csv())
            .on("data", (row) => {
                records.push(row);
            })
            .on("end", () => {
                resolve(records);
            })
            .on("error", reject);

    });
};

export { parseCSVFile };