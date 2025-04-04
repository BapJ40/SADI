/**
 * Función para abrir el modal de edición y cargar los datos de la planificación.
 * @param {number} planificacionId - El ID de la planificación a editar.
 */

// Función para verificar y eliminar planificaciones expiradas
// async function verificarExpiracion() {
//     try {
//         const response = await fetch('/planificaciones-info');
//         if (!response.ok) {
//             throw new Error(`No se pudo obtener la lista de planificaciones: ${response.status}`);
//         }
//         const planificaciones = await response.json();

//         const ahora = new Date();

//         planificaciones.forEach(async (planificacion) => {
//             const fechaExpiracion = new Date(planificacion.fecha_expiracion);
//             fechaExpiracion.setDate(fechaExpiracion.getDate()); // Ajuste de zona horaria
//             console.log('Fecha de expiración recibida:', fechaExpiracion);
//             if (fechaExpiracion < ahora) {
//                 try {
//                     const response = await fetch(`/planificaciones-info/${planificacion.id}`, {
//                         method: 'DELETE'
//                     });
//                     if (!response.ok) {
//                         throw new Error(`Error al eliminar la planificación: ${response.status}`);
//                     }
//                     console.log(`Planificación ${planificacion.id} eliminada por expiración`);
//                 } catch (error) {
//                     console.error('Error al eliminar la planificación:', error);
//                 }
//             }
//         });
//     } catch (error) {
//         console.error('Error al verificar expiración de planificaciones:', error);
//     }
// }

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

            // Obtener el estado de cada vista
            const estadoCarnets = estados.find(vista => vista.nombre_vista === 'sadi_invitado')?.estado || 'inactiva';

            // Habilitar o deshabilitar "Carnets" según el estado
            if (estadoCarnets === 'inactiva') {
                carnet.classList.add('disabled-option'); // Deshabilita "Carnets"
            } else {
                carnet.classList.remove('disabled-option'); // Habilita "Carnets"
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
    // Verificar y eliminar planificaciones expiradas al cargar la página
    // await verificarExpiracion();

    // Cargar planificaciones iniciales al cargar la página
    const divPlanificaciones = document.querySelector('.planificacionesContainer');

    try {
        const response = await fetch('/planes/planificaciones-info');
        if (!response.ok) {
            throw new Error(`No se pudo obtener la lista de planificaciones: ${response.status}`);
        }
        const planificaciones = await response.json();

        divPlanificaciones.innerHTML = ''; // Limpiar el contenedor antes de añadir

        if (planificaciones.length === 0) { // Verificar si la lista de planificaciones está vacía
            divPlanificaciones.innerHTML = '<p class="descripcionPlanes">No hay planificaciones disponibles en este momento.</p>'; // Mostrar mensaje si no hay planes
        } else {
            planificaciones.forEach(planificacion => {
                let imagenHTML = '';
                if (planificacion.imagen_url) {
                    imagenHTML = `<img class="imagenPlanes" src="${planificacion.imagen_url}" alt="${planificacion.titulo}">`;
                } else {
                    imagenHTML = '<p class="descripcionPlanes">No hay imagen disponible</p>';
                }

                const planes = document.createRange().createContextualFragment(`
                    <div class="plan">
                        <div class="planContent">
                            <h3 class="tituloPlanes">${planificacion.titulo}</h3>
                            <p class="descripcionPlanes">${planificacion.descripcion}</p>
                            ${imagenHTML}
                        </div>
                    </div>
                `);
                divPlanificaciones.appendChild(planes);
            });
        }

    } catch (error) {
        console.error('Error al cargar planificaciones:', error.message);
        divPlanificaciones.innerHTML = '<p>Error al cargar las planificaciones. Por favor, intenta de nuevo más tarde.</p>'; // Mensaje de error si falla la carga
    }

});