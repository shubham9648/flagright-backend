const { responseHandler } = require('../../middleware/response-handler');
const service = require('../services/transaction');
const { search } = require("../queries/transaction");
const { ObjectId } = require("mongodb");
const cron = require("node-cron");

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

        const query = [
            {
                $match: filter
            },
            {
                '$group': {
                    '_id': null,
                    'totalAmount': {
                        '$sum': '$amount'
                    }
                }
            }
        ]

        const response = await service.aggregate(query);

        return responseHandler(response, res);

    } catch (err) {
        console.log("error is ", err);
        next(err);
    }
};

var transactionCronJob = null;

exports.startCronJob = async (req, res, next) => {
    try {


        transactionCronJob = cron.schedule('*/5 * * * * *', async () => {

            const userIds = await service.findUser();
            const typeArr = ["DEPOSIT", "TRANSFER", "EXTERNAL_PAYMENT", "WITHDRAWAL", "REFUND", "OTHER"]

            const min = 0;
            const max = userIds.length - 1;
            const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

            console.log(randomNumber);
            let amount = Math.floor(Math.random() * 100);
            const transAmount = Math.floor(Math.random()) * 12

            const minType = 0;
            const maxType = typeArr.length - 1;
            const randomNumberType = Math.floor(Math.random() * (maxType - minType + 1)) + minType;

            const body = {
                description: "some random",
                amount: amount,
                type: typeArr[randomNumberType],
                originUserId: userIds[randomNumber],
                destinationUserId: userIds[randomNumber + 1],
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
