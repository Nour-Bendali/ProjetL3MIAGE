const express = require('express');
const router = express.Router();
const db = require('../../config/db');

// 👥 Liste du personnel
router.get('/personnel', (req, res) => {
  const query = `
    SELECT p.Identifiant, p.Nom, p.Prenom, p.User as email,
           GROUP_CONCAT(c.Competence) as competences
    FROM Personnel p
    LEFT JOIN CompetencesPersonnel cp ON p.Identifiant = cp.IdPersonnel
    LEFT JOIN Competences c ON cp.IdCompetence = c.IdentifiantC
    GROUP BY p.Identifiant
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    const personnel = results.map(p => ({
      id: p.Identifiant,
      nom: p.Nom,
      prenom: p.Prenom,
      email: p.email,
      competences: p.competences ? p.competences.split(',') : []
    }));
    res.json(personnel);
  });
});

// 👥 Ajouter un personnel
router.post('/personnel', (req, res) => {
  const { nom, prenom, email, competences } = req.body;

  db.beginTransaction(err => {
    if (err) return res.status(500).json({ error: err.message });

    const insertPersonnel = 'INSERT INTO Personnel (Nom, Prenom, User) VALUES (?, ?, ?)';
    db.query(insertPersonnel, [nom, prenom, email], (err, result) => {
      if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

      const personnelId = result.insertId;
      if (competences?.length > 0) {
        const insertCompetences = 'INSERT INTO CompetencesPersonnel (IdPersonnel, IdCompetence) VALUES ?';
        const values = competences.map(c => [personnelId, c]);

        db.query(insertCompetences, [values], (err) => {
          if (err) return db.rollback(() => res.status(500).json({ error: err.message }));
          db.commit(err => {
            if (err) return db.rollback(() => res.status(500).json({ error: err.message }));
            res.status(201).json({ id: personnelId, nom, prenom, email, competences });
          });
        });
      }
    });
  });
});

module.exports = router;
