const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Ajusta con tus credenciales MySQL:
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',           
  password: 'MdMNB01010192@',   // Cambia esto con tu contraseña real
  database: 'recruitmiage'   // Base de datos correcta

});

app.use(express.json());
app.use(cors());

// Ruta POST para autenticación
app.post('/login', (req, res) => {
  const { Mail, Motdepasse } = req.body;


  const query = 'SELECT * FROM Utilisateurs WHERE Mail = ? AND Motdepasse = ?'; // tabla "Utilisateurs", según tu elección previa

  db.execute(query, [Mail, Motdepasse], (err, results) => {
    if(err){
      console.error("Error en la consulta MySQL:", err); 

      return res.status(500).json({ success: false, error: err.message });
    }

    // Si 'results.length > 0', entonces existe un usuario con esas credenciales
    if (results.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en: http://localhost:${port}`);
});

// Route POST /api/register
app.post('/api/register', (req, res) => {
  const { Nom, Prenom, Mail, Motdepasse } = req.body;
  
  // Ajout de logs pour déboguer
  console.log('Données reçues:', req.body);
  console.log('Valeurs extraites:', { Nom, Prenom, Mail, Motdepasse });

  if (!Nom || !Prenom || !Mail || !Motdepasse) {
    console.log('Champs manquants:', {
      Nom: !!Nom,
      Prenom: !!Prenom,
      Mail: !!Mail,
      Motdepasse: !!Motdepasse
    });
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  const query = 'INSERT INTO Utilisateurs (Nom, Prenom, Mail, Motdepasse) VALUES (?, ?, ?, ?)';
  db.execute(query, [Nom, Prenom, Mail, Motdepasse], (err, result) => {
    if (err) {
      console.error('Erreur MySQL :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    res.status(201).json({ message: 'Utilisateur inscrit avec succès', id: result.insertId });
  });
});
