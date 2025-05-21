// routes/projets.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateJWT = require('../Middlewares/AuthenticateJwt'); // Added: import JWT auth middleware from same folder
const canAccessProjet = require('../Middlewares/canAccessProjet'); // ajouter cette ligne

// 🔹 Liste des projets
router.get('/', (req, res) => {
  db.execute('SELECT * FROM projets', (err, results) => { // Updated: use lowercase table name to match schema
    if (err) return res.status(500).json({ error: 'Erreur SQL' });
    res.json(results);
  });
});

// 🔹 Détails d’un projet
// 🔹 Récupérer un projet (protégé, seulement si membre ou créateur)
router.get('/:id', authenticateJWT, canAccessProjet, (req, res) => {
  const rawId = req.params.id;
  const projetId = parseInt(rawId, 10);

  // Juste pour vérifier qu’on a bien le user décodé
  console.log('Route /:id — req.user:', req.user);

  if (isNaN(projetId) || projetId <= 0) {
    return res.status(400).json({ error: 'ID de projet invalide.' });
  }

  // Ici on est déjà passé par canAccessProjet, donc req.user a été validé
  db.execute('SELECT * FROM projets WHERE IdProjet = ?', [projetId], (err, results) => {
    if (err) {
      console.error('Erreur SQL dans route GET /:id:', err);
      return res.status(500).json({ error: 'Erreur serveur.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Projet introuvable.' });
    }

    console.log('📦 Projet retourné :', results[0]);
    res.json(results[0]);
  });
});

// 🔹 Liste des missions d’un projet
router.get('/:id/missions', (req, res) => {
  const id = req.params.id;
  const query = `
    SELECT IdMission, Titre, Description, DateCreation
    FROM Missions
    WHERE IdProjet = ?
    ORDER BY DateCreation DESC
  `;
  db.execute(query, [id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des missions :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.status(200).json(results);
  });
});

// 🔹 Création d’un projet (protégée par JWT)
router.post('/', authenticateJWT, (req, res) => { // Added: protect this route with JWT middleware
  const { nomProjet, description } = req.body; // Added: only extract project name and description from body
  console.log('Request body:', req.body); // Added: debug log request body
  console.log('Authenticated user ID:', req.user?.id); // Added: debug log authenticated user ID
  if (!nomProjet || !description) { // Updated: validate required fields
    return res.status(400).json({ error: 'Nom du projet et description requis.' }); // Added: adjusted error message
  }
  const createurId = req.user.id; // Added: retrieve creator ID from decoded JWT payload

  const query = 'INSERT INTO projets (NomProjet, Description, CreateurId, DateCreation) VALUES (?, ?, ?, CURDATE())'; // Updated: use lowercase table name
  db.execute(query, [nomProjet, description, createurId], (err, result) => {
    if (err) {
      console.error('Erreur SQL création projet :', err);
      return res.status(500).json({ // Updated: include error details in response for debugging
        error: 'Erreur lors de la création du projet',
        details: err.message // Added: return SQL error message
      });
    }
    res.status(201).json({ success: true, id: result.insertId }); // Added: respond with new project ID
  });
});

// 🔹 Suppression d’un projet
router.delete('/:id', authenticateJWT, async (req, res) => {
  const projetId = parseInt(req.params.id, 10);
  const userId = req.user?.id;

  if (!userId || isNaN(projetId) || projetId <= 0) {
    return res.status(400).json({ error: 'Requête invalide' });
  }

  try {
    // 🔎 Vérifier si l'utilisateur est le créateur
    const [projetResult] = await db.promise().query(
      'SELECT CreateurId FROM projets WHERE IdProjet = ?',
      [projetId]
    );

    if (projetResult.length === 0) {
      return res.status(404).json({ error: 'Projet introuvable' });
    }

    const createurId = projetResult[0].CreateurId;

    if (createurId !== userId) {
      return res.status(403).json({ error: 'Seul le créateur peut supprimer ce projet.' });
    }

    // 🗑️ Supprimer le projet
    await db.promise().query(
      'DELETE FROM projets WHERE IdProjet = ?',
      [projetId]
    );

    res.status(200).json({ message: 'Projet supprimé avec succès.' });

  } catch (err) {
    console.error('❌ Erreur lors de la suppression du projet :', err);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression.' });
  }
});


// 🔹 Suppression d’une mission liée à un projet
router.delete('/:projectId/missions/:missionId', (req, res) => {
  const { projectId, missionId } = req.params;

  const query = `
    DELETE FROM Missions
    WHERE IdMission = ? AND IdProjet = ?
  `;

  db.execute(query, [missionId, projectId], (err, result) => {
    if (err) {
      console.error('Erreur lors de la suppression de la mission :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Mission non trouvée ou déjà supprimée.' });
    }

    console.log(`Mission ${missionId} supprimée du projet ${projectId}`);
    res.status(200).json({ success: true, message: 'Mission supprimée avec succès.' });
  });
});

module.exports = router; // Added: export router for use in server.js