const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

router.get('/', itemController.getItems);
router.get('/items/new', itemController.showCreateForm);
router.post('/items', itemController.createItem);
router.get('/items/:id', itemController.showItem);

module.exports = router;
