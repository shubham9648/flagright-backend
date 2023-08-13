const { responseHandler } = require('../../middleware/response-handler');
const service = require('../services/transaction');
const { search } = require("../queries/transaction");
const { ObjectId } = require("mongodb");

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
        let sort = { createdAt: -1 }
        const filter = {};

        //Handle sorting.. 

        // to handle filters ...
        if (reqQuery.originName) filter['originName'] = reqQuery.originName;

        if (reqQuery.destinationName) filter['destinationName'] = reqQuery.destinationName

        if (reqQuery.country) filter['country'] = { $regex: reqQuery.country, $options: 'i' };

        if (reqQuery.ID) filter['ID'] = reqQuery.ID;

        if (reqQuery.srNo) filter['srNo'] = Number(reqQuery.srNo);

        if (reqQuery.amount) filter['amount'] = Number(reqQuery.amount);

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