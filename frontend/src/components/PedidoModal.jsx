import React from "react";
import { User, MapPin, Package, X, CheckCircle, XCircle, FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";

const PedidoModal = ({ pedido, onClose, onUpdateStatus, empresa }) => {
  if (!pedido) return null;

  const {
    street,
    number,
    neighborhood,
    city,
    state,
    cep,
    name,
  } = pedido.user || {};

  const endereco = [street, number && `nº ${number}`, neighborhood, `${city} - ${state}`, cep && `CEP ${cep}`]
    .filter(Boolean)
    .join(", ");

  const gerarPDFPedido = async (pedido, empresa) => {
    const jsPDF = (await import("jspdf")).default;
    const QRCode = (await import("qrcode")).default;
    const doc = new jsPDF("p", "mm", "a4");

    const pageWidth = doc.internal.pageSize.getWidth();
    const user = pedido.user || {};

    // Cores
    const corPrimaria = [66, 133, 244];
    const cinzaClaro = [245, 245, 245];

    // TÍTULO
    doc.setFillColor(...corPrimaria);
    doc.setTextColor(255);
    doc.roundedRect(14, 14, pageWidth - 28, 12, 3, 3, "F");
    doc.setFontSize(14);
    doc.text("ORDEM DE COLETA DE PEDIDO", pageWidth / 2, 22, { align: "center" });

    // NÚMERO DO PEDIDO
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.text(`Pedido Nº ${pedido.id}`, pageWidth - 40, 30);

    // CLIENTE E EMPRESA
    doc.setFontSize(10);
    doc.setDrawColor(200);
    doc.roundedRect(14, 34, 90, 35, 2, 2); // cliente
    doc.roundedRect(109, 34, 90, 35, 2, 2); // empresa

    // CLIENTE
    doc.setFont(undefined, "bold");
    doc.text("DADOS DO CLIENTE", 16, 39);
    doc.setFont(undefined, "normal");
    doc.text(`Nome: ${user.name || "N/A"}`, 16, 44);
    doc.text(`Endereço: ${user.street || ""}, Nº ${user.number || ""}`, 16, 49);
    doc.text(`Bairro: ${user.neighborhood || ""}`, 16, 54);
    doc.text(`Cidade: ${user.city || ""} - ${user.state || ""}`, 16, 59);
    doc.text(`CEP: ${user.cep || ""}`, 16, 64);

    // EMPRESA
    doc.setFont(undefined, "bold");
    doc.text("DADOS DA EMPRESA", 111, 39);
    doc.setFont(undefined, "normal");
    doc.text(`Nome: ${empresa?.name || "Empresa"}`, 111, 44);
    doc.text(`Endereço: ${empresa?.street || ""}, Nº ${empresa?.number || ""}`, 111, 49);
    doc.text(`Bairro: ${empresa?.neighborhood || ""}`, 111, 54);
    doc.text(`Cidade: ${empresa?.city || ""} - ${empresa?.state || ""}`, 111, 59);
    doc.text(`CEP: ${empresa?.cep || ""}`, 111, 64);

    // SEPARADOR
    doc.setDrawColor(180);
    doc.setLineDashPattern([1, 1], 0);
    doc.line(14, 72, pageWidth - 14, 72);
    doc.setLineDashPattern([], 0);

    // DESCRIÇÃO DA CARGA
    const startY = 78;
    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.text("DESCRIÇÃO DA CARGA", 14, startY);
    doc.setFont(undefined, "normal");

    // TABELA COM FUNDO
    doc.setFillColor(...cinzaClaro);
    doc.rect(14, startY + 4, 185, 10, "F");
    doc.text("TIPO DO ITEM", 16, startY + 11);
    doc.text("DESCRIÇÃO", 100, startY + 11);

    doc.rect(14, startY + 14, 185, 12);
    doc.text(pedido.type || "N/A", 16, startY + 21);
    const descricao = doc.splitTextToSize(pedido.description || "Sem descrição", 85);
    doc.text(descricao, 100, startY + 21);

    // RODAPÉ
    const rodapeY = startY + 40;
    doc.setFontSize(10);
    doc.text("DATA: ____ / ____ / _______", 14, rodapeY);
    doc.text("ASSINATURA DO CLIENTE:", 84, rodapeY);
    doc.line(130, rodapeY, 195, rodapeY);

    // QR CODE
    const qrData = `Pedido #${pedido.id}`;
    const qrCodeDataUrl = await QRCode.toDataURL(qrData);
    doc.addImage(qrCodeDataUrl, "PNG", pageWidth - 35, rodapeY + 5, 20, 20);

    // Salvar
    doc.save(`ordem_coleta_pedido_${pedido.id}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black transition text-2xl font-bold"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Package className="w-6 h-6 text-blue-600" />
          Pedido #{pedido.id}
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600" />
              Cliente
            </h3>
            <p className="text-gray-800">{name || "Nome não disponível"}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-600" />
              Endereço
            </h3>
            <p className="text-gray-700 text-sm">
              {endereco || "Endereço não disponível"}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-1">Itens</h3>
            <p className="text-gray-800">{pedido.type}</p>
            <p className="text-gray-600 text-sm">{pedido.description}</p>
          </div>
        </div>

        {pedido.status === "pendente" && (
          <div className="flex justify-end gap-3 mt-6">
            <button
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
              onClick={() => onUpdateStatus(pedido.id, "recusado")}
            >
              <XCircle className="w-4 h-4" />
              Recusar
            </button>
            <button
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
              onClick={() => onUpdateStatus(pedido.id, "aceito")}
            >
              <CheckCircle className="w-4 h-4" />
              Aceitar pedido
            </button>
          </div>
        )}

        {pedido.status === "aceito" && (
          <div className="flex justify-end mt-6">
            <button
              onClick={async () => await gerarPDFPedido(pedido, empresa)}
              className="flex items-center gap-2 mt-6 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow transition"
            >
              <FileText className="w-5 h-5" />
              Gerar PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PedidoModal;