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