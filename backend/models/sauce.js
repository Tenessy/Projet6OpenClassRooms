const mongoose = require('mongoose');
const mongooseErrors = require('mongoose-errors');
const validator = require('validator');

const validateSauce = function (sauce) {
    const reg = /^[\w\.]+$/;
    return reg.test(sauce);
}

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true, validate: [validateSauce] },
    manufacturer: {
        type: String,
        isAsync: false,
        validate: [validateSauce],
        required: true,
    },
    description: { type: String, required: true, validate: [validateSauce] },
    mainPepper: { type: String, required: true, validate: [validateSauce] },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number },
    dislikes: { type: Number },
    usersLiked: [String],
    usersDisliked: [String]
});

sauceSchema.plugin(mongooseErrors);

module.exports = mongoose.model('Sauce', sauceSchema);