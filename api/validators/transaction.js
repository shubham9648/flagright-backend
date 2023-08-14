



const Joi = require('joi');

const createSchema = Joi.object({
    amount: Joi.number().required(),
    type: Joi.string().trim().valid("DEPOSIT", "TRANSFER", "EXTERNAL_PAYMENT", "WITHDRAWAL", "REFUND", "OTHER").required(),
    description: Joi.string(),
    destinationUserId: Joi.string().trim().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required(),
    originAmountDetails: Joi.object({
        transactionAmount: Joi.number().required(),
        currency: Joi.string().trim().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required()
    }).required(),
    destinationAmountDetails: Joi.object({
        transactionAmount: Joi.number().required(),
        currency: Joi.string().trim().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required()
    }).required(),
    productType: Joi.string().trim()
});

const updateSchema = Joi.object({
    amount: Joi.number(),
    type: Joi.string().trim().valid("DEPOSIT", "TRANSFER", "EXTERNAL_PAYMENT", "WITHDRAWAL", "REFUND", "OTHER"),
    description: Joi.string(),
    destinationUserId: Joi.string().trim().regex(/^[0-9a-fA-F]{24}$/, 'object Id'),
    originAmountDetails: Joi.object({
        transactionAmount: Joi.number(),
        currency: Joi.string().trim().regex(/^[0-9a-fA-F]{24}$/, 'object Id')
    }),
    destinationAmountDetails: Joi.object({
        transactionAmount: Joi.number(),
        currency: Joi.string().trim().regex(/^[0-9a-fA-F]{24}$/, 'object Id')
    }),
    productType: Joi.string().trim()
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



