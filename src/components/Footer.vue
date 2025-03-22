
<template>
    <footer>
        <ul>
            <li><a href="#"><i class="fas fa-info-circle"></i> Sobre Nosotros</a></li>
            <li><a href="#"><i class="fas fa-envelope"></i> Contacto</a></li>
            <li><a href="#"><i class="fas fa-shield-alt"></i> Política de Privacidad</a></li>
            <li><a href="#"><i class="fas fa-file-contract"></i> Términos y Condiciones</a></li>
        </ul>
        <p>&copy; 2025 Live Shop. Todos los derechos reservados.</p>
    </footer>
</template>


<script setup>

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
    flex-wrap: wrap; /* Permite que los elementos se ajusten en móviles */
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
    gap: 0.5rem; /* Espacio entre icono y texto */
    transition: color 0.3s ease;
}

footer ul li a:hover {
    color: var(--color-primario-hover);
}

/* Texto adicional del footer */
footer p {
    margin-top: 1rem;
    font-size: 0.9rem;
    opacity: 0.8;
}

/* Responsivo */
@media (max-width: 600px) {
    footer ul {
        flex-direction: column;
        gap: 0.8rem;
        align-items: center;
    }
}
</style>