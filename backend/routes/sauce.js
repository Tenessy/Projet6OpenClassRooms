const express = require('express');

const router = express.Router();
const controllers = require('../controllers/sauce');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/', auth, controllers.getAllSauces);
router.post('/', auth, multer, controllers.createSauce);
router.get('/:id', auth, controllers.sauceNotFind);
router.get('/:id', auth, controllers.getOneSauce);
router.put('/:id', auth, multer, controllers.modifyOneSauce);
router.delete('/:id', auth, controllers.deleteSauce);
router.post('/:id/like', auth, controllers.likeOneSauce);

module.exports = router;