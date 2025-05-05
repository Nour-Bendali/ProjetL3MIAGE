const express = require('express');
const router = express.Router();
const db = require('../../config/db');

// 📋 Créer un projet
router.post('/projets', (req, res) => {
  const { nomProjet, description, createurId } = req.body;
  if (!nomProjet || !description || !createurId)
    return res.status(400).json({ success: false, error: 'Champs obligatoires.' });

  const query = 'INSERT INTO Projets (NomProjet, Description, CreateurId, DateCreation) VALUES (?, ?, ?, CURDATE())';
  db.execute(query, [nomProjet, description, createurId], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: 'Erreur interne.' });
    res.status(201).json({ success: true, id: result.insertId, nomProjet, description });
  });
});

// 👥 Ajouter un membre
router.post('/projets/:id/membres', (req, res) => {
  const { id } = req.params;
  const { idPersonnel, createurId } = req.body;

  const checkCreatorQuery = 'SELECT CreateurId FROM Projets WHERE IdProjet = ?';
  db.execute(checkCreatorQuery, [id], (err, results) => {
    if (err) return res.status(500).json({ success: false });
    if (results.length === 0 || results[0].CreateurId !== createurId)
      return res.status(403).json({ success: false, error: 'Non autorisé.' });

    const addMemberQuery = 'INSERT INTO ProjetsPersonnel (IdProjet, IdPersonnel) VALUES (?, ?)';
    db.execute(addMemberQuery, [id, idPersonnel], (err) => {
      if (err) return res.status(500).json({ success: false });
      res.status(200).json({ success: true });
    });
  });
});

// 🗑️ Supprimer un membre
router.delete('/projets/:id/membres/:idPersonnel', (req, res) => {
  const { id, idPersonnel } = req.params;
  const { createurId } = req.body;

  const checkCreatorQuery = 'SELECT CreateurId FROM Projets WHERE IdProjet = ?';
  db.execute(checkCreatorQuery, [id], (err, results) => {
    if (err) return res.status(500).json({ success: false });
    if (results.length === 0 || results[0].CreateurId !== createurId)
      return res.status(403).json({ success: false });

    const removeMemberQuery = 'DELETE FROM ProjetsPersonnel WHERE IdProjet = ? AND IdPersonnel = ?';
    db.execute(removeMemberQuery, [id, idPersonnel], (err) => {
      if (err) return res.status(500).json({ success: false });
      res.status(200).json({ success: true });
    });
  });
});

// 📋 Liste des projets
router.get('/projets', (req, res) => {
  const query = 'SELECT * FROM Projets';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ success: false });
    res.status(200).json(results);
  });
});

// 📋 Détails projet + membres
router.get('/projets/:id', (req, res) => {
  const { id } = req.params;
  const projetQuery = 'SELECT * FROM Projets WHERE IdProjet = ?';
  const membresQuery = `
    SELECT p.Identifiant, p.Prenom, p.Nom, c.Competence
    FROM ProjetsPersonnel pp
    JOIN Personnel p ON pp.IdPersonnel = p.Identifiant
    LEFT JOIN CompetencesPersonnel cp ON p.Identifiant = cp.IdPersonnel
    LEFT JOIN Competences c ON cp.IdCompetence = c.IdentifiantC
    WHERE pp.IdProjet = ?
  `;

  db.execute(projetQuery, [id], (err, projetResults) => {
    if (err || projetResults.length === 0) return res.status(404).json({ success: false });
    db.execute(membresQuery, [id], (err, membresResults) => {
      if (err) return res.status(500).json({ success: false });
      res.status(200).json({ projet: projetResults[0], membres: membresResults });
    });
  });
});

module.exports = router;
