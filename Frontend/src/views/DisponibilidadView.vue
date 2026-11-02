<script setup>
// Importación de hooks de Vue y librerías para manejo de rutas y peticiones HTTP
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import clienteAxios from '@/services/axios.js';

const route = useRoute();
const router = useRouter();

// Declaración de variables reactivas para el estado del componente
const habitacionId = ref(null);
const habitacionDetalle = ref(null);
const usuarioActual = ref(null);

// Variables asociadas al formulario de fechas y control del flujo
const fechaInicio = ref('');
const fechaFin = ref('');
const disponibilidadVerificada = ref(false);

// Campos correspondientes al formulario de pago simulado
const numeroTarjeta = ref('');
const mesExpiracion = ref('');
const cvv = ref('');

// Variables de control visual (carga y alertas)
const estaCargando = ref(false);
const mensajeError = ref('');
const mensajeExito = ref('');

// Obtención de la fecha actual en formato YYYY-MM-DD para limitar el selector
const fechaMinima = new Date().toISOString().split('T')[0];

/**
 * Hook de ciclo de vida: Recupera la sesión del usuario del almacenamiento local 
 * y extrae el identificador de la habitación desde los parámetros de la URL.
 */
onMounted(async () => {
  const usuarioGuardado = localStorage.getItem('user');
  if (usuarioGuardado) {
    usuarioActual.value = JSON.parse(usuarioGuardado);
  }

  habitacionId.value = route.query.habitacionId;
  if (habitacionId.value) {
    await obtenerDetalleHabitacion();
  } else {
    mensajeError.value = 'No se especificó una habitación válida.';
  }
});

/**
 * Realiza una petición al servidor para obtener el catálogo completo 
 * y filtrar la información correspondiente a la habitación seleccionada.
 */
const obtenerDetalleHabitacion = async () => {
  try {
    const respuesta = await clienteAxios.get('/api/habitaciones');
    habitacionDetalle.value = respuesta.data.find(h => h.id_habitacion == habitacionId.value);
  } catch (error) {
    console.error('Error al obtener la habitación:', error);
    mensajeError.value = 'No se pudieron cargar los datos de la habitación.';
  }
};

/**
 * Propiedad computada: Calcula de forma dinámica el número de noches 
 * en función del rango de fechas seleccionado.
 */
const diasCalculados = computed(() => {
  if (!fechaInicio.value || !fechaFin.value) return 0;
  const inicio = new Date(fechaInicio.value);
  const fin = new Date(fechaFin.value);
  const diff = fin - inicio;
  const dias = diff / (1000 * 60 * 60 * 24);
  return dias > 0 ? dias : 0;
});

/**
 * Propiedad computada: Calcula el costo total estimado de la estancia 
 * multiplicando las noches por el precio diario de la habitación.
 */
const precioTotalEstimado = computed(() => {
  if (!habitacionDetalle.value || diasCalculados.value <= 0) return 0;
  return diasCalculados.value * habitacionDetalle.value.precio;
});

/**
 * Fase 1: Valida localmente el rango de fechas seleccionado antes de habilitar el pago.
 * Comprueba límites temporales y la regla máxima de 14 días.
 */
const checarDisponibilidadFechas = async () => {
  // Limpiamos mensajes previos y ocultamos el pago por seguridad antes de evaluar
  mensajeError.value = '';
  mensajeExito.value = '';
  disponibilidadVerificada.value = false; 

  if (!fechaInicio.value || !fechaFin.value) {
    mensajeError.value = 'Por favor seleccione la fecha de entrada y salida.';
    return;
  }

  if (diasCalculados.value <= 0) {
    mensajeError.value = 'La fecha de salida debe ser posterior a la de entrada.';
    return;
  }

  if (diasCalculados.value > 14) {
    mensajeError.value = 'El límite máximo de reserva es de 2 semanas (14 días).';
    return;
  }

  try {
    estaCargando.value = true;

    // Petición al endpoint de disponibilidad del backend para validar traslapes reales en MySQL
    const respuesta = await clienteAxios.post('/api/reservaciones', {
      id_habitacion_fk: habitacionId.value,
      fecha_inicio: fechaInicio.value,
      fecha_fin: fechaFin.value
    });

    // Si el servidor confirma disponibilidad sin cruces, desplegamos el formulario de pago
    if (respuesta.data.disponible) {
      disponibilidadVerificada.value = true;
      mensajeExito.value = '¡Fechas disponibles! Ingrese sus datos de pago para confirmar.';
    }

  } catch (error) {
    console.error('Error al verificar disponibilidad:', error);
    // Si hay traslape (409) u otro error, se mantiene bloqueado el formulario de pago
    disponibilidadVerificada.value = false; 
    
    if (error.response && error.response.data && error.response.data.mensaje) {
      mensajeError.value = error.response.data.mensaje;
    } else {
      mensajeError.value = 'No se pudo verificar la disponibilidad con el servidor.';
    }
  } finally {
    estaCargando.value = false;
  }
};

/**
 * Fase 2: Envía los datos al backend para procesar la transacción unificada 
 * (verificación antitraslape, registro de reservación y almacenamiento del pago).
 */
const procesarPagoYConfirmar = async () => {
  mensajeError.value = '';

  if (!numeroTarjeta.value || !mesExpiracion.value || !cvv.value) {
    mensajeError.value = 'Complete todos los campos del método de pago.';
    return;
  }

  try {
    estaCargando.value = true;

    const datosTransaccion = {
      id_huesped_fk: usuarioActual.value ? usuarioActual.value.id_huesped : 1,
      id_habitacion_fk: habitacionId.value,
      fecha_inicio: fechaInicio.value,
      fecha_fin: fechaFin.value,
      numero_tarjeta: numeroTarjeta.value
    };

    const respuesta = await clienteAxios.post('/api/pagos', datosTransaccion);
    
    mensajeExito.value = respuesta.data.mensaje;

    // Redirección automática al panel principal tras completar la reserva exitosamente
    setTimeout(() => {
      router.push('/dashboard');
    }, 2500);

  } catch (error) {
    console.error('Error en el proceso de pago:', error);
    if (error.response && error.response.data && error.response.data.mensaje) {
      mensajeError.value = error.response.data.mensaje;
    } else {
      mensajeError.value = 'Error al procesar la solicitud con el servidor.';
    }
  } finally {
    estaCargando.value = false;
  }
};

/**
 * Redirige al usuario de regreso al catálogo principal de habitaciones.
 */
const volverAlCatalogo = () => {
  router.push('/dashboard');
};
</script>

<template>
  <div class="contenedor-principal">
    
    <!-- Barra de navegación superior -->
    <header class="barra-superior">
      <div class="logo-titulo">
        <span class="subtitulo">HOTEL INFINITO</span>
        <h1>Proceso de Reservación y Pago</h1>
      </div>
      <button @click="volverAlCatalogo" class="boton-volver">Volver al catálogo</button>
    </header>

    <!-- Contenedor principal de la vista de disponibilidad -->
    <main class="cuerpo-disponibilidad" v-if="habitacionDetalle">
      
      <!-- Panel lateral con la información visual de la habitación -->
      <div class="tarjeta-detalle">
        <img :src="habitacionDetalle.preview" :alt="habitacionDetalle.categoria" class="imagen-preview" />
        <div class="info-detalle">
          <h2>Habitación #{{ habitacionDetalle.id_habitacion }}</h2>
          <span class="etiqueta-categoria">{{ habitacionDetalle.categoria }}</span>
          <p class="piso-texto">Piso {{ habitacionDetalle.piso }}</p>
          <p class="precio-dia">$ {{ habitacionDetalle.precio }} <small>MXN / día</small></p>
        </div>
      </div>

      <!-- Formulario para la selección de fechas y datos de pago -->
      <div class="formulario-fechas">
        <h3>Seleccione su periodo de estancia</h3>
        <p class="instruccion">Máximo 14 días de estancia</p>

        <!-- Controles para el rango de fechas -->
        <div class="grupo-fechas">
          <div class="campo-fecha">
            <label>Fecha de entrada</label>
            <input type="date" v-model="fechaInicio" :min="fechaMinima" :disabled="disponibilidadVerificada" />
          </div>

          <div class="campo-fecha">
            <label>Fecha de salida</label>
            <input type="date" v-model="fechaFin" :min="fechaInicio || fechaMinima" :disabled="disponibilidadVerificada" />
          </div>
        </div>

        <!-- Resumen del cálculo de costos -->
        <div class="resumen-calculo" v-if="diasCalculados > 0">
          <p>Estancia: <strong>{{ diasCalculados }} noche(s)</strong></p>
          <p class="total-monto">Total a pagar: <strong>$ {{ precioTotalEstimado.toLocaleString() }} MXN</strong></p>
        </div>

        <!-- Cuestionario de pago (Se despliega únicamente tras verificar disponibilidad) -->
        <div class="seccion-pago" v-if="disponibilidadVerificada">
          <h4>Datos de Pago en Línea</h4>
          <div class="campo-fecha">
            <label>Número de Tarjeta</label>
            <input type="text" v-model="numeroTarjeta" placeholder="4532 •••• •••• 1234" maxlength="16" />
          </div>
          <div class="fila-doble">
            <div class="campo-fecha">
              <label>Expiración (MM/AA)</label>
              <input type="text" v-model="mesExpiracion" placeholder="12/28" maxlength="5" />
            </div>
            <div class="campo-fecha">
              <label>CVV</label>
              <input type="password" v-model="cvv" placeholder="123" maxlength="4" />
            </div>
          </div>
        </div>

        <!-- Alertas de retroalimentación para el usuario -->
        <div v-if="mensajeError" class="alerta error">{{ mensajeError }}</div>
        <div v-if="mensajeExito" class="alerta exito">{{ mensajeExito }}</div>

        <!-- Botón de acción condicional (Fase de validación o Fase de pago) -->
        <button 
          v-if="!disponibilidadVerificada" 
          @click="checarDisponibilidadFechas" 
          class="boton-confirmar"
        >
          Checar disponibilidad
        </button>

        <button 
          v-else 
          @click="procesarPagoYConfirmar" 
          class="boton-confirmar pago" 
          :disabled="estaCargando"
        >
          {{ estaCargando ? 'Procesando pago...' : 'Pagar y Confirmar Reserva' }}
        </button>
      </div>

    </main>
  </div>
</template>

<style scoped>
/* Estructura y diseño general de la vista */
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
}

.logo-titulo h1 { 
  font-size: 1.4rem; 
  margin: 0.2rem 0 0 0; 
  color: #1a252c; 
}

.boton-volver { 
  background: transparent; 
  border: 1px solid #d5dadf; 
  padding: 0.5rem 1rem; 
  border-radius: 6px; 
  cursor: pointer; 
}

/* Contenedor central del formulario */
.cuerpo-disponibilidad { 
  max-width: 900px; 
  margin: 2rem auto; 
  padding: 1.5rem; 
  display: grid; 
  grid-template-columns: 1fr 1fr; 
  gap: 2rem; 
  background: #ffffff; 
  border-radius: 8px; 
  border: 1px solid #eaeef2; 
}

/* Tarjeta informativa de la habitación */
.tarjeta-detalle { 
  display: flex; 
  flex-direction: column; 
  gap: 1rem; 
}

.imagen-preview { 
  width: 100%; 
  height: 220px; 
  object-fit: cover; 
  border-radius: 6px; 
}

.info-detalle h2 { 
  margin: 0; 
  font-size: 1.3rem; 
}

.etiqueta-categoria { 
  display: inline-block; 
  background: #1a252c; 
  color: #ffffff; 
  padding: 0.2rem 0.6rem; 
  font-size: 0.75rem; 
  border-radius: 4px; 
  margin-top: 0.4rem; 
}

.piso-texto { 
  color: #7f8c8d; 
  font-size: 0.9rem; 
  margin: 0.3rem 0; 
}

.precio-dia { 
  font-size: 1.1rem; 
  font-weight: bold; 
}

/* Formulario de fechas y pagos */
.formulario-fechas { 
  display: flex; 
  flex-direction: column; 
  gap: 1rem; 
}

.formulario-fechas h3, .formulario-fechas h4 { 
  margin: 0; 
  font-size: 1.1rem; 
}

.instruccion { 
  font-size: 0.8rem; 
  color: #7f8c8d; 
  margin: 0; 
}

.grupo-fechas, .fila-doble { 
  display: flex; 
  gap: 1rem; 
}

.fila-doble > div { 
  flex: 1; 
}

.campo-fecha { 
  display: flex; 
  flex-direction: column; 
  gap: 0.3rem; 
}

.campo-fecha label { 
  font-size: 0.85rem; 
  color: #59656f; 
}

.campo-fecha input { 
  padding: 0.6rem; 
  border: 1px solid #d5dadf; 
  border-radius: 6px; 
  font-size: 0.9rem; 
}

/* Resumen financiero */
.resumen-calculo { 
  background: #f8fafc; 
  padding: 0.8rem; 
  border-radius: 6px; 
  border: 1px solid #e2e8f0; 
}

.resumen-calculo p { 
  margin: 0.2rem 0; 
  font-size: 0.9rem; 
}

.total-monto { 
  font-size: 1.05rem; 
  color: #1a252c; 
  font-weight: bold; 
}

/* Secciones secundarias */
.seccion-pago { 
  border-top: 1px solid #eaeef2; 
  padding-top: 1rem; 
  display: flex; 
  flex-direction: column; 
  gap: 0.8rem; 
}

/* Botones de acción */
.boton-confirmar { 
  background-color: #1a252c; 
  color: #ffffff; 
  border: none; 
  padding: 0.8rem; 
  border-radius: 6px; 
  font-size: 0.9rem; 
  cursor: pointer; 
  text-align: center; 
}

.boton-confirmar.pago { 
  background-color: #27ae60; 
}

.boton-confirmar:disabled { 
  background-color: #bdc3c7; 
  cursor: not-allowed; 
}

/* Componentes de alerta */
.alerta { 
  padding: 0.8rem; 
  border-radius: 6px; 
  font-size: 0.85rem; 
  text-align: center; 
}

.alerta.error { 
  background-color: #fde8e8; 
  color: #c0392b; 
}

.alerta.exito { 
  background-color: #e8f8f0; 
  color: #27ae60; 
}
</style>