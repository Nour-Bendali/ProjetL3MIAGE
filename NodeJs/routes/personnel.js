// routes/personnel.js
const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * GET /api/personnel
 * Renvoie tous les utilisateurs avec leurs compétences
 */
router.get('/', (req, res) => {
  const query = `
    SELECT
      p.Identifiant      AS Identifiant,
      p.Prenom           AS Prenom,
      p.Nom              AS Nom,
      p.User             AS Email,
      c.IdentifiantC     AS IdCompetence,
      c.Competence       AS Competence
    FROM personnel p
    LEFT JOIN competencespersonnel cp
      ON cp.IdPersonnel = p.Identifiant
    LEFT JOIN competences c
      ON c.IdentifiantC = cp.IdCompetence
  `;
  db.execute(query, (err, rows) => {
    if (err) {
      console.error('Erreur SQL:', err);
      return res.status(500).json({ error: 'Erreur SQL' });
    }
    // Grouper les compétences par utilisateur
    const map = {};
    rows.forEach(r => {
      if (!map[r.Identifiant]) {
        map[r.Identifiant] = {
          Identifiant: r.Identifiant,
          Prenom:      r.Prenom,
          Nom:         r.Nom,
          Email:       r.Email,
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

module.exports = router;
