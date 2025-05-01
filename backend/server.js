const express = require('express');
const cors = require('cors');
const personnelRoutes = require('./routes/personnel.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/', personnelRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
}); 