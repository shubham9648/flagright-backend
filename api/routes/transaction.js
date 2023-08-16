const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middleware/auth'); // Auth Verification
const validate = require('../../middleware/validator'); // Validator


const {
    create,
    getList,
    getSingleOnId,
    startCronJob,
    stopCronJob,
    analytics,
    getTransactionCsv,
    update,
    deleteOne
} = require('../controllers/transaction');

const {
    createSchema,
    updateSchema
} = require("../validators/transaction");

//create ..
router.route('/').post(verifyToken, validate(createSchema), create);

// Search and List
router.route('/').get(verifyToken, getList);
router.route('/analytics').get(verifyToken, analytics);
router.route('/startCron').get(verifyToken, startCronJob);
router.route('/stopCron').get(verifyToken, stopCronJob);
router.route('/csvExport').get(verifyToken, getTransactionCsv);
router.route('/singleFetch/:id').get(verifyToken, getSingleOnId);
// Update
router.route('/:id').put(verifyToken, validate(updateSchema), update);

// Delete
router.route('/:id').delete(verifyToken, deleteOne);


module.exports = router;