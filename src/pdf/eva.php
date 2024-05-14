<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Convertir PDF a Texto con Resaltador y Visor</title>
    <style>
        #visor {
            height: 300px; /* Altura fija del visor*/
            overflow-y: auto; /* Activar scroll vertical */
        }
        .highlight {
            background-color: yellow;
        }
    </style>
</head>
<?php if (1==2) {
  echo('verdadero');
} else {
  echo('falso');
} ?>
<body>
    <input type="file" id="fileInput" accept=".pdf">
    <input type="checkbox" id="checkboxResaltador" checked> <label for="checkboxResaltador">Activar resaltador</label>
    <button type="button" name="button" onclick="mostrarParrafosEnOtraVentana()">Finalizar encuesta</button>
    <div id="visor">
        <div id="textoPDF" style="cursor: text;"></div>
    </div>
    <br>
    <button id="grabarBtn">Grabar</button>
    <button id="mostrarBtn">Mostrar</button>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.min.js"></script>
    <script>
    let resaltadorActivo = true;
    let resaltados = [];

    document.getElementById('checkboxResaltador').addEventListener('change', function() {
        resaltadorActivo = this.checked;
    });

    document.getElementById('fileInput').addEventListener('change', function(event) {
        let file = event.target.files[0];
        let reader = new FileReader();

        reader.onload = function(event) {
            let arrayBuffer = event.target.result
            pdfjsLib.getDocument(arrayBuffer).promise.then(function(pdf) {
                let textoPDF = "";
                let getPageText = function(pageNum) {
                    return pdf.getPage(pageNum).then(function(page) {
                        return page.getTextContent().then(function(textContent) {
                            return textContent.items.map(function(item) {
                                return item.str;
                            }).join(' ');
                        });
                    });
                };
                let numPaginas = pdf.numPages;
                let promises = [];
                for (let i = 1; i <= numPaginas; i++) {
                    promises.push(getPageText(i));
                    //promises.push("");
                }
                Promise.all(promises).then(function(pagesText){
                    let textosConParrafos = [];
                    pagesText.forEach(function(texto){
                        //alert(texto.length);
                        textosConParrafos.push('<p class="salto">' + texto + '</p>');
                    });
                    document.getElementById('textoPDF').innerHTML = textosConParrafos.join('');
                });
            });
        };
        reader.readAsArrayBuffer(file);
    });

    document.getElementById('textoPDF').addEventListener('mouseup', function(event) {
      if (!resaltadorActivo) return;
        let target = event.target;
        if (target.tagName === 'P') {
            let selection = window.getSelection();
            let range = selection.getRangeAt(0);
            let startOffset = range.startOffset;
            let endOffset = (range.toString().length);
            let span = document.createElement('span');
            span.classList.add('highlight');
            span.setAttribute('data-start',startOffset);
            span.setAttribute('data-length',endOffset);
            range.surroundContents(span);
            //console.log('El inicio de la selección en el párrafo:', startOffset,'-',endOffset);
        }
    });
    document.getElementById('textoPDF').addEventListener('click', function(event) {
        if (!resaltadorActivo && event.target.classList.contains('highlight')) {
            event.target.outerHTML = event.target.innerHTML;
        }
    });

    function mostrarParrafosEnOtraVentana() {
        let posiciones = obtenerPosicionesTexto();
        console.log('Posiciones del texto en cada span:', posiciones);
    }

    function obtenerPosicionesTexto() {
      let contenidoP = [];
      let contenidoSpan = [];
      let suma = 0;
      let nroParrafo = 0;
      // Obtener contenido de los elementos <p>
      let elementosP = document.querySelectorAll('#textoPDF > p');
      elementosP.forEach(p => {
        contenidoP.push(p.textContent.trim());
        suma += p.textContent.length;
        nroParrafo += 1;
        let elementosSpan = p.querySelectorAll('span');
        elementosSpan.forEach(span => {
          let comienzo = span.getAttribute('data-start');
          let tamaño = span.getAttribute('data-length');
          contenidoSpan.push([comienzo,tamaño,nroParrafo]);
        });
      });

      // Obtener contenido de los elementos <span>
      /*let elementosSpan = document.querySelectorAll('#textoPDF > p > );
      elementosSpan.forEach(span => {
        contenidoSpan.push(span.textContent.trim());
      });*/

      return {
        parrafos: contenidoP,
        spans: contenidoSpan
      };
    }

    //Registrar movimientos del visor
        // Función para grabar los movimientos del visor
        document.getElementById('grabarBtn').addEventListener('click', function() {
            movimientosGrabados = []; // Limpiar movimientos grabados
            document.getElementById('visor').addEventListener('scroll', registrarMovimiento);
            console.log('Grabación iniciada...');
        });

        // Función para mostrar los movimientos grabados
        document.getElementById('mostrarBtn').addEventListener('click', function() {
            document.getElementById('visor').removeEventListener('scroll', registrarMovimiento);
            console.log('Reproducción iniciada...');
            reproducirMovimientos();
        });

        // Función para registrar los movimientos del visor durante la grabación
        function registrarMovimiento() {
            var scrollY = document.getElementById('visor').scrollTop;
            movimientosGrabados.push(scrollY);
        }

        // Función para reproducir los movimientos grabados
        function reproducirMovimientos() {
            var intervalo = 850; // Intervalo de tiempo entre movimientos (en milisegundos)
            var index = 0;

            var interval = setInterval(function() {
                document.getElementById('visor').scrollTop = movimientosGrabados[index];
                index++;

                if (index >= movimientosGrabados.length) {
                    clearInterval(interval);
                    console.log('Reproducción finalizada.');
                    console.log(movimientosGrabados);
                }
            }, intervalo);
        }
    </script>
</body>
</html>
