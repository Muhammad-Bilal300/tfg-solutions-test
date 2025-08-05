import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConfig from "./config/db-config";
// import seedMockProductsData from "./seed/seed-product-data";
import allRoutes from "./routes/all-routes";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*", // allow all origins — change this to specific domain in production
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(allRoutes);

const PORT = process.env.PORT;
app.listen(PORT, async (err: unknown) => {
  if (err) {
    console.log("Server failed to start due to : ", err);
    return;
  }

  console.log("Server is running on port : ", PORT);

  dbConfig();
  //   await seedMockProductsData();
});
