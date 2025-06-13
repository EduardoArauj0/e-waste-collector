const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');


router.get('/clientes', AdminController.getAllClientes); 
router.get('/empresas', AdminController.getAllEmpresas); 

router.put('/cliente/:id', AdminController.updateCliente);
router.delete('/cliente/:id', AdminController.deleteCliente);
router.put('/empresas/:id', AdminController.updateEmpresa);
router.delete('/empresas/:id', AdminController.deleteEmpresa);

router.get('/pedidos', AdminController.getAllPedidos); 
router.put('/pedido/:id', AdminController.updatePedido); 
router.delete('/pedido/:id', AdminController.deletePedido);

module.exports = router;
