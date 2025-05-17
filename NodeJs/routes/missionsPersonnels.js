// routes/missionsPersonnels.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/projets/:id/personnel — devuelve cada miembro con su array de competencias
router.get('/:id', (req, res) => {
  const id = req.params.id;
  const query = `
    SELECT
      p.Identifiant     AS Identifiant,
      p.Nom             AS Nom,
      p.Prenom          AS Prenom,
      p.User            AS User,
      c.IdentifiantC    AS IdCompetence,
      c.Competence      AS Competence
    FROM ProjetsPersonnel pp
    JOIN Personnel p
      ON p.Identifiant = pp.IdPersonnel
    LEFT JOIN CompetencesPersonnels cp
      ON cp.IdPersonnel = p.Identifiant
    LEFT JOIN Competences c
      ON c.IdentifiantC = cp.IdCompetence
    WHERE pp.IdProjet = ?
  `;
  db.execute(query, [id], (err, rows) => {
    if (err) {
      console.error('Erreur SQL:', err);
      return res.status(500).json({ error: 'Erreur SQL' });
    }
    // Agrupamos cada persona con su array de competencias
    const map = {};
    rows.forEach(r => {
      if (!map[r.Identifiant]) {
        map[r.Identifiant] = {
          Identifiant: r.Identifiant,
          Nom:         r.Nom,
          Prenom:      r.Prenom,
          User:        r.User,
          competences: []            // <-- quitamos la "as" de TypeScript
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

// POST /api/projets/:id/personnel — asigna un miembro a la misión
router.post('/', (req, res) => {
  const { IdMission, IdPersonnel } = req.body;
  if (!IdMission || !IdPersonnel) {
    return res.status(400).json({ error: 'Champs requis' });
  }

  const query = 'INSERT INTO MissionsPersonnel (IdMission, IdPersonnel) VALUES (?, ?)';
  db.execute(query, [IdMission, IdPersonnel], (err, result) => {
    if (err) {
      console.error('Erreur SQL:', err);
      return res.status(500).json({ error: 'Erreur SQL' });
    }
    res.json({ success: true });
  });
});

module.exports = router;
