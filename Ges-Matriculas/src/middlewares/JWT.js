import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

// Crear token JWT
export const crearTokenJWT = (usuario) => {
  const payload = {
    id: usuario._id,
    rol: "usuario", // si quieres manejar roles
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "1d",
  });
};

// Middleware para verificar token
export const verificarTokenJWT = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) 
    return res.status(401).json({ msg: "Acceso denegado: token no proporcionado o inválido" });

  try {
    const token = authorization.split(" ")[1];
    const { id, rol } = jwt.verify(token, process.env.JWT_SECRET);

    if (rol === "usuario") {
      req.usuarioBDD = await Usuario.findById(id).lean().select("-password");
      next();
    } else {
      return res.status(403).json({ msg: "Rol no autorizado" });
    }
  } catch (error) {
    return res.status(401).json({ msg: "Token inválido o expirado" });
  }
};
