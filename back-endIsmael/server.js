const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

app.use(express.json()); // Pour parser les requêtes JSON

// Connexion à MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '@Ismaeliyo10', // Remplace par ton mot de passe
  database: 'recruitmiage'
});

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à MySQL :', err);
    return;
  }
  console.log('Connecté à MySQL !');
});

// Endpoint POST /api/register
app.post('/api/register', (req, res) => {
  const { nom, prenom, email, password } = req.body;

  // Vérification simple des données
  if (!nom || !prenom || !email || !password) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  // Insertion dans la base de données
  const query = 'INSERT INTO users (nom, prenom, email, password) VALUES (?, ?, ?, ?)';
  db.query(query, [nom, prenom, email, password], (err, result) => {
    if (err) {
      console.error('Erreur lors de l’inscription :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.status(201).json({ message: 'Utilisateur inscrit avec succès', id: result.insertId });
  });
});

// Endpoint POST /api/login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Vérification simple des données
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  // Vérification dans la base de données
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Erreur lors de la connexion :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    if (results.length > 0) {
      res.json({ message: 'Connexion réussie', user: results[0] });
    } else {
      res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
  });
});

// Route de test
app.get('/', (req, res) => {
  res.send('Hello World from Node.js with MySQL!');
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});