
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
        const response = await fetch('/carnets-info');
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
            const response = await fetch('/carnets-info/actualizar-estados', {
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
});

// QR
// DESCARGAR QRS
// const qrs = [
//     "https://sadicu.netlify.app/#carnet-1",
//     "https://sadicu.netlify.app/#carnet-2",
//     "https://sadicu.netlify.app/#carnet-3",
//     "https://sadicu.netlify.app/#carnet-4",
//     "https://sadicu.netlify.app/#carnet-5",
// ] 

// qrs.forEach((url, index) => {
//     const qrContainer = document.createElement('div');
//     qrContainer.classList.add('qr');
//     document.querySelector('.qrs').appendChild(qrContainer);

//     // Genera el QR
//     const qrCode = new QRCode(qrContainer, {
//         text: url,
//         width: 100,
//         height: 100,
//         correctLevel: QRCode.CorrectLevel.H,
//     });

//     // Esperar a que el QR se genere y luego descargar
//     setTimeout(() => {
//         const qrCanvas = qrContainer.querySelector('canvas');
//         if (qrCanvas) {
//             const dataURL = qrCanvas.toDataURL("image/png");
//             downloadQRCode(dataURL, `qr_code_${index + 1}.png`);
//         }
//     }, 500); // Ajusta el tiempo según sea necesario
// });

// function downloadQRCode(dataURL, filename) {
//     const link = document.createElement('a');
//     link.href = dataURL;
//     link.download = filename;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
// }

// qrs.forEach((qr, index) => {
//     const qrmuesta = document.querySelector(".qr");
//     new QRCode(qrmuesta, {
//         text: qr,
//         width: 100,
//         height: 100,
//         callback: function (qr) {
//             const qrCanvas = qrContainer.querySelector("canvas")
//             if (qrCanvas) {
//                 const dataURL = qrCanvas.toDataURL("image/png")
//                 downloadQR(dataURL, "qr.png")
//             }
//         }
//     });
// });

