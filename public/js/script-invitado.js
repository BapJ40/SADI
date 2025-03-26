async function obtenerEstadosVistas() {
    try {
        // Hacer la solicitud a la API
        const response = await fetch('/api/estados-vistas');
        const data = await response.json();

        // Verificar si la solicitud fue exitosa
        if (data.success) {
            const estados = data.data;

            const planes = document.querySelector('.planes');

            const estadoPlanes = estados.find(vista => vista.nombre_vista === 'planes')?.estado || 'inactiva';

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
    const carnetsDiv = document.querySelector('.carnets');

    try {
        const response = await fetch('/carnets/carnets-info');
        const carnets = await response.json();

        carnets.forEach(carnet => {
            const carnetElement = document.createRange().createContextualFragment(`
                <div class="carnet ${carnet.estado}">
                    <div class="carnet-img">
                        <div class="galeria">
                            <a href="${carnet.img}" data-fancybox="Carnet" data-caption="Este empleado esta: ${carnet.estado}">
                                <img src="${carnet.img}" alt="carnet">
                            </a>
                        </div>
                    </div>
                    <div class="carnet-info">
                        <p class="info">${carnet.estado}</p>
                    </div>
                </div>
            `);
            carnetsDiv.appendChild(carnetElement);
        });
        
    } catch (err) {
        console.error('Error al cargar carnets:', err.message);
    }

    Fancybox.bind('[data-fancybox]', {
    });    
});

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
    
});