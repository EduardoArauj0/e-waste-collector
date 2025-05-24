export default function PainelClientes({ clientes }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Clientes</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {clientes.map(cliente => (
          <div key={cliente.id} className="border p-4 rounded-lg shadow bg-white">
            <p><strong>Nome:</strong> {cliente.name}</p>
            <p><strong>Email:</strong> {cliente.email}</p>
            <p><strong>Endereço:</strong> {`${cliente.street}, ${cliente.number}, ${cliente.neighborhood}, ${cliente.city} - ${cliente.state}, ${cliente.cep}`}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
