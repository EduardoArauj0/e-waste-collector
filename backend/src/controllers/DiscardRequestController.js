const { DiscardRequest } = require('../models');
const discardRequestSchema = require('../validations/discardRequestValidator');

module.exports = {
  async create(req, res) {
    try {
      await discardRequestSchema.validate(req.body, { abortEarly: false });

      const { type, description, userId } = req.body;

      const discard = await DiscardRequest.create({
        type,
        description,
        userId,
        status: 'pendente',
      });

      return res.status(201).json(discard);
    } catch (err) {
      if (err.name === 'ValidationError') {
        return res.status(400).json({
          error: 'Erro de validação',
          messages: err.errors
        });
      }

      return res.status(400).json({
        error: 'Erro ao criar pedido de descarte',
        details: err
      });
    }
  },

  async index(req, res) {
    try {
      const requests = await DiscardRequest.findAll();
      return res.json(requests);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao buscar pedidos' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { status, companyId } = req.body;

      const request = await DiscardRequest.findByPk(id);
      if (!request) return res.status(404).json({ error: 'Pedido não encontrado' });

      request.status = status;
      request.companyId = companyId;

      await request.save();

      return res.json(request);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao atualizar pedido' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      const deleted = await DiscardRequest.destroy({ where: { id } });

      if (!deleted) return res.status(404).json({ error: 'Pedido não encontrado' });

      return res.json({ message: 'Pedido removido com sucesso' });
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao deletar pedido' });
    }
  },

  async findByClienteId(req, res) {
    try {
      const { id } = req.params;
  
      const pedidos = await DiscardRequest.findAll({
        where: { userId: id }
      });
  
      if (pedidos.length === 0) {
        return res.status(200).json({ message: 'Nenhum pedido encontrado.' });
      }
  
      res.json(pedidos);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar pedidos do cliente' });
    }
  },

  async findPendentes(req, res) {
    try {
      const pendentes = await DiscardRequest.findAll({
        where: { status: 'pendente' },
        include: [
          {
            model: User,
            attributes: ['name', 'street', 'neighborhood', 'city', 'state'],
          },
        ],
      });
      return res.json(pendentes);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao buscar pedidos pendentes' });
    }
  }
};