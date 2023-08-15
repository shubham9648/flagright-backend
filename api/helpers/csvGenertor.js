const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports.convertToCsv = async (headerArr, jsonArr, file) => {
    return new Promise((resolve, reject) => {
        try {
            const csvWriter = createCsvWriter({
                path: `./uploads/${file}`,
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