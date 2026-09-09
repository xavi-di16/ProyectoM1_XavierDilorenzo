// --- Variables del DOM ---
const selectorCant = document.getElementById('cantColores');
const botonGenerar = document.getElementById('btnGenerar');
const contenedorPaleta = document.getElementById('contenedorPaleta');
const cartelCopy = document.getElementById('micro'); // Corregido: Se usa la variable correcta

// --- Estado de la aplicación ---
let paletaActual = [];

// --- Utilidades ---
function generarPaleta() { 
    const caracteres = '0123456789ABCDEF';
    let colorHex = '#';
    for (let i = 0; i < 6; i++) {
        colorHex += caracteres[Math.floor(Math.random() * 16)];
    }
    return colorHex;
}

function hexAHsl(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

function guardarEnLocal() {
    localStorage.setItem('paletaColor', JSON.stringify(paletaActual));
}

function copiarAlPortapapeles(hex) {
    navigator.clipboard.writeText(hex).then(() => { 
        mostrarMicro(`¡Color ${hex} copiado!`); // Corregido: Sintaxis limpia
    }).catch(err => { 
        console.error('Error al copiar: ', err);
    });
}

function mostrarMicro(mensaje) {
    cartelCopy.textContent = mensaje;
    cartelCopy.classList.add('visible');
    cartelCopy.setAttribute('aria-hidden', 'false');

    setTimeout(() => {
        cartelCopy.classList.remove('visible');
        cartelCopy.setAttribute('aria-hidden', 'true'); // Corregido: Vuelve a true por accesibilidad
    }, 2000);
}

// --- Lógica Principal ---
function iniciarApp() {
    const paletaGuardada = localStorage.getItem('paletaColor');

    if (paletaGuardada) {
        paletaActual = JSON.parse(paletaGuardada);
        selectorCant.value = paletaActual.length;
        renderizarPaleta();
    } else {
        generarNuevaPaleta();
    }
}

function generarNuevaPaleta() {
    const cantidad = parseInt(selectorCant.value);
    const nuevaPaleta = [];

    for (let i = 0; i < cantidad; i++) {
        // Corregido: Typo de "bloquedo" a "bloqueado"
        if (paletaActual[i] && paletaActual[i].bloqueado) {
            nuevaPaleta.push(paletaActual[i]);
        } else {
            // Corregido: Llamada a la función correcta para evitar recursividad infinita
            const hex = generarPaleta(); 
            nuevaPaleta.push({
                hex: hex,
                hsl: hexAHsl(hex),
                bloqueado: false
            });
        }
    }

    paletaActual = nuevaPaleta;
    guardarEnLocal();
    renderizarPaleta();
}

function alternarBloqueo(indice) {
    paletaActual[indice].bloqueado = !paletaActual[indice].bloqueado;
    guardarEnLocal();
    renderizarPaleta();
}

// --- Refactorización: Modularización del Nodo ---
function crearTarjetaColor(colorObj, indice) {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta-color';
    tarjeta.style.backgroundColor = colorObj.hex;
    
    // Asignamos datos al DOM para utilizarlos en la delegación de eventos
    tarjeta.dataset.hex = colorObj.hex;

    const btnCandado = document.createElement('button');
    // Le asignamos una clase adicional para mantener el diseño CSS
    btnCandado.className = `btn-candado`; 
    btnCandado.textContent = colorObj.bloqueado ? '🔒' : '🔓';
    btnCandado.setAttribute('aria-label', colorObj.bloqueado ? 'Desbloquear color' : 'Bloquear color');
    
    // Asignamos datos específicos al botón
    btnCandado.dataset.accion = 'bloquear';
    btnCandado.dataset.indice = indice;

    const info = document.createElement('div');
    info.className = 'info-color';

    // Corregido: Declaración en orden y propiedades respetando las minúsculas del objeto original
    const textoHex = document.createElement('p');
    textoHex.className = 'texto-hex'; 
    textoHex.textContent = colorObj.hex; 

    const textoHsl = document.createElement('p');
    textoHsl.className = 'texto-hsl';
    textoHsl.textContent = colorObj.hsl;

    info.appendChild(textoHex);
    info.appendChild(textoHsl);

    tarjeta.appendChild(btnCandado);
    tarjeta.appendChild(info);

    return tarjeta; // Retorna el nodo completo sin inyectarlo aún
}

function renderizarPaleta() {
    contenedorPaleta.innerHTML = '';
    
    // Buena práctica (Performance): Usar un fragmento evita reflows innecesarios del DOM por cada tarjeta
    const fragmento = document.createDocumentFragment();

    paletaActual.forEach((colorObj, indice) => {
        const tarjeta = crearTarjetaColor(colorObj, indice);
        fragmento.appendChild(tarjeta);
    });

    contenedorPaleta.appendChild(fragmento);
}

// --- Refactorización: Delegación de Eventos ---
// Un solo "escuchador" para todo el contenedor de la paleta.
contenedorPaleta.addEventListener('click', (evento) => {
    // 1. Verificamos si se hizo clic en un candado
    const btnCandado = evento.target.closest('[data-accion="bloquear"]');
    
    if (btnCandado) {
        evento.stopPropagation();
        const indice = parseInt(btnCandado.dataset.indice);
        alternarBloqueo(indice);
        return; // Detenemos la ejecución aquí si fue un clic en el candado
    }

    // 2. Si no fue el candado, verificamos si se hizo clic en cualquier parte de la tarjeta
    const tarjeta = evento.target.closest('.tarjeta-color');
    if (tarjeta) {
        const hex = tarjeta.dataset.hex;
        copiarAlPortapapeles(hex);
    }
});

// Event listeners de controles principales
botonGenerar.addEventListener('click', generarNuevaPaleta);
selectorCant.addEventListener('change', generarNuevaPaleta);

// Inicialización de la aplicación
iniciarApp();