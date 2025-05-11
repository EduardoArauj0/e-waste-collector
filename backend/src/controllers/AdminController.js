const db = require('../models');
const { User, DiscardRequest } = db;

module.exports = {
  async getAllClientes(req, res) {
    try {
      const clientes = await User.findAll({ where: { role: 'cliente' } }); 
      return res.json(clientes);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao buscar clientes' });
    }
  },

  async getAllEmpresas(req, res) {
    try {
      const empresas = await User.findAll({ where: { role: 'empresa' } }); 
      return res.json(empresas);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao buscar empresas' });
    }
  },

  async updateCliente(req, res) {
    try {
      const { id } = req.params;
      const {
        name, email, cep, street, number, neighborhood, city, state
      } = req.body;

      const cliente = await User.findByPk(id);
      if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' });

      cliente.name = name ?? cliente.name;
      cliente.email = email ?? cliente.email;
      cliente.cep = cep ?? cliente.cep;
      cliente.street = street ?? cliente.street;
      cliente.number = number ?? cliente.number;
      cliente.neighborhood = neighborhood ?? cliente.neighborhood;
      cliente.city = city ?? cliente.city;
      cliente.state = state ?? cliente.state;

      await cliente.save();
      return res.json(cliente);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao atualizar cliente' });
    }
  },

  async deleteCliente(req, res) {
    try {
      const { id } = req.params;
      const deleted = await User.destroy({ where: { id } });

      if (!deleted) return res.status(404).json({ error: 'Cliente não encontrado' });

      return res.json({ message: 'Cliente removido com sucesso' });
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao excluir cliente' });
    }
  },

  async updateEmpresa(req, res) {
    try {
      const { id } = req.params;
      const {
        name, email, cep, street, number, neighborhood, city, state
      } = req.body;

      const empresa = await User.findByPk(id);
      if (!empresa) return res.status(404).json({ error: 'Empresa não encontrada' });

      empresa.name = name ?? empresa.name;
      empresa.email = email ?? empresa.email;
      empresa.cep = cep ?? empresa.cep;
      empresa.street = street ?? empresa.street;
      empresa.number = number ?? empresa.number;
      empresa.neighborhood = neighborhood ?? empresa.neighborhood;
      empresa.city = city ?? empresa.city;
      empresa.state = state ?? empresa.state;

      await empresa.save();
      return res.json(empresa);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao atualizar empresa' });
    }
  },

  async deleteEmpresa(req, res) {
    try {
      const { id } = req.params;
      const deleted = await User.destroy({ where: { id } });

      if (!deleted) return res.status(404).json({ error: 'Empresa não encontrada' });

      return res.json({ message: 'Empresa removida com sucesso' });
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao excluir empresa' });
    }
  },

  async getAllPedidos(req, res) {
    try {
      const pedidos = await DiscardRequest.findAll();
      return res.json(pedidos);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao buscar pedidos' });
    }
  },

  async updatePedido(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const pedido = await DiscardRequest.findByPk(id);
      if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado' });

      pedido.status = status;

      await pedido.save();
      return res.json(pedido);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao atualizar pedido' });
    }
  },
};
