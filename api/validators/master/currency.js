
const Joi = require('joi');

const createSchema = Joi.object({
    name: Joi.string().trim().required(),
    country: Joi.string().trim().required(),
});

const updateSchema = Joi.object({
    name: Joi.string().trim(),
    country: Joi.string().trim(),
});


const defaults = {
    'abortEarly': false, // include all errors
    'allowUnknown': true, // ignore unknown props
    'stripUnknown': true // remove unknown props
};

const message = (error) => { return `${error.details.map(x => x.message).join(', ')}`; };

module.exports = {
    createSchema,
    updateSchema,
    defaults,
    message
}
