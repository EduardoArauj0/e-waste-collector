const db = require('../models');
const { DiscardRequest, User } = db;
const { discardRequestSchema } = require('../validations/discardRequestValidator');

module.exports = {
  async create(req, res) {
    try {
      const { userId, residuos } = req.body;
  
      await discardRequestSchema.validate(req.body, { abortEarly: false });
  
      const createdRequests = await Promise.all(residuos.map(res =>
        DiscardRequest.create({
          type: res.type,
          description: res.description,
          userId,
          status: 'pendente',
        })
      ));
  
      return res.status(201).json(createdRequests);
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
      const { status, companyId, type, description } = req.body;

      const request = await DiscardRequest.findByPk(id);
      if (!request) return res.status(404).json({ error: 'Pedido não encontrado' });

      if (status) request.status = status;
      if (companyId) request.companyId = companyId;
      if (type) request.type = type;
      if (description) request.description = description;

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
        where: { userId: id },
        include: [
          {
            model: User,
            as: 'company',
            attributes: ['name']
          }
        ]
      });

      // Sempre retorna array, mesmo se vazio
      return res.status(200).json(pedidos);
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
            as: 'user', 
            attributes: ['name', 'street', 'neighborhood', 'city', 'state', 'cep', 'number'],
          }
        ]
      });
      return res.json(pendentes);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao buscar pedidos pendentes' });
    }
  },

  async findAceitosByEmpresa(req, res) {
    try {
      const { id } = req.params;
  
      const aceitos = await DiscardRequest.findAll({
        where: {
          companyId: id,
          status: 'aceito'
        },
        include: [
          {
            model: User,
            as: 'user', 
            attributes: ['name', 'street', 'neighborhood', 'city', 'state']
          }
        ]
      });
  
      return res.json(aceitos);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao buscar pedidos aceitos pela empresa' });
    }
  },

  async findAllByEmpresa(req, res) {
  try {
    const { id } = req.params;

    const pedidos = await DiscardRequest.findAll({
      where: { companyId: id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: [
            'name',
            'street',
            'number',
            'neighborhood',
            'city',
            'state',
            'cep'
          ]
        }
      ]
    });

    return res.json(pedidos);
    } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar pedidos da empresa' });
    }
  },

  async findPendentesParaEmpresas(req, res) {
  try {
    const pedidos = await DiscardRequest.findAll({
      where: {
        status: 'pendente',
        companyId: null
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'street', 'number', 'neighborhood', 'city']
        }
      ]
    });

    return res.json(pedidos);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar pedidos pendentes' });
  }
}
};