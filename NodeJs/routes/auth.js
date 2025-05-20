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

// 🔹 **Nouvelle route** : Vérification de l'existence d'un utilisateur pour "mot de passe oublié"
router.post('/verify-user', (req, res) => { // Added
  const { username } = req.body;             // Added
  if (!username) {                           // Added
    return res.status(400).json({ success: false, error: 'Nom d\'utilisateur requis.' }); // Added
  }
  const sql = 'SELECT Identifiant FROM Personnel WHERE User = ?'; // Added
  db.execute(sql, [username], (err, results) => {               // Added
    if (err) {                                                 // Added
      console.error('❌ Erreur SQL verify-user:', err);        // Added
      return res.status(500).json({ success: false, error: 'Erreur SQL' }); // Added
    }
    if (results.length === 0) {                                // Added
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé.' }); // Added
    }
    // Tout va bien : on renvoie success
    res.status(200).json({ success: true });                   // Added
  });
});

module.exports = router;
