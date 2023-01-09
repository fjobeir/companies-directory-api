var express = require('express');
const { store, index, show, update, destroy } = require('../controllers/cityController');
const isAdmin = require('../middlewares/isAdmin');
var router = express.Router();
const { body } = require('express-validator');

router.post('/',
    isAdmin,
    body('name', 'Name length should be between 2 and 20').isLength({ min: 2, max: 20 }),
    store);
router.get('/', index);
router.get('/:id', show);
router.put('/:id',
    isAdmin,
    body('name', 'Name length should be between 2 and 20').isLength({ min: 2, max: 20 }),
    update);
router.delete('/:id', isAdmin, destroy);

module.exports = router;