import { Router } from "express";
import {
  crearMateria,
  listarMaterias,
  actualizarMateria,
  eliminarMateria
} from "../controllers/materia_controller.js";
import { verificarTokenJWT } from "../middlewares/JWT.js";

const router = Router();

router.post("/", verificarTokenJWT, crearMateria);           // Crear materia
router.get("/", verificarTokenJWT, listarMaterias);          // Listar todas
router.put("/:id", verificarTokenJWT, actualizarMateria);    // Actualizar por id
router.delete("/:id", verificarTokenJWT, eliminarMateria);   // Eliminar por id

export default router;
