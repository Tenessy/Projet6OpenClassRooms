const mongoose = require('mongoose');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');

const validateEmail = function (email) {
    var reg = /^[\w]([a-zA-Z0-9_\-\.]+)+@[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/;
    return reg.test(email)
};

const validatePassword = function (mdp) {
    var reg = /^[0-9]{3}/;
    return reg.test(mdp);
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
       // validate: [validatePassword, 'Le mot de passe n\'est pas valide'],
    },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);