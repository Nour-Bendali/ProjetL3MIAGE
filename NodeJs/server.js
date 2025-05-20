// server.js (placer à la racine de votre dossier nodejs)
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // parse JSON bodies

// Routes modulaires
app.use('/api/auth', require('./routes/auth'));                        // authentication routes
app.use('/api/projets', require('./routes/projets'));                  // projects routes
app.use('/api/missions', require('./routes/missions'));                // missions routes
app.use('/api/personnel', require('./routes/personnel'));              // personnel routes
app.use('/api/competences', require('./routes/competences'));          // competences routes
app.use('/api/projets-personnel', require('./routes/projetsPersonnels'));     // projets–personnel relation routes
app.use('/api/missions-personnel', require('./routes/missionsPersonnels'));   // missions–personnel relation routes
app.use('/api/competences-missions', require('./routes/competencesMissions')); // competences–missions relation routes

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
  console.log(`🚀 Backend modulaire opérationnel sur http://localhost:${PORT}`);
  console.log('📝 Routes disponibles:');
  console.log('  - /api/auth');
  console.log('  - /api/projets');
  console.log('  - /api/missions');
  console.log('  - /api/personnel');
  console.log('  - /api/competences');
  console.log('  - /api/projets-personnel');
  console.log('  - /api/missions-personnel');
  console.log('  - /api/competences-missions');
});
