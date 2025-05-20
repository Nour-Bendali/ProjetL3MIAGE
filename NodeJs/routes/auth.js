const express = require('express');
const router = express.Router();
const db = require('../db.js');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'RECRUIT_SECRET_KEY_JWT_2025'; // à stocker en .env plus tard

/*/ Route de login
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

module.exports = router;*/

// POST /api/auth/login
router.post('/login', (req, res) => {
  console.log('Login payload:', req.body); // Added: debug log incoming body
  const { User, password } = req.body; // Updated: use User field matching client payload
  if (!User || !password) { // Updated: validate both fields
    return res.status(400).json({ success: false, error: 'User et mot de passe requis.' });
  }

  const query = 'SELECT Identifiant, User, Password FROM personnel WHERE User = ?';
  db.execute(query, [User], (err, results) => {
    if (err) {
      console.error('Erreur SQL login :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    if (results.length === 0) {
      return res.status(401).json({ success: false, error: 'Utilisateur non trouvé.' });
    }

    const userRow = results[0];
    // Pour mot de passe en clair (non recommandé en prod)
    if (password !== userRow.Password) {
      return res.status(401).json({ success: false, error: 'Mot de passe incorrect.' });
    }

    // Génération du JWT
    const token = jwt.sign(
      { id: userRow.Identifiant, user: userRow.User },
      SECRET_KEY,
      { expiresIn: '2h' } // Restored original expiry
    );

    console.log('Login successful, issuing token for:', userRow.User); // Added: success log
    res.status(200).json({ success: true, token }); // Unchanged: return token with 200 status
  });
});

module.exports = router; // export router
