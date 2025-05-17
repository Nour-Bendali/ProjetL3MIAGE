const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/:id', (req, res) => {
  const id = req.params.id;
  const query = `
    SELECT p.Id, p.Nom, p.Prenom, p.User
    FROM ProjetsPersonnel pp
    JOIN Personnel p ON p.Identifiant = pp.IdPersonnel
    WHERE pp.IdProjet = ?`;
  db.execute(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur SQL' });
    res.json(results);
  });
});

router.post('/', (req, res) => {
  const { IdProjet, IdPersonnel } = req.body;
  if (!IdProjet || !IdPersonnel) return res.status(400).json({ error: 'Champs requis' });

  const query = 'INSERT INTO ProjetsPersonnel (IdProjet, IdPersonnel) VALUES (?, ?)';
  db.execute(query, [IdProjet, IdPersonnel], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erreur SQL' });
    res.json({ success: true });
  });
});

module.exports = router;
