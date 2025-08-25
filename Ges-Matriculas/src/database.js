import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.set('strictQuery', true);

const connection = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI_LOCAL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Database is connected on ${db.connection.host} - ${db.connection.port}`);
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1); // Salir si no se conecta
  }
};

export default connection;
