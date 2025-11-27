export default function DBSelector({ db, setDb, loadCV }) {
  return (
    <div className="text-center mb-8">
      <select
        className="border px-3 py-2 rounded-lg"
        value={db}
        onChange={(e) => setDb(e.target.value)}
      >
        <option value="mariadb">MariaDB</option>
        <option value="postgres">PostgreSQL</option>
      </select>

      <button
        className="ml-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        onClick={loadCV}
      >
        Mostrar CV
      </button>
    </div>
  );
}
