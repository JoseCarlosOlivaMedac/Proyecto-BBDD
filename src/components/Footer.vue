
<template>
    <footer>
        <ul>
            <li><a href="#"><i class="fas fa-info-circle"></i> Sobre Nosotros</a></li>
            <li><a href="#"><i class="fas fa-envelope"></i> Contacto</a></li>
            <li><a href="#"><i class="fas fa-shield-alt"></i> Política de Privacidad</a></li>
            <li><a href="#"><i class="fas fa-file-contract"></i> Términos y Condiciones</a></li>
        </ul>
        <div class="footer-content">
      <p>&copy; 2025 Live Shop. Todos los derechos reservados.</p>
      <button @click="openModal" class="terms-btn">Términos y Condiciones</button>
    </div>

    <!-- Modal de Términos y Condiciones -->
    <TermsModal ref="termsModal" />
    </footer>
</template>


<script setup>
import { ref } from 'vue';
import TermsModal from './TermsModal.vue';

const termsModal = ref(null);

// Función para abrir el modal
const openModal = () => {
  termsModal.value.openModal();
};
</script>
<style scoped>
footer {
    background-color: #222;
    color: #fff;
    text-align: center;
    padding: 1.5rem 0;
    margin-top: 2rem;
    border-top: 3px solid var(--color-primario);
}

footer ul {
    list-style: none;
    padding: 0;
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    flex-wrap: wrap; 
}

footer ul li {
    transition: transform 0.3s ease, color 0.3s ease;
}

footer ul li:hover {
    transform: translateY(-10px);
}

footer ul li a {
    color: #fff;
    font-size: 1.2rem;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.5rem; 
    transition: color 0.3s ease;
}

footer ul li a:hover {
    color: var(--color-primario-hover);
}


footer p {
    margin-top: 1rem;
    font-size: 0.9rem;
    opacity: 0.8;
}
.terms-btn {
  display: inline-block;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background: linear-gradient(135deg, #7659e9, #5c36f2);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}


@media (max-width: 600px) {
    footer ul {
        flex-direction: column;
        gap: 0.8rem;
        align-items: center;
    }
}
</style>