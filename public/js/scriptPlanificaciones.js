/**
 * Función para abrir el modal de edición y cargar los datos de la planificación.
 * @param {number} planificacionId - El ID de la planificación a editar.
 */
function abrirModalEditarPlanificacion(planificacionId) {
    fetch(`/planificaciones-info/${planificacionId}`) // Obtener datos para editar
        .then(response => {
            if (!response.ok) {
                throw new Error(`No se pudo obtener la planificación: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('id').value = data.id; // Cambiado a 'id'
            document.getElementById('tituloEditar').value = data.titulo;
            document.getElementById('descripcionEditar').value = data.descripcion;

            const imagenPreview = document.getElementById('imagen_preview');
            if (data.imagen_url) {
                imagenPreview.src = data.imagen_url;
                imagenPreview.style.display = 'block';
            } else {
                imagenPreview.src = '';
                imagenPreview.style.display = 'none';
            }

            console.count('Inicialización Modal Editar')
        })
        .catch(error => {
            console.error('Error al cargar datos para editar:', error);
            alert(`Error al cargar datos para editar: ${error.message}`);
        });
}

document.getElementById('imagenEditar').addEventListener('change', (event) => {
    const imagenPreview = document.getElementById('imagen_preview');
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagenPreview.src = e.target.result;
            imagenPreview.style.display = 'block';
        }
        reader.readAsDataURL(file);
    } else {
        imagenPreview.src = '';
        imagenPreview.style.display = 'none';
    }
});

// Función para verificar y eliminar planificaciones expiradas
async function verificarExpiracion() {
    try {
        const response = await fetch('/planificaciones-info');
        if (!response.ok) {
            throw new Error(`No se pudo obtener la lista de planificaciones: ${response.status}`);
        }
        const planificaciones = await response.json();

        const ahora = new Date();

        planificaciones.forEach(async (planificacion) => {
            const fechaExpiracion = new Date(planificacion.fecha_expiracion);
            fechaExpiracion.setDate(fechaExpiracion.getDate()); // Ajuste de zona horaria
            console.log('Fecha de expiración recibida:', fechaExpiracion);
            if (fechaExpiracion < ahora) {
                try {
                    const response = await fetch(`/planificaciones-info/${planificacion.id}`, {
                        method: 'DELETE'
                    });
                    if (!response.ok) {
                        throw new Error(`Error al eliminar la planificación: ${response.status}`);
                    }
                    console.log(`Planificación ${planificacion.id} eliminada por expiración`);
                } catch (error) {
                    console.error('Error al eliminar la planificación:', error);
                }
            }
        });
    } catch (error) {
        console.error('Error al verificar expiración de planificaciones:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar y eliminar planificaciones expiradas al cargar la página
    await verificarExpiracion();

    // Cargar planificaciones iniciales al cargar la página
    const divPlanificaciones = document.querySelector('.planificacionesContainer');

    try {
        const response = await fetch('/planificaciones-info');
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
                        <div class="planButtons" style="text-align: center; margin-top: 10px;">
                            <button type="button" class="btn btn-primary btnModificar" data-bs-toggle="modal" data-bs-target="#editarPlanificacionModal" data-id="${planificacion.id}">
                                Editar Planificación
                            </button>
                            <button type="button" class="btn btn-danger" data-id="${planificacion.id}">
                                Eliminar Planificación
                            </button>
                        </div>
                    </div>
                `);
                divPlanificaciones.appendChild(planes);
            });
        }

        // Event Listener para los botones de edición (dentro del contenedor de planificaciones)
        divPlanificaciones.addEventListener('click', (event) => {
            if (event.target.classList.contains('btnModificar')) {
                const planificacionId = event.target.dataset.id;
                abrirModalEditarPlanificacion(parseInt(planificacionId, 10));
            }
        });


    } catch (error) {
        console.error('Error al cargar planificaciones:', error.message);
        divPlanificaciones.innerHTML = '<p>Error al cargar las planificaciones. Por favor, intenta de nuevo más tarde.</p>'; // Mensaje de error si falla la carga
    }

    // ---  NUEVO EVENT LISTENER PARA EL FORMULARIO DE EDICIÓN (PUT) ---
    const formEditarPlanificacion = document.getElementById('formEditarPlanificacion');
    formEditarPlanificacion.addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar el envío normal del formulario (POST)

        const formData = new FormData(formEditarPlanificacion);
        const idValue = document.getElementById('id').value; // Cambiado a 'id' y renombrado variable para claridad
        const url = `/planificaciones-info/${idValue}`; // **URL PARA EL PUT (MISMA RUTA PERO CON PUT)**

        fetch(url, {
            method: 'PUT', // **Método PUT**
            body: formData // Enviar FormData para archivos y datos de formulario
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud PUT: ${response.status}`);
            }
            return response.json(); // o response.text() si tu backend no devuelve JSON en éxito
        })
        .then(data => {
            console.log('Planificación actualizada exitosamente:', data);
            alert('Planificación actualizada correctamente!');

            // Recargar las planificaciones para mostrar los cambios en la página
            cargarPlanificaciones(); // **Llama a una función para recargar la lista de planificaciones**

        })
        .catch(error => {
            console.error('Error al actualizar la planificación:', error);
            alert(`Error al actualizar la planificación: ${error.message}`);
        });
    });
    // --- FIN DEL EVENT LISTENER PARA EL FORMULARIO DE EDICIÓN (PUT) ---


    // Evento para enviar plan (Formulario principal - POST para crear NUEVAS planificaciones)
    const formCrearPlanificacion = document.querySelector('form'); // Selecciona el formulario principal (asumiendo que es el único form fuera del modal)
    formCrearPlanificacion.addEventListener('submit', (event) => {
        event.preventDefault(); // Evita la recarga de página
        const formData = new FormData(formCrearPlanificacion);

        const fecha_expiracion = new Date();
        fecha_expiracion.setDate(fecha_expiracion.getDate() + 90); // 90 días después de la fecha actual
        formData.append('fecha_expiracion', fecha_expiracion.toISOString()); // Agregar la fecha de expiración al FormData
        console.log(`Fecha de expiración enviada: ${fecha_expiracion}`);

        fetch('/planificaciones-info', { // **URL PARA EL POST (CREACIÓN)**
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la solicitud POST: ${response.status}`);
            }
            return response.json(); // o response.text() si tu backend no devuelve JSON en éxito
        })
        .then(data => {
            console.log('Nueva planificación creada exitosamente:', data);
            alert('El plan se ha enviado correctamente');
            formCrearPlanificacion.reset(); // Limpiar el formulario después del éxito

            cargarPlanificaciones(); // **Recargar planificaciones para mostrar la nueva**

        })
        .catch(error => {
            console.error('Error al crear la planificación:', error);
            alert(`Error al crear la planificación: ${error.message}`);
        });
    });


    // ---  FUNCIÓN PARA RECARGAR LAS PLANIFICACIONES  ---
    async function cargarPlanificaciones() {
        const divPlanificaciones = document.querySelector('.planificacionesContainer');
        try {
            const response = await fetch('/planificaciones-info');
            if (!response.ok) {
                throw new Error(`No se pudieron recargar las planificaciones: ${response.status}`);
            }
            const planificaciones = await response.json();

            divPlanificaciones.innerHTML = ''; // Limpiar el contenedor antes de re-renderizar

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
                        <div class="planButtons" style="text-align: center; margin-top: 10px;">
                            <button type="button" class="btn btn-primary btnModificar" data-bs-toggle="modal" data-bs-target="#editarPlanificacionModal" data-id="${planificacion.id}">
                                Editar Planificación
                            </button>
                            <button type="button" class="btn btn-danger" data-id="${planificacion.id}">
                                Eliminar Planificación
                            </button>
                        </div>
                    </div>
                    `);
                    divPlanificaciones.appendChild(planes);
                });
            }
        } catch (error) {
            console.error('Error al recargar planificaciones:', error);
            divPlanificaciones.innerHTML = '<p>Error al recargar las planificaciones. Por favor, intenta de nuevo más tarde.</p>'; // Mensaje de error si falla la recarga
        }
    }
    // --- FIN DE FUNCIÓN PARA RECARGAR LAS PLANIFICACIONES ---

    // ---  EVENT LISTENER PARA ELIMINAR PLANIFICACIONES  ---
    divPlanificaciones.addEventListener('click', async (event) => {
        if (event.target.classList.contains('btn-danger')) {
            const planificacionId = event.target.dataset.id;
            const confirmar = confirm('¿Estás seguro de que deseas eliminar esta planificación?');
            if (confirmar) {
                try {
                    const response = await fetch(`/planificaciones-info/${planificacionId}`, {
                        method: 'DELETE'
                    });
                    if (!response.ok) {
                        throw new Error(`Error al eliminar la planificación: ${response.status}`);
                    }
                    alert('Planificación eliminada correctamente!');
                    cargarPlanificaciones(); // **Recargar planificaciones después de eliminar**
                } catch (error) {
                    console.error('Error al eliminar la planificación:', error);
                    alert(`Error al eliminar la planificación: ${error.message}`);
                }
            }
        }
    });

});