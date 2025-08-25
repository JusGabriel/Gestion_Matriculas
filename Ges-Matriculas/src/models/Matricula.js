import { Schema, model } from "mongoose";

const matriculaSchema = new Schema(
  {
    codigo: { type: Number, required: true, unique: true },
    descripcion: { type: String, trim: true },
    estudiante: { type: Schema.Types.ObjectId, ref: "Estudiante", required: true },
    materia: { type: Schema.Types.ObjectId, ref: "Materia", required: true },
  },
  { timestamps: true }
);

export default model("Matricula", matriculaSchema);
