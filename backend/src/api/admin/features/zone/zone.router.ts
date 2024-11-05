import express from "express";

import { getAllZones, getSingleZone } from "./zone.controller";

const router = express.Router();

router.get("/all", getAllZones);
router.get("/:zoneId", getSingleZone);

export default router;
