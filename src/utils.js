//Este archivo se encarga de transformar el mapa de Productos.vue en un objeto que podamos 
//llamar desde cualquier sitio del proyecto
export function getImageUrl(productId, defaultImage = '/imagenes/placeholder.jpg') {
    if (!productId) return defaultImage;
    
    try {
      // Extraemos números del ID (los IDs de Firebase suelen tener caracteres especiales)
      const num = parseInt(productId.replace(/\D/g, '')) || 1;
      const imageNumber = Math.max(1, Math.min(num, 20));
      
      // Usamos rutas absolutas desde la raíz del dominio
      return `/imagenes/producto(${imageNumber}).jpg`;
    } catch (error) {
      console.error('Error generando URL de imagen:', error);
      return defaultImage;
    }
}