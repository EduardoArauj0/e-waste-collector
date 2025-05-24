import React, { useState } from 'react';

export default function PainelEmpresas({ empresas, onEdit, onDelete }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [filtroBusca, setFiltroBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [colunaOrdenada, setColunaOrdenada] = useState('name');
  const [ordemAsc, setOrdemAsc] = useState(true);
  const itensPorPagina = 10;

  // Consulta ViaCEP e atualiza campos de endereço
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

  // Lida com mudança no campo de CEP
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

  // Salva edição
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
    <div>
      <h2 className="text-2xl font-bold mb-4">Empresas</h2>

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
            {empresasPaginadas.map(empresa => (
              <tr key={empresa.id} className="border-t hover:bg-gray-50">
                {['name', 'email', 'cep', 'street', 'number', 'neighborhood', 'city', 'state'].map(campo => (
                  <td key={campo} className="p-2">
                    {editingId === empresa.id ? (
                      ['name', 'email', 'number'].includes(campo) ? (
                        <input
                          type="text"
                          value={editData[campo] || ''}
                          onChange={e => setEditData({ ...editData, [campo]: e.target.value })}
                          className="border rounded p-1 w-full"
                        />
                      ) : campo === 'cep' ? (
                        <input
                          type="text"
                          maxLength={8}
                          value={editData.cep || ''}
                          onChange={handleCepChange}
                          className="border rounded p-1 w-full"
                          placeholder="Somente números"
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
                      empresa[campo] || '-'
                    )}
                  </td>
                ))}
                <td className="p-2 space-x-2">
                  {editingId === empresa.id ? (
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
                        className="text-blue-600 underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Tem certeza que deseja excluir esta empresa?')) {
                            onDelete(empresa.id);
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
            {empresasPaginadas.length === 0 && (
              <tr>
                <td colSpan="9" className="p-4 text-center text-gray-500">
                  Nenhuma empresa encontrada.
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