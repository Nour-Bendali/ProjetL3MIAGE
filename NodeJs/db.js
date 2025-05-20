// db.js (à placer à la racine de votre dossier nodejs)
const mysql = require('mysql2');

// Configuration du pool de connexions MySQL
const pool = mysql.createPool({
  host: 'localhost',      // À adapter
  user: 'root',           // À adapter
  password: '',           // À adapter
  database: 'recruitmiage',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// (Optionnel) Test de connexion initial
pool.getConnection((err, connection) => {    // Changed: use pool.getConnection, not db.connect
  if (err) {
    console.error('❌ Erreur de connexion à la base de données :', err);
    return;
  }
  console.log('✅ Connexion à la base de données établie');
  connection.release();
});

module.exports = pool; // Changed: export pool, not undefined `db`
