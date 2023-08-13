const mongoose = require('mongoose');
Schema = mongoose.Schema;


const userSchema = Schema({
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        select: false
    },
    fullName: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});


module.exports = mongoose.model("users", userSchema);