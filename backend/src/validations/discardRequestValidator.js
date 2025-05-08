import * as yup from 'yup';

export const discardRequestSchema = yup.object().shape({
  userId: yup.number().required('O ID do usuário é obrigatório'),
  residuos: yup.array().of(
    yup.object().shape({
      type: yup.string().required('O tipo é obrigatório'),
      description: yup.string().required('A descrição é obrigatória')
    })
  ).min(1, 'É necessário informar ao menos um resíduo'),
});