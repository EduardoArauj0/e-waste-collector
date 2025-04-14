const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');


router.get('/clientes', AdminController.getAllClientes); 
router.get('/empresas', AdminController.getAllEmpresas); 

router.put('/cliente/:id', AdminController.updateCliente);
router.delete('/cliente/:id', AdminController.deleteCliente);
router.put('/empresa/:id', AdminController.updateEmpresa);
router.delete('/empresa/:id', AdminController.deleteEmpresa);

router.get('/pedidos', AdminController.getAllPedidos); 
router.put('/pedido/:id', AdminController.updatePedido); 


module.exports = router;
