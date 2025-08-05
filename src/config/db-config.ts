import mongoose from "mongoose";

const dbConfig = () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error(
        "DATABASE_URL is not defined in the environment variables"
      );
    }
    mongoose
      .connect(mongoUri)
      .then(() => {
        console.log("Mongo Database is connected");
      })
      .catch((error: Error) => {
        console.log("Mongo Database is not connected due to : ", error);
      });
  } catch (error) {
    console.log("Mongo Database is not connected due to : ", error);
  }
};

export default dbConfig;
