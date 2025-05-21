// imports
const express = require('express');
const router = express.Router();
const db = require('../db');                       // Instance pour exécuter des requêtes SQL
const jwt = require('jsonwebtoken');                // Pour générer des tokens JWT
const SECRET_KEY = 'RECRUIT_SECRET_KEY_JWT_2025';    // Clé secrète pour signer les JWT


/**
 
 * - Vérifie que les champs sont présents
 * - Vérifie l’existence de l’utilisateur en base
 * - Compare le mot de passe
 * - Génère et renvoie un JWT en cas de succès
 */
router.post('/login', (req, res) => {
  const { User, password } = req.body;

  // Validation des champs obligatoires
  if (!User || !password) {
    return res.status(400).json({ success: false, error: 'Champs User et password requis.' });
  }

  // Recherche de l’utilisateur par nom d’utilisateur
  const query = 'SELECT * FROM Personnel WHERE User = ?';
  db.execute(query, [User], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: 'Erreur SQL' });

    // Si aucun résultat, l’utilisateur n’existe pas
    if (results.length === 0) {
      return res.status(401).json({ success: false, error: 'Utilisateur introuvable.' });
    }

    const user = results[0];

    // Vérification du mot de passe
    if (user.Password !== password) {
      return res.status(401).json({ success: false, error: 'Mot de passe incorrect.' });
    }

    // Génération du token JWT 
    const token = jwt.sign(
      { id: user.Identifiant, user: user.User },
      SECRET_KEY,
      { expiresIn: '2h' }
    );

    console.log('Connexion réussie pour l’utilisateur ID :', user.Identifiant);
    res.status(200).json({ success: true, token });
  });
});


/**
 * Vérifie qu’un utilisateur existe avant réinitialisation du mot de passe.
 * - Si trouvé : renvoie success:true
 * - Sinon : erreur 404
 */

router.post('/verify-user', (req, res) => {
  const { username } = req.body;

  // Validation du champ username
  if (!username) {
    return res.status(400).json({ success: false, error: 'Nom d’utilisateur requis.' });
  }

  // Recherche de l’Identifiant en base
  const query = 'SELECT Identifiant FROM Personnel WHERE User = ?';
  db.execute(query, [username], (err, results) => {
    if (err) {
      console.error('Erreur SQL verify-user :', err);
      return res.status(500).json({ success: false, error: 'Erreur SQL' });
    }

    // Si aucun utilisateur trouvé
    if (results.length === 0) {
      return res.status(404).json({ success: false, error: 'Utilisateur introuvable.' });
    }

    console.log('Utilisateur trouvé pour réinitialisation : ID', results[0].Identifiant);
    res.status(200).json({ success: true });
  });
});


/**
 * Réinitialise le mot de passe d’un utilisateur.
 * - Met à jour la table Personnel
 * - Renvoie success:true si la mise à jour a affecté une ligne
 */

router.post('/reset-password', (req, res) => {
  const { username, newPassword } = req.body;

  // Vérification des champs
  if (!username || !newPassword) {
    return res.status(400).json({ success: false, error: 'Nom d’utilisateur et nouveau mot de passe requis.' });
  }

  // Requête de mise à jour du mot de passe
  const query = 'UPDATE Personnel SET Password = ? WHERE User = ?';
  db.execute(query, [newPassword, username], (err, result) => {
    if (err) {
      console.error('Erreur SQL reset-password :', err);
      return res.status(500).json({ success: false, error: 'Erreur SQL' });
    }

    // Aucun utilisateur mis à jour → introuvable
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Utilisateur introuvable.' });
    }

    console.log('Mot de passe réinitialisé pour :', username);
    res.status(200).json({ success: true });
  });
});

module.exports = router;
