const PROFILE_IMAGE = "https://ik.imagekit.io/ia0ln3twn/Gemini_Generated_Image_ji9238ji9238ji92.png?tr=w-300,h-300,c-maintain_ratio,f-webp,q-80";

export default function CVCard({ cv, onShowMore }) {
  if (!cv) return null;

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6">
      <div className="flex justify-center mb-4">
        <img
          src={PROFILE_IMAGE}
          alt="Foto de perfil"
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-600 shadow"
        />
      </div>
      <h2 className="text-3xl font-bold mb-2 text-center">{cv.name}</h2>
      <h5 className="text-gray-600 text-lg mb-4 text-center">{cv.profession}</h5>
      <p className="text-gray-800 mb-4 whitespace-pre-line">{cv.experience}</p>
      <p className="font-semibold">
        Email: <span className="font-normal">{cv.email}</span>
      </p>

      <button
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        onClick={onShowMore}º
      >
        Ver más detalles
      </button>
    </div>
  );
}
