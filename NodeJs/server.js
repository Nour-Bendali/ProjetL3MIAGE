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
  password: 'MdMNB01010192@', // ⚠️ Spécifiez le mot de passe si nécessaire
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
  //const query = 'SELECT * FROM Utilisateurs WHERE Mail = ? AND Password = ?'; **JULIAN 29/04 Modification avec la bonne table 
  const query = 'SELECT * FROM Personnel WHERE User = ? AND Password = ?';

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
📋 Route POST : /api/projets
Cette route permet à un utilisateur de créer un nouveau projet.
Elle enregistre le projet dans la table Projets et associe l'utilisateur comme créateur.
**Ajouté le 01/05/25 pour le composant projet**
=====================================
*/
app.post('/api/projets', (req, res) => {
  const { nomProjet, description, createurId } = req.body;

  // ✅ Vérification des champs requis
  if (!nomProjet || !description || !createurId) {
    return res.status(400).json({
      success: false,
      error: 'Nom du projet, description et ID du créateur obligatoires.'
    });
  }

  // 🔎 Requête SQL pour insérer un nouveau projet
  const query = 'INSERT INTO Projets (NomProjet, Description, CreateurId, DateCreation) VALUES (?, ?, ?, CURDATE())';

  // 📡 Exécution de la requête SQL
  db.execute(query, [nomProjet, description, createurId], (err, result) => {
    if (err) {
      // ❌ Gestion des erreurs SQL
      console.error('❌ Erreur lors de la création du projet :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }

    // ✅ Projet créé avec succès
    console.log(`✅ Nouveau projet créé : ${nomProjet} par l'utilisateur ${createurId}`);
    res.status(201).json({ success: true, id: result.insertId, nomProjet, description });
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
        console.error('❌ Erreur lors de l\'ajout du membre :', err);
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
🚀 Démarrage du serveur Express
Le serveur écoute les requêtes entrantes sur le port spécifié.
=====================================
*/
app.listen(port, () => {
  console.log(`✅ Serveur en cours d'exécution sur : http://localhost:${port}`);
});

// 👥 Route GET : Récupérer tous les personnels avec leurs compétences
app.get('/api/personnel', (req, res) => {
  const query = `
    SELECT p.Identifiant, p.Nom, p.Prenom, p.User as email,
           GROUP_CONCAT(c.Competence) as competences
    FROM Personnel p
    LEFT JOIN CompetencesPersonnel cp ON p.Identifiant = cp.IdPersonnel
    LEFT JOIN Competences c ON cp.IdCompetence = c.IdentifiantC
    GROUP BY p.Identifiant
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Erreur lors de la récupération du personnel:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    
    const personnel = results.map(p => ({
      id: p.Identifiant,
      nom: p.Nom,
      prenom: p.Prenom,
      email: p.email,
      competences: p.competences ? p.competences.split(',') : []
    }));
    
    res.json(personnel);
  });
});

// 👥 Route POST : Ajouter un nouveau personnel
app.post('/api/personnel', (req, res) => {
  const { nom, prenom, email, competences } = req.body;
  
  db.beginTransaction(err => {
    if (err) {
      console.error('❌ Erreur de transaction:', err);
      return res.status(500).json({ error: err.message });
    }

    // Insérer le personnel
    const insertPersonnel = 'INSERT INTO Personnel (Nom, Prenom, User) VALUES (?, ?, ?)';
    db.query(insertPersonnel, [nom, prenom, email], (err, result) => {
      if (err) {
        return db.rollback(() => {
          console.error('❌ Erreur lors de l\'insertion du personnel:', err);
          res.status(500).json({ error: err.message });
        });
      }

      const personnelId = result.insertId;

      // Insérer les compétences
      if (competences && competences.length > 0) {
        const insertCompetences = 'INSERT INTO CompetencesPersonnel (IdPersonnel, IdCompetence) VALUES ?';
        const competenceValues = competences.map(c => [personnelId, c]);
        
        db.query(insertCompetences, [competenceValues], (err) => {
          if (err) {
            return db.rollback(() => {
              console.error('❌ Erreur lors de l\'insertion des compétences:', err);
              res.status(500).json({ error: err.message });
            });
          }

          db.commit(err => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json({ error: err.message });
              });
            }
            console.log('✅ Nouveau personnel ajouté avec succès');
            res.status(201).json({
              id: personnelId,
              nom,
              prenom,
              email,
              competences
            });
          });
        });
      }
    });
  });
});