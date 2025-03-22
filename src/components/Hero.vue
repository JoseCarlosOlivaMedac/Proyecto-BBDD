<template>
  <section class="hero">
    <div class="hero-overlay">
      <div class="hero-text" :class="{ 'fade-in': isVisible }">
        <h2>Explora nuestra tienda</h2>
        <p>Conoce nuestra colección exclusiva</p>
        <a href="#" class="btn-primary">Ver productos</a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue";

const isVisible = ref(false);

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true;
  }, 200);
});
</script>

<style scoped>
.hero {
  background-image: url("/public/imagenes/hero_background.jpg");
  background-position: center;
  background-size: cover;
  background-attachment: fixed;
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-overlay {
  background: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.hero-text {
  color: #ffffff;
  max-width: 600px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.fade-in {
  opacity: 1;
  transform: translateY(0);
}

.hero-text h2 {
  font-size: 2.8rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.hero-text p {
  font-size: 1.3rem;
  margin-bottom: 2rem;
  color: #ddd;
}

.btn-primary {
  background-color: var(--color-primario);
  color: #fff;
  text-decoration: none;
  padding: 0.8rem 1.8rem;
  border-radius: 8px;
  font-weight: bold;
  transition: background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
  display: inline-block;
}

.btn-primary:hover {
  background-color: var(--color-primario-hover);
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) {
  .hero {
    height: 50vh;
  }

  .hero-text h2 {
    font-size: 2.2rem;
  }

  .hero-text p {
    font-size: 1.1rem;
  }

  .btn-primary {
    padding: 0.7rem 1.5rem;
  }
}
</style>
