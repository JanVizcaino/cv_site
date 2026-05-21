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

// GET /api/cv?db=mariadb
router.get('/', async (req, res) => {
  const db = (req.query.db || 'mariadb').toLowerCase();
  const { type, client } = getDbClients(db);

  try {
    let row;
    if (type === 'mysql') {
      const [rows] = await client.execute('SELECT * FROM cv_info LIMIT 1');
      row = rows[0];
    } else {
      const result = await client.query('SELECT * FROM cv_info LIMIT 1');
      row = result.rows[0];
    }
    if (!row) return res.status(404).json({ error: 'No hay datos en la BD' });
    return res.json(row);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error de base de datos' });
  }
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
