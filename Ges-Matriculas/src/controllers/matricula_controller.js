import Matricula from "../models/Matricula.js";
import Estudiante from "../models/Estudiante.js";
import Materia from "../models/Materia.js";

// Crear matrícula
const crearMatricula = async (req, res) => {
  try {
    const { codigo, descripcion, estudianteId, materiaId } = req.body;

    if (!codigo || !estudianteId || !materiaId) {
      return res.status(400).json({ msg: "Código, estudiante y materia son obligatorios" });
    }

    const existeCodigo = await Matricula.findOne({ codigo });
    if (existeCodigo) return res.status(400).json({ msg: "El código de matrícula ya existe" });

    // Verificar existencia de estudiante y materia
    const estudiante = await Estudiante.findById(estudianteId);
    if (!estudiante) return res.status(404).json({ msg: "Estudiante no encontrado" });

    const materia = await Materia.findById(materiaId);
    if (!materia) return res.status(404).json({ msg: "Materia no encontrada" });

    const nuevaMatricula = new Matricula({
      codigo,
      descripcion,
      estudiante: estudianteId,
      materia: materiaId
    });

    await nuevaMatricula.save();
    res.status(201).json(nuevaMatricula);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Listar matrículas con detalles de estudiante y materia
const listarMatriculas = async (req, res) => {
  try {
    const matriculas = await Matricula.find()
      .populate("estudiante", "nombre apellido cedula email")
      .populate("materia", "nombre codigo creditos");
    res.status(200).json(matriculas);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Actualizar matrícula por id
const actualizarMatricula = async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo, descripcion, estudianteId, materiaId } = req.body;

    const matricula = await Matricula.findById(id);
    if (!matricula) return res.status(404).json({ msg: "Matrícula no encontrada" });

    matricula.codigo = codigo || matricula.codigo;
    matricula.descripcion = descripcion || matricula.descripcion;
    matricula.estudiante = estudianteId || matricula.estudiante;
    matricula.materia = materiaId || matricula.materia;

    await matricula.save();
    res.status(200).json(matricula);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Eliminar matrícula por id
const eliminarMatricula = async (req, res) => {
  try {
    const { id } = req.params;
    const matricula = await Matricula.findById(id);
    if (!matricula) return res.status(404).json({ msg: "Matrícula no encontrada" });

    await matricula.deleteOne();
    res.status(200).json({ msg: "Matrícula eliminada correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export { crearMatricula, listarMatriculas, actualizarMatricula, eliminarMatricula };
