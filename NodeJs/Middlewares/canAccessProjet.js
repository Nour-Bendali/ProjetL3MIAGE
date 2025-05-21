const db = require('../db');

async function canAccessProjet(req, res, next) {
  console.log('🎯 Middleware canAccessProjet atteint');

  const projetId = parseInt(req.params.id, 10);
  const userId = req.user?.id;

  console.log('🔎 projectId:', projetId, '| userId:', userId);

  if (!userId || isNaN(projetId) || projetId <= 0) {
    return res.status(400).json({ error: 'Requête invalide (ID projet).' });
  }

  try {
    const [projetResult] = await db.promise().query(
      'SELECT CreateurId FROM projets WHERE IdProjet = ?',
      [projetId]
    );
    const projet = projetResult[0];
    if (projet?.CreateurId === userId) {
      console.log('✅ Accès autorisé - créateur');
      return next();
    }

    const [membreResult] = await db.promise().query(
      'SELECT 1 FROM projetspersonnel WHERE IdProjet = ? AND IdPersonnel = ?',
      [projetId, userId]
    );
    if (membreResult.length > 0) {
      console.log('✅ Accès autorisé - membre');
      return next();
    }

    console.warn('⛔ Refusé - ni créateur ni membre');
    return res.status(403).json({ error: "Accès interdit à ce projet." });

  } catch (err) {
    console.error('💥 Erreur middleware canAccessProjet:', err);
    return res.status(500).json({ error: 'Erreur serveur interne.' });
  }
}

module.exports = canAccessProjet;
