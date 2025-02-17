const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');

router.get('/', bookController.findAll);
router.get('/:id', bookController.findOne);
router.post('/', bookController.create);
router.put('/:id', bookController.update);
router.delete('/:id', bookController.delete);
router.delete('/', bookController.deleteAll);

module.exports = router;