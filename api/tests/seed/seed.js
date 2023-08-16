const {ObjectId} = require('mongodb');
const userService = require("../../services/users");
require('dotenv').config();

const userOneID = new ObjectId("64d85358d15dad610c3ba564");
const userTwoID = new ObjectId("64d88c32b0f03cdadc86a93c");

let token = async(body) => {
    console.log("body is ", body);
    return await userService.getToken(body)
};

const users = [{
    _id: userOneID,
    email: "shubham@flagright.com",
    password: "Shubham@@",
    tokens: {
      access: 'auth',
      token: token({ userId: userOneID, email: "shubham@flagright.com", fullName: "Shubham Tiwari" })
    }
  }, {
    _id: userTwoID,
    email: "aman@flagright.com",
    password: "Aman@@",
    tokens: {
      access: 'auth',
      token: token({ email: "aman@flagright.com", fullName: "Aman", userId: userTwoID })
    }
  }]
const transaction = {
    "amount": 50000,
    "type": "TRANSFER", 
    "description": "some description",
    "destinationUserId": "64d85358d15dad610c3ba564",
    "originAmountDetails": {
        "transactionAmount": 250000,
        "currency": "64d87a4646cf035437f78a30"
    },
    "destinationAmountDetails": {
        "transactionAmount": 250000,
        "currency": "64d87a3946cf035437f78a2e"
    },
    "productType": "some productType"
}

module.exports = {
    users,
    transaction
}  