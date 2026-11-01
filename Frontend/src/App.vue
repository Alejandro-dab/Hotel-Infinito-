<script setup>
/**
 * Componente Principal (App.vue)
 * Sirve como contenedor global y renderiza las vistas definidas en Vue Router.
 */
import { RouterView } from 'vue-router';
</script>

<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<style>
/* Estilos globales para reiniciar márgenes */
#app {
  margin: 0;
  padding: 0;
  font-family: Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>