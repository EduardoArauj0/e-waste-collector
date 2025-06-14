import React, { useState } from 'react';
import { Pencil, Trash, Save, X, FileDown, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PainelPedidos({
  pedidos,
  empresas,
  clientes,
  onEdit,
  onDelete,
  editingId,
  editData,
  setEditData,
  setEditingId,
  salvarEdicao
}) {
  const [statusFiltro, setStatusFiltro] = useState('');
  const [empresaFiltro, setEmpresaFiltro] = useState('');
  const [buscaCliente, setBuscaCliente] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [colunaOrdenada, setColunaOrdenada] = useState('id');
  const [ordemAsc, setOrdemAsc] = useState(true);
  const itensPorPagina = 10;

  const getEmpresaNome = (id) => empresas.find(e => e.id === id)?.name || '-';
  const getCliente = (id) => clientes.find(c => c.id === id);

  const pedidosFiltrados = pedidos.filter(pedido => {
    const cliente = getCliente(pedido.userId);
    const nomeCliente = cliente?.name?.toLowerCase() || '';
    return (
      (statusFiltro === '' || pedido.status === statusFiltro) &&
      (empresaFiltro === '' || pedido.companyId == empresaFiltro) &&
      (buscaCliente === '' || nomeCliente.includes(buscaCliente.toLowerCase()))
    );
  });

  const pedidosOrdenados = [...pedidosFiltrados].sort((a, b) => {
    let valorA = a[colunaOrdenada];
    let valorB = b[colunaOrdenada];
    if (colunaOrdenada === 'cliente') {
      valorA = getCliente(a.userId)?.name || '';
      valorB = getCliente(b.userId)?.name || '';
    }
    if (typeof valorA === 'string') valorA = valorA.toLowerCase();
    if (typeof valorB === 'string') valorB = valorB.toLowerCase();
    return ordemAsc ? valorA > valorB ? 1 : -1 : valorA < valorB ? 1 : -1;
  });

  const totalPaginas = Math.ceil(pedidosOrdenados.length / itensPorPagina);
  const pedidosPaginados = pedidosOrdenados.slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina);

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
    const header = ['ID', 'Tipo', 'Descrição', 'Status', 'Empresa', 'Cliente', 'Endereço'];
    const linhas = pedidosOrdenados.map(pedido => {
      const cliente = getCliente(pedido.userId);
      return [
        pedido.id,
        pedido.type,
        pedido.description,
        pedido.status,
        getEmpresaNome(pedido.companyId),
        cliente?.name || '-',
        cliente ? `${cliente.street}, ${cliente.number}, ${cliente.neighborhood}, ${cliente.city} - ${cliente.state}, ${cliente.cep}` : '-'
      ].join(',');
    });
    const csvContent = [header.join(','), ...linhas].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'pedidos.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Painel de Pedidos</h2>

      {/* Painel de Status Único com Cores */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-slate-900 text-white p-4 rounded-xl shadow-md text-center">
          <p className="text-sm font-medium">Total</p>
          <p className="text-xl font-bold">{pedidos.length}</p>
        </div>
        <div className="bg-yellow-100 text-yellow-900 p-4 rounded-xl shadow-md text-center">
          <p className="text-sm font-medium">Pendente</p>
          <p className="text-xl font-bold">{pedidos.filter(p => p.status === 'pendente').length}</p>
        </div>
        <div className="bg-blue-100 text-blue-900 p-4 rounded-xl shadow-md text-center">
          <p className="text-sm font-medium">Aceitos</p>
          <p className="text-xl font-bold">{pedidos.filter(p => p.status === 'aceito').length}</p>
        </div>
        <div className="bg-orange-100 text-orange-900 p-4 rounded-xl shadow-md text-center">
          <p className="text-sm font-medium">Em Coleta</p>
          <p className="text-xl font-bold">{pedidos.filter(p => p.status === 'entrega').length}</p>
        </div>
        <div className="bg-green-100 text-green-900 p-4 rounded-xl shadow-md text-center">
          <p className="text-sm font-medium">Concluído</p>
          <p className="text-xl font-bold">{pedidos.filter(p => p.status === 'concluido').length}</p>
        </div>
        <div className="bg-red-100 text-red-900 p-4 rounded-xl shadow-md text-center">
          <p className="text-sm font-medium">Recusado</p>
          <p className="text-xl font-bold">{pedidos.filter(p => p.status === 'recusado').length}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-4">
        <select value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)} className="border p-2 rounded">
          <option value="">Todos os status</option>
          <option value="pendente">Pendente</option>
          <option value="aceito">Aceito</option>
          <option value="entrega">Em Coleta</option>
          <option value="concluido">Concluído</option>
          <option value="recusado">Recusado</option>
        </select>
        <select value={empresaFiltro} onChange={(e) => setEmpresaFiltro(e.target.value)} className="border p-2 rounded">
          <option value="">Todas as empresas</option>
          {empresas.map((empresa) => (
            <option key={empresa.id} value={empresa.id}>{empresa.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Buscar por cliente"
          value={buscaCliente}
          onChange={(e) => setBuscaCliente(e.target.value)}
          className="border p-2 rounded flex-1"
        />
          <button
            onClick={exportarCSV}
            className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            <FileDown className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>

      {/* Tabela */}
      <div className="overflow-auto rounded shadow border">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {['ID', 'Tipo', 'Descrição', 'Status', 'Empresa', 'Cliente', 'Endereço'].map(col => (
                <th
                  key={col}
                  onClick={() => ordenarPor(col === 'empresa' ? 'companyId' : col === 'cliente' ? 'cliente' : col)}
                  className="p-2 cursor-pointer hover:underline capitalize"
                >
                  {col}
                </th>
              ))}
              <th className="p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {pedidosPaginados.map((pedido) => {
              const cliente = getCliente(pedido.userId);
              return (
                <tr key={pedido.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{pedido.id}</td>
                  <td className="p-2">{pedido.type}</td>
                  <td className="p-2">{pedido.description}</td>
                  <td className="p-2">
                    {editingId === pedido.id ? (
                      <select
                        value={editData.status || ''}
                        onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                        className="border p-1 rounded"
                      >
                        <option value="pendente">Pendente</option>
                        <option value="aceito">Aceito</option>
                        <option value="em andamento">Em Coleta</option>
                        <option value="concluído">Concluído</option>
                        <option value="recusado">Recusado</option>
                      </select>
                    ) : pedido.status}
                  </td>
                  <td className="p-2">{getEmpresaNome(pedido.companyId)}</td>
                  <td className="p-2">{cliente?.name || '-'}</td>
                  <td className="p-2">{cliente ? `${cliente.street}, ${cliente.number}, ${cliente.neighborhood}, ${cliente.city} - ${cliente.state}, ${cliente.cep}` : '-'}</td>
                  <td className="p-2 space-x-2">
                    {editingId === pedido.id ? (
                      <button onClick={() => salvarEdicao(pedido.id)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                        Salvar
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(pedido.id);
                          setEditData({ status: pedido.status, companyId: pedido.companyId || '' });
                        }}
                        className="text-blue-600 hover:text-blue-800"
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </button>
                    )}
                      <button
                        onClick={() => onDelete(pedido.id)}
                        className="text-red-600 hover:underline"
                        title="Excluir Pedido"
                      >
                        <Trash size={16} />
                      </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
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