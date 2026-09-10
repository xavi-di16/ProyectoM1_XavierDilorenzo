# Proyecto Integrador Módulo 1 - Colorfly Studio

Este repositorio contiene la entrega del Proyecto Integrador correspondiente al Módulo 1. Consiste en el desarrollo de un MVP para *Colorfly Studio*, una agencia de branding que requiere un generador de paletas de colores estático, interactivo y rápido.

# Ingreso a la Aplicacion
**link/** :  https://xavi-di16.github.io/ProyectoM1_XavierDilorenzo/desarrollo

## Estructura del Proyecto

Siguiendo las rúbricas de entrega, el repositorio está estructurado de la siguiente manera:

*   **Desarrollo/**: Contiene el código fuente completo (`index.html`, `styles.css`, `script.js`). Para desplegar en GitHub Pages se recomienda mover estos archivos a la raíz o configurar la rama gh-pages apuntando a esta carpeta.
*   **Documentacion/**: Contiene este `README.md` con las instrucciones, decisiones técnicas y la documentación de uso de IA.
*   flujo proximamente

## Tecnologías Utilizadas
*   HTML5 (Etiquetas Semánticas y accesibilidad)
*   CSS (Variables, Flexbox, UI, Animaciones sutiles)
*   JavaScript (DOM, Arrays, LocalStorage, Eventos)
*   Git y GitHub (Control de versiones)
*   Gemini AI (Investigacion y Desarrollo)

## Extra Credits Implementados
1.  **Bloqueo de colores:** Mediante un ícono de candado interactivo (🔓/🔒).
2.  **Guardado en localStorage:** La paleta sobrevive al recargar la pestaña.
3.  **Animaciones sutiles:** Escala y sombras al pasar el mouse por las tarjetas.
4.  **Copiar al portapapeles:** Al hacer clic en una tarjeta, se copia automáticamente el valor HEX.
5.  **Microfeedback (UI):** Implementación de un *Toast* (micro) animado para avisar que la acción de copiado fue exitosa.

---

## Documentación del uso de la IA

Para agilizar el desarrollo del MVP (Producto Minimo Viable) y cumplir con las buenas prácticas, utilicé Inteligencia Artificial en dos casos técnicos puntuales del proyecto.

### Caso 1: Lógica matemática para convertir de formato HEX a HSL
Dado que se requería generar colores completamente aleatorios en dos formatos distintos (HEX y HSL), y escribir la fórmula de conversión desde cero es lenta y propensa a errores matemáticos, utilicé IA para generar la función de transformación.

*   **Prompt utilizado:** *"Estoy armando un generador de paletas en JavaScript. Ya tengo una función que genera códigos HEX aleatorios, pero necesito mostrar también el valor en HSL. ¿Cómo escribo una función matemática que reciba un string HEX (ej: '#1A2B3C') y me devuelva un string formateado en HSL (ej: 'hsl(210, 39%, 17%)')?"*

*   **Código Antes:**
    ```javascript
    function hexAHsl(hex) {
        // TODO: Buscar fórmula matemática en internet para convertir RGB a HSL
        return "hsl(0, 0%, 0%)"; 
    }
    ```

*   **Código Después (Resultado implementado):**
    ```javascript
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
    ```

### Caso 2: Animación CSS para el Microfeedback (Toast)
Para cumplir con el requerimiento de accesibilidad y UI del microfeedback (toast) al copiar un color, necesitaba una animación suave que no interrumpiera el flujo de la aplicación web estática.

*   **Prompt utilizado:** *"Necesito hacer que un div que funciona como 'toast' (notificación de éxito al copiar) aparezca suavemente desde abajo en la pantalla y se desvanezca después de 2 segundos. Dame solo el CSS necesario usando clases para activarlo desde JavaScript."*

*   **Código Antes:**
    ```css
    .micro { 
        display: none; 
        position: fixed; 
        bottom: 0; 
    }
    .micro.visible { 
        display: block; 
    }
    ```

*   **Código Después (Resultado implementado):**
    ```css
    .micro {
        position: fixed;
        bottom: 2rem;
        /* ... estilos visuales como fondo y padding ... */
        opacity: 0;
        transform: translate(-50%, 20px);
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    .micro.visible {
        opacity: 1;
        transform: translate(-50%, 0);
    }
    ```
