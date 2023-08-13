const mongoose = require('mongoose');
Schema = mongoose.Schema;

const originAmountDetails = Schema({
    _id: false,
    transactionAmount: {
        type: Number,
        require: "Amount is required"
    },
    transactionCurrency: {
        type: String
        // enum: [""]
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
    originAmountDetail: originAmountDetails,
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