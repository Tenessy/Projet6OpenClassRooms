const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const SauceObject = JSON.parse(req.body.sauce);
    delete SauceObject._id;
    const sauce = new Sauce({
        ...SauceObject,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'La sauce a été créé !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.getAllSauces = (req, res) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};
exports.sauceExist = (req, res, next) => {
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

exports.getOneSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id }) // _id est l'identifiant créer par MongoDb
                    .then(() => res.status(200).json({ message: 'La sauce a été supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.modifyOneSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            let sauceObject;
            const testBody = () => {
                const objSauce = req.body;
                const regex1 = /^[-a-zA-Zàâäéèêëïîôöùûüç0-9\ \,]+$/;
                return regex1.test(objSauce.name) && regex1.test(objSauce.manufacturer)
                    && regex1.test(objSauce.description) && regex1.test(objSauce.mainPepper);
            }
            if (req.file !== undefined) {
                if (!testBody()) {
                    res.status(400).json({ error: 'Les données ne sont pas valides !' })
                }
                else if (testBody() === true) {
                    const filename = sauce.imageUrl.split('/images')[1];
                    fs.unlink(`images/${filename}`, (err) => {
                        if (err) {
                            return console.log(err);
                        }
                    })
                    sauceObject = {
                        ...JSON.parse(req.body.sauce),
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    }
                }
            }
            if (req.file === undefined) {
                if (!testBody()) {
                    res.status(400).json({ error: 'Les données ne sont pas valides !' })
                }
                else if (testBody() === true) {
                    sauceObject = { ...req.body }
                }
            }

            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'La sauce a bien été modifié !' }))
                .catch(error => res.status(400).json({ error }));

        })
        .catch(error => res.status(500).json({ error }));

};

exports.likeOneSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            let like = req.body.like;
            const userId = req.body.userId;

            let dislikes = sauce.dislikes;
            const usersDisliked = sauce.usersDisliked;
            const indexArrayDisliked = usersDisliked.indexOf(userId);

            let likes = sauce.likes;
            const usersLiked = sauce.usersLiked;
            const indexArrayLiked = usersLiked.indexOf(userId);

            if (like === 1) {
                usersLiked.push(userId);
                likes += 1;
                if (indexArrayDisliked !== -1) {
                    dislikes -= 1;
                    usersDisliked.splice(indexArrayDisliked, 1);
                }
            }
            else if (like === 0) {
                if (indexArrayDisliked !== - 1) {
                    dislikes -= 1;
                    usersDisliked.splice(indexArrayDisliked, 1);
                }
                if (indexArrayLiked !== -1) {
                    likes -= 1;
                    usersLiked.splice(indexArrayLiked, 1);
                }
            }
            else if (like === -1) {
                usersDisliked.push(userId);
                dislikes += 1;
                if (indexArrayLiked !== -1) {
                    likes -= 1;
                    usersLiked.splice(indexArrayLiked, 1);
                }
            }
            Sauce.updateOne({ _id: req.params.id },
                {
                    dislikes: dislikes, likes: likes, _id: req.params.id,
                    usersLiked: usersLiked, usersDisliked: usersDisliked
                })
                .then(() => res.status(200).json({ message: 'La sauce a bien été mis à jour !' }))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(500).json({ error }));
};