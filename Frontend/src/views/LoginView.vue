<script setup>
/**
 * Componente de Autenticación y Registro de Huéspedes
 * Interfaz minimalista adaptada al esquema relacional de la base de datos del hotel.
 */
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

// Estado para alternar entre el formulario de Login y Registro
const isRegister = ref(false);

// Datos del formulario de inicio de sesión
const loginData = ref({
  email: '',
  pass: ''
});

// Datos del formulario de registro alineados con la tabla Huespedes
const registerData = ref({
  nombre: '',
  ap_paterno: '',
  ap_materno: '',
  num: '', // Tratado como texto para evitar desbordamientos numéricos
  email: '',
  pass: '',
  confirmPassword: '',
  aceptaTerminos: false
});

// Control de estados de carga y retroalimentación visual
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

/**
 * Autentica al huésped validando sus credenciales contra el backend.
 */
const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';
  
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/huespedes`);
    const huespedes = response.data;

    const usuario = huespedes.find(
      h => h.email === loginData.value.email && h.pass === loginData.value.pass
    );

    if (usuario) {
      localStorage.setItem('user', JSON.stringify(usuario));
      router.push('/dashboard');
    } else {
      errorMessage.value = 'Correo o contraseña incorrectos.';
    }
  } catch (error) {
    console.error('Error de autenticación:', error);
    errorMessage.value = 'No se pudo conectar con el servidor.';
  } finally {
    loading.value = false;
  }
};

/**
 * Registra un nuevo huésped enviando la estructura exacta a la API.
 */
const handleRegister = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  if (registerData.value.pass !== registerData.value.confirmPassword) {
    errorMessage.value = 'Las contraseñas no coinciden.';
    return;
  }

  if (!registerData.value.aceptaTerminos) {
    errorMessage.value = 'Debe aceptar los términos y políticas de privacidad.';
    return;
  }

  loading.value = true;

  try {
    const nuevoHuesped = {
      nombre: registerData.value.nombre,
      ap_paterno: registerData.value.ap_paterno,
      ap_materno: registerData.value.ap_materno,
      num: registerData.value.num, // Enviado directamente como cadena de texto
      email: registerData.value.email,
      pass: registerData.value.pass
    };

    await axios.post(`${import.meta.env.VITE_API_URL}/api/huespedes`, nuevoHuesped);
    
    successMessage.value = 'Cuenta creada con éxito. Ya puede iniciar sesión.';
    isRegister.value = false;
  } catch (error) {
    console.error('Error en registro:', error);
    errorMessage.value = 'Error al registrar la cuenta. Verifique los datos.';
  } finally {
    loading.value = false;
  }
};

// Alterna entre vistas de login y registro limpiando alertas
const toggleView = (viewState) => {
  isRegister.value = viewState;
  errorMessage.value = '';
  successMessage.value = '';
};
</script>

<template>
  <div class="hotel-auth-container">
    <div class="hotel-auth-card">
      
      <div class="brand-header">
        <span class="hotel-badge">HOTEL DE LUJO</span>
        <h1>Hotel Infinito</h1>
        <p class="brand-subtitle">
          {{ isRegister ? 'Cree su perfil de huésped' : 'Bienvenido de nuevo' }}
        </p>
      </div>

      <!-- ================= LOGIN ================= -->
      <form v-if="!isRegister" @submit.prevent="handleLogin" class="auth-form">
        <div class="input-group">
          <label>Correo Electrónico</label>
          <input type="email" v-model="loginData.email" placeholder="correo@ejemplo.com" required />
        </div>

        <div class="input-group">
          <label>Contraseña</label>
          <input type="password" v-model="loginData.pass" placeholder="Ingrese su contraseña" required />
        </div>

        <button type="submit" class="btn-submit" :disabled="loading">
          {{ loading ? 'Accediendo...' : 'Iniciar Sesión' }}
        </button>
      </form>

      <!-- ================= REGISTRO ================= -->
      <form v-else @submit.prevent="handleRegister" class="auth-form">
        <div class="input-group">
          <label>Nombre(s)</label>
          <input type="text" v-model="registerData.nombre" placeholder="Ingrese su nombre" required />
        </div>

        <div class="form-row">
          <div class="input-group">
            <label>Apellido Paterno</label>
            <input type="text" v-model="registerData.ap_paterno" placeholder="Primer apellido" />
          </div>
          <div class="input-group">
            <label>Apellido Materno</label>
            <input type="text" v-model="registerData.ap_materno" placeholder="Segundo apellido" />
          </div>
        </div>

        <div class="form-row">
          <div class="input-group">
            <label>Teléfono / Número</label>
            <!-- Modificado a tipo text para soportar cadenas sin desbordar enteros -->
            <input type="text" v-model="registerData.num" placeholder="Número de contacto" />
          </div>
          <div class="input-group">
            <label>Correo Electrónico</label>
            <input type="email" v-model="registerData.email" placeholder="correo@ejemplo.com" required />
          </div>
        </div>

        <div class="form-row">
          <div class="input-group">
            <label>Contraseña</label>
            <input type="password" v-model="registerData.pass" placeholder="Mínimo 6 caracteres" required />
          </div>
          <div class="input-group">
            <label>Confirmar Contraseña</label>
            <input type="password" v-model="registerData.confirmPassword" placeholder="Repita la contraseña" required />
          </div>
        </div>

        <div class="terms-group">
          <input type="checkbox" id="terms" v-model="registerData.aceptaTerminos" />
          <label for="terms">Acepto los términos y políticas de privacidad</label>
        </div>

        <button type="submit" class="btn-submit" :disabled="loading">
          {{ loading ? 'Registrando...' : 'Registrar Cuenta' }}
        </button>
      </form>

      <p v-if="errorMessage" class="feedback-msg error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="feedback-msg success">{{ successMessage }}</p>

      <div class="auth-switch">
        <span v-if="!isRegister">¿No tiene una cuenta? <a @click="toggleView(true)">Regístrese aquí</a></span>
        <span v-else>¿Ya cuenta con acceso? <a @click="toggleView(false)">Inicie sesión</a></span>
      </div>

    </div>
  </div>
</template>

<style scoped>
.hotel-auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f7f9fa;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: #2c3e50;
  padding: 1rem;
}

.hotel-auth-card {
  background: #ffffff;
  padding: 2.5rem 2rem;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 480px;
  box-sizing: border-box;
  border: 1px solid #eaeef2;
}

.brand-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.hotel-badge {
  font-size: 0.7rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #8c9ba5;
  font-weight: 600;
  display: block;
  margin-bottom: 0.3rem;
}

.brand-header h1 {
  font-size: 1.6rem;
  font-weight: 400;
  color: #1a252c;
  margin: 0 0 0.3rem 0;
}

.brand-subtitle {
  color: #7f8c8d;
  font-size: 0.85rem;
  margin: 0;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: flex;
  gap: 0.8rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
  text-align: left;
}

.input-group label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #59656f;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.input-group input {
  padding: 0.7rem 0.9rem;
  border: 1px solid #d5dadf;
  border-radius: 6px;
  font-size: 0.9rem;
  outline: none;
  background-color: #fafbfc;
  color: #2c3e50;
  box-sizing: border-box;
  width: 100%;
}

.input-group input:focus {
  border-color: #1a252c;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(26, 37, 44, 0.05);
}

.terms-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #6c7a89;
  margin-top: 0.1rem;
}

.terms-group input[type="checkbox"] {
  accent-color: #1a252c;
  cursor: pointer;
}

.btn-submit {
  width: 100%;
  padding: 0.8rem;
  background-color: #1a252c;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 0.3rem;
}

.btn-submit:hover {
  background-color: #2c3e50;
}

.btn-submit:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.feedback-msg {
  font-size: 0.8rem;
  text-align: center;
  margin-top: 1rem;
}

.feedback-msg.error {
  color: #c0392b;
}

.feedback-msg.success {
  color: #27ae60;
}

.auth-switch {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.8rem;
  color: #7f8c8d;
  border-top: 1px solid #eaeef2;
  padding-top: 1.2rem;
}

.auth-switch a {
  color: #1a252c;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  margin-left: 0.3rem;
}
</style>