const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signUp = (req, res) => {
    User.findOne({ email: req.body.email })
        .then(email => {
            if (email) {
                return res.status(401).json({ message: 'Cet email existe déjà dans la bdd !' });
            }
            bcrypt.hash(req.body.password, 12)
                .then(hash => {
                    const user = new User({
                        email: req.body.email,
                        password: hash
                    });
                    user.save()
                        .then(() => res.status(201).json({ message: 'Votre compte a bien été créé !' }))
                        .catch(error => res.status(400).json({ message: error }));
                })
        })
        .catch(error => res.status(500).json({ message: error }));
};

exports.login = (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'L\'utilisateur n\'existe pas !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Le mot de passe est incorrect !' });
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
                .catch(error => res.status(500).json({ message: error }));
        })
        .catch(error => res.status(500).json({ message: error }));
};