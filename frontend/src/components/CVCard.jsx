// CVCard.jsx
export default function CVCard({ cv, onShowMore }) {
  if (!cv) return null;

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6">
      <h2 className="text-3xl font-bold mb-2">{cv.name}</h2>
      <h5 className="text-gray-600 text-lg mb-4">{cv.profession}</h5>
      <p className="text-gray-800 mb-4 whitespace-pre-line">{cv.experience}</p>
      <p className="font-semibold">
        Email: <span className="font-normal">{cv.email}</span>
      </p>

      <button
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        onClick={onShowMore}
      >
        Ver más detalles
      </button>
    </div>
  );
}
