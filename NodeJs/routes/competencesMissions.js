const express = require('express');
const router = express.Router();
const db = require('../db');

// Récupérer toutes les compétences d'une mission
router.get('/:idMission/competences', (req, res) => {
  const idMission = req.params.idMission;
  const sql = `
    SELECT c.IdentifiantC AS IdCompetence, c.Competence
    FROM CompetencesMissions cm
    JOIN Competences c ON c.IdentifiantC = cm.IdCompetence
    WHERE cm.IdMission = ?
  `;
  db.execute(sql, [idMission], (err, rows) => {
    if (err) {
      console.error('❌ Erreur SQL:', err);
      return res.status(500).json({ error: 'Erreur SQL', details: err.message });
    }
    res.json(rows);
  });
});


// Ajouter une compétence à une mission
router.post('/:idMission/competences', (req, res) => {
  const { idMission } = req.params;
  const { idCompetence } = req.body;

  if (!idCompetence) {
    return res.status(400).json({
      success: false,
      error: 'ID de la compétence requis.'
    });
  }

  const query = `
    INSERT INTO CompetencesMissions (IdMission, IdCompetence)
    VALUES (?, ?)
  `;

  db.query(query, [idMission, idCompetence], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        console.warn(`⚠️ La compétence ${idCompetence} est déjà assignée à la mission ${idMission}.`);
        return res.status(409).json({ 
          success: false, 
          error: 'La compétence est déjà assignée à cette mission.' 
        });
      }
      console.error('❌ Erreur lors de l\'ajout de la compétence à la mission:', err);
      return res.status(500).json({ success: false, error: 'Erreur serveur.' });
    }
    res.status(201).json({ success: true, id: result.insertId });
  });
});

// Supprimer une compétence d'une mission
router.delete('/:idMission/competences/:idCompetence', (req, res) => {
  const { idMission, idCompetence } = req.params;
  const query = `
    DELETE FROM CompetencesMissions 
    WHERE IdMission = ? AND IdCompetence = ?
  `;

  db.query(query, [idMission, idCompetence], (err, result) => {
    if (err) {
      console.error('❌ Erreur lors de la suppression de la compétence de la mission:', err);
      return res.status(500).json({ success: false, error: 'Erreur serveur.' });
    }
    res.json({ success: true, affectedRows: result.affectedRows });
  });
});

module.exports = router; 