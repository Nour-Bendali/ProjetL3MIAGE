const mysql = require('mysql2');

// Configuration du pool de connexions MySQL
const pool = mysql.createPool({
  host: 'localhost',      // À adapter
  user: 'root',           // À adapter
  password: '',           // À adapter
  host: 'localhost',      
  user: 'root',           
  password: 'MdMNB01010192@',           // À adapter
  database: 'recruitmiage',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test de connexion initiale
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
    return;
  }
  console.log('Connexion à la base de données établie');
  connection.release();
});

module.exports = pool; // Export du pool pour les routes
