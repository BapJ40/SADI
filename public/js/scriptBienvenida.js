// Función para obtener los estados de las vistas
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