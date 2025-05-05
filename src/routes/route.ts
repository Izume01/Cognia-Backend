import { Router } from "express";

import { login , signup } from "../controller/UserController";

const router = Router();

router.post("/signup" , signup);
router.post("/signin" , login);

export default router;