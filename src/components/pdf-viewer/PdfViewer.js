import React, { useEffect, useState } from "react";
import HighlightRenderer from "./HighlightRenderer";

function highlightText(event) {
  let target = event.target;
  if (target.tagName === "P") {
    let selection = window.getSelection();
    let range = selection.getRangeAt(0);
    let startOffset = range.startOffset;
    let endOffset = range.toString().length;
    let span = document.createElement("span");
    span.classList.add("highlight");
    span.setAttribute("data-start", startOffset);
    span.setAttribute("data-length", endOffset);
    range.surroundContents(span);
  }
}

function removeHighlightText(event) {
  if (event.target.classList.contains("highlight")) {
    event.target.outerHTML = event.target.innerHTML;
  }
}

const PdfViewer = ({ pdfData, highlightEnabled, highlighted, identifier }) => {
  const [content, setContent] = useState(["Cargando contenido..."]);
  const [loadHighlightContent, setHighlightContent] = useState(false);
  const renderPdf = async (pdfData) => {
    const readPage = async (pageNum) => {
      const page = await pdf.getPage(pageNum);
      const pageContext = await page.getTextContent();
      return pageContext.items.map((item) => item.str).join(" ");
    };

    const pdfjs = window.pdfjsLib;
    const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.min.mjs");
    pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    const pdf = await pdfjs.getDocument(pdfData).promise;
    const numPages = pdf.numPages;
    const readPages = [];
    for (let pageNum = 1; pageNum <= numPages; pageNum++)
      readPages.push(readPage(pageNum));

    Promise.all(readPages).then((pagesText) => {
      const readContent = pagesText.map((pageText) => pageText);
      setContent(readContent);
      setHighlightContent(true);
    });
  };

  useEffect(() => {
    if (pdfData) {
      renderPdf(pdfData);
    }
  }, [pdfData]);

  useEffect(() => {
    const pdfContent = document.getElementById("pdf-content");
    if (highlightEnabled) {
      pdfContent.addEventListener("mouseup", highlightText);
      pdfContent.addEventListener("touchend", highlightText);
      pdfContent.removeEventListener("mouseup", removeHighlightText);
      pdfContent.removeEventListener("touchend", removeHighlightText);
    } else {
      pdfContent.removeEventListener("mouseup", highlightText);
      pdfContent.removeEventListener("touchend", highlightText);
      pdfContent.addEventListener("mouseup", removeHighlightText);
      pdfContent.addEventListener("touchend", removeHighlightText);
    }
  }, [highlightEnabled]);

  return (
    <div
      id="viewfinder"
      className="h-80 p-2 overflow-y-auto rounded-md border-[3px] border-[#76ec5e]"
    >
      <HighlightRenderer
        key={identifier}
        content={content}
        highlightPositions={highlighted}
      />
    </div>
  );
};

export default PdfViewer;
