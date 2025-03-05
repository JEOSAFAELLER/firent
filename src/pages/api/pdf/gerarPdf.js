import PdfPrinter from "pdfmake";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { ordem } = req.body;

  if (!ordem) {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  const printer = new PdfPrinter({
    Roboto: {
      normal: path.resolve("./public/fonts/Roboto-Regular.ttf"),
      bold: path.resolve("./public/fonts/Roboto-Medium.ttf"),
    },
  });

  const docDefinition = {
    content: [
      { text: "Ordem de Serviço", style: "header" },
      { text: `OS: ${ordem.id}`, style: "subheader" },
      { text: `Cliente: ${ordem.cliente}`, margin: [0, 5, 0, 5] },
      { text: "Produtos:", style: "subheader" },
      {
        table: {
          widths: ["*", "auto"],
          body: [
            ["Produto", "Quantidade"],
            ...ordem.produtos.map((item) => [item.nome, item.quantidade]),
          ],
        },
      },
    ],
    styles: {
      header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
      subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
    },
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  const filePath = path.join(process.cwd(), "public", `ordem_${ordem.id}.pdf`);
  const writeStream = fs.createWriteStream(filePath);

  pdfDoc.pipe(writeStream);
  pdfDoc.end();

  writeStream.on("finish", () => {
    res.status(200).json({ url: `/ordem_${ordem.id}.pdf` });
  });

  writeStream.on("error", (err) => {
    res.status(500).json({ error: "Erro ao gerar PDF", details: err.message });
  });
}
