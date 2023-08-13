const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../../middleware/auth'); // Auth Verification
const validate = require('../../../middleware/validator'); // Validator


const {
    create,
    getList,
    update,
    deleteOne
} = require('../../controllers/master/currency');

const {
    createSchema,
    updateSchema
} = require("../../validators/master/currency");

// create
router.route('/').post(verifyToken, validate(createSchema), create);

// Listing and search
router.route('/').get(verifyToken, getList);

// Update..
router.route('/:id').put(verifyToken, validate(updateSchema), update);

// Delete ..
router.route('/:id').delete(verifyToken, deleteOne);


module.exports = router;