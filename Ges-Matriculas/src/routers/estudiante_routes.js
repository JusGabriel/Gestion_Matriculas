import { Router } from "express";
import {
  crearEstudiante,
  listarEstudiantes,
  actualizarEstudiante,
  eliminarEstudiante
} from "../controllers/estudiante_controller.js";
import { verificarTokenJWT } from "../middlewares/JWT.js";

const router = Router();

router.post("/", verificarTokenJWT, crearEstudiante);           // Crear estudiante
router.get("/", verificarTokenJWT, listarEstudiantes);          // Listar todos
router.put("/:id", verificarTokenJWT, actualizarEstudiante);    // Actualizar por id
router.delete("/:id", verificarTokenJWT, eliminarEstudiante);   // Eliminar por id

export default router;
