// nodejs/routes/auth.js

const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'RECRUIT_SECRET_KEY_JWT_2025'; // à stocker en .env plus tard

// 🔹 Route de login
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

// 🔹 Vérifier qu'un utilisateur existe (forgot-password)
router.post('/verify-user', (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ success: false, error: 'Nom d’utilisateur requis.' });
  }
  const query = 'SELECT Identifiant FROM Personnel WHERE User = ?';
  db.execute(query, [username], (err, results) => {
    if (err) {
      console.error('❌ Erreur SQL verify-user :', err);
      return res.status(500).json({ success: false, error: 'Erreur SQL' });
    }
    if (results.length === 0) {
      return res.status(404).json({ success: false, error: 'Utilisateur introuvable.' });
    }
    res.status(200).json({ success: true });
  });
});

// 🔹 Réinitialiser le mot de passe (reset-password)
router.post('/reset-password', (req, res) => {
  const { username, newPassword } = req.body;
  if (!username || !newPassword) {
    return res.status(400).json({ success: false, error: 'Nom d’utilisateur et nouveau mot de passe requis.' });
  }
  const query = 'UPDATE Personnel SET Password = ? WHERE User = ?';
  db.execute(query, [newPassword, username], (err, result) => {
    if (err) {
      console.error('❌ Erreur SQL reset-password :', err);
      return res.status(500).json({ success: false, error: 'Erreur SQL' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Utilisateur introuvable.' });
    }
    res.status(200).json({ success: true });
  });
});

module.exports = router;
