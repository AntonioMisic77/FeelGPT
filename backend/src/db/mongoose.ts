// src/db/mongoose.ts
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'your_default_mongo_uri';

export const connectDB = async () => {

  console.log("Trying to connect to mongodb");

  console.log("MONGO_URI: ", MONGO_URI);
  
  if (!MONGO_URI) {
    console.error("Mongo URI is missing");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to mongodb: ${MONGO_URI}");
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`Error connecting to MongoDb: ${err.message}`);
   }
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
