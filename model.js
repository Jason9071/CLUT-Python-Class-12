const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports.mongoose = mongoose;
module.exports.connectionConfig = "mongodb+srv://jasonyaya:jasonyaya@class.nwopb5x.mongodb.net/library";

module.exports.bookSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    updateAt: {
        type: Date,
        default: Date.now,
        required: true
    }
}, { strict: false, versionKey: false });

module.exports.userSchema = new Schema({
    accountId: {
        type: String,
        required: true,
        minLength: 6
    },
    accountPw: {
        type: String,
        required: true,
        minLength: 6
    },
    permission: {
        enum: ["admin", "user"],
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    updateAt: {
        type: Date,
        default: Date.now,
        required: true
    }
}, { strict: false, versionKey: false });
