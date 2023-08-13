const { responseHandler } = require('../../middleware/response-handler');
const service = require('../services/users');


exports.logIn = async (req, res, next) => {
    try {

        const value = req.value;

        const {userData, token} = await service.loginUser(value);

        if(!userData) {
            return responseHandler(null, res, 'No User!', 400);
        };

        if(!token) {
            return responseHandler(null, res, 'Invalid Email OR password', 400)
        };

        const data = {
            data: userData,
            Authorization: token
        };

        responseHandler(data, res);

    } catch (err) {
        console.log("error is ", err);
        next(err);
    }
}

exports.registerUser = async (req, res, next) => {
    try {

        const value = req.value;

        const { userData, token } = await service.registerUser(value);

        if(!userData || !token) {
            return responseHandler(null, res, "Error Occured!", 400);
        };

        const data = {
            data: userData,
            Authorization: token
        };

        responseHandler(data, res);
    } catch (err) {
        console.log("error is ", err);
        next(err);
    }
};

exports.search = async (req, res, next) => {
    try {

        const reqQuery = req.query;

        const pagination = { skip: 0, limit: 30 };

        if (reqQuery.pageNo && reqQuery.pageSize) {
            pagination.skip = parseInt((reqQuery.pageNo - 1) * reqQuery.pageSize);
            pagination.limit = parseInt(reqQuery.pageSize);
        }

        const filter = {};
        let sort = { };

        // To handle sorting queries
        if (reqQuery.createdAt)  sort ['createdAt'] = Number(reqQuery.createdAt) 
                
        if (reqQuery.updatedAt)  sort ['updatedAt'] = Number(reqQuery.updatedAt) 

        if (reqQuery.alphabetical) sort ['name'] = Number(reqQuery.alphabetical);

        if(reqQuery.email) filter['email'] = { $regex: reqQuery.email, $options: 'i' };

        if(reqQuery.phone) filter['phone'] = { $regex: reqQuery.phone, $options: 'i' };

        if(reqQuery.fullName) filter['fullName'] = { $regex: reqQuery.fullName, $options: 'i' };

        if(reqQuery.role) filter["roles"] = {$regex: reqQuery.role, $options: 'i'}

        if(reqQuery.id) filter['_id'] = { $in: reqQuery.id.split(',').map(el => ObjectId(el)) };

        const query = queries.search(filter, pagination, sort);

        const data = await service.search(query);

        responseHandler(data, res);
    } catch (err) {
        console.log("error is ", err);
        next(err);
    }
};

exports.getUser = async (req, res, next) => {
    try {

        const userId = req.params.id;

        const user = await service.getUser(userId);

        if(!user) {
            return responseHandler(null, res, "Invalid User Id", 400);
        }

        responseHandler(user, res);
    } catch (err) {
        console.log("error is ", err);
        next(err);
    }
}