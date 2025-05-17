const express = require('express');
const router = express.Router();
const db = require('../db.js');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'RECRUIT_SECRET_KEY_JWT_2025'; // à stocker en .env plus tard

// Route de login
router.post('/login', (req, res) => {
  const { User, password } = req.body;

  if (!User || !password) {
    return res.status(400).json({ success: false, error: 'Champs User et password requis.' });
  }

  const query = 'SELECT * FROM Personnel WHERE User = ?';
  db.execute(query, [User], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: 'Erreur SQL' });
    if (results.length === 0) {
      return res.status(401).json({ success: false, error: 'Utilisateur introuvable.' });
    }

    const user = results[0];
    if (user.Password !== password) {
      return res.status(401).json({ success: false, error: 'Mot de passe incorrect.' });
    }

    const token = jwt.sign(
      { id: user.Identifiant, user: user.User },
      SECRET_KEY,
      { expiresIn: '2h' }
    );

    res.status(200).json({ success: true, token });
  });
});

module.exports = router;