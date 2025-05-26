const express = require('express');
const router = express.Router();
const DiscardRequestController = require('../controllers/DiscardRequestController');

router.post('/', DiscardRequestController.create);
router.get('/cliente/:id', DiscardRequestController.findByClienteId);
router.get('/', DiscardRequestController.index);
router.put('/:id', DiscardRequestController.update);
router.delete('/:id', DiscardRequestController.delete);
router.get('/pendentes', DiscardRequestController.findPendentes);
router.get('/empresa/:id/aceitos', DiscardRequestController.findAceitosByEmpresa);
router.get('/empresa/:id/todos', DiscardRequestController.findAllByEmpresa);

module.exports = router;
