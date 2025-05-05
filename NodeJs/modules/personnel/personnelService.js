// services/personnelService.js
const db = require('../config/db');

exports.getAllPersonnel = (callback) => {
  const query = `
    SELECT p.Identifiant, p.Prenom, p.Nom, p.User, GROUP_CONCAT(c.Competence) as Competences
    FROM Personnel p
    LEFT JOIN CompetencesPersonnel cp ON p.Identifiant = cp.IdPersonnel
    LEFT JOIN Competences c ON cp.IdCompetence = c.IdentifiantC
    GROUP BY p.Identifiant
  `;
  db.execute(query, callback);
};

exports.addPersonnel = (prenom, nom, email, password, callback) => {
  const query = 'INSERT INTO Personnel (Prenom, Nom, User, Password) VALUES (?, ?, ?, ?)';
  db.execute(query, [prenom, nom, email, password], callback);
};

// Ajoute ici les autres méthodes (update, delete, etc.)