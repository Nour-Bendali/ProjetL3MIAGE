// backend/server.js

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

// 🛡️ Middleware pour activer CORS et recevoir des données JSON
app.use(cors());
app.use(express.json());

// Connexion à la base de données MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '@Ismaeliyo10',
  database: 'recruitmiage'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Erreur de connexion à la base de données :', err);
    return;
  }
  console.log('✅ Connexion à la base de données établie');
});

// 🔐 Route POST : /api/login
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

// 📋 Route POST : /api/projets
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

// 📋 Route DELETE : /api/projets/:id
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

// 📋 Route GET : /api/projets
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

// 📋 Route GET : /api/projets/:id
app.get('/api/projets/:id', (req, res) => {
  const { id } = req.params;

  const projetQuery = 'SELECT * FROM Projets WHERE IdProjet = ?';
  const membresQuery = `
    SELECT p.Identifiant, p.Prenom, p.Nom, p.User, GROUP_CONCAT(c.Competence) as Competences
    FROM ProjetsPersonnel pp
    JOIN Personnel p ON pp.IdPersonnel = p.Identifiant
    LEFT JOIN CompetencesPersonnel cp ON p.Identifiant = cp.IdPersonnel
    LEFT JOIN Competences c ON cp.IdCompetence = c.IdentifiantC
    WHERE pp.IdProjet = ?
    GROUP BY p.Identifiant
  `;

  db.execute(projetQuery, [id], (err, projetResults) => {
    if (err) {
      console.error('❌ Erreur lors de la récupération du projet :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }

    if (projetResults.length === 0) {
      return res.status(404).json({ success: false, error: 'Projet non trouvé.' });
    }

    db.execute(membresQuery, [id], (err, membresResults) => {
      if (err) {
        console.error('❌ Erreur lors de la récupération des membres :', err);
        return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
      }

      console.log(`✅ Détails du projet ${id} récupérés avec succès`);
      res.status(200).json({ success: true, projet: projetResults[0], membres: membresResults });
    });
  });
});

// 👥 Route POST : /api/projets/:id/membres
app.post('/api/projets/:id/membres', (req, res) => {
  const { id } = req.params;
  const { idPersonnel, createurId } = req.body;

  if (!idPersonnel || !createurId) {
    return res.status(400).json({
      success: false,
      error: 'ID du membre et ID du créateur obligatoires.'
    });
  }

  const checkCreatorQuery = 'SELECT CreateurId FROM Projets WHERE IdProjet = ?';
  db.execute(checkCreatorQuery, [id], (err, results) => {
    if (err) {
      console.error('❌ Erreur lors de la vérification du créateur :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }

    if (results.length === 0 || results[0].CreateurId !== createurId) {
      console.log(`❌ Tentative non autorisée d'ajout de membre par l'utilisateur ${createurId}`);
      return res.status(403).json({ success: false, error: 'Seul le créateur peut ajouter des membres.' });
    }

    const addMemberQuery = 'INSERT INTO ProjetsPersonnel (IdProjet, IdPersonnel) VALUES (?, ?)';
    db.execute(addMemberQuery, [id, idPersonnel], (err, result) => {
      if (err) {
        console.error('❌ Erreur lors de l\'ajout du membre :', err);
        return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
      }

      console.log(`✅ Membre ${idPersonnel} ajouté au projet ${id}`);
      res.status(200).json({ success: true, message: 'Membre ajouté avec succès.' });
    });
  });
});

// 👥 Route DELETE : /api/projets/:id/membres/:idPersonnel
app.delete('/api/projets/:id/membres/:idPersonnel', (req, res) => {
  const { id, idPersonnel } = req.params;
  const { createurId } = req.body;

  if (!createurId) {
    return res.status(400).json({
      success: false,
      error: 'ID du créateur obligatoire.'
    });
  }

  const checkCreatorQuery = 'SELECT CreateurId FROM Projets WHERE IdProjet = ?';
  db.execute(checkCreatorQuery, [id], (err, results) => {
    if (err) {
      console.error('❌ Erreur lors de la vérification du créateur :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }

    if (results.length === 0 || results[0].CreateurId !== createurId) {
      console.log(`❌ Tentative non autorisée de suppression de membre par l'utilisateur ${createurId}`);
      return res.status(403).json({ success: false, error: 'Seul le créateur peut supprimer des membres.' });
    }

    const removeMemberQuery = 'DELETE FROM ProjetsPersonnel WHERE IdProjet = ? AND IdPersonnel = ?';
    db.execute(removeMemberQuery, [id, idPersonnel], (err, result) => {
      if (err) {
        console.error('❌ Erreur lors de la suppression du membre :', err);
        return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
      }

      console.log(`✅ Membre ${idPersonnel} supprimé du projet ${id}`);
      res.status(200).json({ success: true, message: 'Membre supprimé avec succès.' });
    });
  });
});

// 📋 Route GET : /api/projets/:id/membres
app.get('/api/projets/:id/membres', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT p.Identifiant, p.Prenom, p.Nom, p.User, GROUP_CONCAT(c.Competence) as Competences
    FROM ProjetsPersonnel pp
    JOIN Personnel p ON pp.IdPersonnel = p.Identifiant
    LEFT JOIN CompetencesPersonnel cp ON p.Identifiant = cp.IdPersonnel
    LEFT JOIN Competences c ON cp.IdCompetence = c.IdentifiantC
    WHERE pp.IdProjet = ?
    GROUP BY p.Identifiant
  `;
  db.execute(query, [id], (err, results) => {
    if (err) {
      console.error('❌ Erreur lors de la récupération des membres :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.status(200).json(results);
  });
});

// 🔍 Route POST : /api/verify-user
app.post('/api/verify-user', (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({
      success: false,
      error: 'Nom d\'utilisateur requis.'
    });
  }

  const query = 'SELECT * FROM Personnel WHERE User = ?';
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

// 🔐 Route POST : /api/reset-password
app.post('/api/reset-password', (req, res) => {
  const { username, newPassword } = req.body;

  if (!username || !newPassword) {
    return res.status(400).json({
      success: false,
      error: 'Nom d\'utilisateur et nouveau mot de passe requis.'
    });
  }

  const query = 'UPDATE Personnel SET Password = ? WHERE User = ?';
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

// 📋 Route GET : /api/personnel
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
app.post('/api/personnel', (req, res) => {
  const { prenom, nom, User, password } = req.body;

  if (!prenom || !nom || !User || !password) {
    return res.status(400).json({ success: false, error: 'Tous les champs sont obligatoires.' });
  }

  const query = 'INSERT INTO Personnel (Prenom, Nom, User, Password) VALUES (?, ?, ?, ?)';
  db.execute(query, [prenom, nom, User, password], (err, result) => {
    if (err) {
      console.error('❌ Erreur lors de l\'ajout du membre :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.status(201).json({ success: true, id: result.insertId });
  });
});

// 📋 Route PUT : /api/personnel/:id
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
      console.error('❌ Erreur lors de l\'ajout du membre au projet :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }

    res.status(201).json({ success: true });
  });
});

// 📋 Route DELETE : /api/projets/:id/personnel/:idPersonnel
app.delete('/api/projets/:id/personnel/:idPersonnel', (req, res) => {
  const { id, idPersonnel } = req.params;
  const query = 'DELETE FROM ProjetsPersonnel WHERE IdProjet = ? AND IdPersonnel = ?';
  db.execute(query, [id, idPersonnel], (err) => {
    if (err) {
      console.error('❌ Erreur lors de la suppression du membre du projet :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.status(200).json({ success: true });
  });
});

// 🚀 Route POST : /api/missions
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

// 📋 Route GET : /api/missions
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

// 📋 Route GET : /api/projets/:id/missions
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

// 🚀 Démarrage du serveur Express
app.listen(port, () => {
  console.log(`✅ Serveur en cours d'exécution sur : http://localhost:${port}`);
});