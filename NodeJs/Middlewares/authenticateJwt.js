function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token manquant.' });
    }
  
    const token = authHeader.split(' ')[1];
    jwt.verify(token, 'SECRET_KEY_JWT_RECRUIT', (err, decoded) => {
      if (err) return res.status(403).json({ error: 'Token invalide.' });
      req.user = decoded; // contient { id, user }
      next();
    });
  }
  