import { Router } from "express";

import { createContent, deleteContent, fetchAllContent, fetchSharedContent, shareContent } from "../controller/ContentController";

const router = Router();

router.post("/", createContent);

router.get("/", fetchAllContent);

router.get("/shared/:hash", fetchSharedContent);

router.delete("/:id", deleteContent);

router.post("/:id/share", shareContent);


export default router;