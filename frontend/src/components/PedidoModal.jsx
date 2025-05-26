import React from "react";
import {
  User,
  MapPin,
  Phone,
  Package,
  X,
  CheckCircle,
  XCircle
} from "lucide-react";

const PedidoModal = ({ pedido, onClose, onUpdateStatus }) => {
  if (!pedido) return null;

  const {
    street,
    number,
    neighborhood,
    city,
    state,
    cep,
    name,
    phone
  } = pedido.user || {};

  const endereco = [street, number && `nº ${number}`, neighborhood, `${city} - ${state}`, cep && `CEP ${cep}`]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black transition text-2xl font-bold"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Package className="w-6 h-6 text-blue-600" />
          Pedido #{pedido.id}
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600" />
              Cliente
            </h3>
            <p className="text-gray-800">{name || "Nome não disponível"}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-600" />
              Endereço
            </h3>
            <p className="text-gray-700 text-sm">
              {endereco || "Endereço não disponível"}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-1">Itens</h3>
            <p className="text-gray-800">{pedido.type}</p>
            <p className="text-gray-600 text-sm">{pedido.description}</p>
          </div>
        </div>

        {pedido.status === "pendente" && (
          <div className="flex justify-end gap-3 mt-6">
            <button
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
              onClick={() => onUpdateStatus(pedido.id, "recusado")}
            >
              <XCircle className="w-4 h-4" />
              Recusar
            </button>
            <button
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
              onClick={() => onUpdateStatus(pedido.id, "aceito")}
            >
              <CheckCircle className="w-4 h-4" />
              Aceitar pedido
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PedidoModal;