import { Router } from "express";

import { createContent, fetchAllContent } from "../controller/ContentController";

const router = Router();

router.post("/content", createContent);

router.get("/content", fetchAllContent);

export default router;