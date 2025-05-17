const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
  const { IdMission, IdPersonnel } = req.body;
  if (!IdMission || !IdPersonnel) return res.status(400).json({ error: 'Champs requis' });

  const query = 'INSERT INTO MissionsPersonnel (IdMission, IdPersonnel) VALUES (?, ?)';
  db.execute(query, [IdMission, IdPersonnel], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erreur SQL' });
    res.json({ success: true });
  });
});

module.exports = router;
