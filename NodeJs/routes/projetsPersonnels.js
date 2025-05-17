// routes/projetsPersonnels.js
const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * GET    /api/projets-personnel/:id
 *   Lista los miembros asignados al proyecto
 * POST   /api/projets-personnel
 *   Añade un miembro al proyecto
 * DELETE /api/projets-personnel/:idProjet/:idPersonnel
 *   Elimina un miembro del proyecto
 */

// 1) Listar miembros asignados
router.get('/:id', (req, res) => {
  const projectId = req.params.id;
  const sql = `
    SELECT
      p.Identifiant      AS Identifiant,
      p.Prenom           AS Prenom,
      p.Nom              AS Nom,
      p.User             AS User,
      c.IdentifiantC     AS IdCompetence,
      c.Competence       AS Competence
    FROM projetspersonnel pp
      JOIN personnel p
        ON p.Identifiant = pp.IdPersonnel
      LEFT JOIN competencespersonnel cp
        ON cp.IdPersonnel = p.Identifiant
      LEFT JOIN competences c
        ON c.IdentifiantC = cp.IdCompetence
    WHERE pp.IdProjet = ?
  `;
  db.execute(sql, [projectId], (err, rows) => {
    if (err) {
      console.error('Erreur SQL:', err);
      return res.status(500).json({ error: 'Erreur SQL' });
    }
    const map = {};
    rows.forEach(r => {
      if (!map[r.Identifiant]) {
        map[r.Identifiant] = {
          Identifiant: r.Identifiant,
          Prenom:      r.Prenom,
          Nom:         r.Nom,
          User:        r.User,
          competences: []
        };
      }
      if (r.IdCompetence) {
        map[r.Identifiant].competences.push({
          IdCompetence: r.IdCompetence,
          Competence:   r.Competence
        });
      }
    });
    res.json(Object.values(map));
  });
});

// 2) Añadir un miembro
router.post('/', (req, res) => {
  const { IdProjet, IdPersonnel } = req.body;
  if (!IdProjet || !IdPersonnel) {
    return res.status(400).json({ error: 'Champs requis' });
  }
  const sql = 'INSERT INTO projetspersonnel (IdProjet, IdPersonnel) VALUES (?, ?)';
  db.execute(sql, [IdProjet, IdPersonnel], err => {
    if (err) {
      console.error('Erreur SQL:', err);
      return res.status(500).json({ error: 'Erreur SQL' });
    }
    res.json({ success: true });
  });
});

// 3) Eliminar un miembro
router.delete('/:idProjet/:idPersonnel', (req, res) => {
  const { idProjet, idPersonnel } = req.params;
  const sql = 'DELETE FROM projetspersonnel WHERE IdProjet = ? AND IdPersonnel = ?';
  db.execute(sql, [idProjet, idPersonnel], err => {
    if (err) {
      console.error('Erreur SQL:', err);
      return res.status(500).json({ error: 'Erreur SQL' });
    }
    res.json({ success: true });
  });
});

module.exports = router;
