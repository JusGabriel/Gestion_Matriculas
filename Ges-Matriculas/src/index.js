import app from './server.js';
import connectDB from './database.js';
import dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno

// Configurar puerto
const PORT = process.env.PORT || 3000;
app.set('port', PORT);

// Conectar a la base de datos
connectDB()
  .then(() => {
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
    process.exit(1); // Salir si falla la conexión
  });
