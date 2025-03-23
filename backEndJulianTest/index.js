const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000; 

// Conexión correcta a tu base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',           
  password: '',   // Cambia esto con tu contraseña real
  database: 'recruitMiage'   // Base de datos correcta
});

// Middleware
app.use(express.json());
app.use(cors());

// Ruta POST para autenticación
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?'; // tabla "users", según tu elección previa

  db.execute(query, [email, password], (err, results) => {
    if(err){
      console.error("Error en la consulta MySQL:", err); 
      return res.status(500).json({ success: false, error: err.message });
    }

    if(results.length > 0){
      return res.json({ success: true });
    } else {
      return res.json({ success: false });
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en: http://localhost:${port}`);
});
