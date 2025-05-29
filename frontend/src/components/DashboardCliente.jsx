import { useEffect, useState } from "react";
import axios from "axios";
import UserMenu from "./UserMenu";
import ColetaModal from "./ColetaDetalhesModal";
import {
  Plus,
  Trash2,
  RefreshCw,
  Loader,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

export default function DashboardCliente() {
  const [user] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [coletas, setColetas] = useState([]);
  const [residuos, setResiduos] = useState([{ type: "", description: "" }]);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("novo");
  const [selectedColeta, setSelectedColeta] = useState(null);

  useEffect(() => {
    if (response) {
      const timeout = setTimeout(() => setResponse(null), 4000);
      return () => clearTimeout(timeout);
    }
  }, [response]);

  const fetchColetas = async () => {
    setLoading(true);
    try {
      if (!user?.id) return;
      const res = await axios.get(
        `http://localhost:3000/discard-requests/cliente/${user.id}`
      );
      setColetas(Array.isArray(res.data) ? res.data : []);
      console.log("Resposta do backend:", res.data);

    } catch (error) {
      console.error("Erro ao buscar coletas:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateColeta = async (id, data) => {
    try {
      await axios.put(`http://localhost:3000/discard-requests/${id}`, data);
      setResponse({ type: "success", message: "Coleta atualizada com sucesso!" });
      fetchColetas();
    } catch (error) {
      console.error("Erro ao atualizar coleta:", error);
      setResponse({ type: "error", message: "Erro ao atualizar coleta." });
    }
  };

  const deleteColeta = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/discard-requests/${id}`);
      setResponse({ type: "success", message: "Coleta excluída com sucesso!" });
      fetchColetas();
    } catch (error) {
      console.error("Erro ao excluir coleta:", error);
      setResponse({ type: "error", message: "Erro ao excluir coleta." });
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchColetas();
    }
  }, [user?.id]);

  const handleChange = (index, e) => {
    const updated = [...residuos];
    updated[index][e.target.name] = e.target.value;
    setResiduos(updated);
  };

  const handleAddResíduo = () => {
    setResiduos([...residuos, { type: "", description: "" }]);
  };

  const handleRemoveResíduo = (index) => {
    const updated = [...residuos];
    updated.splice(index, 1);
    setResiduos(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/discard-requests", {
        userId: user.id,
        residuos,
      });
      setResponse({ type: "success", message: "Pedido(s) criado(s) com sucesso!" });
      setResiduos([{ type: "", description: "" }]);
      fetchColetas();
    } catch (err) {
      console.error("Erro ao criar pedidos:", err);
      setResponse({ type: "error", message: "Erro ao criar pedidos" });
    }
  };

  const grouped = {
    pendente: [],
    aceito: [],
    entrega: [],
    concluido: [],
    recusado: [],
  };

  coletas.forEach((c) => {
    if (grouped[c.status]) grouped[c.status].push(c);
  });

  const statusData = {
    pendente: {
      label: "Pendentes",
      icon: <Clock className="w-5 h-5" />,
      color: "text-yellow-600",
    },
    aceito: {
      label: "Aceitos",
      icon: <CheckCircle className="w-5 h-5" />,
      color: "text-green-600",
    },
    entrega: {
      label: "Em andamento",
      icon: <Loader className="w-5 h-5 animate-spin" />,
      color: "text-orange-600",
    },
    concluido: {
      label: "Concluídos",
      icon: <CheckCircle className="w-5 h-5" />,
      color: "text-green-700",
    },
    recusado: {
      label: "Recusados",
      icon: <XCircle className="w-5 h-5" />,
      color: "text-red-600",
    },
  };

  const columnsToShow =
    activeTab === "novo"
      ? ["pendente", "aceito", "entrega"]
      : ["concluido", "recusado"];

  const openModal = (coleta) => setSelectedColeta(coleta);
  const closeModal = () => setSelectedColeta(null);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard do Cliente</h2>
        <UserMenu />
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("novo")}
          className={`px-4 py-2 rounded-full ${
            activeTab === "novo"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Novo Pedido
        </button>
        <button
          onClick={() => setActiveTab("historico")}
          className={`px-4 py-2 rounded-full ${
            activeTab === "historico"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Histórico
        </button>
      </div>

      {activeTab === "novo" && (
        <div className="bg-white p-6 rounded-xl shadow mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Novo Pedido de Coleta
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {residuos.map((residuo, index) => (
              <div key={index} className="grid md:grid-cols-3 gap-2 items-center">
                <input
                  type="text"
                  name="type"
                  placeholder="Tipo de resíduo"
                  value={residuo.type}
                  onChange={(e) => handleChange(index, e)}
                  className="border p-2 rounded w-full"
                  required
                />
                <input
                  type="text"
                  name="description"
                  placeholder="Descrição"
                  value={residuo.description}
                  onChange={(e) => handleChange(index, e)}
                  className="border p-2 rounded w-full"
                  required
                />
                {residuos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveResíduo(index)}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm"
                  >
                    <Trash2 className="w-4 h-4" /> Remover
                  </button>
                )}
              </div>
            ))}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddResíduo}
                className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded"
              >
                <Plus className="w-4 h-4" /> Adicionar Resíduo
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium"
              >
                Enviar Pedido
              </button>
            </div>
          </form>
          {response && (
            <p
              className={`mt-4 text-sm ${
                response.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {response.message}
            </p>
          )}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Minhas Coletas</h3>
        <button
          onClick={fetchColetas}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800 gap-1"
          title="Atualizar coletas"
        >
          <RefreshCw className="w-4 h-4" /> Atualizar
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-600">
          <Loader className="animate-spin w-5 h-5" /> Carregando coletas...
        </div>
      ) : (
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 ${
            columnsToShow.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"
          } gap-4`}
        >
          {columnsToShow.map((status) => (
            <div key={status} className="bg-gray-50 rounded-lg p-4 shadow border">
              <div className="flex justify-center items-center gap-2 mb-4">
                {statusData[status].icon}
                <h3 className={`text-lg font-semibold ${statusData[status].color}`}>
                  {statusData[status].label}
                </h3>
                <span className="ml-2 text-sm text-white bg-gray-700 px-2 py-0.5 rounded-full">
                  {grouped[status].length}
                </span>
              </div>
              {grouped[status].length === 0 ? (
                <p className="text-sm text-gray-400 text-center">Nenhuma coleta</p>
              ) : (
                grouped[status].map((coleta) => (
                  <div
                    key={coleta.id}
                    onClick={() => openModal(coleta)}
                    className="bg-white rounded-md p-3 mb-3 shadow border hover:bg-blue-50 cursor-pointer transition"
                    title="Clique para ver detalhes"
                  >
                    <p className="font-semibold text-gray-800 truncate">
                      Tipo: {coleta.type}
                    </p>
                    <p className="text-gray-600 truncate">
                      Descrição: {coleta.description}
                    </p>
                    {coleta.company?.name && (
                      <p className="text-sm text-gray-500 mt-1 truncate">
                        Empresa:{" "}
                        <span className="font-medium text-gray-700">
                          {coleta.company.name}
                        </span>
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      )}

      <ColetaModal
        isOpen={!!selectedColeta}
        closeModal={closeModal}
        selectedColeta={selectedColeta}
        updateColeta={updateColeta}
        deleteColeta={deleteColeta}
      />
    </div>
  );
}