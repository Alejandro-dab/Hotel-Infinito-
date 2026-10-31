import 'dotenv/config'; // Carga las variables de entorno de manera segura (.env)
import mysql from 'mysql2'; //Modulo de conexión MYSQL

console.log("=== CARGANDO CONFIGURACIÓN DE BASE DE DATOS ===");
console.log("DB_HOST:", process.env.DB_HOST || process.env.MYSQLHOST);

// El pool abre conexiones nuevas solo cuando se necesitan.
const pool = mysql.createPool({
    host: process.env.DB_HOST || process.env.MYSQLHOST,
    user: process.env.DB_USER || process.env.MYSQLUSER,
    password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
    database: process.env.DB_NAME || process.env.MYSQLDATABASE,
    port: process.env.DB_PORT || process.env.MYSQLPORT || 3306,

    //? ssl define los parametros de cifrado entre Node.js y MySQL en la nube
    //Si el DB_SSL es igual a true entonces recibira ese objeto, si es false (como en local) 
    // false en lugar de undefined, evita que la librería mysql2 se confunda en local y garantiza que apague el cifrado correctamente.
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,


    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((error, connection) => {
    if (error) {
        console.log("Error de conexión:", error);
        return;
    }
    console.log("¡Conectado a la Base de Datos exitosamente!");
    connection.release(); // solo probamos, el pool maneja el resto
});

export default pool;