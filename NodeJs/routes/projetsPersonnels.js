const express = require('express');
const router = express.Router();
const db = require('../db');

// Récupère tous les membres affectés à un projet, avec leurs compétences.
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
      return res.status(500).json({ success: false, error: 'Erreur SQL' });
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
    res.status(200).json(Object.values(map));
});
});

// Assigne un membre à un projet.
router.post('/', (req, res) => {
  const { IdProjet, IdPersonnel } = req.body;
  if (!IdProjet || !IdPersonnel) {
    return res.status(400).json({ success: false, error: 'Champs IdProjet et IdPersonnel requis' });
  }
  const sql = 'INSERT INTO projetspersonnel (IdProjet, IdPersonnel) VALUES (?, ?)';
  db.execute(sql, [IdProjet, IdPersonnel], err => {
    if (err) {
      console.error('Erreur SQL:', err);
      return res.status(500).json({ success: false, error: 'Erreur SQL' });
    }
    res.status(201).json({ success: true });
  });
});

// Désassigne un membre d’un projet.
router.delete('/:idProjet/:idPersonnel', (req, res) => {
  const { idProjet, idPersonnel } = req.params;
  const sql = 'DELETE FROM projetspersonnel WHERE IdProjet = ? AND IdPersonnel = ?';
  db.execute(sql, [idProjet, idPersonnel], err => {
    if (err) {
      console.error('Erreur SQL:', err);
      return res.status(500).json({ success: false, error: 'Erreur SQL' });
    }
    res.status(200).json({ success: true });
  });
});

module.exports = router;
