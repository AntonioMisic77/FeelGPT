import express from "express";

import menuCategoryRouter from "./menuCategory/menuCategory.router";
import menuItemRouter from "./menuItem/menuItem.router";

const router = express.Router();

router.use("/category", menuCategoryRouter);
router.use("/item", menuItemRouter);

export default router;
