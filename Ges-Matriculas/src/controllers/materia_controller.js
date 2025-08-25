import Materia from "../models/Materia.js";

// Crear materia
const crearMateria = async (req, res) => {
  try {
    const { nombre, codigo, descripcion, creditos } = req.body;
    if (!nombre || !codigo || !creditos) {
      return res.status(400).json({ msg: "Los campos nombre, código y créditos son obligatorios" });
    }

    const existeCodigo = await Materia.findOne({ codigo });
    if (existeCodigo) {
      return res.status(400).json({ msg: "El código de materia ya existe" });
    }

    const nuevaMateria = new Materia({ nombre, codigo, descripcion, creditos });
    await nuevaMateria.save();
    res.status(201).json(nuevaMateria);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Listar todas las materias
const listarMaterias = async (req, res) => {
  try {
    const materias = await Materia.find();
    res.status(200).json(materias);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Actualizar materia por id
const actualizarMateria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, codigo, descripcion, creditos } = req.body;

    const materia = await Materia.findById(id);
    if (!materia) return res.status(404).json({ msg: "Materia no encontrada" });

    materia.nombre = nombre || materia.nombre;
    materia.codigo = codigo || materia.codigo;
    materia.descripcion = descripcion || materia.descripcion;
    materia.creditos = creditos || materia.creditos;

    await materia.save();
    res.status(200).json(materia);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Eliminar materia por id
const eliminarMateria = async (req, res) => {
  try {
    const { id } = req.params;
    const materia = await Materia.findById(id);
    if (!materia) return res.status(404).json({ msg: "Materia no encontrada" });

    await materia.deleteOne();
    res.status(200).json({ msg: "Materia eliminada correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export { crearMateria, listarMaterias, actualizarMateria, eliminarMateria };
