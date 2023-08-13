const mongoose = require('mongoose');
Schema = mongoose.Schema;

const amountDetailSchema = Schema({
    _id: false,
    transactionAmount: {
        type: Number,
        require: "Amount is required"
    },
    currency: {
        type: Schema.ObjectId,
        ref: "mastercurrencies"
    }
});


const nameOnCardSchema = Schema({
    _id: false,
    firstName: {
        type: String
    },
    middleName: {
        type: String
    },
    lastName: {
        type: String
    }
});

const cardExpirySchema = Schema({
    _id: false,
    month: {
        type: Number
    },
    year: {
        type: Number
    }
});


const paymentDetails = Schema({
    method: {
        type: String,
        enum: ["CARD", "BANK_TRANSFER"],
        require: "payment detail is required"
    },
    cardFingerprint: {
        type: String,
        unique: true
    },
    cardIssuedCountry: {
        type: Schema.ObjectId,
        ref: "mastercurrencies"
    },
    nameOnCard: nameOnCardSchema,
    cardExpiry: cardExpirySchema,
    cardLast4Digits: {
        type: Number
    },
    cardBrand: {
        type: String,
        enum: ["VISA", "MASTERCARD", "AMERICAN_EXPRESS", "DISCOVER", "UNIONPAY", "RUPAY", "JCB"]
    },
    cardFunding: {
        type: String,
        enum: ["CREDIT", "DEBIT", "PREPAID"]
    }
})

const transactionSchema = Schema({
    ID: {
        type: String,
        require: "ID is required"
    },
    srNo: {
        type: Number
    },
    description: {
        type: String
    },
    amount: {
        type: Number,
        require: "Amount is required"
    },
    type: {
        type: String,
        enum: ["DEPOSIT", "TRANSFER", "EXTERNAL_PAYMENT", "WITHDRAWAL", "REFUND", "OTHER"]
    },
    originUserId: {
        type: Schema.ObjectId,
        ref: "users"
    },
    destinationUserId: {
        type: Schema.ObjectId,
        ref: "users"
    },
    status: {
        type: String,
        enum: ["received"]
    },
    originAmountDetails: amountDetailSchema,
    destinationAmountDetails: amountDetailSchema,
    originPaymentDetails: paymentDetails,
    destinationPaymentDetails: paymentDetails,
    productType: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    },
    addedBy: {
        type: Schema.ObjectId,
        ref: "users"
    }
}, {
    timestamps: true
});


module.exports = mongoose.model("transaction", transactionSchema);