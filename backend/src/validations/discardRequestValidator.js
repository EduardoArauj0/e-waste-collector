const yup = require('yup');

const discardRequestSchema = yup.object().shape({
  type: yup.string().required('Tipo é obrigatório'),
  description: yup.string().required('Descrição é obrigatória'),
  userId: yup.number().required('ID do usuário é obrigatório').integer().positive(),
});

module.exports = discardRequestSchema;
