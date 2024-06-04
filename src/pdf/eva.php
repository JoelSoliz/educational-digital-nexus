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
<body>
    <input type="file" id="fileInput" accept=".pdf">
    <input type="checkbox" id="checkboxResaltador" checked> <label for="checkboxResaltador">Activar resaltador</label>
    <button type="button" name="button" onclick="guardarResaltado()">Guardar resaltado</button>
    <button type="button" name="button" onclick="mostrarResaltado()">Cargar resaltado</button>
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
            let elementosSpan = target.querySelectorAll('span');
            let sumCom = 0;
            let span = document.createElement('span');
            span.classList.add('highlight');
            range.surroundContents(span);
        }
    });

    document.getElementById('textoPDF').addEventListener('click', function(event) {
        if (!resaltadorActivo && event.target.classList.contains('highlight')) {
            event.target.outerHTML = event.target.innerHTML;
        }
    });

    function guardarResaltado() {
        let posiciones = obtenerPosicionesTexto();
        console.log('Posiciones del texto en cada span:', posiciones);
    }

    //funcion para generar de texto para el resaltado
    function obtenerPosicionesTexto() {
      let contenidoP = [];
      let contenidoSpan = [];
      let inicio = 0;
      let fin = 0;
      let aux = 0;
      let resaltado = 0;
      let nroParrafo = 0;
      let nonSpanTexts = [];
      // Obtener contenido de los elementos <p>
      let elementosP = document.querySelectorAll('#textoPDF > p');
      elementosP.forEach(p => {
        nroParrafo += 1;
        p.childNodes.forEach((node, index, nodeList) => {
          if (node.nodeType === Node.TEXT_NODE){
            //nonSpanTexts.push([node.textContent.trim(),aux,node.textContent.trim().length,nroParrafo,0]);
            nonSpanTexts.push([aux,node.textContent.trim().length,nroParrafo,0]);
          }else if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'span') {
            //nonSpanTexts.push([node.textContent.trim(),aux,node.textContent.trim().length,nroParrafo,1]);
            nonSpanTexts.push([aux,node.textContent.trim().length,nroParrafo,1]);
          }
          aux += node.textContent.trim().length;
          resaltado = 0;
        });
        aux = 0;
        let pText = p.textContent;
        contenidoP.push(p.textContent.trim());
        //suma += p.textContent.length;
        //nroParrafo += 1;
        let elementosSpan = p.querySelectorAll('span');
        elementosSpan.forEach(span => {
          let spanText = span.textContent;
          let comienzo = pText.indexOf(spanText);
          let tamaño = spanText.length;
          contenidoSpan.push([comienzo,tamaño,nroParrafo]);
        });
      });

      return {
        nospans: nonSpanTexts
      };
    }

    //funcion para mostrar el resaltado
    function mostrarResaltado() {
        //[inicio,tamaño,parrafo,resaltado]
        //en posiciones colocar el arreglo de los resaltados
        //let posiciones = [[0,5,1,1],[5,7,1,0],[13,9,1,1]]; //ejemplo
        let nuevo = [];
        let suma = 0;
        for (let i = 0; i < posiciones.length; i++) {
          //empezando un nuevo parrafo
          if(posiciones[i][0] == 0){
            suma = 0;
          }
          if(posiciones[i][3] == 0){ //no resaltado
            suma += posiciones[i][1];
          }else{ //resaltado
            //suma += posiciones[i][1];
            if(posiciones[i][0] == 0){
              nuevo.push({start: posiciones[i][0],length: posiciones[i][1], parrafo: posiciones[i][2]});
            }else{
              nuevo.push({start: suma,length: posiciones[i][1], parrafo: posiciones[i][2]});
            }
            suma = 0;
          }
        }
        console.log('Posiciones del texto en cada span:', nuevo);
        cargarPosicionesTexto(nuevo);
    }

    function cargarPosicionesTexto(posiciones) {
      let contenidoP = [];
      let contenidoSpan = [];
      let nonSpanTexts = [];
      let elementosP = document.querySelectorAll('#textoPDF > p');
      let contadorParrafo = 0;
      elementosP.forEach(p => {
        contadorParrafo++;
        let textNode = p.firstChild;
        function highlightRange(textNode, start, length, parrafo) {
          const range = document.createRange();
          range.setStart(textNode, start);
          range.setEnd(textNode, start + length);
          const span = document.createElement('span');
          span.className = 'highlight';
          range.surroundContents(span);
        }
        posiciones.forEach(({ start, length, parrafo }) => {
          if (parrafo == contadorParrafo) {
            let currentStart = start;
            let remainingLength = length;
            while (remainingLength > 0 && textNode) {
              if (textNode.nodeType === Node.TEXT_NODE) {
                if (currentStart < textNode.textContent.length) {
                  let end = Math.min(currentStart + remainingLength, textNode.textContent.length);
                  highlightRange(textNode, currentStart, end - currentStart, parrafo);
                  remainingLength -= (end - currentStart);
                  currentStart = 0;
                } else {
                  currentStart -= textNode.textContent.length;
                }
              }
              textNode = textNode.nextSibling;
            }
          }
        });
      });
      //devolver
      return {
        nospans: nonSpanTexts
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
