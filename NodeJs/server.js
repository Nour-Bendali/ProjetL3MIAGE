// backend/serverMerged.js

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;


// 🛡️ Middleware pour activer CORS (Cross-Origin Resource Sharing)
// et pour permettre la réception de données JSON dans les requêtes
app.use(cors());
app.use(express.json());

// Connexion à la base de données MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Mot de passe MySQL
  database: 'recruitmiage' // Nom de la base de données
});

db.connect((err) => {
  if (err) {
    console.error('❌ Erreur de connexion à la base de données :', err);
    return;
  }
  console.log('✅ Connexion à la base de données établie');
});

// =============================================================
// 🧩 LOGIN COMPONENT
// =============================================================

app.post('/api/login', (req, res) => {
  const { User, password } = req.body;

  if (!User || !password) {
    return res.status(400).json({
      success: false,
      error: 'User et mot de passe obligatoires.'
    });
  }

  const query = 'SELECT * FROM Personnel WHERE User = ? AND Password = ?';
  db.execute(query, [User, password], (err, results) => {
    if (err) {
      console.error('❌ Erreur lors de la requête MySQL :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }

    if (results.length > 0) {
      console.log(`✅ Utilisateur authentifié : ${User}`);
      res.json({ success: true, userId: results[0].Identifiant });
    } else {
      console.log(`❌ Identifiants incorrects pour : ${User}`);
      res.json({ success: false });
    }
  });
});

app.post('/api/verify-user', (req, res) => {
  const { User } = req.body;
  const query = 'SELECT * FROM Personnel WHERE User = ?';
  db.execute(query, [User], (err, results) => {
    if (err) {
      console.error('❌ Erreur lors de la vérification de l’utilisateur :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.json({ exists: results.length > 0 });
  });
});

app.post('/api/reset-password', (req, res) => {
  const { User, newPassword } = req.body;
  const query = 'UPDATE Personnel SET Password = ? WHERE User = ?';
  db.execute(query, [newPassword, User], (err) => {
    if (err) {
      console.error('❌ Erreur lors de la réinitialisation du mot de passe :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.json({ success: true });
  });
});

// =============================================================
// 🧩 PERSONNEL COMPONENT
// =============================================================

// 📋 Route GET : /api/personnel
app.get('/api/personnel', (req, res) => {
  const query = `
    SELECT p.Identifiant, p.Prenom, p.Nom, p.User, GROUP_CONCAT(c.Competence) as Competences
    FROM Personnel p
    LEFT JOIN CompetencesPersonnel cp ON p.Identifiant = cp.IdPersonnel
    LEFT JOIN Competences c ON cp.IdCompetence = c.IdentifiantC
    GROUP BY p.Identifiant`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Erreur lors de la récupération du personnel :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.status(200).json(results);
  });
});

// ➕ Route POST : /api/personnel
app.post('/api/personnel', (req, res) => {
  const { Prenom, Nom, User, Password } = req.body;
  const query = 'INSERT INTO Personnel (Prenom, Nom, User, Password) VALUES (?, ?, ?, ?)';
  db.execute(query, [Prenom, Nom, User, Password], (err, result) => {
    if (err) {
      console.error('❌ Erreur lors de l’ajout du personnel :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.status(201).json({ success: true, id: result.insertId });
  });
});

// ✏️ Route PUT : /api/personnel/:id
app.put('/api/personnel/:id', (req, res) => {
  const { id } = req.params;
  const { Prenom, Nom, User } = req.body;
  const query = 'UPDATE Personnel SET Prenom = ?, Nom = ?, User = ? WHERE Identifiant = ?';
  db.execute(query, [Prenom, Nom, User, id], (err) => {
    if (err) {
      console.error('❌ Erreur lors de la mise à jour du personnel :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.json({ success: true });
  });
});

// 🗑️ Route DELETE : /api/personnel/:id
app.delete('/api/personnel/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Personnel WHERE Identifiant = ?';
  db.execute(query, [id], (err) => {
    if (err) {
      console.error('❌ Erreur lors de la suppression du personnel :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.json({ success: true });
  });
});

// =============================================================
// 🧩 COMPETENCES COMPONENT
// =============================================================

// 📋 Route GET : /api/competences
app.get('/api/competences', (req, res) => {
  const query = 'SELECT * FROM Competences';

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Erreur lors de la récupération des compétences :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.status(200).json(results);
  });
});

// =============================================================
// 🧩 PROJETS COMPONENT
// =============================================================

// 📋 Route GET : /api/projets
app.get('/api/projets', (req, res) => {
  const query = 'SELECT * FROM Projets';

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Erreur lors de la récupération des projets :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.status(200).json(results);
  });
});

// 📋 Route GET : /api/projets/:id
app.get('/api/projets/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM Projets WHERE IdProjet = ?';
  db.execute(query, [id], (err, results) => {
    if (err) {
      console.error('❌ Erreur lors de la récupération du projet :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.status(200).json(results[0]);
  });
});

// ➕ Route POST : /api/projets
app.post('/api/projets', (req, res) => {
  const { NomProjet, Description, CreateurId } = req.body;
  const query = 'INSERT INTO Projets (NomProjet, Description, CreateurId) VALUES (?, ?, ?)';
  db.execute(query, [NomProjet, Description, CreateurId], (err, result) => {
    if (err) {
      console.error('❌ Erreur lors de la création du projet :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.status(201).json({ success: true, id: result.insertId });
  });
});

// 🗑️ Route DELETE : /api/projets/:id
app.delete('/api/projets/:id', (req, res) => {
  const { id } = req.params;
  console.log('🛠️ ID reçu pour suppression :', id);
  const query = 'DELETE FROM Projets WHERE IdProjet = ?';
  db.execute(query, [id], (err) => {
    if (err) {
      console.error('❌ Erreur lors de la suppression du projet :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.json({ success: true });
  });
});

// ➕ Route POST : /api/projets/:id/membres
app.post('/api/projets/:id/membres', (req, res) => {
  const { id } = req.params;
  const { IdentifiantPersonnel } = req.body;
  const query = 'INSERT INTO ProjetsPersonnel (IdProjet, IdentifiantPersonnel) VALUES (?, ?)';
  db.execute(query, [id, IdentifiantPersonnel], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        console.warn('⚠️ Ce membre est déjà dans le projet.');
        return res.status(409).json({ success: false, error: 'Le membre est déjà dans ce projet.' });
      }
      console.error('❌ Erreur lors de l’ajout du membre au projet :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.status(201).json({ success: true });
  });
});

// 🗑️ Route DELETE : /api/projets/:id/membres/:idPersonnel
app.delete('/api/projets/:id/membres/:idPersonnel', (req, res) => {
  const { id, idPersonnel } = req.params;
  const query = 'DELETE FROM ProjetsPersonnel WHERE IdProjet = ? AND IdentifiantPersonnel = ?';
  db.execute(query, [id, idPersonnel], (err) => {
    if (err) {
      console.error('❌ Erreur lors de la suppression du membre du projet :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.json({ success: true });
  });
});

// ➕ Route POST : /api/projets/:id/personnel
app.post('/api/projets/:id/personnel', (req, res) => {
  const { id } = req.params;
  const { IdentifiantPersonnel } = req.body;

  // Vérifier que l’utilisateur est bien créateur du projet
  const checkCreatorQuery = 'SELECT CreateurId FROM Projets WHERE IdProjet = ?';
  db.execute(checkCreatorQuery, [id], (err, results) => {
    if (err) {
      console.error('❌ Erreur lors de la vérification du créateur :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }

    if (results.length === 0 || results[0].CreateurId !== IdentifiantPersonnel) {
      console.log(`❌ Tentative non autorisée d\'ajout de membre par l\'utilisateur ${IdentifiantPersonnel}`);
      return res.status(403).json({ success: false, error: 'Seul le créateur peut ajouter des membres.' });
    }

    const insertQuery = 'INSERT INTO ProjetsPersonnel (IdProjet, IdentifiantPersonnel) VALUES (?, ?)';
    db.execute(insertQuery, [id, IdentifiantPersonnel], (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          console.warn('⚠️ Ce membre est déjà dans le projet.');
          return res.status(409).json({ success: false, error: 'Le membre est déjà dans ce projet.' });
        }
        console.error('❌ Erreur lors de l\'ajout du membre au projet :', err);
        return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
      }
      res.status(201).json({ success: true });
    });
  });
});

// 🗑️ Route DELETE : /api/projets/:id/personnel/:idPersonnel
app.delete('/api/projets/:id/personnel/:idPersonnel', (req, res) => {
  const { id, idPersonnel } = req.params;
  const query = 'DELETE FROM ProjetsPersonnel WHERE IdProjet = ? AND IdentifiantPersonnel = ?';
  db.execute(query, [id, idPersonnel], (err) => {
    if (err) {
      console.error('❌ Erreur lors de la suppression du membre du projet :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.status(200).json({ success: true });
  });
});

// =============================================================
// 🧩 MISSIONS COMPONENT
// =============================================================

// 📋 Route GET : /api/missions
app.get('/api/missions', (req, res) => {
  const query = 'SELECT * FROM Missions';
  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Erreur lors de la récupération des missions :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.status(200).json(results);
  });
});

// 📋 Route GET : /api/missions/:id/personnel
app.get('/api/missions/:id/personnel', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT p.Identifiant, p.Prenom, p.Nom, p.User
    FROM Personnel p
    INNER JOIN MissionsPersonnel mp ON p.Identifiant = mp.IdPersonnel
    WHERE mp.IdMission = ?`;
  db.execute(query, [id], (err, results) => {
    if (err) {
      console.error('❌ Erreur lors de la récupération du personnel de la mission :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.status(200).json(results);
  });
});

// ➕ Route POST : /api/missions
app.post('/api/missions', (req, res) => {
  const { NomMission, IdProjet } = req.body;
  const query = 'INSERT INTO Missions (NomMission, IdProjet) VALUES (?, ?)';
  db.execute(query, [NomMission, IdProjet], (err, result) => {
    if (err) {
      console.error('❌ Erreur lors de la création de la mission :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.status(201).json({ success: true, id: result.insertId });
  });
});

// ➕ Route POST : /api/missions/:id/assign
app.post('/api/missions/:id/assign', (req, res) => {
  const { id } = req.params;
  const { IdPersonnel } = req.body;
  const query = 'INSERT INTO MissionsPersonnel (IdMission, IdPersonnel) VALUES (?, ?)';
  db.execute(query, [id, IdPersonnel], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        console.warn('⚠️ Ce membre est déjà assigné à la mission.');
        return res.status(409).json({ success: false, error: 'Ce membre est déjà assigné à cette mission.' });
      }
      console.error('❌ Erreur lors de l\'assignation de la mission :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.status(201).json({ success: true });
  });
});

// ➕ Route POST : /api/missions/:id/competences
app.post('/api/missions/:id/competences', (req, res) => {
  const { id } = req.params;
  const { idCompetence } = req.body;
  const query = 'INSERT INTO CompetencesMissions (IdMission, IdCompetence) VALUES (?, ?)';
  db.execute(query, [id, idCompetence], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        console.warn(`⚠️ La compétence ${idCompetence} est déjà assignée à la mission ${id}.`);
        return res.status(409).json({ success: false, error: 'La compétence est déjà assignée à cette mission.' });
      }
      console.error('❌ Erreur lors de l’affectation de la compétence :', err);
      return res.status(500).json({ success: false, error: 'Erreur serveur.' });
    }

    res.status(201).json({ success: true, message: 'Compétence assignée avec succès.' });
  });
});

// 📋 Route GET : /api/projets/:id/missions
app.get('/api/projets/:id/missions', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM Missions WHERE IdProjet = ?';
  db.execute(query, [id], (err, results) => {
    if (err) {
      console.error('❌ Erreur lors de la récupération des missions du projet :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.status(200).json(results);
  });
});

// =============================================================
// 🚀 LANCEMENT DU SERVEUR
// =============================================================

app.listen(port, () => {
  console.log(`✅ Serveur en cours d'exécution sur : http://localhost:${port}`);
});
