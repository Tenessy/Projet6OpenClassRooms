const mongoose = require('mongoose');
const mongooseErrors = require('mongoose-errors');

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number },
    dislikes: { type: Number },
    usersLiked: [String],
    usersDisliked: [String]
});

sauceSchema.plugin(mongooseErrors);

module.exports = mongoose.model('Sauce', sauceSchema);