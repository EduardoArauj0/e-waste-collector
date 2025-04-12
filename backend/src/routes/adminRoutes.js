const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');


router.get('/admin/clientes', AdminController.getAllClientes); 
router.get('/admin/empresas', AdminController.getAllEmpresas); 

router.put('/admin/cliente/:id', AdminController.updateCliente);
router.delete('/admin/cliente/:id', AdminController.deleteCliente);
router.put('/admin/empresa/:id', AdminController.updateEmpresa);
router.delete('/admin/empresa/:id', AdminController.deleteEmpresa);

router.get('/admin/pedidos', AdminController.getAllPedidos); 
router.put('/admin/pedido/:id', AdminController.updatePedido); 


module.exports = router;
