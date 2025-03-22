<template>
    <div class="modal-overlay" v-if="isVisible" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-btn" @click="closeModal">✖</button>
        <h2>Términos y Condiciones</h2>
        <div class="terms-text">
          <p>
            Aquí van los términos y condiciones de uso del sitio. Es importante leerlos antes de continuar.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel turpis sed ante gravida condimentum.
          </p>
          <!-- Aquí puedes añadir todo el texto de los términos y condiciones -->
        </div>
        <button class="accept-btn" @click="acceptTerms">Aceptar</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const isVisible = ref(false);
  
  const openModal = () => {
    isVisible.value = true;
  };
  
  const closeModal = () => {
    isVisible.value = false;
  };
  
  const acceptTerms = () => {
    // Lógica cuando el usuario acepta los términos
    closeModal();
    console.log("Términos aceptados");
  };
  
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background: #fff;
    padding: 2rem;
    border-radius: 8px;
    width: 80%;
    max-width: 500px;
    position: relative;
    overflow-y: auto;
    max-height: 80vh;
  }
  
  button.close-btn {
    background: transparent;
    border: none;
    font-size: 2rem;
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    color: #333;
  }
  
  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .terms-text {
    max-height: 60vh;
    overflow-y: auto;
    margin-bottom: 1rem;
  }
  
  button.accept-btn {
    background-color: #5c36f2;
    color: white;
    padding: 0.7rem 1.5rem;
    border-radius: 6px;
    width: 100%;
    cursor: pointer;
    font-size: 1rem;
  }
  
  button.accept-btn:hover {
    background-color: #e67d00;
  }
  </style>
  