const express = require('express');

const router = express.Router();
const controllers = require('../controllers/sauce');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sauceFind = require('../middleware/sauceFind');

router.get('/', auth, controllers.getAllSauces);
router.post('/', auth, multer, controllers.createSauce);
router.get('/:id', auth, sauceFind, controllers.getOneSauce);
router.put('/:id', auth, sauceFind, multer, controllers.modifyOneSauce);
router.delete('/:id', auth, sauceFind, controllers.deleteSauce);
router.post('/:id/like', auth, sauceFind, controllers.likeOneSauce);

module.exports = router;