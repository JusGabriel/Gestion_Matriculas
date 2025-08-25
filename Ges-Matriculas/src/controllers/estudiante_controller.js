import Estudiante from "../models/Estudiante.js";

// Crear estudiante
const crearEstudiante = async (req, res) => {
  try {
    const { nombre, apellido, cedula, fecha_nacimiento, ciudad, direccion, telefono, email } = req.body;

    if (!nombre || !apellido || !cedula || !email) {
      return res.status(400).json({ msg: "Nombre, apellido, cédula y email son obligatorios" });
    }

    const existeCedula = await Estudiante.findOne({ cedula });
    if (existeCedula) return res.status(400).json({ msg: "La cédula ya está registrada" });

    const existeEmail = await Estudiante.findOne({ email });
    if (existeEmail) return res.status(400).json({ msg: "El email ya está registrado" });

    const nuevoEstudiante = new Estudiante(req.body);
    await nuevoEstudiante.save();
    res.status(201).json(nuevoEstudiante);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Listar estudiantes
const listarEstudiantes = async (req, res) => {
  try {
    const estudiantes = await Estudiante.find();
    res.status(200).json(estudiantes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Actualizar estudiante por id
const actualizarEstudiante = async (req, res) => {
  try {
    const { id } = req.params;
    const estudiante = await Estudiante.findById(id);
    if (!estudiante) return res.status(404).json({ msg: "Estudiante no encontrado" });

    Object.assign(estudiante, req.body); // Actualiza todos los campos recibidos
    await estudiante.save();
    res.status(200).json(estudiante);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Eliminar estudiante por id
const eliminarEstudiante = async (req, res) => {
  try {
    const { id } = req.params;
    const estudiante = await Estudiante.findById(id);
    if (!estudiante) return res.status(404).json({ msg: "Estudiante no encontrado" });

    await estudiante.deleteOne();
    res.status(200).json({ msg: "Estudiante eliminado correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export { crearEstudiante, listarEstudiantes, actualizarEstudiante, eliminarEstudiante };
