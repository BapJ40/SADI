// CODIGO ORIGINAL
// document.addEventListener('DOMContentLoaded', async () => {
//     const carnetsDiv = document.querySelector('.carnets');

//     try {
//         const response = await fetch('/carnets-info');
//         const carnets = await response.json();

//         carnets.forEach(carnet => {
//             const carnetElement = document.createRange().createContextualFragment(`
//                 <div class="carnet ${carnet.estado}" onclick="mostrarCarnet(${carnet.id})"> // aqui quiero que se muestre el carnet
//                     <div class="carnet-img">
//                         <div class="galeria">
//                             <img src="${carnet.img}" alt="carnet">
//                         </div>
//                     </div>
//                     <div class="carnet-info">
//                         <p class="info">${carnet.estado}</p>
//                     </div>
//                 </div>
//             `);
        
//             carnetsDiv.appendChild(carnetElement);
//         });
        
//     } catch (err) {
//         console.error('Error al cargar carnets:', err.message);
//     }
// });

document.addEventListener('DOMContentLoaded', async () => {
    const carnetsDiv = document.querySelector('.carnets');

    try {
        const response = await fetch('/carnets-info');
        const carnets = await response.json();

        carnets.forEach(carnet => {
            const carnetElement = document.createRange().createContextualFragment(`
                <div class="carnet ${carnet.estado}">
                    <div class="carnet-img">
                        <div class="galeria">
                            <a href="${carnet.img}" data-fancybox="Carnet" data-caption="nº ${carnet.id}. Este empleado esta: ${carnet.estado}">
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
});

document.addEventListener('DOMContentLoaded', () => {
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
})