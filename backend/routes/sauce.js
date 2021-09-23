const express = require('express');

const router = express.Router();
const controllers = require('../controllers/sauce');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sauceExist = require('../middleware/sauceExist');

router.get('/', auth, controllers.getAllSauces);
router.post('/', auth, multer, controllers.createSauce);
router.get('/:id', auth, sauceExist, controllers.getOneSauce);
router.put('/:id', auth, multer, sauceExist, controllers.modifyOneSauce);
router.delete('/:id', auth, sauceExist, controllers.deleteSauce);
router.post('/:id/like', auth, sauceExist, controllers.likeOneSauce);

module.exports = router;