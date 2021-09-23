const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Sauce = require('../models/sauce');

exports.signUp = (req, res) => {
    User.findOne({ email: req.body.email })
        .then(email => {
            if (email) {
                res.status(401).json({ error: 'Cet email existe déjà !' });
            }
            bcrypt.hash(req.body.password, 10)
                .then(hash => {
                    const user = new User({
                        email: req.body.email,
                        password: hash
                    });
                    user.save()
                        .then(() => res.status(201).json({ message: 'Votre compte a bien été créé !' }))
                        .catch(error => res.status(400).json({ error }));
                })
        })
        .catch(error => res.status(500).json({ error }));

};

exports.login = (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                res.status(401).json({ error: 'Cet utilisateur n\'existe pas !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        res.status(401).json({ error: 'Mot de passe incorrect !' })
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            '14890266EtU89Lo12',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};