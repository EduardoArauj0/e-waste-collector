import { Trash2, X } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "./ConfirmModal";

export default function ColetaModal({
  isOpen,
  closeModal,
  selectedColeta,
  updateColeta,
  deleteColeta,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ type: "", description: "" });
  const [loading, setLoading] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const firstInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && selectedColeta) {
      setEditData({
        type: selectedColeta.type,
        description: selectedColeta.description,
      });
      setIsEditing(false);
    }
  }, [isOpen, selectedColeta]);

  useEffect(() => {
    if (isOpen && isEditing && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [isOpen, isEditing]);

  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
    }
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  function handleEditChange(e) {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleUpdate() {
    if (!editData.type.trim() || !editData.description.trim()) {
      toast.warning("Por favor, preencha todos os campos para atualizar.");
      return;
    }

    if (
      editData.type === selectedColeta.type &&
      editData.description === selectedColeta.description
    ) {
      toast.info("Nenhuma alteração detectada.");
      return;
    }

    setLoading(true);
    try {
      await updateColeta(selectedColeta.id, editData);
      toast.success("Coleta atualizada com sucesso!");
      setIsEditing(false);
      closeModal();
    } catch (error) {
      const msg = error.response?.data?.message || "Erro ao atualizar a coleta.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  function confirmDelete(id) {
    setSelectedId(id);
    setShowConfirmModal(true);
  }

  async function handleDelete(id) {
    setLoading(true);
    try {
      await deleteColeta(id);
      toast.success("Coleta excluída com sucesso!");
      closeModal();
    } catch (error) {
      const msg = error.response?.data?.message || "Erro ao excluir a coleta.";
      toast.error(msg);
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
      onClick={closeModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded shadow-lg max-w-lg w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          aria-label="Fechar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 id="modal-title" className="text-xl font-bold mb-4">
          Detalhes da Coleta
        </h3>

        {selectedColeta ? (
          <>
            {selectedColeta.status === "pendente" ? (
              isEditing ? (
                <>
                  <label className="block mb-2">
                    Tipo:
                    <select
                      ref={firstInputRef}
                      name="type"
                      value={editData.type}
                      onChange={handleEditChange}
                      className={`border p-2 rounded w-full mt-1 ${
                        !editData.type.trim() ? "border-red-500" : ""
                      }`}
                      aria-invalid={!editData.type.trim()}
                    >
                      <option value="">Selecione o tipo de resíduo</option>
                      <option value="Celulares e Tablets">
                        Celulares e Tablets
                      </option>
                      <option value="Computadores e Notebooks">
                        Computadores e Notebooks
                      </option>
                      <option value="Monitores e TVs">Monitores e TVs</option>
                      <option value="Periféricos (teclados, mouses, etc.)">
                        Periféricos (teclados, mouses, etc.)
                      </option>
                      <option value="Baterias e Pilhas">
                        Baterias e Pilhas
                      </option>
                      <option value="Cabos e Carregadores">
                        Cabos e Carregadores
                      </option>
                      <option value="Eletrodomésticos Pequenos">
                        Eletrodomésticos Pequenos
                      </option>
                      <option value="Outros">Outros</option>
                    </select>
                  </label>

                  <label className="block mb-2">
                    Descrição:
                    <input
                      name="description"
                      value={editData.description}
                      onChange={handleEditChange}
                      className={`border p-2 rounded w-full mt-1 ${
                        !editData.description.trim() ? "border-red-500" : ""
                      }`}
                      aria-invalid={!editData.description.trim()}
                    />
                  </label>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={handleUpdate}
                      disabled={loading}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      {loading ? "Salvando..." : "Salvar"}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <>
                <>
                  <p>
                    <strong>Tipo:</strong> {selectedColeta.type}
                  </p>
                  <p>
                    <strong>Descrição:</strong> {selectedColeta.description}
                  </p>

                  {selectedColeta.company?.name && (
                    <p>
                      <strong>Empresa responsável:</strong> {selectedColeta.company.name}
                    </p>
                  )}
                </>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => confirmDelete(selectedColeta.id)}
                      disabled={loading}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      <Trash2 className="inline-block w-4 h-4 mr-1" />
                      {loading ? "Excluindo..." : "Excluir"}
                    </button>
                  </div>
                </>
              )
            ) : (
              <>
                <p>
                  <strong>Tipo:</strong> {selectedColeta.type}
                </p>
                <p>
                  <strong>Descrição:</strong> {selectedColeta.description}
                </p>
              </>
            )}
          </>
        ) : (
          <p>Nenhuma coleta selecionada.</p>
        )}
      </div>

      {showConfirmModal && (
        <ConfirmModal
          title="Confirmar exclusão"
          message="Você tem certeza que deseja excluir esta coleta? Essa ação não poderá ser desfeita."
          onConfirm={() => handleDelete(selectedId)}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
}