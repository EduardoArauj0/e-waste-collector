const yup = require('yup');

const registerSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().min(6, 'A senha deve ter no mínimo 6 caracteres').required('Senha é obrigatória'),
  role: yup.string().oneOf(['cliente', 'empresa', 'admin'], 'Tipo de usuário inválido').required('Tipo é obrigatório'),
  cep: yup.string().required('CEP é obrigatório'),
  street: yup.string().required('Rua é obrigatória'),
  number: yup.string().required('Número é obrigatório'),
  neighborhood: yup.string().required('Bairro é obrigatório'),
  city: yup.string().required('Cidade é obrigatória'),
  state: yup.string().required('Estado é obrigatório'),
});

const loginSchema = yup.object().shape({
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().required('Senha é obrigatória'),
});

module.exports = {
  registerSchema,
  loginSchema
};
