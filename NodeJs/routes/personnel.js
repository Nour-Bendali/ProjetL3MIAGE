const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  db.execute('SELECT * FROM Personnel', (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur SQL' });
    res.json(results);
  });
});

module.exports = router;
