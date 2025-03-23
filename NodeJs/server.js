const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Conexión a MySQL (ajusta con tu contraseña si es necesario)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Coloca tu contraseña aquí si la tienes
  database: 'recruitmiage'
});

// Middleware
app.use(cors());
app.use(express.json());

// Ruta POST protegida para login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Validar que email y password no estén vacíos
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email y contraseña obligatorios.'
    });
  }

  const query = 'SELECT * FROM Utilisateurs WHERE Mail = ? AND Password = ?';

  db.execute(query, [email, password], (err, results) => {
    if (err) {
      console.error('❌ Error en la consulta MySQL:', err);
      return res.status(500).json({ success: false, error: 'Error interno del servidor.' });
    }

    if (results.length > 0) {
      console.log(`✅ Usuario autenticado: ${email}`);
      res.json({ success: true });
    } else {
      console.log(`❌ Credenciales incorrectas para: ${email}`);
      res.json({ success: false });
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`✅ Servidor ejecutándose en: http://localhost:${port}`);
});
