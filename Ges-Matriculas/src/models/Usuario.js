import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  apellido: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  token: { type: String, default: null },
  confirmEmail: {
  type: Boolean,
  default: false
},
  password: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    default: "usuario", // admin, estudiante, etc.
  },
  status: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true
});

// Cifrar password antes de guardarlo
usuarioSchema.methods.encryptPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Comparar password
usuarioSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default model("Usuario", usuarioSchema);
