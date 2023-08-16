const { responseHandler } = require('../../middleware/response-handler');
const service = require('../services/transaction');
const { search, analytics } = require("../queries/transaction");
const { ObjectId } = require("mongodb");
const cron = require("node-cron");
const constants = require("../helpers/constant");
const cvsGenerator = require("../helpers/csvGenertor");
const moment = require("moment");
const fs = require("fs")
const path = require("path")

exports.create = async (req, res, next) => {
    try {
        const value = req.value;

        const userId = req.user.userId;

        value.addedBy, value.originUserId = userId;

        const response = await service.create(value);

        if (!response) {
            return responseHandler(null, res, "Error Occured", 400);
        };

        responseHandler(response, res);
    } catch (err) {
        console.log("error is ", err);
        next(err);
    }
};

exports.getList = async (req, res, next) => {
    try {

        const reqQuery = req.query;
        const pagination = { skip: 0, limit: 10 };
        if (reqQuery.pageNo && reqQuery.pageSize) {
            pagination.skip = parseInt((reqQuery.pageNo - 1) * reqQuery.pageSize);
            pagination.limit = parseInt(reqQuery.pageSize);
        }
        let sort = {}
        const filter = {};

        //Handle sorting.. 
        if (reqQuery.createdAt) sort['createdAt'] = Number(reqQuery.createdAt)

        if (reqQuery.updatedAt) sort['updatedAt'] = Number(reqQuery.updatedAt)

        if (reqQuery.amountSort) sort['amount'] = Number(reqQuery.amountSort);

        // to handle filters ...

        if (reqQuery.search) filter['search'] = reqQuery.search

        if (reqQuery.country) filter['country'] = { $regex: reqQuery.country, $options: 'i' };

        if (reqQuery.ID) filter['ID'] = reqQuery.ID;

        if (reqQuery.srNo) filter['srNo'] = Number(reqQuery.srNo);

        if (reqQuery.amount) filter['amount'] = Number(reqQuery.amount)

        if (reqQuery.destinationUserId) filter['destinationUserId'] = { $in: reqQuery.destinationUserId.split(',').map(el => new ObjectId(el)) };

        if (reqQuery.originUserId) filter['originUserId'] = { $in: reqQuery.originUserId.split(',').map(el => new ObjectId(el)) };

        if (reqQuery.id) filter['_id'] = { $in: reqQuery.id.split(',').map(el => new ObjectId(el)) };

        if (reqQuery.from && reqQuery.to) {
            filter['createdAt'] = { $gte: new Date(reqQuery.from), $lte: new Date(reqQuery.to) };
        };

        const query = search(filter, pagination, sort);

        const data = await service.search(query);

        responseHandler(data, res);
    } catch (err) {
        console.log("error is ", err);
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const value = req.value;

        const id = req.params.id;

        const response = await service.update({ _id: id }, value);

        if (!response) {
            return responseHandler(null, res, "Error Occurred", 400);
        };

        responseHandler(response, res);

    } catch (err) {
        console.log("error is ", err);
        next(err);
    }
};

exports.deleteOne = async (req, res, next) => {
    try {
        const id = req.params.id;

        const response = await service.delete(id);

        if (!response) {
            return responseHandler(null, res, "Error Occurred", 400);
        };

        responseHandler("deleted", res);

    } catch (err) {
        console.log("error is ", err);
        next(err);
    }
};

exports.analytics = async (req, res, next) => {
    try {

        const reqQuery = req.query;

        const filter = {}

        if (reqQuery.from && reqQuery.to) {
            filter['createdAt'] = { $gte: new Date(reqQuery.from), $lte: new Date(reqQuery.to) };
        };

        const queries = analytics(filter);

        const response = await service.aggregate(queries);

        const data = {
            totalAmount: response[0].totalAmount ? response[0].totalAmount[0].totalAmount : 0,
            totalCount: response[0].totalCount ? response[0].totalCount[0].count : 0
        }

        return responseHandler(data, res);

    } catch (err) {
        console.log("error is ", err);
        next(err);
    }
};

var transactionCronJob = null;

exports.startCronJob = async (req, res, next) => {
    try {
        // for starting cron job...
         transactionCronJob = cron.schedule('*/1 * * * * *', async () => {
            const userIds = await service.findUser();
            const typeArr = ["DEPOSIT", "TRANSFER", "EXTERNAL_PAYMENT", "WITHDRAWAL", "REFUND", "OTHER"]

            const min = 0;
            const max = userIds.length - 1;
            const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

            console.log(randomNumber);
            let amount = Math.floor(Math.random() * 1000);
            const transAmount = Math.floor(Math.random()) * 12

            const minType = 0;
            const maxType = typeArr.length - 1;
            const randomNumberType = Math.floor(Math.random() * (maxType - minType + 1)) + minType;

            const body = {
                description: "some random",
                amount: amount,
                type: typeArr[randomNumberType],
                originUserId: userIds[randomNumber] ? userIds[randomNumber] : userIds[randomNumber - 1],
                destinationUserId: userIds[randomNumber + 1] ? userIds[randomNumber + 1] : userIds[randomNumber - 1],
                originAmountDetails: {
                    transactionAmount: transAmount,
                    currency: "64d87a4646cf035437f78a30"
                },
                destinationAmountDetails: {
                    transactionAmount: transAmount,
                    currency: "64d87a3946cf035437f78a2e"
                },
                productType: "some productType",
                status: "received"
            }
            const response = await service.create(body);
            console.log('Generating transaction...', response);
        });
        responseHandler(null, res, "CronJob Started");

    } catch (err) {
        console.log("error is ", err);
        next(err);
    }
};

exports.stopCronJob = async (req, res, next) => {
    try {
        // for stopping cron job
        if (transactionCronJob) {
            transactionCronJob.stop();
            responseHandler(null, res, 'Cron job stopped.');
        } else {
            responseHandler(null, res, 'Nothing to stop!.');
        }

    } catch (err) {
        console.log("error is ", err);
        next(err);
    }
};

exports.getTransactionCsv = async (req, res, next) => {
    try {
        let filter = { active: true };
        let pagination = { skip: 0, limit: 1500 };

        const query = search(filter, pagination, { createdAt: -1 });

        const data = await service.search(query);

        const transaction = data.data;
        let headerArr = constants.transactionExport;

        const jsonArr = [];

        transaction ? transaction.map((obj) => {
            jsonArr.push({
                amount: obj.amount || '',
                srNo: obj.srNo || '',
                transId: obj.ID || '',
                originName: obj?.originUser?.fullName || '',
                destinationName: obj?.destinationUser?.fullName || '',
                originEmail: obj?.originUser?.email || '',
                destinationEmail: obj?.destinationUser?.email || '',
                description: obj.description || '',
                type: obj.type || '',
                status: obj.status || '',
                originCurrency: obj.originAmountDetails.currency.name || '',
                destinationCurrency: obj.destinationAmountDetails.currency.name || '',
                productType: obj.productType || '',
                createdAt: moment(obj.createdAt).format("DD/MM/YYYY") || ''
            })
        }) : null;

        let filePath = new Date().getTime() + ".csv";

        const transactionCsvExport = await cvsGenerator.convertToCsv(headerArr, jsonArr, filePath);

        const absolutePath = path.resolve(__dirname, '../..');

        console.log("absolutePath is ", absolutePath);
        res.download(absolutePath + "/uploads/" + transactionCsvExport, absolutePath + "/uploads/" + transactionCsvExport, () => {
            fs.unlink("./uploads/" + transactionCsvExport, (err => {
                if (err) console.log(err);
                else {
                    console.log("\nDeleted file:", "./uploads/" + transactionCsvExport);
                }
            }));
        })

    } catch (err) {
        console.log(err);
        next(err);
    }
}