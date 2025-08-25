// Requerir los módulos
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import routerUsuarios from "./routers/usuario_routes.js";
import routerMaterias from "./routers/materia_routes.js";
import routerEstudiantes from "./routers/estudiante_routes.js";
import routerMatriculas from "./routers/matricula_routes.js";



// Inicializaciones
const app = express()
dotenv.config()

// Configuraciones 
app.set('port',process.env.port || 3000)
app.use(cors())

// Middlewares 
app.use(express.json())


// Variables globales
// Rutas de usuarios
app.use("/api/usuarios", routerUsuarios);
app.use("/api/materias", routerMaterias);
app.use("/api/estudiantes", routerEstudiantes);
app.use("/api/matriculas", routerMatriculas);

// Rutas 
app.get('/',(req,res)=>{
    res.send("Server on")
})

// Exportar la instancia de express por medio de app
export default  app