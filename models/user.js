const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    api_key: {
        type: String,
        required: true,
        unique: true,
    },
},{
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('User', UserSchema);