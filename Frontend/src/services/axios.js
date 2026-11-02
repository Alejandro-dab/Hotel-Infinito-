/**
 * Configuración centralizada de Axios
 * Establece la URL base mediante variables de entorno y habilita credenciales.
 */
import axios from 'axios';

const clienteAxios = axios.create({
    // Toma la URL de producción o desarrollo según el entorno de compilación
    baseURL: import.meta.env.VITE_API_URL,
    // Permite el envío de cookies y cabeceras de autorización entre dominios
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default clienteAxios;