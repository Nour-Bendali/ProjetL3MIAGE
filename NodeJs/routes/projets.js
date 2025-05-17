const express = require('express');
const router = express.Router();
const db = require('../db');

// 🔹 Liste des projets
router.get('/', (req, res) => {
  db.execute('SELECT * FROM Projets', (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur SQL' });
    res.json(results);
  });
});

// 🔹 Détails d’un projet
router.get('/:id', (req, res) => {
  const id = req.params.id;
  db.execute('SELECT * FROM Projets WHERE IdProjet = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur SQL' });
    if (results.length === 0) return res.status(404).json({ error: 'Projet introuvable' });
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
      console.error('❌ Erreur lors de la récupération des missions :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }
    res.status(200).json(results);
  });
});

// 🔹 Création d’un projet
router.post('/', (req, res) => {
  const { nomProjet, description, createurId } = req.body;
  if (!nomProjet || !description || !createurId) {
    return res.status(400).json({ error: 'Champs requis' });
  }

  const query = 'INSERT INTO Projets (NomProjet, Description, CreateurId, DateCreation) VALUES (?, ?, ?, CURDATE())';
  db.execute(query, [nomProjet, description, createurId], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erreur lors de la création du projet' });
    res.status(201).json({ success: true, id: result.insertId });
  });
});

// 🔹 Suppression d’un projet
router.delete('/:id', (req, res) => {
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

// ✅ Suppression d’une mission spécifique à un projet
// 🔹 Suppression d’une mission liée à un projet
router.delete('/:projectId/missions/:missionId', (req, res) => {
  const { projectId, missionId } = req.params;

  const query = `
    DELETE FROM Missions
    WHERE IdMission = ? AND IdProjet = ?
  `;

  db.execute(query, [missionId, projectId], (err, result) => {
    if (err) {
      console.error('❌ Erreur lors de la suppression de la mission :', err);
      return res.status(500).json({ success: false, error: 'Erreur interne du serveur.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Mission non trouvée ou déjà supprimée.' });
    }

    console.log(`Mission ${missionId} supprimée du projet ${projectId}`);
    res.status(200).json({ success: true, message: 'Mission supprimée avec succès.' });
  });
});


module.exports = router;

