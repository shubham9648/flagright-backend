const Joi = require('joi');

const registerUserSchema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().required(),
    fullName: Joi.string().required()
});


const logInSchema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().required()
});


const defaults = {
    'abortEarly': false, // include all errors
    'allowUnknown': true, // ignore unknown props
    'stripUnknown': true // remove unknown props
};

const message = (error) => { return `${error.details.map(x => x.message).join(', ')}`; };

module.exports = {
    registerUserSchema,
    logInSchema,
    defaults,
    message
}