const Sauce = require('../models/sauce');

module.exports = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (!sauce) {
                res.status(404).json({ error: 'La sauce n\'existe pas !' });
            }
            else {
                next();
            }
        })
}
