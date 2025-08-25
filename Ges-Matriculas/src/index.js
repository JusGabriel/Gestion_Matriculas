import app from './server.js'
import connection from './database.js';
connection();

const PORT = process.env.PORT || app.get('port');  // usar el puerto de Railway si existe

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server ok on port ${PORT}`);
});
