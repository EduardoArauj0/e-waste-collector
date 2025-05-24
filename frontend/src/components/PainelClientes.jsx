import React, { useState } from 'react';

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
    <div>
      <h2 className="text-2xl font-bold mb-4">Clientes</h2>

      <div className="mb-4 flex gap-4 flex-wrap items-center">
        <input
          type="text"
          placeholder="Buscar por nome"
          value={filtroBusca}
          onChange={e => setFiltroBusca(e.target.value)}
          className="border p-2 rounded flex-1 min-w-[200px]"
        />
        <button
          onClick={exportarCSV}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Exportar CSV
        </button>
      </div>

      <div className="overflow-auto rounded shadow border">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {['Nome', 'Email', 'CEP', 'Rua', 'Número', 'Bairro', 'Cidade', 'Estado', 'Ações'].map(col => (
                <th key={col} onClick={col !== 'Ações' ? () => ordenarPor(col.toLowerCase()) : null} className={`p-2 ${col !== 'Ações' ? 'cursor-pointer hover:underline' : ''}`}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clientesPaginados.map(cliente => (
              <tr key={cliente.id} className="border-t hover:bg-gray-50">
                {['name', 'email', 'cep', 'street', 'number', 'neighborhood', 'city', 'state'].map(campo => (
                  <td key={campo} className="p-2">
                    {editingId === cliente.id ? (
                      campo === 'cep' ? (
                        <input
                          type="text"
                          value={editData.cep || ''}
                          onChange={handleCepChange}
                          maxLength={8}
                          className="border rounded p-1 w-full"
                        />
                      ) : ['name', 'email', 'number'].includes(campo) ? (
                        <input
                          type="text"
                          value={editData[campo] || ''}
                          onChange={e => setEditData({ ...editData, [campo]: e.target.value })}
                          className="border rounded p-1 w-full"
                        />
                      ) : (
                        <input
                          type="text"
                          value={editData[campo] || ''}
                          readOnly
                          className="border rounded p-1 w-full bg-gray-100 cursor-not-allowed"
                        />
                      )
                    ) : (
                      cliente[campo] || '-'
                    )}
                  </td>
                ))}
                <td className="p-2 space-x-2">
                  {editingId === cliente.id ? (
                    <>
                      <button
                        onClick={salvarEdicao}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={cancelarEdicao}
                        className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                      >
                        Cancelar
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
                        className="text-blue-600 underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Deseja realmente excluir este cliente?')) {
                            onDelete(cliente.id);
                          }
                        }}
                        className="text-red-600 underline"
                      >
                        Excluir
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {clientesPaginados.length === 0 && (
              <tr>
                <td colSpan="9" className="p-4 text-center text-gray-500">
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-700">
          Página {paginaAtual} de {totalPaginas}
        </span>
        <div className="space-x-2">
          <button
            onClick={() => mudarPagina(paginaAtual - 1)}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            disabled={paginaAtual === 1}
          >
            Anterior
          </button>
          <button
            onClick={() => mudarPagina(paginaAtual + 1)}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            disabled={paginaAtual === totalPaginas}
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}