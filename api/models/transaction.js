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

const transactionSchema = Schema({
    ID: {
        type: String,
        require: "ID is required",
        unique: true
    },
    srNo: {
        type: Number,
        index: true
    },
    description: {
        type: String
    },
    amount: {
        type: Number,
        require: "Amount is required",
        index: true
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