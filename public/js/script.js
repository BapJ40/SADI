
// Filtro

const filtro = document.querySelector("#filtro");
filtro.addEventListener("change", () => {    
    if (filtro.value === "todos") {
        const carnets_grind = document.querySelectorAll(".carnet");
        carnets_grind.forEach(carnet => {
            carnet.classList.remove("novisible");
        })
    } else if (filtro.value === "activos") {
        const carnets_grind = document.querySelectorAll(".carnet");
        carnets_grind.forEach(carnet => {
            if (carnet.classList.contains("Inactivo")) {
                carnet.classList.add("novisible");
            } else {
                carnet.classList.remove("novisible");
            }
        })
    } else if (filtro.value === "inactivos") {
        const carnets_grind = document.querySelectorAll(".carnet");
        carnets_grind.forEach(carnet => {
            if (carnet.classList.contains("Inactivo")) {
                carnet.classList.remove("novisible");
            } else {
                carnet.classList.add("novisible");
            }
        })
    }
})

document.addEventListener('DOMContentLoaded', async () => {
    const carnetsDiv = document.querySelector('.carnets');
    const confirmarBtn = document.getElementById('confirmarEstados'); // Botón de confirmar
    const vistasBtn = document.querySelector('.confirmarEstadoVista') // Botón de vistas
    let estadosOriginales = []; // Almacenará el estado original de los selects

    // Función para verificar si hay cambios
    const verificarCambios = () => {
        const selects = document.querySelectorAll('.estado-select');
        let hayCambios = false;

        selects.forEach((select, index) => {
            const estadoActual = select.value;
            if (estadoActual !== estadosOriginales[index]) {
                hayCambios = true;
            }
        });

        confirmarBtn.disabled = !hayCambios; // Habilitar si hay cambios, deshabilitar si no
    };

    try {
        // Obtener datos iniciales desde el servidor
        const response = await fetch('/carnets/carnets-info');
        const carnets = await response.json();

        // Generar HTML dinámico
        carnets.forEach(carnet => {
            estadosOriginales.push(carnet.estado); // Guardar estados originales

            const carnetElement = document.createRange().createContextualFragment(`
                <div class="carnet ${carnet.estado}">
                    <div class="carnet-img" onclick="mostrarCarnet(${carnet.id})">
                        <div class="galeria">
                            <img src="${carnet.img}" alt="carnet">
                        </div>
                    </div>
                    <div class="carnet-info">
                        <select class="form-select estado-select" data-id="${carnet.id}">
                            <option value="Activo" ${carnet.estado === 'Activo' ? 'selected' : ''}>Activo</option>
                            <option value="Inactivo" ${carnet.estado === 'Inactivo' ? 'selected' : ''}>Inactivo</option>
                        </select>
                    </div>
                </div>
            `);
            carnetsDiv.appendChild(carnetElement);
        });

        // Desactivar botón inicialmente
        confirmarBtn.disabled = true;

        // Añadir evento de cambio a cada select
        const selects = document.querySelectorAll('.estado-select');
        selects.forEach(select => {
            select.addEventListener('change', verificarCambios);
        });

    } catch (err) {
        console.error('Error al cargar carnets:', err.message);
    }

    // Evento al botón Confirmar
    confirmarBtn.addEventListener('click', async () => {
        const selects = document.querySelectorAll('.estado-select');
        const cambios = [];

        // Recoger los estados seleccionados
        selects.forEach(select => {
            const id = select.getAttribute('data-id');
            const estado = select.value;
            cambios.push({ id, estado });
        });

        try {
            // Enviar todos los cambios al servidor
            const response = await fetch('/carnets/actualizar-estados', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cambios }),
            });

            if (response.ok) {
                alert('Estados actualizados correctamente');
                // Actualizar estados originales y desactivar botón
                estadosOriginales = cambios.map(cambio => cambio.estado);
                confirmarBtn.disabled = true;
            } else {
                alert('Error al actualizar estados');
            }
        } catch (err) {
            console.error('Error al enviar actualizaciones:', err.message);
        }
    });

    // Evento al botón Vistas
    const configModal = document.getElementById('configModal');
    const estadoActualSpan = document.getElementById('estadoActual');
    const estadoVistaSelect = document.getElementById('estadoVista');
    const confirmarEstadoBtn = document.getElementById('confirmarEstado');

    // Evento cuando el modal se abre
    configModal.addEventListener('show.bs.modal', async () => {
        const nombreVista = 'sadi_invitado'; // Nombre de la vista a consultar

        try {
            // Obtener el estado actual de la vista
            const response = await fetch(`/vistas/estado-vista/${nombreVista}`);
            const data = await response.json();

            if (data.success) {
                const estadoActual = data.estado;
                estadoActualSpan.textContent = estadoActual; // Mostrar el estado actual
                estadoVistaSelect.value = estadoActual; // Seleccionar el estado actual en el select
            } else {
                console.error('Error al obtener el estado de la vista:', data.message);
            }
        } catch (error) {
            console.error('Error al hacer la solicitud:', error);
        }
    });

    // Evento para confirmar el cambio de estado
    confirmarEstadoBtn.addEventListener('click', async () => {
        const nombreVista = 'sadi_invitado';
        const estado = estadoVistaSelect.value;

        try {
            const response = await fetch('/vistas/actualizar-estado', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre_vista: nombreVista, estado }),
            });

            const data = await response.json();

            if (data.success) {
                alert(data.message);
                // Cerrar el modal
                bootstrap.Modal.getInstance(configModal).hide();
            } else {
                alert(data.message || 'Error al actualizar la vista');
            }
        } catch (error) {
            console.error('Error al hacer la solicitud:', error);
            alert('Error al actualizar la vista');
        }
    });
});