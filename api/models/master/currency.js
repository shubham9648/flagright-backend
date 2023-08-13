const mongoose = require('mongoose');
Schema = mongoose.Schema;


const currencySchema = Schema({
    name: {
        type: String,
        trim: true,
        require: "Currency name is required"
    },
    country: {
        type: String,
        require: "Country name is required"
    },
    addedBy: {
        type: Schema.ObjectId,
        ref: "users"
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});


module.exports = mongoose.model("mastercurrencies", currencySchema);