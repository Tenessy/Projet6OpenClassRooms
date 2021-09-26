const mongoose = require('mongoose');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');

const validateEmail = function (email) {
    var reg = /^[\w]([a-zA-Z0-9_\-\.]+)+@[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/;
    return reg.test(email)
};

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        validate: [validateEmail, 'Utilisez une adresse email valide'],
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: [6, 'Veuillez utilisez minimun 6 caractères'],
    },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);