const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Routes modulaires
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projets', require('./routes/projets'));
app.use('/api/missions', require('./routes/missions'));
app.use('/api/personnel', require('./routes/personnel'));
app.use('/api/competences', require('./routes/competences'));
app.use('/api/projets-personnel', require('./routes/projetsPersonnels'));
app.use('/api/missions', require('./routes/missionsPersonnels'));
app.use('/api/missions', require('./routes/competencesMissions'));

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
