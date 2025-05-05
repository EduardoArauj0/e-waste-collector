import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() === "") {
      setMensagem("Por favor, informe um e-mail válido.");
      return;
    }
    setMensagem("Se este e-mail estiver cadastrado, enviamos instruções para redefinir sua senha!");
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-green-700 mb-6">Recuperar Senha</h1>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-mail cadastrado
            </label>
            <input
              type="email"
              id="email"
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition"
          >
            Enviar
          </button>

          {mensagem && (
            <p className="text-sm text-center text-green-600 mt-4">{mensagem}</p>
          )}
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-green-600 hover:underline"
          >
            Voltar para login
          </button>
        </div>
      </div>
    </div>
  );
}
