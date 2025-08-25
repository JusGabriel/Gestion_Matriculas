import { Router } from "express";
import {
  crearMatricula,
  listarMatriculas,
  actualizarMatricula,
  eliminarMatricula
} from "../controllers/matricula_controller.js";
import { verificarTokenJWT } from "../middlewares/JWT.js";

const router = Router();

router.post("/", verificarTokenJWT, crearMatricula);
router.get("/", verificarTokenJWT, listarMatriculas);
router.put("/:id", verificarTokenJWT, actualizarMatricula);
router.delete("/:id", verificarTokenJWT, eliminarMatricula);

export default router;
