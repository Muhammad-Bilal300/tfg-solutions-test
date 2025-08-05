import express from "express";
import { ROUTES } from "../constants/routes";
import productRouter from "./product-routes";

const router = express.Router();

router.use(ROUTES.PRODUCTS, productRouter);

export default router;
