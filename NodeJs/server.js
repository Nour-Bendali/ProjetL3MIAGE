// backend/server.js

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();


// 🛡️ Middleware pour activer CORS (Cross-Origin Resource Sharing)
// et pour permettre la réception de données JSON dans les requêtes
app.use(cors());
app.use(express.json());

// Connexion à la base de données MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Mot de passe MySQL
  database: 'recruitmiage'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Erreur de connexion à la base de données :', err);
    return;
  }
  console.log('✅ Connexion à la base de données établie');
});

// =================================================================
// 🔐 Route POST : /api/login
// Cette route permet à un utilisateur de se connecter avec un email et un mot de passe.
// Elle vérifie si les identifiants existent dans la base de données.
// =================================================================
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email et mot de passe obligatoires.'
    });
  }

  const query = 'SELECT * FROM Personnel WHERE User = ? AND Password = ?';
  db.execute(query, [email, password], (err, results) => {
    if (err) {
      console.error('❌ Erreur lors de la requête MySQL :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }

    if (results.length > 0) {
      console.log(`✅ Utilisateur authentifié : ${email}`);
      res.json({ success: true });
    } else {
      console.log(`❌ Identifiants incorrects pour : ${email}`);
      res.json({ success: false });
    }
  });
});

// =================================================================
// 📋 Routes pour le composant Personnel
// Ces routes gèrent l'affichage, l'ajout, la modification et la suppression des membres.
// Elles seront extraites dans un fichier personnel.js par Nour plus tard.
// Prérequis : Tables Personnel, Competences, CompetencesPersonnel
// =================================================================

// 📋 Route GET : /api/personnel
// Récupère tous les membres avec leurs compétences (jointure avec CompetencesPersonnel).
app.get('/api/personnel', (req, res) => {
  const query = `
    SELECT p.Identifiant, p.Prenom, p.Nom, p.User, GROUP_CONCAT(c.Competence) as Competences
    FROM Personnel p
    LEFT JOIN CompetencesPersonnel cp ON p.Identifiant = cp.IdPersonnel
    LEFT JOIN Competences c ON cp.IdCompetence = c.IdentifiantC
    GROUP BY p.Identifiant
  `;

  db.execute(query, (err, results) => {
    if (err) {
      console.error('❌ Erreur lors de la récupération des membres :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.status(200).json(results);
  });
});

// 📋 Route POST : /api/personnel
// Ajoute un nouveau membre dans la table Personnel.
app.post('/api/personnel', (req, res) => {
  const { prenom, nom, email, password } = req.body;

  if (!prenom || !nom || !email || !password) {
    return res.status(400).json({ success: false, error: 'Tous les champs sont obligatoires.' });
  }

  const query = 'INSERT INTO Personnel (Prenom, Nom, User, Password) VALUES (?, ?, ?, ?)';
  db.execute(query, [prenom, nom, email, password], (err, result) => {
    if (err) {
      console.error('❌ Erreur lors de l’ajout du membre :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.status(201).json({ success: true, id: result.insertId });
  });
});

// 📋 Route PUT : /api/personnel/:id
// Modifie les informations d’un membre existant.
app.put('/api/personnel/:id', (req, res) => {
  const { id } = req.params;
  const { Prenom, Nom, User } = req.body;

  if (!Prenom || !Nom || !User) {
    return res.status(400).json({ success: false, error: 'Tous les champs sont obligatoires.' });
  }

  const query = 'UPDATE Personnel SET Prenom = ?, Nom = ?, User = ? WHERE Identifiant = ?';
  db.execute(query, [Prenom, Nom, User, id], (err) => {
    if (err) {
      console.error('❌ Erreur lors de la modification du membre :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.status(200).json({ success: true });
  });
});

// 📋 Route DELETE : /api/personnel/:id
// Supprime un membre de la table Personnel.
app.delete('/api/personnel/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM Personnel WHERE Identifiant = ?';
  db.execute(query, [id], (err) => {
    if (err) {
      console.error('❌ Erreur lors de la suppression du membre :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.status(200).json({ success: true });
  });
});

// =================================================================
// 📋 Routes pour le composant Projet
// Ces routes gèrent l'affichage, l'ajout et la suppression des membres associés à un projet.
// Prérequis : Tables Projets, ProjetsPersonnel, Missions, Personnel
// =================================================================

// 📋 Route GET : /api/projets/:id
// Récupère les détails d’un projet (nom, description, membres, missions).
app.get('/api/projets/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT p.NomProjet, p.Description,
           GROUP_CONCAT(CONCAT(per.Prenom, ' ', per.Nom, ' (Email: ', per.User, ')')) as membres,
           GROUP_CONCAT(m.Titre) as missions
    FROM Projets p
    LEFT JOIN ProjetsPersonnel pp ON p.IdProjet = pp.IdProjet
    LEFT JOIN Personnel per ON pp.IdentifiantPersonnel = per.Identifiant
    LEFT JOIN Missions m ON p.IdProjet = m.IdProjet
    WHERE p.IdProjet = ?
    GROUP BY p.IdProjet
  `;
  db.execute(query, [id], (err, results) => {
    if (err) {
      console.error('❌ Erreur lors de la récupération du projet :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    const projet = results[0] || {};
    // Formater les champs membres et missions en tableaux
    projet.membres = projet.membres ? projet.membres.split(',') : [];
    projet.missions = projet.missions ? projet.missions.split(',') : [];
    res.status(200).json(projet);
  });
});

// 📋 Route POST : /api/projets
// Crée un nouveau projet dans la base de données
app.post('/api/projets', (req, res) => {
  const { nomProjet, description, createurId } = req.body;

  if (!nomProjet || !description || !createurId) {
    return res.status(400).json({ success: false, error: 'Champs requis manquants.' });
  }

  const query = 'INSERT INTO Projets (NomProjet, Description, CreateurId, DateCreation) VALUES (?, ?, ?, CURDATE())';

  db.execute(query, [nomProjet, description, createurId], (err, result) => {
    if (err) {
      console.error('❌ Erreur lors de la création du projet :', err);
      return res.status(500).json({ success: false, error: 'Erreur serveur.' });
    }

    console.log('✅ Nouveau projet créé :', nomProjet);
    res.status(201).json({ success: true, id: result.insertId });
  });
});


// 📋 Route POST : /api/projets/:id/personnel
app.post('/api/projets/:id/personnel', (req, res) => {
  const { id } = req.params;
  const { idPersonnel } = req.body;

  if (!idPersonnel) {
    return res.status(400).json({ success: false, error: 'idPersonnel est requis.' });
  }

  const query = 'INSERT INTO ProjetsPersonnel (IdProjet, IdPersonnel) VALUES (?, ?)';
  db.execute(query, [id, idPersonnel], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        console.warn(`⚠️ Le membre ${idPersonnel} est déjà assigné au projet ${id}`);
        return res.status(409).json({ success: false, error: 'Le membre est déjà assigné à ce projet.' });
      }

      console.error('❌ Erreur lors de l’ajout du membre au projet :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }

    res.status(201).json({ success: true });
  });
});



// 📋 Route GET : /api/projets
// Récupère la liste de tous les projets pour le select du formulaire de mission
app.get('/api/projets', (req, res) => {
  const query = 'SELECT IdProjet, NomProjet, Description FROM Projets';

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Erreur lors de la récupération des projets :', err);
      return res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur lors de la récupération des projets.'
      });
    }

    if (results.length === 0) {
      console.warn('⚠️ Aucun projet trouvé dans la base de données.');
      return res.status(200).json({ success: true, projets: [] });
    }

    console.log(`✅ ${results.length} projets récupérés avec succès.`);
    res.status(200).json({ success: true, projets: results });
  });
});



// 📋 Route DELETE : /api/projets/:id/personnel/:idPersonnel
// Supprime un membre d’un projet (supprime une entrée de ProjetsPersonnel).
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

// Démarrer le serveur
const port = 3000;
app.listen(port, () => {
  console.log(`✅ Serveur en cours d'exécution sur : http://localhost:${port}`);
});
/*
=====================================
🚀 Route POST : /api/missions
Cette route permet de créer une nouvelle mission et l'associer à un projet.
=====================================
*/
app.post('/api/missions', (req, res) => {
  const { idProjet, titre, description } = req.body;

  if (!idProjet || !titre) {
    return res.status(400).json({
      success: false,
      error: 'Id du projet et titre de la mission sont obligatoires.'
    });
  }

  const query = `
    INSERT INTO Missions (IdProjet, Titre, Description)
    VALUES (?, ?, ?)
  `;

  db.execute(query, [idProjet, titre, description], (err, result) => {
    if (err) {
      console.error('❌ Erreur lors de la création de la mission :', err);
      return res.status(500).json({ success: false, error: 'Erreur serveur.' });
    }

    console.log(`✅ Mission "${titre}" créée pour le projet ${idProjet}`);
    res.status(201).json({ success: true, id: result.insertId });
  });
});

/*
=====================================
📋 Route GET : /api/missions
Cette route retourne toutes les missions enregistrées dans la base de données.
=====================================
*/
app.get('/api/missions', (req, res) => {
  const query = `
    SELECT m.*, p.NomProjet
    FROM Missions m
    JOIN Projets p ON m.IdProjet = p.IdProjet
    ORDER BY m.DateCreation DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Erreur lors de la récupération des missions :', err);
      return res.status(500).json({ success: false, error: 'Erreur serveur.' });
    }

    res.json(results);
  });
});
