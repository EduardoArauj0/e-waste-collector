import React, { useState } from 'react';

export default function PainelPedidos({ pedidos, empresas, clientes, onEdit, onDelete, editingId, editData, setEditData, setEditingId, salvarEdicao }) {
  const [statusFiltro, setStatusFiltro] = useState('');
  const [buscaCliente, setBuscaCliente] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  const getEmpresaNome = (id) => {
    const empresa = empresas.find((e) => e.id === id);
    return empresa ? empresa.name : '-';
  };

  const getCliente = (id) => {
    return clientes.find(c => c.id === id);
  };

  const pedidosFiltrados = pedidos.filter(pedido => {
    const cliente = getCliente(pedido.userId);
    const nomeCliente = cliente?.name?.toLowerCase() || '';
    return (
      (statusFiltro === '' || pedido.status === statusFiltro) &&
      (buscaCliente === '' || nomeCliente.includes(buscaCliente.toLowerCase()))
    );
  });

  const totalPaginas = Math.ceil(pedidosFiltrados.length / itensPorPagina);
  const pedidosPaginados = pedidosFiltrados.slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina);

  const mudarPagina = (novaPagina) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
      setPaginaAtual(novaPagina);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Painel de Pedidos</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-100 text-blue-900 p-4 rounded-lg shadow">
          <p className="text-sm">Total de Pedidos</p>
          <p className="text-2xl font-bold">{pedidos.length}</p>
        </div>
        <div className="bg-yellow-100 text-yellow-900 p-4 rounded-lg shadow">
          <p className="text-sm">Em Andamento</p>
          <p className="text-2xl font-bold">{pedidos.filter(p => p.status === 'em andamento').length}</p>
        </div>
        <div className="bg-green-100 text-green-900 p-4 rounded-lg shadow">
          <p className="text-sm">Concluídos</p>
          <p className="text-2xl font-bold">{pedidos.filter(p => p.status === 'concluído').length}</p>
        </div>
        <div className="bg-red-100 text-red-900 p-4 rounded-lg shadow">
          <p className="text-sm">Recusados</p>
          <p className="text-2xl font-bold">{pedidos.filter(p => p.status === 'recusado').length}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <select value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)} className="border p-2 rounded">
          <option value="">Todos os status</option>
          <option value="pendente">Pendente</option>
          <option value="aceito">Aceito</option>
          <option value="em andamento">Em Andamento</option>
          <option value="concluído">Concluído</option>
          <option value="recusado">Recusado</option>
        </select>
        <input
          type="text"
          placeholder="Buscar por cliente"
          value={buscaCliente}
          onChange={(e) => setBuscaCliente(e.target.value)}
          className="border p-2 rounded flex-1"
        />
      </div>

      <div className="overflow-auto rounded shadow border">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Tipo</th>
              <th className="p-2">Descrição</th>
              <th className="p-2">Status</th>
              <th className="p-2">Empresa</th>
              <th className="p-2">Cliente</th>
              <th className="p-2">Endereço</th>
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
                      <select value={editData.status || ''} onChange={(e) => setEditData({ ...editData, status: e.target.value })} className="border p-1 rounded">
                        <option value="pendente">Pendente</option>
                        <option value="aceito">Aceito</option>
                        <option value="em andamento">Em Andamento</option>
                        <option value="concluído">Concluído</option>
                        <option value="recusado">Recusado</option>
                      </select>
                    ) : pedido.status}
                  </td>
                  <td className="p-2">
                    {editingId === pedido.id ? (
                      <select value={editData.companyId || ''} onChange={(e) => setEditData({ ...editData, companyId: e.target.value })} className="border p-1 rounded">
                        <option value="">Nenhuma</option>
                        {empresas.map((empresa) => (
                          <option key={empresa.id} value={empresa.id}>{empresa.name}</option>
                        ))}
                      </select>
                    ) : getEmpresaNome(pedido.companyId)}
                  </td>
                  <td className="p-2">{cliente ? cliente.name : '-'}</td>
                  <td className="p-2">
                    {cliente ? `${cliente.street}, ${cliente.number}, ${cliente.neighborhood}, ${cliente.city} - ${cliente.state}, ${cliente.cep}` : '-'}
                  </td>
                  <td className="p-2 space-x-2">
                    {editingId === pedido.id ? (
                      <button onClick={() => salvarEdicao(pedido.id)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Salvar</button>
                    ) : (
                      <button onClick={() => {
                        setEditingId(pedido.id);
                        setEditData({
                          status: pedido.status,
                          companyId: pedido.companyId || ''
                        });
                      }} className="text-blue-600 underline">Editar</button>
                    )}
                    <button onClick={() => onDelete(pedido.id)} className="text-red-600 underline">Excluir</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-700">
          Página {paginaAtual} de {totalPaginas}
        </span>
        <div className="space-x-2">
          <button onClick={() => mudarPagina(paginaAtual - 1)} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Anterior</button>
          <button onClick={() => mudarPagina(paginaAtual + 1)} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Próxima</button>
        </div>
      </div>
    </div>
  );
}