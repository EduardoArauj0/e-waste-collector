const express = require('express');
const router = express.Router();
const DiscardRequestController = require('../controllers/DiscardRequestController');

router.post('/', DiscardRequestController.create);
router.get('/', DiscardRequestController.index);
router.put('/:id', DiscardRequestController.update);
router.delete('/:id', DiscardRequestController.delete);

module.exports = router;
