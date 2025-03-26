async function obtenerEstadosVistas() {
    try {
        // Hacer la solicitud a la API
        const response = await fetch('/api/estados-vistas');
        const data = await response.json();

        // Verificar si la solicitud fue exitosa
        if (data.success) {
            const estados = data.data;

            // Obtener referencias a las opciones del menú
            const carnet = document.querySelector('.carnetOp');
            const planes = document.querySelector('.planes');

            // Obtener el estado de cada vista
            const estadoCarnets = estados.find(vista => vista.nombre_vista === 'sadi_invitado')?.estado || 'inactiva';
            const estadoPlanes = estados.find(vista => vista.nombre_vista === 'planes')?.estado || 'inactiva';

            // Habilitar o deshabilitar "Carnets" según el estado
            if (estadoCarnets === 'inactiva') {
                carnet.classList.add('disabled-option'); // Deshabilita "Carnets"
            } else {
                carnet.classList.remove('disabled-option'); // Habilita "Carnets"
            }

            // Habilitar o deshabilitar "Planes" según el estado
            if (estadoPlanes === 'inactiva') {
                planes.classList.add('disabled-option'); // Deshabilita "Planes"
            } else {
                planes.classList.remove('disabled-option'); // Habilita "Planes"
            }
        } else {
            console.error('Error al obtener los estados de las vistas:', data.message);
        }
    } catch (error) {
        console.error('Error al hacer la solicitud:', error);
    }
}

// Llamar a la función cuando la página cargue
window.onload = obtenerEstadosVistas;

document.addEventListener('DOMContentLoaded', async () => {
    // Elementos del DOM
    const nombreElement = document.getElementById('nombre');
    const cargoElement = document.getElementById('cargo');
    const cedulaElement = document.getElementById('cedula');
    const estadoElement = document.getElementById('estado');
    const imgElement = document.getElementById('imagenCarnet');

    // Mostrar estado de carga
    nombreElement.textContent = 'Cargando...';
    cargoElement.textContent = 'Cargando...';
    cedulaElement.textContent = 'Cargando...';
    estadoElement.textContent = 'Cargando...';
    imgElement.src = '/images/loading.gif';

    try {
        // Obtener ID de la URL
        const pathParts = window.location.pathname.split('/');
        const id = pathParts[pathParts.length - 1];

        // Hacer petición a la API
        const response = await fetch(`/trabajador/api/${id}`);
        
        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.status}`);
        }

        const trabajador = await response.json();

        // Asignar imagen
        imgElement.src = trabajador.imagenCarnet || '/images/default-profile.jpg';

        // Asignar valores a los elementos (con validación)
        nombreElement.textContent = trabajador.nombre || 'No especificado';
        cargoElement.textContent = trabajador.cargo || trabajador.Cargo || 'No especificado';
        cedulaElement.textContent = trabajador.cedula || trabajador.Cedula || 'No especificado';
        
        // Manejar diferentes nombres para el estado
        estadoElement.textContent = trabajador.estado || 
                                  trabajador.estado_carnet || 
                                  trabajador.Estado || 
                                  'No especificado';

    } catch (error) {
        console.error('Error al cargar datos:', error);
        
        // Mostrar mensaje de error
        nombreElement.textContent = 'Error';
        cargoElement.textContent = 'Error';
        cedulaElement.textContent = 'Error';
        estadoElement.textContent = 'Error';
        
        const errorElement = document.createElement('p');
        errorElement.style.color = 'red';
        errorElement.textContent = 'Error al cargar los datos. Por favor recarga la página.';
        document.querySelector('.datosComandante').appendChild(errorElement);
    }
});