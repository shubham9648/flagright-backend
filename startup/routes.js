const express = require("express");
const cookieParser = require("cookie-parser");
const { useErrorHandler } = require("../middleware/error-handler");
const cron = require("node-cron");



const user = require('../api/routes/user');
const transaction = require('../api/routes/transaction');

// Master Data
const masterCurrency = require("../api/routes/master/currency");

module.exports.default = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.use('/api/v1/user', user);
  app.use('/api/v1/transaction', transaction);

  // masters ..
  app.use('/api/v1/master/currency', masterCurrency);


  app.use(useErrorHandler);
}
