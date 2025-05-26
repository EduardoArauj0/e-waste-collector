import React, { useEffect, useState } from "react";
import axios from "axios";
import PedidoModal from "./PedidoModal";
import UserMenu from "./UserMenu";

const DashboardEmpresa = () => {
  const [empresa, setEmpresa] = useState(null);
  const [pedidos, setPedidos] = useState({
    pendente: [],
    aceito: [],
    entrega: [],
    concluido: [],
    recusado: []
  });
  const [toast, setToast] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

  useEffect(() => {
    const storedEmpresa = JSON.parse(localStorage.getItem("empresa"));
    if (storedEmpresa) {
      setEmpresa(storedEmpresa);
    }
  }, []);

  useEffect(() => {
    if (empresa) {
      fetchPedidos();
    }
  }, [empresa]);

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/discard-requests/empresa/${empresa.id}/todos`);
      const grouped = {
        pendente: [],
        aceito: [],
        entrega: [],
        concluido: [],
        recusado: []
      };
      res.data.forEach(p => {
        if (grouped[p.status]) grouped[p.status].push(p);
      });
      setPedidos(grouped);
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err);
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatus = async (id, novoStatus) => {
    setProcessingId(id);
    try {
      await axios.put(`http://localhost:3000/discard-requests/${id}`, {
        status: novoStatus,
        companyId: empresa.id
      });
      setToast(`Pedido ${novoStatus === "recusado" ? "recusado" : "atualizado"} com sucesso!`);
      await fetchPedidos();
      setPedidoSelecionado(null);
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    } finally {
      setProcessingId(null);
      setTimeout(() => setToast(""), 3000);
    }
  };

  const statusLabels = {
    pendente: "Em aberto",
    aceito: "Aceitos",
    entrega: "Em andamento",
    concluido: "Concluído",
    recusado: "Recusados"
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold mb-6">Painel de Pedidos</h2>
        <UserMenu />
      </div>

      {toast && (
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-4 shadow">
          {toast}
        </div>
      )}

      {loading ? (
        <p>Carregando pedidos...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.entries(statusLabels).map(([status, titulo]) => (
            <div key={status} className="bg-gray-50 rounded-lg p-4 shadow-sm border">
              <h3 className="text-lg font-semibold mb-3">{titulo}</h3>
              {pedidos[status].length === 0 ? (
                <p className="text-sm text-gray-400">Nenhum pedido</p>
              ) : (
                pedidos[status].map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setPedidoSelecionado(p)}
                    className="bg-white rounded-md p-3 mb-3 shadow border cursor-pointer hover:shadow-md transition"
                  >
                    <p className="font-semibold">Pedido #{p.id}</p>
                    <p>{p.user?.name}</p>
                    <p className="text-sm text-gray-500">
                      {p.user?.street}, {p.user?.number} - {p.user?.neighborhood}, {p.user?.city} - {p.user?.state}, {p.user?.cep}
                    </p>

                    {status === "pendente" && (
                      <div className="flex gap-2 mt-2">
                        <button
                          disabled={processingId === p.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            atualizarStatus(p.id, "aceito");
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                        >
                          Aceitar
                        </button>
                        <button
                          disabled={processingId === p.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            atualizarStatus(p.id, "recusado");
                          }}
                          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded"
                        >
                          Recusar
                        </button>
                      </div>
                    )}

                    {status === "aceito" && (
                      <button
                        disabled={processingId === p.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          atualizarStatus(p.id, "entrega");
                        }}
                        className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded w-full"
                      >
                        Colocar em entrega
                      </button>
                    )}

                    {status === "entrega" && (
                      <button
                        disabled={processingId === p.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          atualizarStatus(p.id, "concluido");
                        }}
                        className="mt-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded w-full"
                      >
                        Finalizar pedido
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      )}

      {pedidoSelecionado && (
        <PedidoModal
          pedido={pedidoSelecionado}
          onClose={() => setPedidoSelecionado(null)}
          onUpdateStatus={atualizarStatus}
        />
      )}
    </div>
  );
};

export default DashboardEmpresa;