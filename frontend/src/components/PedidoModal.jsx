import React from "react";

const PedidoModal = ({ pedido, onClose, onUpdateStatus }) => {
  if (!pedido) return null;

  const {
    street,
    number,
    neighborhood,
    city,
    state,
    cep
  } = pedido.user || {};

  const endereco = [street, number && `nº ${number}`, neighborhood, `${city} - ${state}`, cep && `CEP ${cep}`]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl font-bold">×</button>
        
        <h2 className="text-xl font-bold mb-4">Pedido #{pedido.id}</h2>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Itens</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>{pedido.type} - {pedido.description}</li>
          </ul>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold">Cliente</h3>
          <p>{pedido.user?.name}</p>
          <p className="text-sm text-gray-600">{pedido.user?.phone}</p>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold">Endereço</h3>
          <p className="text-sm text-gray-600">{endereco || "Endereço não disponível"}</p>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          {pedido.status === "pendente" && (
            <>
              <button
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                onClick={() => onUpdateStatus(pedido.id, "recusado")}
              >
                Recusar
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                onClick={() => onUpdateStatus(pedido.id, "aceito")}
              >
                Aceitar pedido
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PedidoModal;