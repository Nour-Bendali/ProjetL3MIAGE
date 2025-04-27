// 🌐 Importation des modules nécessaires
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

// 🔧 Initialisation de l'application Express
const app = express();
const port = 3000;

// 📦 Configuration de la connexion à la base de données MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // ⚠️ Spécifiez le mot de passe si nécessaire
  database: 'recruitmiage'
});

// 🛡️ Middleware pour activer CORS (Cross-Origin Resource Sharing)
// et pour permettre la réception de données JSON dans les requêtes
app.use(cors());
app.use(express.json());

/* 
=====================================
🔐 Route POST : /api/login
Cette route permet à un utilisateur de se connecter avec un email et un mot de passe.
Elle vérifie si les identifiants existent dans la base de données.
=====================================
*/
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // ✅ Vérification des champs requis
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email et mot de passe obligatoires.'
    });
  }

  // 🔎 Requête SQL pour rechercher un utilisateur correspondant
  const query = 'SELECT * FROM Utilisateurs WHERE Mail = ? AND Password = ?';

  // 📡 Exécution de la requête SQL
  db.execute(query, [email, password], (err, results) => {
    if (err) {
      // ❌ Gestion des erreurs SQL
      console.error('❌ Erreur lors de la requête MySQL :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }

    // ✅ Utilisateur trouvé
    if (results.length > 0) {
      console.log(`✅ Utilisateur authentifié : ${email}`);
      res.json({ success: true });
    } else {
      // ❌ Aucun utilisateur ne correspond aux identifiants
      console.log(`❌ Identifiants incorrects pour : ${email}`);
      res.json({ success: false });
    }
  });
});

/*
=====================================
🚀 Démarrage du serveur Express
Le serveur écoute les requêtes entrantes sur le port spécifié.
=====================================
*/
app.listen(port, () => {
  console.log(`✅ Serveur en cours d'exécution sur : http://localhost:${port}`);
});
