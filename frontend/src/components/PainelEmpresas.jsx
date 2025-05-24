export default function PainelEmpresas({ empresas }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Empresas</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {empresas.map(empresa => (
          <div key={empresa.id} className="border p-4 rounded-lg shadow bg-white">
            <p><strong>Nome:</strong> {empresa.name}</p>
            <p><strong>Email:</strong> {empresa.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
