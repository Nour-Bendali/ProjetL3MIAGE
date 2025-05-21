/* authenticateJwt.js */
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY_JWT || 'RECRUIT_SECRET_KEY_JWT_2025'; 

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant.' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Token invalide.' });
    console.log('✅ Token payload déchiffré :', decoded); 
    req.user = decoded;
    next();
  });  
}

module.exports = authenticateJWT; // Added: export middleware
