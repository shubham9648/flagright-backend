const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middleware/auth'); // Auth Verification
const validate = require('../../middleware/validator'); // Validator


const {
    logIn,
    registerUser,
    getUser
} = require('../controllers/user');

const {
    logInSchema,
    registerUserSchema
} = require("../validators/user");


// GET Calls
router.route('/:id').get(verifyToken, getUser);

// POST Calls
router.route('/login').post( validate(logInSchema), logIn);
router.route('/register').post( validate(registerUserSchema), registerUser);



module.exports = router;