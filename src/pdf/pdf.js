import React from 'react';

const Pdf = () => {
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function(event) {
            const arrayBuffer = event.target.result;

            window.pdfjsLib.getDocument(arrayBuffer).promise.then(function(pdf) {
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
                }

                Promise.all(promises).then(function(pagesText) {
                    textoPDF = pagesText.join('');
                    document.getElementById('textoPDF').textContent = textoPDF;

                    if (resaltadorActivo) {
                        // Resaltador activado
                        document.getElementById('textoPDF').addEventListener('mouseup', function() {
                            let seleccion = window.getSelection().toString().trim();
                            if (seleccion !== '') {
                                let span = document.createElement('span');
                                span.classList.add('highlight');
                                let range = window.getSelection().getRangeAt(0);
                                range.surroundContents(span);
                            }
                        });
                    } else {
                        // Resaltador desactivado
                        document.querySelectorAll('#textoPDF .highlight').forEach(function(span) {
                            span.outerHTML = span.innerHTML; // Eliminar el resaltado
                        });
                    }
                });
            });
        };
        reader.readAsArrayBuffer(file);
    };

    const resaltadorActivo = true; // Deberías manejar esto de alguna manera según lo necesites

    return (
        <>
            <input type="file" id="fileInput" accept=".pdf" onChange={handleFileChange} />
            <input type="checkbox" id="checkboxResaltador" defaultChecked={resaltadorActivo} />
            <label htmlFor="checkboxResaltador">Activar resaltador</label>
            <div id="textoPDF" style={{ cursor: 'text' }}></div>
        </>
    );
};

export default Pdf;
