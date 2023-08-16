const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require("path")

module.exports.convertToCsv = async (headerArr, jsonArr, file) => {
    return new Promise((resolve, reject) => {
        try {
            const absolutePath = path.resolve(__dirname, '../..'); 
            const csvWriter = createCsvWriter({
                path: `${absolutePath}/uploads/${file}`,
                header: headerArr
            });
            csvWriter
                .writeRecords(jsonArr)
                .then(() => {
                    console.log('The CSV file was written successfully')
                    resolve(file);
                });
        }
        catch(err) {
            reject(err)
        }
    })
}