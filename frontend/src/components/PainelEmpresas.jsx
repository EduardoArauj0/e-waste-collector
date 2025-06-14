import React, { useState } from 'react';
import { Pencil, Trash, Save, X, FileDown, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PainelEmpresas({ empresas, onEdit, onDelete }) {
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

  const empresasFiltradas = empresas.filter(e =>
    e.name.toLowerCase().includes(filtroBusca.toLowerCase())
  );

  const empresasOrdenadas = [...empresasFiltradas].sort((a, b) => {
    let valorA = a[colunaOrdenada] || '';
    let valorB = b[colunaOrdenada] || '';
    if (typeof valorA === 'string') valorA = valorA.toLowerCase();
    if (typeof valorB === 'string') valorB = valorB.toLowerCase();
    if (valorA > valorB) return ordemAsc ? 1 : -1;
    if (valorA < valorB) return ordemAsc ? -1 : 1;
    return 0;
  });

  const totalPaginas = Math.ceil(empresasOrdenadas.length / itensPorPagina);
  const empresasPaginadas = empresasOrdenadas.slice(
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

  const exportarCSV = () => {
    const header = ['ID', 'Nome', 'Email', 'CEP', 'Rua', 'Número', 'Bairro', 'Cidade', 'Estado'];
    const linhas = empresasOrdenadas.map(e => [
      e.id,
      e.name,
      e.email,
      e.cep || '-',
      e.street || '-',
      e.number || '-',
      e.neighborhood || '-',
      e.city || '-',
      e.state || '-',
    ].map(campo => `"${campo}"`).join(','));
    const csvContent = [header.join(','), ...linhas].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'empresas.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-2xl font-bold">Empresas</h2>
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
            {empresasPaginadas.map(empresa => (
              <tr key={empresa.id} className="hover:bg-gray-50">
                {['name', 'email', 'cep', 'street', 'number', 'neighborhood', 'city', 'state'].map(campo => (
                  <td key={campo} className="px-4 py-2">
                    {editingId === empresa.id ? (
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
                      empresa[campo] || '-'
                    )}
                  </td>
                ))}
                <td className="px-4 py-2 flex gap-2">
                  {editingId === empresa.id ? (
                    <>
                      <button
                        onClick={salvarEdicao}
                        className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={cancelarEdicao}
                        className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(empresa.id);
                          setEditData({
                            name: empresa.name,
                            email: empresa.email,
                            cep: empresa.cep || '',
                            street: empresa.street || '',
                            number: empresa.number || '',
                            neighborhood: empresa.neighborhood || '',
                            city: empresa.city || '',
                            state: empresa.state || '',
                          });
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Tem certeza que deseja excluir esta empresa?')) {
                            onDelete(empresa.id);
                          }
                        }}
                        className="text-red-600 hover:underline"
                      >
                        <Trash size={16} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {empresasPaginadas.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center text-gray-500 py-4">
                  Nenhuma empresa encontrada.
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
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => mudarPagina(paginaAtual + 1)}
            disabled={paginaAtual === totalPaginas}
            className="p-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}