// src/App.jsx
import { useState, useEffect } from "react";
import CVCard from "./components/CVCard";
import DBSelector from "./components/DBSelector";
import Modal from "./components/Modal";

function App() {
  const [dbChoice, setDbChoice] = useState("mariadb");
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

const fetchCV = async () => {
  setLoading(true);
  try {
    const res = await fetch(`http://localhost:3000/api/cv?db=${dbChoice}`);
    const text = await res.text(); // <-- leer como texto
    console.log("Respuesta cruda de la API:", text);

    const data = JSON.parse(text); // aquí fallaba si no era JSON
    setCv(data);
  } catch (error) {
    console.error("Error al parsear JSON:", error);
    setCv(null);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchCV();
  }, []);

  return (
    <div className="bg-gray-100 py-10 min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Mini CV Interactivo</h1>

        {/* Selector de base de datos */}
        <DBSelector db={dbChoice} setDb={setDbChoice} loadCV={fetchCV} />

        {loading && <p className="text-center text-gray-600">Cargando...</p>}

        {!loading && cv ? (
          <CVCard cv={cv} onShowMore={() => setModalOpen(true)} />
        ) : (
          !loading && <p className="text-center text-red-600 font-semibold">No se encontró información.</p>
        )}

        {/* Modal */}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <p className="text-gray-700">{cv?.moreinfo}</p>
        </Modal>
      </div>
    </div>
  );
}

export default App;
