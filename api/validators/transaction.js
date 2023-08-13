



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
    originPaymentDetails: Joi.object({
        method: Joi.string().trim().valid("CARD", "BANK_TRANSFER").required(),
        cardFingerprint: Joi.string().trim().required(),
        cardIssuedCountry: Joi.string().trim().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required(),
        nameOnCard: Joi.object({
            firstName: Joi.string().trim().required(),
            middleName: Joi.string().trim(),
            lastName: Joi.string().trim()
        }),
        cardExpiry: Joi.object({
            month: Joi.number().valid(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12).required(),
            year: Joi.number().required()
        }),
        cardLast4Digits: Joi.number(),
        cardBrand: Joi.string().trim().valid("VISA", "MASTERCARD", "AMERICAN_EXPRESS", "DISCOVER", "UNIONPAY", "RUPAY", "JCB").required(),
        cardFunding: Joi.string().trim().valid("CREDIT", "DEBIT", "PREPAID").required()    
    }).required(),
    destinationPaymentDetails: Joi.object({
        method: Joi.string().trim().valid("CARD", "BANK_TRANSFER").required(),
        cardFingerprint: Joi.string().trim().required(),
        cardIssuedCountry: Joi.string().trim().regex(/^[0-9a-fA-F]{24}$/, 'object Id').required(),
        nameOnCard: Joi.object({
            firstName: Joi.string().trim().required(),
            middleName: Joi.string().trim(),
            lastName: Joi.string().trim()
        }),
        cardExpiry: Joi.object({
            month: Joi.number().valid(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12).required(),
            year: Joi.number().required()
        }),
        cardLast4Digits: Joi.number(),
        cardBrand: Joi.string().trim().valid("VISA", "MASTERCARD", "AMERICAN_EXPRESS", "DISCOVER", "UNIONPAY", "RUPAY", "JCB").required(),
        cardFunding: Joi.string().trim().valid("CREDIT", "DEBIT", "PREPAID").required()
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
    originPaymentDetails: Joi.object({
        method: Joi.string().trim().valid("CARD", "BANK_TRANSFER"),
        cardFingerprint: Joi.string().trim(),
        cardIssuedCountry: Joi.string().trim().regex(/^[0-9a-fA-F]{24}$/, 'object Id'),
        nameOnCard: Joi.object({
            firstName: Joi.string().trim(),
            middleName: Joi.string().trim(),
            lastName: Joi.string().trim()
        }),
        cardExpiry: Joi.object({
            month: Joi.number().valid("01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"),
            year: Joi.number()
        }),
        cardLast4Digits: Joi.number(),
        cardBrand: Joi.string().trim().valid("VISA", "MASTERCARD", "AMERICAN_EXPRESS", "DISCOVER", "UNIONPAY", "RUPAY", "JCB").required(),
        cardFunding: Joi.string().trim().valid("CREDIT", "DEBIT", "PREPAID").required()    
    }),
    destinationPaymentDetails: Joi.object({
        method: Joi.string().trim().valid("CARD", "BANK_TRANSFER"),
        cardFingerprint: Joi.string().trim(),
        cardIssuedCountry: Joi.string().trim().regex(/^[0-9a-fA-F]{24}$/, 'object Id'),
        nameOnCard: Joi.object({
            firstName: Joi.string().trim(),
            middleName: Joi.string().trim(),
            lastName: Joi.string().trim()
        }),
        cardExpiry: Joi.object({
            month: Joi.number().valid("01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"),
            year: Joi.number()
        }),
        cardLast4Digits: Joi.number(),
        cardBrand: Joi.string().trim().valid("VISA", "MASTERCARD", "AMERICAN_EXPRESS", "DISCOVER", "UNIONPAY", "RUPAY", "JCB").required(),
        cardFunding: Joi.string().trim().valid("CREDIT", "DEBIT", "PREPAID").required()
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



