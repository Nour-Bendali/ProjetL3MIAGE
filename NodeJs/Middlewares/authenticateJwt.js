const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY_JWT || 'RECRUIT_SECRET_KEY_JWT_2025';

// Vérifie la présence et la validité du token JWT dans l'en-tête Authorization.
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  // Si pas de header ou pas de Bearer, on refuse l'accès
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Token manquant.' });
  }

  // Extraction du token
  const token = authHeader.split(' ')[1];

  // Vérification du JWT
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      // Token invalide ou expiré
      return res.status(403).json({ success: false, error: 'Token invalide.' });
    }

    console.log('✅ Token payload déchiffré :', decoded);
    req.user = decoded; // Ajout du payload au req pour les routes suivantes
    next();           // Passe au middleware ou route suivante
  });  
}

module.exports = authenticateJWT; // Export du middleware d'authentification
