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
  password: 'MdMNB01010192@', // Mot de passe MySQL
  database: 'recruitmiage'
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
      console.error('❌ Erreur lors de la vérification de l\'utilisateur :', err);
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

app.post('/api/personnel', (req, res) => {
  const { Prenom, Nom, User, Password } = req.body;

  if (!Prenom || !Nom || !User || !Password) {
    return res.status(400).json({ success: false, error: 'Tous les champs sont obligatoires.' });
  }

  const query = 'INSERT INTO Personnel (Prenom, Nom, User, Password) VALUES (?, ?, ?, ?)';
  db.execute(query, [Prenom, Nom, User, Password], (err, result) => {
    if (err) {
      console.error('❌ Erreur lors de l\'ajout du personnel :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.status(201).json({ success: true, id: result.insertId });
  });
});

app.put('/api/personnel/:id', (req, res) => {
  const { id } = req.params;
  const { Prenom, Nom, User } = req.body;

  if (!Prenom || !Nom || !User) {
    return res.status(400).json({ success: false, error: 'Tous les champs sont obligatoires.' });
  }

  const query = 'UPDATE Personnel SET Prenom = ?, Nom = ?, User = ? WHERE Identifiant = ?';
  db.execute(query, [Prenom, Nom, User, id], (err) => {
    if (err) {
      console.error('❌ Erreur lors de la mise à jour du personnel :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.json({ success: true });
  });
});

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

app.get('/api/projets/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT p.*, 
           GROUP_CONCAT(DISTINCT CONCAT(per.Prenom, ' ', per.Nom)) as membres,
           GROUP_CONCAT(DISTINCT m.Titre) as missions
    FROM Projets p
    LEFT JOIN ProjetsPersonnel pp ON p.IdProjet = pp.IdProjet
    LEFT JOIN Personnel per ON pp.IdPersonnel = per.Identifiant
    LEFT JOIN Missions m ON p.IdProjet = m.IdProjet
    WHERE p.IdProjet = ?
    GROUP BY p.IdProjet`;

  db.execute(query, [id], (err, results) => {
    if (err) {
      console.error('❌ Erreur lors de la récupération du projet :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ success: false, error: 'Projet non trouvé.' });
    }

    const projet = results[0];
    projet.membres = projet.membres ? projet.membres.split(',') : [];
    projet.missions = projet.missions ? projet.missions.split(',') : [];
    
    res.status(200).json(projet);
  });
});

app.post('/api/projets', (req, res) => {
  const { NomProjet, Description, CreateurId } = req.body;

  if (!NomProjet || !Description || !CreateurId) {
    return res.status(400).json({
      success: false,
      error: 'Nom du projet, description et ID du créateur obligatoires.'
    });
  }

  const query = 'INSERT INTO Projets (NomProjet, Description, CreateurId, DateCreation) VALUES (?, ?, ?, CURDATE())';
  db.execute(query, [NomProjet, Description, CreateurId], (err, result) => {
    if (err) {
      console.error('❌ Erreur lors de la création du projet :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.status(201).json({ success: true, id: result.insertId });
  });
});

app.delete('/api/projets/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Projets WHERE IdProjet = ?';
  db.execute(query, [id], (err) => {
    if (err) {
      console.error('❌ Erreur lors de la suppression du projet :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.json({ success: true });
  });
});

app.post('/api/projets/:id/membres', (req, res) => {
  const { id } = req.params;
  const { idPersonnel, createurId } = req.body;

  if (!idPersonnel || !createurId) {
    return res.status(400).json({
      success: false,
      error: 'ID du membre et ID du créateur sont obligatoires.'
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
    db.execute(addMemberQuery, [id, idPersonnel], (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ success: false, error: 'Le membre est déjà dans ce projet.' });
        }
        console.error('❌ Erreur lors de l\'ajout du membre :', err);
        return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
      }
      res.status(200).json({ success: true, message: 'Membre ajouté avec succès.' });
    });
  });
});

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
    db.execute(removeMemberQuery, [id, idPersonnel], (err) => {
      if (err) {
        console.error('❌ Erreur lors de la suppression du membre :', err);
        return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
      }
      res.status(200).json({ success: true, message: 'Membre supprimé avec succès.' });
    });
  });
});

app.get('/api/projets/:id/membres', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT p.Identifiant, p.Prenom, p.Nom, p.User, GROUP_CONCAT(c.Competence) as Competences
    FROM ProjetsPersonnel pp
    JOIN Personnel p ON pp.IdPersonnel = p.Identifiant
    LEFT JOIN CompetencesPersonnel cp ON p.Identifiant = cp.IdPersonnel
    LEFT JOIN Competences c ON cp.IdCompetence = c.IdentifiantC
    WHERE pp.IdProjet = ?
    GROUP BY p.Identifiant`;

  db.execute(query, [id], (err, results) => {
    if (err) {
      console.error('❌ Erreur lors de la récupération des membres :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.status(200).json(results);
  });
});

// =============================================================
// 🧩 MISSIONS COMPONENT
// =============================================================

app.get('/api/missions', (req, res) => {
  const query = `
    SELECT m.*, p.NomProjet
    FROM Missions m
    JOIN Projets p ON m.IdProjet = p.IdProjet
    ORDER BY m.DateCreation DESC`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Erreur lors de la récupération des missions :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.status(200).json(results);
  });
});

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

app.post('/api/missions', (req, res) => {
  const { NomMission, IdProjet, Description } = req.body;

  if (!NomMission || !IdProjet) {
    return res.status(400).json({
      success: false,
      error: 'Nom de la mission et ID du projet sont obligatoires.'
    });
  }

  const query = 'INSERT INTO Missions (NomMission, IdProjet, Description, DateCreation) VALUES (?, ?, ?, CURDATE())';
  db.execute(query, [NomMission, IdProjet, Description], (err, result) => {
    if (err) {
      console.error('❌ Erreur lors de la création de la mission :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.status(201).json({ success: true, id: result.insertId });
  });
});

app.post('/api/missions/:id/assign', (req, res) => {
  const { id } = req.params;
  const { IdPersonnel } = req.body;

  if (!IdPersonnel) {
    return res.status(400).json({ success: false, error: 'ID du personnel est requis.' });
  }

  const query = 'INSERT INTO MissionsPersonnel (IdMission, IdPersonnel) VALUES (?, ?)';
  db.execute(query, [id, IdPersonnel], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ success: false, error: 'Le membre est déjà assigné à cette mission.' });
      }
      console.error('❌ Erreur lors de l\'assignation de la mission :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.status(201).json({ success: true });
  });
});

app.post('/api/missions/:id/competences', (req, res) => {
  const { id } = req.params;
  const { idCompetence } = req.body;

  if (!idCompetence) {
    return res.status(400).json({ success: false, error: 'ID de la compétence est requis.' });
  }

  const query = 'INSERT INTO CompetencesMissions (IdMission, IdCompetence) VALUES (?, ?)';
  db.execute(query, [id, idCompetence], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ success: false, error: 'La compétence est déjà assignée à cette mission.' });
      }
      console.error('❌ Erreur lors de l\'affectation de la compétence :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.status(201).json({ success: true });
  });
});

app.get('/api/projets/:id/missions', (req, res) => {
  const { id } = req.params;
  console.log(`📋 Tentative de récupération des missions pour le projet ${id}`);

  // D'abord, vérifions si le projet existe
  const checkProjectQuery = 'SELECT IdProjet FROM Projets WHERE IdProjet = ?';
  db.execute(checkProjectQuery, [id], (err, projectResults) => {
    if (err) {
      console.error('❌ Erreur lors de la vérification du projet :', err);
      return res.status(500).json({ success: false, error: 'Erreur lors de la vérification du projet.' });
    }

    if (projectResults.length === 0) {
      console.log(`❌ Projet ${id} non trouvé`);
      return res.status(404).json({ success: false, error: 'Projet non trouvé.' });
    }

    // Ensuite, essayons de récupérer les missions avec les membres
    const query = `
      SELECT m.*, 
             GROUP_CONCAT(DISTINCT p.Prenom, ' ', p.Nom) as membres_assignes
      FROM Missions m
      LEFT JOIN MissionsPersonnel mp ON m.IdMission = mp.IdMission
      LEFT JOIN Personnel p ON mp.IdPersonnel = p.Identifiant
      WHERE m.IdProjet = ?
      GROUP BY m.IdMission
      ORDER BY m.DateCreation DESC`;

    console.log('🔍 Exécution de la requête pour les missions...');
    db.execute(query, [id], (err, results) => {
      if (err) {
        console.error('❌ Erreur détaillée lors de la récupération des missions :', {
          code: err.code,
          errno: err.errno,
          sqlState: err.sqlState,
          sqlMessage: err.sqlMessage
        });

        // Si l'erreur est due à une table manquante, on essaie une requête plus simple
        if (err.code === 'ER_NO_SUCH_TABLE') {
          console.log('⚠️ Table manquante détectée, tentative avec une requête simplifiée...');
          const simpleQuery = 'SELECT * FROM Missions WHERE IdProjet = ? ORDER BY DateCreation DESC';
          db.execute(simpleQuery, [id], (err2, results2) => {
            if (err2) {
              console.error('❌ Erreur lors de la requête simplifiée :', err2);
              return res.status(500).json({ 
                success: false, 
                error: 'Erreur lors de la récupération des missions.',
                details: err2.message
              });
            }
            console.log(`✅ ${results2.length} missions récupérées avec succès (requête simplifiée)`);
            const missions = results2.map(mission => ({
              ...mission,
              membres_assignes: [],
              competences_requises: []
            }));
            res.status(200).json(missions);
          });
          return;
        }

        // Pour toute autre erreur, on essaie une requête encore plus basique
        console.log('⚠️ Tentative avec une requête de base...');
        const basicQuery = 'SELECT * FROM Missions WHERE IdProjet = ?';
        db.execute(basicQuery, [id], (err3, results3) => {
          if (err3) {
            console.error('❌ Erreur critique : Impossible de récupérer les missions :', err3);
            return res.status(500).json({ 
              success: false, 
              error: 'Erreur critique lors de la récupération des missions.',
              details: err3.message
            });
          }
          console.log(`✅ ${results3.length} missions récupérées (requête de base)`);
          res.status(200).json(results3);
        });
        return;
      }
      
      console.log(`✅ ${results.length} missions récupérées avec succès`);
      // Formater les résultats
      const missions = results.map(mission => ({
        ...mission,
        membres_assignes: mission.membres_assignes ? mission.membres_assignes.split(',') : [],
        competences_requises: []
      }));
      
      res.status(200).json(missions);
    });
  });
});

// =============================================================
// 🚀 LANCEMENT DU SERVEUR
// =============================================================

app.listen(port, () => {
  console.log(`✅ Serveur en cours d'exécution sur : http://localhost:${port}`);
}); 