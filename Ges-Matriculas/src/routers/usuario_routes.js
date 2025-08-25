import { Router } from "express";
import { 
  registro, 
  confirmarMail, 
  login, 
  recuperarPassword, 
  comprobarTokenPassword, 
  crearNuevoPassword,
  perfil,
  actualizarPerfil,
  actualizarPassword,
  logout 
} from "../controllers/usuario_controller.js";
import { verificarTokenJWT } from '../middlewares/JWT.js'

const router = Router();

// Registro y confirmación
router.post("/registro", registro);
router.get("/confirmar/:token", confirmarMail);

// Login
router.post("/login", login);

// Recuperación de contraseña
router.post("/recuperarpassword", recuperarPassword);
router.get("/recuperarpassword/:token", comprobarTokenPassword);
router.post("/nuevopassword/:token", crearNuevoPassword);


router.get('/perfil',verificarTokenJWT,perfil)
router.put('/usuario/:id',verificarTokenJWT,actualizarPerfil)
router.put('/usuario/actualizarpassword/:id',verificarTokenJWT,actualizarPassword)
router.post("/logout", logout);

export default router;
