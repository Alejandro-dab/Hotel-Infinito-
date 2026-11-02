<script setup>
// Importación de herramientas necesarias de Vue y librerías
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

// Variables para manejar el estado de la vista
const listaHabitaciones = ref([]);
const usuarioActual = ref(null);
const estaCargando = ref(true);
const mensajeError = ref('');

// Se ejecuta al cargar el componente
onMounted(() => {
  const usuarioGuardado = localStorage.getItem('user');
  if (usuarioGuardado) {
    usuarioActual.value = JSON.parse(usuarioGuardado);
  }

  cargarHabitaciones();
});

// Petición al backend para obtener las habitaciones de la base de datos
const cargarHabitaciones = async () => {
  try {
    estaCargando.value = true;
    
    // Conexión real con el servidor para traer el inventario completo
    const respuesta = await axios.get(`${import.meta.env.VITE_API_URL}/api/habitaciones`);
    listaHabitaciones.value = respuesta.data;

  } catch (error) {
    console.error('Error al obtener el catálogo:', error);
    mensajeError.value = 'No se pudo conectar con el servidor.';
  } finally {
    estaCargando.value = false;
  }
};

// Cerrar sesión y volver al login
const cerrarSesion = () => {
  localStorage.removeItem('user');
  router.push('/');
};

// Acción al seleccionar una habitación
const manejarSeleccionHabitacion = (habitacion) => {
  alert(`Habitación seleccionada: ID #${habitacion.id_habitacion} (Piso ${habitacion.piso} - ${habitacion.categoria})`);
};
</script>

<template>
  <div class="contenedor-principal">
    
    <!-- Barra de navegación -->
    <header class="barra-superior">
      <div class="logo-titulo">
        <span class="subtitulo">HOTEL INFINITO</span>
        <h1>Exhibición General de Habitaciones</h1>
      </div>
      
      <div class="menu-usuario" v-if="usuarioActual">
        <span>Huésped: <strong>{{ usuarioActual.nombre }}</strong></span>
        <button @click="cerrarSesion" class="boton-salir">Cerrar Sesión</button>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="cuerpo-catalogo">
      
      <div v-if="estaCargando" class="alerta">Cargando habitaciones...</div>
      <div v-if="mensajeError" class="alerta error">{{ mensajeError }}</div>

      <!-- Recorrido por cada uno de los 3 pisos -->
      <div class="seccion-piso" v-for="numeroPiso in [1, 2, 3]" :key="numeroPiso">
        
        <div class="encabezado-piso">
          <h2>Piso {{ numeroPiso }}</h2>
          <hr class="linea-separadora" />
        </div>

        <!-- Cuadrícula de habitaciones filtradas por piso -->
        <div class="curicula-habitaciones">
          <div 
            class="tarjeta-habitacion" 
            v-for="hab in listaHabitaciones.filter(h => h.piso === numeroPiso)" 
            :key="hab.id_habitacion"
          >
            
            <!-- Imagen de la habitación -->
            <div class="contenedor-imagen" @click="manejarSeleccionHabitacion(hab)">
              <img :src="hab.preview" :alt="hab.categoria" />
              <span class="etiqueta-categoria" :class="hab.categoria.toLowerCase()">
                {{ hab.categoria }}
              </span>
            </div>
            
            <!-- Información y botones -->
            <div class="info-habitacion">
              <h3>Habitación #{{ hab.id_habitacion }}</h3>
              
              <div class="pie-tarjeta">
                <span class="precio">$ {{ hab.precio }} <small>MXN / día</small></span>
                
                <button @click="manejarSeleccionHabitacion(hab)" class="boton-accion">
                  Checar disponibilidad
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

    </main>
  </div>
</template>

<style scoped>
/* Contenedor principal */
.contenedor-principal {
  min-height: 100vh;
  background-color: #f7f9fa;
  font-family: Arial, sans-serif;
  color: #2c3e50;
}

/* Barra superior */
.barra-superior {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 3rem;
  background-color: #ffffff;
  border-bottom: 1px solid #eaeef2;
}

.subtitulo {
  font-size: 0.7rem;
  letter-spacing: 2px;
  color: #8c9ba5;
  font-weight: bold;
  text-transform: uppercase;
}

.logo-titulo h1 {
  font-size: 1.4rem;
  margin: 0.2rem 0 0 0;
  color: #1a252c;
}

.menu-usuario {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  font-size: 0.9rem;
}

.boton-salir {
  background: transparent;
  border: 1px solid #d5dadf;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
}

.boton-salir:hover {
  background-color: #fafbfc;
}

/* Catálogo y pisos */
.cuerpo-catalogo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.seccion-piso {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.encabezado-piso h2 {
  font-size: 1.1rem;
  color: #1a252c;
  text-transform: uppercase;
  margin: 0;
}

.linea-separadora {
  border: none;
  height: 1px;
  background-color: #eaeef2;
  margin-top: 0.5rem;
}

/* Grid de habitaciones */
.curicula-habitaciones {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}

/* Tarjetas */
.tarjeta-habitacion {
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #eaeef2;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
}

.contenedor-imagen {
  position: relative;
  height: 160px;
  cursor: pointer;
}

.contenedor-imagen img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.etiqueta-categoria {
  position: absolute;
  top: 10px;
  left: 10px;
  color: #ffffff;
  padding: 0.25rem 0.6rem;
  font-size: 0.7rem;
  border-radius: 4px;
  font-weight: bold;
  text-transform: uppercase;
}

.etiqueta-categoria.standard { background-color: #64748b; }
.etiqueta-categoria.deluxe { background-color: #d97706; }
.etiqueta-categoria.suite { background-color: #1e293b; }

/* Info de la habitación */
.info-habitacion {
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  flex: 1;
}

.info-habitacion h3 {
  margin: 0;
  font-size: 1rem;
  color: #1a252c;
}

.pie-tarjeta {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  border-top: 1px solid #f1f5f9;
  padding-top: 0.8rem;
}

.precio {
  font-weight: bold;
  font-size: 0.95rem;
}

.precio small {
  font-weight: normal;
  color: #7f8c8d;
}

/* Botón de acción */
.boton-accion {
  background-color: #1a252c;
  color: #ffffff;
  border: none;
  padding: 0.6rem;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  text-align: center;
}

.boton-accion:hover {
  background-color: #2c3e50;
}

.alerta {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
}
</style>