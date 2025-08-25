import Usuario from "../models/Usuario.js";
import { sendMailToRegister, sendMailToRecoveryPassword } from "../config/nodemailer.js";
import { crearTokenJWT } from "../middlewares/JWT.js";
import mongoose from "mongoose"


// POST /api/usuarios/registro
const registro = async (req, res) => {
  try {
    const { nombre, apellido, email, password } = req.body;

    if ([nombre, apellido, email, password].some(v => !v || v === "")) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    const verificarEmail = await Usuario.findOne({ email });
    if (verificarEmail) {
      return res.status(400).json({ msg: "El email ya está registrado" });
    }

    // Crear usuario
    const nuevoUsuario = new Usuario(req.body);

    // Encriptar contraseña
    nuevoUsuario.password = await nuevoUsuario.encryptPassword(password);

    // Generar y guardar token de confirmación
    const token = Math.random().toString(36).slice(2);
    nuevoUsuario.token = token;

    // Enviar correo
    await sendMailToRegister(email, token);

    // Guardar usuario en BD
    await nuevoUsuario.save();

    res.status(201).json({
      msg: "Revisa tu correo electrónico para confirmar tu cuenta",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// GET /api/usuarios/confirmar/:token
const confirmarMail = async (req, res) => {
  try {
    const { token } = req.params;

    const usuarioBDD = await Usuario.findOne({ token });
    if (!usuarioBDD) {
      return res.status(404).json({ msg: "Token inválido o ya fue usado" });
    }

    usuarioBDD.token = null;
    usuarioBDD.confirmEmail = true;
    await usuarioBDD.save();

    res.status(200).json({ msg: "Cuenta confirmada, ya puedes iniciar sesión" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// POST /api/usuarios/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones mínimas
    if (!email || !password) {
      return res.status(400).json({ msg: "Email y contraseña son obligatorios" });
    }

    // Buscar usuario
    const usuario = await Usuario.findOne({ email });
    // Mensaje solicitado por el enunciado cuando falla
    if (!usuario) {
      return res.status(400).json({ msg: "Usuario o contraseña incorrectos." });
    }

    // Verificar si ya confirmó el correo
    if (!usuario.confirmEmail) {
      return res.status(401).json({ msg: "Debes confirmar tu correo antes de iniciar sesión." });
    }

    // Comparar contraseña
    const esValido = await usuario.matchPassword(password);
    if (!esValido) {
      return res.status(400).json({ msg: "Usuario o contraseña incorrectos." });
    }

    // Crear JWT
    const token = crearTokenJWT(usuario);

    // Responder con token y datos del usuario (sin password)
    res.status(200).json({
      msg: "Login exitoso",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};



// POST /api/usuarios/recuperar-password
const recuperarPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || email === "") {
      return res.status(400).json({ msg: "Debes proporcionar un email" });
    }

    const usuarioBDD = await Usuario.findOne({ email });
    if (!usuarioBDD) {
      return res.status(404).json({ msg: "El usuario no se encuentra registrado" });
    }

    // Generar token temporal
    const token = Math.random().toString(36).slice(2);
    usuarioBDD.token = token;

    // Enviar correo con token
    await sendMailToRecoveryPassword(email, token);
    await usuarioBDD.save();

    res.status(200).json({ msg: "Revisa tu correo electrónico para reestablecer tu cuenta" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// GET /api/usuarios/comprobar-token/:token
const comprobarTokenPassword = async (req, res) => {
  try {
    const { token } = req.params;

    const usuarioBDD = await Usuario.findOne({ token });
    if (!usuarioBDD || usuarioBDD.token !== token) {
      return res.status(404).json({ msg: "No se puede validar la cuenta" });
    }

    res.status(200).json({ msg: "Token confirmado, ya puedes crear tu nuevo password" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// POST /api/usuarios/crear-nuevo-password/:token
const crearNuevoPassword = async (req, res) => {
  try {
    const { password, confirmpassword } = req.body;
    const { token } = req.params;

    if (!password || !confirmpassword) {
      return res.status(400).json({ msg: "Debes llenar todos los campos" });
    }
    if (password !== confirmpassword) {
      return res.status(400).json({ msg: "Los passwords no coinciden" });
    }

    const usuarioBDD = await Usuario.findOne({ token });
    if (!usuarioBDD || usuarioBDD.token !== token) {
      return res.status(404).json({ msg: "No se puede validar la cuenta" });
    }

    // Actualizar contraseña y limpiar token
    usuarioBDD.password = await usuarioBDD.encryptPassword(password);
    usuarioBDD.token = null;

    await usuarioBDD.save();
    res.status(200).json({ msg: "Contraseña actualizada, ya puedes iniciar sesión" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

const perfil = (req, res) => {
  const { token, confirmEmail, createdAt, updatedAt, __v, password, ...datosPerfil } = req.usuarioBDD;
  res.status(200).json(datosPerfil);
};

const actualizarPerfil = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, direccion, celular, email } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) 
      return res.status(404).json({ msg: "Lo sentimos, debe ser un id válido" });

    if ([nombre, apellido, direccion, celular, email].some(v => !v || v === ""))
      return res.status(400).json({ msg: "Debes llenar todos los campos" });

    const usuarioBDD = await Usuario.findById(id);
    if (!usuarioBDD) 
      return res.status(404).json({ msg: `No existe el usuario ${id}` });

    // Verificar si el email está en uso por otro usuario
    if (usuarioBDD.email !== email) {
      const usuarioConEmail = await Usuario.findOne({ email });
      if (usuarioConEmail) {
        return res.status(400).json({ msg: "El email ya se encuentra registrado" });
      }
    }

    // Actualizar datos
    usuarioBDD.nombre = nombre ?? usuarioBDD.nombre;
    usuarioBDD.apellido = apellido ?? usuarioBDD.apellido;
    usuarioBDD.direccion = direccion ?? usuarioBDD.direccion;
    usuarioBDD.celular = celular ?? usuarioBDD.celular;
    usuarioBDD.email = email ?? usuarioBDD.email;

    await usuarioBDD.save();

    res.status(200).json(usuarioBDD);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};
const actualizarPassword = async (req, res) => {
  try {
    const usuarioBDD = await Usuario.findById(req.usuarioBDD._id);
    if (!usuarioBDD)
      return res.status(404).json({ msg: "Lo sentimos, no existe el usuario" });

    // Verificar contraseña actual
    const verificarPassword = await usuarioBDD.matchPassword(req.body.passwordactual);
    if (!verificarPassword)
      return res.status(400).json({ msg: "El password actual no es correcto" });

    // Actualizar contraseña
    usuarioBDD.password = await usuarioBDD.encryptPassword(req.body.passwordnuevo);
    await usuarioBDD.save();

    res.status(200).json({ msg: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};
// POST /api/usuarios/logout
const logout = async (req, res) => {
  try {
    // Aquí no necesitas tocar la BD, solo avisar al cliente
    res.status(200).json({ msg: "Sesión cerrada correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};


export {
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
};
