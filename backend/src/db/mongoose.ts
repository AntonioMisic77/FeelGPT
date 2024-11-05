// src/db/mongoose.ts
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'your_default_mongo_uri';

export const connectDB = () => {

  try {
    mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.error(err.message);
  }
  const dbConnection = mongoose.connection;
  dbConnection.once("open", (_) => {
    console.log(`Database connected: ${MONGO_URI}`);
  });

  dbConnection.on("error", (err) => {
    console.error(`connection error: ${err}`);
  });
  return;
}

export default connectDB;
