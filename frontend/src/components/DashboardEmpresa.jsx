import React, { useEffect, useState } from "react";
import axios from "axios";
import PedidoModal from "./PedidoModal";
import UserMenu from "./UserMenu";
import {
  Clock,
  CheckCircle,
  Truck,
  CheckSquare,
  XCircle
} from "lucide-react";

const DashboardEmpresa = () => {
  const [empresa, setEmpresa] = useState(null);
  const [activeTab, setActiveTab] = useState("novo");
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
    if (storedEmpresa) setEmpresa(storedEmpresa);
  }, []);

  useEffect(() => {
    if (empresa) fetchPedidos();
  }, [empresa]);

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:3000/discard-requests/empresa/${empresa.id}/todos`
      );
      const grouped = {
        pendente: [],
        aceito: [],
        entrega: [],
        concluido: [],
        recusado: []
      };

      // Agrupa os pedidos por status
      res.data.forEach(p => {
        if (grouped[p.status]) grouped[p.status].push(p);
      });

      // Busca os pedidos pendentes disponíveis e evita sobrescrever os existentes
      const resPendentes = await axios.get("http://localhost:3000/discard-requests/pendentes/disponiveis");

      if (Array.isArray(resPendentes.data)) {
        // Adiciona apenas os pedidos que ainda não estão no grupo
        resPendentes.data.forEach(pendente => {
          if (!grouped.pendente.find(p => p.id === pendente.id)) {
            grouped.pendente.push(pendente);
          }
        });
      }

      console.log("Pedidos agrupados:", grouped);
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

  const statusData = {
    pendente: { label: "Em aberto", icon: <Clock className="w-5 h-5" />, color: "text-blue-600" },
    aceito: { label: "Aceitos", icon: <CheckCircle className="w-5 h-5" />, color: "text-indigo-600" },
    entrega: { label: "Em andamento", icon: <Truck className="w-5 h-5" />, color: "text-orange-600" },
    concluido: { label: "Concluído", icon: <CheckSquare className="w-5 h-5" />, color: "text-green-600" },
    recusado: { label: "Recusados", icon: <XCircle className="w-5 h-5" />, color: "text-red-600" }
  };

  const columnsToShow = activeTab === "novo"
    ? ["pendente", "aceito", "entrega"]
    : ["concluido", "recusado"];

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Painel de Pedidos</h2>
        <UserMenu />
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("novo")}
          className={`px-4 py-2 rounded-full ${activeTab === "novo"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
        >
          Novo Pedido
        </button>
        <button
          onClick={() => setActiveTab("historico")}
          className={`px-4 py-2 rounded-full ${activeTab === "historico"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
        >
          Histórico
        </button>
      </div>

      {toast && (
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-4 shadow">
          {toast}
        </div>
      )}

      {loading ? (
        <p>Carregando pedidos...</p>
      ) : (
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${activeTab === "novo" ? "md:grid-cols-3" : "md:grid-cols-2"} gap-4`}>
          {columnsToShow.map(status => (
            <div key={status} className="bg-gray-50 rounded-lg p-4 shadow border">
              <div className="flex justify-center items-center gap-2 mb-4">
                {statusData[status].icon}
                <h3 className={`text-lg font-semibold ${statusData[status].color}`}>
                  {statusData[status].label}
                </h3>
                <span className="ml-2 text-sm text-white bg-gray-700 px-2 py-0.5 rounded-full">
                  {pedidos[status].length}
                </span>
              </div>

              {pedidos[status].length === 0 ? (
                <p className="text-sm text-gray-400 text-center">Nenhum pedido</p>
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
                      {p.user?.street}, {p.user?.number} - {p.user?.neighborhood}, {p.user?.city}
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
                        className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded w-full"
                      >
                        Retirar pedido
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