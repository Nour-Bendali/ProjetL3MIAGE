const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/missions', (req, res) => {
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
  })
});





// 📋 Route GET : /api/projets/:id/missions
// Récupère toutes les missions associées à un projet spécifique.
router.get('/projets/:id/missions', (req, res) => {
  const { id } = req.params.id;
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


router.post('/', (req, res) => {
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



router.delete('/projets/:projectId/missions/:missionId', async (req, res) => {
  const { projectId, missionId } = req.params;

  try {
    const result = await db.query(
      'DELETE FROM Missions WHERE IdMission = ? AND IdProjet = ?',
      [missionId, projectId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Mission non trouvée ou déjà supprimée.' });
    }

    res.status(200).json({ message: 'Mission supprimée avec succès.' });
  } catch (err) {
    console.error('Erreur lors de la suppression de la mission :', err);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression de la mission.' });
  }
});

module.exports = router;
