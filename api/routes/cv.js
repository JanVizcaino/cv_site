// routes/cv.js
const express = require('express');
const router = express.Router();

const mariadb = require('../db/mariadb');
const pg = require('../db/postgres');

// Helper: decide db pool y placeholders
function getDbClients(db) {
  if (db === 'postgres') return { type: 'pg', client: pg };
  // default mariadb
  return { type: 'mysql', client: mariadb };
}

// GET /api/cv?db=mariadb&id=1
router.get('/', async (req, res) => {
  return res.json({
    id: 1,
    nombre: "Jan Vizcaino",
    profesion: "Desarrollador Full Stack & DevOps",
    experiencia: "Despliegue automatizado con Jenkins y Docker superado con éxito.",
    moreinfo: "Datos estáticos para la práctica de DevOps."
  });
});

// PUT /api/cv/:id   body: { db: 'mariadb'|'postgres', moreinfo: 'texto...' }
router.put('/:id', async (req, res) => {
  const db = (req.body.db || 'mariadb').toLowerCase();
  const moreinfo = req.body.moreinfo ?? '';
  const id = parseInt(req.params.id, 10);

  if (!Number.isInteger(id)) return res.status(400).json({ error: 'ID inválido' });

  const { type, client } = getDbClients(db);

  try {
    if (type === 'mysql') {
      const [result] = await client.execute('UPDATE cv_info SET moreinfo = ? WHERE id = ?', [moreinfo, id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Registro no encontrado' });
      return res.json({ message: 'Actualizado', id, moreinfo });
    } else {
      const result = await client.query('UPDATE cv_info SET moreinfo = $1 WHERE id = $2 RETURNING *', [moreinfo, id]);
      if (result.rowCount === 0) return res.status(404).json({ error: 'Registro no encontrado' });
      return res.json({ message: 'Actualizado', row: result.rows[0] });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al actualizar la base de datos' });
  }
});

module.exports = router;
