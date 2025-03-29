import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faSquarePlus } from "@fortawesome/free-solid-svg-icons";

const EstoqueModal = ({ estoque, setCodigoProduto, setNomeProduto, setEstoqueModalOpen }) => {
  const [filtro, setFiltro] = useState("");

  const produtosFiltrados = estoque.filter((item) =>
    item.nome.toLowerCase().startsWith(filtro.toLowerCase())
  );

  return (
    <div
      id="modalBackdrop"
      style={modalStyles}
      onClick={(e) => {
        if (e.target.id === "modalBackdrop") {
          setEstoqueModalOpen(false);
        }
      }}
    >
      <div style={modalContentStyles}>
      <button
          style={closeButtonStyles}
          onClick={() => setEstoqueModalOpen(false)}
        >
          <FontAwesomeIcon icon={faClose} style={{ fontSize: "20px", color: "#545e75" }} />
        </button>
        <h2>Estoque</h2>
        

        {/* Campo de Filtro dentro do Modal */}
        <input
          type="text"
          placeholder="Filtrar produtos..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={inputStyles}
        />

        <table border="2" cellPadding="7" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nome</th>
              <th>Quantidade</th>
              <th>Selecionar</th>
            </tr>
          </thead>
          <tbody>
            {produtosFiltrados.length > 0 ? (
              produtosFiltrados.map((item) => (
                <tr key={item.codigo}>
                  <td>{item.codigo}</td>
                  <td>{item.nome}</td>
                  <td>{item.quantidade}</td>
                  <td>
                    <button
                      style={selectButtonStyles}
                      onClick={() => {
                        setCodigoProduto(item.codigo);
                        setNomeProduto(item.nome);
                        setEstoqueModalOpen(false);
                      }}
                    >
                      <FontAwesomeIcon icon={faSquarePlus} style={{ fontSize: "20px", color: "#545e75" }} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "10px" }}>
                  Nenhum produto encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* --- Estilos --- */
const modalStyles = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  
};

const modalContentStyles = {
  background: "#fff",
  padding: "20px",

  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  width: "90%",
  maxWidth: "600px",
  maxHeight: "80%",
  overflowY: "auto",
  position: "relative", 
  
};

const closeButtonStyles = {
  display:"flex-end",
  fontSize: '18px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: '#333',
  position: "absolute",   // Posiciona o botão no canto superior direito
  top: "10px",            // Distância do topo
  right: "10px",
};

const inputStyles = {
  width: "100%",
  padding: "8px",
  marginBottom: "10px",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

const selectButtonStyles = {
  background: "none",
  border: "none",
  padding: "0",
  cursor: "pointer",
  width: "25px",
  height: "25px",
};

export default EstoqueModal;
