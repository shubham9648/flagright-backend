const { responseHandler } = require('../../../middleware/response-handler');
const service = require('../../services/master/currency');
const { search } = require("../../queries/master/currency");
const { ObjectId } = require("mongodb");

exports.create = async (req, res, next) =>  {
    try {
        const value = req.value;

        const userId = req.user.userId;

        value.addedBy = userId;

        const response = await service.create(value);

        if(!response) {
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
        const pagination = { skip: 0, limit: 30 };
        if (reqQuery.pageNo && reqQuery.pageSize) {
            pagination.skip = parseInt((reqQuery.pageNo - 1) * reqQuery.pageSize);
            pagination.limit = parseInt(reqQuery.pageSize);
        }

        const filter = {};
        
        // to handle filters ...
        if (reqQuery.name) filter['name'] = { $regex: reqQuery.name, $options: 'i' };

        if (reqQuery.country) filter['country'] = { $regex: reqQuery.country, $options: 'i' };

        if (reqQuery.id) filter['_id'] = { $in: reqQuery.id.split(',').map(el => new ObjectId(el)) };

        const query = search(filter, pagination);

        console.log("query is ", JSON.stringify(query));
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

        const response = await service.update({_id: id}, value);

        if(!response) {
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

        if(!response) {
            return responseHandler(null, res, "Error Occurred", 400);
        };

        responseHandler("deleted", res);

    } catch (err) {
        console.log("error is ", err);
        next(err);
    }
};