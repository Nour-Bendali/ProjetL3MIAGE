const express = require('express');
const router = express.Router();
const db = require('../db');

// Récupère tous les membres affectés à une mission, avec leurs compétences.
router.get('/:id/personnel/with-competences', (req, res) => {
  const idMission = req.params.id;

  const sql = `
    SELECT 
      p.Identifiant AS IdPersonnel,
      p.Prenom,
      p.Nom,
      p.User,
      c.IdentifiantC AS IdCompetence,
      c.Competence,
      cm.IdMission AS MissionWith
    FROM MissionsPersonnel mp
    JOIN Personnel p ON p.Identifiant = mp.IdPersonnel
    LEFT JOIN CompetencesPersonnel cp ON cp.IdPersonnel = p.Identifiant
    LEFT JOIN Competences c ON c.IdentifiantC = cp.IdCompetence
    LEFT JOIN CompetencesMissions cm ON cm.IdMission = mp.IdMission
    WHERE mp.IdMission = ?
  `;

  db.execute(sql, [idMission], (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: 'Erreur SQL' });

    const map = new Map();
    rows.forEach(r => {
      if (!map.has(r.IdPersonnel)) {
        map.set(r.IdPersonnel, {
          Identifiant: r.IdPersonnel,
          Prenom: r.Prenom,
          Nom: r.Nom,
          User: r.User,
          competences: []
        });
      }
      if (r.IdCompetence) {
        map.get(r.IdPersonnel).competences.push({
          id: r.IdCompetence,
          nom: r.Competence
        });
      }
    });

    res.status(200).json([...map.values()]);
  });
});

// Récupère tous les membres affectés à une mission sans leurs compétences.
router.get('/:id/personnel', (req, res) => {
  const missionId = req.params.id;
  const sql = `
    SELECT
      p.Identifiant      AS Identifiant,
      p.Prenom           AS Prenom,
      p.Nom              AS Nom,
      p.User             AS User
    FROM MissionsPersonnel mp
    JOIN Personnel p
      ON p.Identifiant = mp.IdPersonnel
    WHERE mp.IdMission = ?
  `;
  db.execute(sql, [missionId], (err, rows) => {
    if (err) {
      console.error('Erreur SQL:', err);
      return res.status(500).json({ success: false, error: 'Erreur SQL', details: err.message });
    }
    res.status(200).json(rows);
  });
});

// Assigne un membre à une mission.
router.post('/:id/assign', (req, res) => {
  const missionId   = req.params.id;
  const idPersonnel = req.body.idPersonnel;
  if (!idPersonnel) {
    return res.status(400).json({ success: false, error: 'idPersonnel requis' });
  }

  const sql = `INSERT INTO MissionsPersonnel (IdMission, IdPersonnel) VALUES (?, ?)`;
  db.execute(sql, [missionId, idPersonnel], err => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ success: false, message: 'Ce membre est déjà assigné' });
      }
      console.error('Erreur SQL:', err);
      return res.status(500).json({ success: false, error: 'Erreur SQL', details: err.message });
    }
    res.status(201).json({ success: true });
  });
});

// Désassigne un membre d’une mission.
router.delete('/:id/:personnelId', (req, res) => {
  const missionId   = req.params.id;
  const personnelId = req.params.personnelId;
  const sql = `DELETE FROM MissionsPersonnel WHERE IdMission = ? AND IdPersonnel = ?`;
  db.execute(sql, [missionId, personnelId], err => {
    if (err) {
      console.error('Erreur SQL:', err);
      return res.status(500).json({ success: false, error: 'Erreur SQL', details: err.message });
    }
    res.status(200).json({ success: true });
  });
});

module.exports = router;
