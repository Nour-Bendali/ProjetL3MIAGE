// imports
const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * Récupère toutes les compétences.
 * - Aucun paramètre requis
 * - Interroge la table Competences
 * - En cas d’erreur SQL : status 500 et message d’erreur
 * - En cas de succès : renvoie la liste des compétences au format JSON
 */

router.get('/', (req, res) => {
  db.execute('SELECT * FROM Competences', (err, results) => {
    if (err) {
      // Erreur SQL : on renvoie un code 500
      return res.status(500).json({ success: false, error: 'Erreur SQL' });
    }
    // Succès : données renvoyées au client
    res.json({ success: true, data: results });
  });
});

module.exports = router;