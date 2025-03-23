const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Ajusta con tus credenciales MySQL:
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'recruitmiage'
});

app.use(express.json());
app.use(cors());

// Ruta POST para autenticación
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Cambia la consulta para usar "Utilisateurs", columna "Mail" y "Password"
  const query = 'SELECT * FROM Utilisateurs WHERE Mail = ? AND Password = ?';

  db.execute(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error en la consulta MySQL:', err);
      return res.status(500).json({ success: false, error: err.message });
    }

    // Si 'results.length > 0', entonces existe un usuario con esas credenciales
    if (results.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en: http://localhost:${port}`);
});
