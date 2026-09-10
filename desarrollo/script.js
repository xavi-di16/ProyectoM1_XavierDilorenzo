// --- Variables del DOM ---
const selectorCant = document.getElementById('cantColores');
const botonGenerar = document.getElementById('btnGenerar');
const contenedorPaleta = document.getElementById('contenedorPaleta');
const cartelCopy = document.getElementById('micro'); 


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
        mostrarMicro(`¡Color ${hex} copiado!`); 
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
        cartelCopy.setAttribute('aria-hidden', 'true'); 
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
        if (paletaActual[i] && paletaActual[i].bloqueado) {
            nuevaPaleta.push(paletaActual[i]);
        } else {
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


function crearTarjetaColor(colorObj, indice) {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta-color';
    tarjeta.style.backgroundColor = colorObj.hex;
    

    tarjeta.dataset.hex = colorObj.hex;

    const btnCandado = document.createElement('button');

    btnCandado.className = `btn-candado`; 
    btnCandado.textContent = colorObj.bloqueado ? '🔒' : '🔓';
    btnCandado.setAttribute('aria-label', colorObj.bloqueado ? 'Desbloquear color' : 'Bloquear color');
    

    btnCandado.dataset.accion = 'bloquear';
    btnCandado.dataset.indice = indice;

    const info = document.createElement('div');
    info.className = 'info-color';

      
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

    return tarjeta;
}

function renderizarPaleta() {
    contenedorPaleta.innerHTML = '';
    
    const fragmento = document.createDocumentFragment();

    paletaActual.forEach((colorObj, indice) => {
        const tarjeta = crearTarjetaColor(colorObj, indice);
        fragmento.appendChild(tarjeta);
    });

    contenedorPaleta.appendChild(fragmento);
}


contenedorPaleta.addEventListener('click', (evento) => {
   
    const btnCandado = evento.target.closest('[data-accion="bloquear"]');
    
    if (btnCandado) {
        evento.stopPropagation();
        const indice = parseInt(btnCandado.dataset.indice);
        alternarBloqueo(indice);
        return; 
    }

    const tarjeta = evento.target.closest('.tarjeta-color');
    if (tarjeta) {
        const hex = tarjeta.dataset.hex;
        copiarAlPortapapeles(hex);
    }
});


botonGenerar.addEventListener('click', generarNuevaPaleta);
selectorCant.addEventListener('change', generarNuevaPaleta);


iniciarApp();