import React, { useState } from 'react';
import { Pencil, Trash, Save, X, FileDown, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PainelClientes({ clientes, onEdit, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [filtroBusca, setFiltroBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [colunaOrdenada, setColunaOrdenada] = useState('name');
  const [ordemAsc, setOrdemAsc] = useState(true);
  const itensPorPagina = 10;

  const consultarViaCep = async (cep) => {
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setEditData(prev => ({
          ...prev,
          street: data.logradouro || '',
          neighborhood: data.bairro || '',
          city: data.localidade || '',
          state: data.uf || '',
        }));
      } else {
        alert('CEP inválido');
      }
    } catch {
      alert('Erro ao consultar CEP');
    }
  };

  const handleCepChange = (e) => {
    const cep = e.target.value.replace(/\D/g, '');
    setEditData(prev => ({ ...prev, cep }));
    if (cep.length === 8) {
      consultarViaCep(cep);
    } else {
      setEditData(prev => ({
        ...prev,
        street: '',
        neighborhood: '',
        city: '',
        state: '',
      }));
    }
  };

  const salvarEdicao = () => {
    if (onEdit && editingId != null) {
      onEdit(editingId, editData);
      setEditingId(null);
      setEditData({});
    }
  };

  const cancelarEdicao = () => {
    setEditingId(null);
    setEditData({});
  };

  const exportarCSV = () => {
    const header = ['ID', 'Nome', 'Email', 'CEP', 'Rua', 'Número', 'Bairro', 'Cidade', 'Estado'];
    const linhas = clientesOrdenadas.map(c => [
      c.id, c.name, c.email, c.cep || '-', c.street || '-', c.number || '-', c.neighborhood || '-', c.city || '-', c.state || '-',
    ].map(val => `"${val}"`).join(','));
    const csvContent = [header.join(','), ...linhas].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'clientes.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clientesFiltrados = clientes.filter(c =>
    c.name.toLowerCase().includes(filtroBusca.toLowerCase())
  );

  const clientesOrdenadas = [...clientesFiltrados].sort((a, b) => {
    let valA = a[colunaOrdenada] || '';
    let valB = b[colunaOrdenada] || '';
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    if (valA > valB) return ordemAsc ? 1 : -1;
    if (valA < valB) return ordemAsc ? -1 : 1;
    return 0;
  });

  const totalPaginas = Math.ceil(clientesOrdenadas.length / itensPorPagina);
  const clientesPaginados = clientesOrdenadas.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  const mudarPagina = (novaPagina) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) setPaginaAtual(novaPagina);
  };

  const ordenarPor = (coluna) => {
    if (colunaOrdenada === coluna) {
      setOrdemAsc(!ordemAsc);
    } else {
      setColunaOrdenada(coluna);
      setOrdemAsc(true);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-2xl font-bold">Clientes</h2>
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Buscar por nome"
            value={filtroBusca}
            onChange={e => setFiltroBusca(e.target.value)}
            className="border rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={exportarCSV}
            className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            <FileDown className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>
      </div>

      <div className="overflow-auto rounded-lg border shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {['Nome', 'Email', 'CEP', 'Rua', 'Número', 'Bairro', 'Cidade', 'Estado', 'Ações'].map(col => (
                <th
                  key={col}
                  onClick={col !== 'Ações' ? () => ordenarPor(col.toLowerCase()) : null}
                  className={`px-4 py-2 text-left ${col !== 'Ações' ? 'cursor-pointer hover:underline' : ''}`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {clientesPaginados.map(cliente => (
              <tr key={cliente.id} className="hover:bg-gray-50">
                {['name', 'email', 'cep', 'street', 'number', 'neighborhood', 'city', 'state'].map(campo => (
                  <td key={campo} className="px-4 py-2">
                    {editingId === cliente.id ? (
                      ['name', 'email', 'number'].includes(campo) ? (
                        <input
                          type="text"
                          value={editData[campo] || ''}
                          onChange={e => setEditData({ ...editData, [campo]: e.target.value })}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : campo === 'cep' ? (
                        <input
                          type="text"
                          maxLength={8}
                          value={editData.cep || ''}
                          onChange={handleCepChange}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        <input
                          type="text"
                          value={editData[campo] || ''}
                          readOnly
                          className="bg-gray-100 border rounded px-2 py-1 w-full cursor-not-allowed"
                        />
                      )
                    ) : (
                      cliente[campo] || '-'
                    )}
                  </td>
                ))}
                <td className="px-4 py-2 flex gap-2">
                  {editingId === cliente.id ? (
                    <>
                      <button
                        onClick={salvarEdicao}
                        className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                        title="Salvar"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={cancelarEdicao}
                        className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                        title="Cancelar"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(cliente.id);
                          setEditData({
                            name: cliente.name,
                            email: cliente.email,
                            cep: cliente.cep || '',
                            street: cliente.street || '',
                            number: cliente.number || '',
                            neighborhood: cliente.neighborhood || '',
                            city: cliente.city || '',
                            state: cliente.state || '',
                          });
                        }}
                        className="text-blue-600 hover:underline"
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Deseja realmente excluir este cliente?')) {
                            onDelete(cliente.id);
                          }
                        }}
                        className="text-red-600 hover:underline"
                        title="Excluir"
                      >
                        <Trash size={16} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {clientesPaginados.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center text-gray-500 py-4">
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-600">
          Página {paginaAtual} de {totalPaginas}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => mudarPagina(paginaAtual - 1)}
            disabled={paginaAtual === 1}
            className="p-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            title="Página anterior"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => mudarPagina(paginaAtual + 1)}
            disabled={paginaAtual === totalPaginas}
            className="p-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            title="Próxima página"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}