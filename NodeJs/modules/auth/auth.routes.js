const express = require('express');
const router = express.Router();
const db = require('../../config/db');

// 🔐 Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, error: 'Email et mot de passe obligatoires.' });

  const query = 'SELECT * FROM Personnel WHERE User = ? AND Password = ?';
  db.execute(query, [email, password], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    if (results.length > 0) return res.json({ success: true });
    res.json({ success: false });
  });
});

// 🔍 Vérification d’utilisateur
router.post('/verify-user', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ success: false, error: 'Nom d\'utilisateur requis.' });

  const query = 'SELECT * FROM personnel WHERE User = ?';
  db.execute(query, [username], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: 'Erreur serveur.' });
    if (results.length > 0) return res.status(200).json({ success: true });
    res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
  });
});

// 🔐 Réinitialisation mot de passe
router.post('/reset-password', (req, res) => {
  const { username, newPassword } = req.body;
  if (!username || !newPassword) return res.status(400).json({ success: false, error: 'Champs requis.' });

  const query = 'UPDATE personnel SET Password = ? WHERE User = ?';
  db.execute(query, [newPassword, username], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: 'Erreur serveur.' });
    if (results.affectedRows === 0) return res.status(404).json({ success: false, error: 'Utilisateur non trouvé.' });
    res.status(200).json({ success: true });
  });
});

module.exports = router;
