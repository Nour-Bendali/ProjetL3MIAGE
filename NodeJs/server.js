// backend/server.js

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
// Cette route permet à un utilisateur de se connecter avec un nom d'utilisateur et un mot de passe.
// Elle vérifie si les identifiants existent dans la base de données.
// =================================================================
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
      res.json({ success: true });
    } else {
      console.log(`❌ Identifiants incorrects pour : ${User}`);
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

app.post('/api/projets', (req, res) => {
  const { nomProjet, description, createurId } = req.body;

  if (!nomProjet || !description || !createurId) {
    return res.status(400).json({
      success: false,
      error: 'Nom du projet, description et ID du créateur obligatoires.'
    });
  }

  const query = 'INSERT INTO Projets (NomProjet, Description, CreateurId, DateCreation) VALUES (?, ?, ?, CURDATE())';

  db.execute(query, [nomProjet, description, createurId], (err, result) => {
    if (err) {
      console.error('❌ Erreur lors de la création du projet :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }

    console.log(`✅ Nouveau projet créé : ${nomProjet} par l'utilisateur ${createurId}`);
    res.status(201).json({ success: true, id: result.insertId, nomProjet, description });
  });
});

app.delete('/api/projets/:id', (req, res) => {
  const id = req.params.id;
  console.log("🛠️ ID reçu pour suppression :", id);

  const query = 'DELETE FROM Projets WHERE IdProjet = ?';

  db.execute(query, [id], (err, result) => {
    if (err) {
      console.error('❌ Erreur lors de la suppression du projet :', err);
      return res.status(500).send({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Projet non trouvé' });
    }

    res.status(200).send({ message: 'Projet supprimé' });
  });
});

/* 
=====================================
👥 Route POST : /api/projets/:id/membres
Cette route permet au créateur d'ajouter un membre à un projet.
Elle vérifie d'abord si l'utilisateur est le créateur du projet.
**Ajouté le 01/05/25 pour le composant projet**
=====================================
*/
app.post('/api/projets/:id/membres', (req, res) => {
  const { id } = req.params;
  const { idPersonnel, createurId } = req.body;

  // ✅ Vérification des champs requis
  if (!idPersonnel || !createurId) {
    return res.status(400).json({
      success: false,
      error: 'ID du membre et ID du créateur obligatoires.'
    });
  }

  // 🔎 Requête SQL pour vérifier si l'utilisateur est le créateur
  const checkCreatorQuery = 'SELECT CreateurId FROM Projets WHERE IdProjet = ?';

  db.execute(checkCreatorQuery, [id], (err, results) => {
    if (err) {
      // ❌ Gestion des erreurs SQL
      console.error('❌ Erreur lors de la vérification du créateur :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }

    if (results.length === 0 || results[0].CreateurId !== createurId) {
      // ❌ L'utilisateur n'est pas le créateur
      console.log(`❌ Tentative non autorisée d'ajout de membre par l'utilisateur ${createurId}`);
      return res.status(403).json({ success: false, error: 'Seul le créateur peut ajouter des membres.' });
    }

    // 🔎 Requête SQL pour ajouter un membre au projet
    const addMemberQuery = 'INSERT INTO ProjetsPersonnel (IdProjet, IdPersonnel) VALUES (?, ?)';
    db.execute(addMemberQuery, [id, idPersonnel], (err, result) => {
      if (err) {
        // ❌ Gestion des erreurs SQL
        console.error('❌ Erreur lors de l\`ajout du membre :', err);
        return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
      }

      // ✅ Membre ajouté avec succès
      console.log(`✅ Membre ${idPersonnel} ajouté au projet ${id}`);
      res.status(200).json({ success: true, message: 'Membre ajouté avec succès.' });
    });
  });
});

/*
=====================================
📋 Route GET : /api/projets
Cette route renvoie la liste de tous les projets.
**À ajouter pour éviter l'erreur 404 dans Angular**
=====================================
*/
app.get('/api/projets', (req, res) => {
  const query = 'SELECT * FROM Projets';

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Erreur lors de la récupération des projets :', err);
      return res.status(500).json({ success: false, error: 'Erreur serveur.' });
    }

    res.status(200).json(results);
  });
});


/*
=====================================
📋 Route GET : /api/projets
Cette route renvoie la liste de tous les projets.
**À ajouter pour éviter l'erreur 404 dans Angular**
=====================================
*/
app.get('/api/projets', (req, res) => {
  const query = 'SELECT * FROM Projets';

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Erreur lors de la récupération des projets :', err);
      return res.status(500).json({ success: false, error: 'Erreur serveur.' });
    }

    res.status(200).json(results);
  });
});


/* 
=====================================
📋 Route GET : /api/projets/:id
Cette route permet de récupérer les détails d'un projet, y compris ses membres et leurs compétences.
**Ajouté le 01/05/25 pour le composant projet**
=====================================
*/
app.get('/api/projets/:id', (req, res) => {
  const { id } = req.params;

  // 🔎 Requête SQL pour récupérer les informations du projet
  const projetQuery = 'SELECT * FROM Projets WHERE IdProjet = ?';
  const membresQuery = `
    SELECT p.Identifiant, p.Prenom, p.Nom, c.Competence
    FROM ProjetsPersonnel pp
    JOIN Personnel p ON pp.IdPersonnel = p.Identifiant
    LEFT JOIN CompetencesPersonnel cp ON p.Identifiant = cp.IdPersonnel
    LEFT JOIN Competences c ON cp.IdCompetence = c.IdentifiantC
    WHERE pp.IdProjet = ?
  `;

  // 📡 Récupération des détails du projet
  db.execute(projetQuery, [id], (err, projetResults) => {
    if (err) {
      // ❌ Gestion des erreurs SQL
      console.error('❌ Erreur lors de la récupération du projet :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }

    if (projetResults.length === 0) {
      // ❌ Projet non trouvé
      return res.status(404).json({ success: false, error: 'Projet non trouvé.' });
    }

    // 📡 Récupération des membres et de leurs compétences
    db.execute(membresQuery, [id], (err, membresResults) => {
      if (err) {
        // ❌ Gestion des erreurs SQL
        console.error('❌ Erreur lors de la récupération des membres :', err);
        return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
      }

      // ✅ Réponse avec les détails du projet et ses membres
      console.log(`✅ Détails du projet ${id} récupérés avec succès`);
      res.status(200).json({ success: true, projet: projetResults[0], membres: membresResults });
    });
  });
});

/* 
=====================================
👥 Route DELETE : /api/projets/:id/membres/:idPersonnel
Cette route permet au créateur de supprimer un membre d'un projet.
Elle vérifie d'abord si l'utilisateur est le créateur du projet.
**Ajouté le 01/05/25 pour le composant projet**
=====================================
*/
app.delete('/api/projets/:id/membres/:idPersonnel', (req, res) => {
  const { id, idPersonnel } = req.params;
  const { createurId } = req.body;

  // ✅ Vérification des champs requis
  if (!createurId) {
    return res.status(400).json({
      success: false,
      error: 'ID du créateur obligatoire.'
    });
  }

  // 🔎 Requête SQL pour vérifier si l'utilisateur est le créateur
  const checkCreatorQuery = 'SELECT CreateurId FROM Projets WHERE IdProjet = ?';

  db.execute(checkCreatorQuery, [id], (err, results) => {
    if (err) {
      // ❌ Gestion des erreurs SQL
      console.error('❌ Erreur lors de la vérification du créateur :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }

    if (results.length === 0 || results[0].CreateurId !== createurId) {
      // ❌ L'utilisateur n'est pas le créateur
      console.log(`❌ Tentative non autorisée de suppression de membre par l'utilisateur ${createurId}`);
      return res.status(403).json({ success: false, error: 'Seul le créateur peut supprimer des membres.' });
    }

    // 🔎 Requête SQL pour supprimer un membre du projet
    const removeMemberQuery = 'DELETE FROM ProjetsPersonnel WHERE IdProjet = ? AND IdPersonnel = ?';
    db.execute(removeMemberQuery, [id, idPersonnel], (err, result) => {
      if (err) {
        // ❌ Gestion des erreurs SQL
        console.error('❌ Erreur lors de la suppression du membre :', err);
        return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
      }

      // ✅ Membre supprimé avec succès
      console.log(`✅ Membre ${idPersonnel} supprimé du projet ${id}`);
      res.status(200).json({ success: true, message: 'Membre supprimé avec succès.' });
    });
  });
});

/*
=====================================
🔍 Route POST : /api/verify-user
Cette route permet de vérifier si un utilisateur existe dans la base de données
à partir de son nom d'utilisateur (User) fourni depuis Angular.
=====================================
*/
app.post('/api/verify-user', (req, res) => {
  const { username } = req.body;

  // ✅ Vérification du champ requis
  if (!username) {
    return res.status(400).json({
      success: false,
      error: 'Nom d\'utilisateur requis.'
    });
  }

  // 🔎 Requête SQL pour vérifier si le nom d'utilisateur existe
  const query = 'SELECT * FROM personnel WHERE User = ?';

  db.execute(query, [username], (err, results) => {
    if (err) {
      console.error('❌ Erreur MySQL :', err);
      return res.status(500).json({
        success: false,
        error: 'Erreur serveur.'
      });
    }

    if (results.length > 0) {
      console.log(`✅ Utilisateur trouvé : ${username}`);
      res.status(200).json({ success: true, message: 'Utilisateur trouvé' });
    } else {
      console.log(`❌ Utilisateur introuvable : ${username}`);
      res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    }
  });
});


/*
=====================================
🔐 Route POST : /api/reset-password
Cette route permet de mettre à jour le mot de passe d'un utilisateur
après qu'il a été vérifié via la procédure "mot de passe oublié".
=====================================
*/
app.post('/api/reset-password', (req, res) => {
  const { username, newPassword } = req.body;

  // ✅ Vérification des champs requis
  if (!username || !newPassword) {
    return res.status(400).json({
      success: false,
      error: 'Nom d\'utilisateur et nouveau mot de passe requis.'
    });
  }

  // 🔧 Requête SQL de mise à jour du mot de passe
  const query = 'UPDATE personnel SET Password = ? WHERE User = ?';

  db.execute(query, [newPassword, username], (err, results) => {
    if (err) {
      console.error('❌ Erreur MySQL :', err);
      return res.status(500).json({
        success: false,
        error: 'Erreur serveur.'
      });
    }

    if (results.affectedRows === 0) {
      console.log(`❌ Utilisateur non trouvé : ${username}`);
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé.'
      });
    }

    console.log(`✅ Mot de passe mis à jour pour : ${username}`);
    res.status(200).json({ success: true, message: 'Mot de passe mis à jour.' });
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

// 👥 Route GET : Récupérer tous les personnels avec leurs compétences
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
  const { prenom, nom, User, password } = req.body;

  if (!prenom || !nom || !User || !password) {
    return res.status(400).json({ success: false, error: 'Tous les champs sont obligatoires.' });
  }

  const query = 'INSERT INTO Personnel (Prenom, Nom, User, Password) VALUES (?, ?, ?, ?)';
  db.execute(query, [prenom, nom, User, password], (err, result) => {
    if (err) {
      console.error('❌ Erreur lors de lajout du membre :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.status(201).json({ success: true, id: result.insertId });
  });
});

// 📋 Route PUT : /api/personnel/:id
// Modifie les informations d'un membre existant.
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
// Récupère les détails d'un projet (nom, description, membres, missions).
app.get('/api/projets/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT p.NomProjet, p.Description,
           GROUP_CONCAT(CONCAT(per.Prenom, ' ', per.Nom, ' (User: ', per.User, ')')) as membres,
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
      console.error(' Erreur lors de la récupération du projet :', err);
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
      console.error('❌ Erreur lors de lajout du membre au projet :', err);
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
// Supprime un membre d'un projet (supprime une entrée de ProjetsPersonnel).
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
      console.error(' Erreur lors de la récupération des missions :', err);
      return res.status(500).json({ success: false, error: 'Erreur serveur.' });
    }

    res.json(results);
  });
});


// 📋 Route GET : /api/projets/:id/missions
// Récupère toutes les missions associées à un projet spécifique.
app.get('/api/projets/:id/missions', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT IdMission, Titre, Description, DateCreation
    FROM Missions
    WHERE IdProjet = ?
    ORDER BY DateCreation DESC
  `;
  db.execute(query, [id], (err, results) => {
    if (err) {
      console.error('❌ Erreur lors de la récupération des missions :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.status(200).json(results);
  });
});

// 📋 Route GET : /api/missions/:id/personnel
// Récupère tous les membres d'un projet lié à une mission spécifique.
app.get('/api/missions/:id/personnel', (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT per.Identifiant, per.Prenom, per.Nom, per.User
    FROM Missions m
    JOIN Projets p ON m.IdProjet = p.IdProjet
    JOIN ProjetsPersonnel pp ON p.IdProjet = pp.IdProjet
    JOIN Personnel per ON pp.IdPersonnel = per.Identifiant
    WHERE m.IdMission = ?
  `;

  db.execute(query, [id], (err, results) => {
    if (err) {
      console.error('❌ Erreur lors de la récupération des membres liés à la mission :', err);
      return res.status(500).json({ success: false, error: 'Erreur serveur.' });
    }

    res.status(200).json(results);
  });
});
