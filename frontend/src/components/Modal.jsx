export default function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-80">
        <h2 className="text-xl font-bold mb-3">Más detalles sobre mí</h2>

        {children}

        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
