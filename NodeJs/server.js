// server.js (à placer à la racine de votre dossier nodejs)
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // parse JSON bodies

// Routes modulaires
app.use('/api/auth', require('./routes/auth')); // Added: authentication routes
app.use('/api/projets', require('./routes/projets')); // Added: projects routes
app.use('/api/missions', require('./routes/missions')); // Ensure missions routes are mounted correctly
app.use('/api/personnel', require('./routes/personnel')); // Added: personnel routes
app.use('/api/competences', require('./routes/competences')); // Added: competences routes
app.use('/api/projets-personnel', require('./routes/projetsPersonnels')); // Updated: fixed route path for projets-personnel
app.use('/api/missions-personnel', require('./routes/missionsPersonnels')); // Updated: correct path & file for missions-personnel
app.use('/api/competences-missions', require('./routes/competencesMissions')); // Updated: correct path & file for competences-missions

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Route non trouvée',
    path: req.originalUrl 
  });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Erreur interne du serveur',
    message: err.message 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend modulaire opérationnel sur http://localhost:${PORT}`); // Inform user of server URL
  console.log('📝 Routes disponibles:');
  console.log('  - /api/auth'); // Authentication endpoints
  console.log('  - /api/projets'); // Projects endpoints
  console.log('  - /api/missions'); // Missions endpoints
  console.log('  - /api/personnel'); // Personnel endpoints
  console.log('  - /api/competences'); // Competences endpoints
  console.log('  - /api/projets-personnel'); // Projet-personnel relation endpoints
  console.log('  - /api/missions-personnel'); // Mission-personnel relation endpoints
  console.log('  - /api/competences-missions'); // Competence-mission relation endpoints
});
