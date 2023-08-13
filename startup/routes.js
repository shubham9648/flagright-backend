const express = require("express");
const cookieParser = require("cookie-parser");
const { useErrorHandler } = require("../middleware/error-handler");


const user = require('../api/routes/user');
const transaction = require('../api/routes/transaction.js');


module.exports.default = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());

    app.use('/api/v1/user', user);


          
      app.use(useErrorHandler);
}
