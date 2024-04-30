"use client";
import LayoutWithHeader from "@/components/common/LayoutWithHeader";
import { useContent } from "@/hooks/useContent";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function getParentSpan(node) {
  while (node && node !== document.body) {
    if (node.nodeName === "SPAN" && node.classList.contains("highlight")) {
      return node;
    }
    node = node.parentNode;
  }
  return null;
}

function highlightText() {
  let selection = window.getSelection().toString().trim();
  if (selection !== "") {
    let range = window.getSelection().getRangeAt(0);
    let selectedText = range.toString();
    let span = document.createElement("span");
    span.classList.add("highlight");
    range.deleteContents();
    range.insertNode(span);
    span.appendChild(document.createTextNode(selectedText));
  }
}

function removeHighlightText() {
  var selection = window.getSelection();
  if (selection.rangeCount > 0) {
    var range = selection.getRangeAt(0);
    var parentSpan = getParentSpan(range.commonAncestorContainer);
    if (parentSpan && parentSpan.classList.contains("highlight")) {
      var selectedText = range.toString();
      var wrapper = document.createElement("span");
      wrapper.classList.add("no-highlight");
      wrapper.textContent = selectedText;
      range.deleteContents();
      range.insertNode(wrapper);
    }
  }
}

const PdfViewer = ({ params }) => {
  const [content, _] = useContent(params.id);
  const [highlightEnabled, setHighlightEnabled] = useState(true);
  const [removeHighlightEnabled, setRemoveHighlightEnabled] = useState(false);

  const updateContent = async () => {
    const pdfjs = window.pdfjsLib;
    const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.min.mjs");
    pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    pdfjs.getDocument(content.fileUrl).promise.then(function (pdf) {
      let pdfContent = "";

      let getPageText = function (pageNum) {
        return pdf.getPage(pageNum).then(function (page) {
          return page.getTextContent().then(function (textContent) {
            return textContent.items
              .map(function (item) {
                // if (item.hasEOL) {
                //   return item.str + "\n";
                // }
                return item.str;
              })
              .join(" ");
          });
        });
      };

      let numPages = pdf.numPages;
      let promises = [];

      for (let i = 1; i <= numPages; i++) {
        promises.push(getPageText(i));
      }

      Promise.all(promises).then(function (pagesText) {
        pdfContent = pagesText.join("");
        document.getElementById("pdfContent").textContent = pdfContent;
      });
    });
  };

  useEffect(() => {
    if (content) {
      updateContent();
    }
  }, [content]);

  useEffect(() => {
    const pdfContent = document.getElementById("pdfContent");
    if (highlightEnabled) {
      pdfContent.addEventListener("mouseup", highlightText);
      pdfContent.addEventListener("touchend", highlightText);
    } else {
      pdfContent.removeEventListener("mouseup", highlightText);
      pdfContent.removeEventListener("touchend", highlightText);
    }
  }, [highlightEnabled]);

  useEffect(() => {
    const pdfContent = document.getElementById("pdfContent");
    if (removeHighlightEnabled) {
      pdfContent.addEventListener("mouseup", removeHighlightText);
      pdfContent.addEventListener("touchend", removeHighlightText);
    } else {
      pdfContent.removeEventListener("mouseup", removeHighlightText);
      pdfContent.removeEventListener("touchend", removeHighlightText);
    }
  }, [removeHighlightEnabled]);

  return (
    <LayoutWithHeader>
      <div className="py-6 px-8">
        <div className="flex justify-center ">
          <div className="flex items-center flex-wrap gap-2 max-w-[100%] bg-[#1b1425] text-[#fffffe] border-[2px] py-2 px-4">
            <div className="flex items-center flex-col">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="highlightCheckbox"
                  className="mr-2 accent-[#66b72e]"
                  checked={highlightEnabled}
                  onChange={() => {
                    if (!highlightEnabled) {
                      setRemoveHighlightEnabled(false);
                    }
                    setHighlightEnabled(
                      (highlightEnabled) => !highlightEnabled
                    );
                  }}
                />
                <label htmlFor="highlightCheckbox">Activar resaltador</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="highlightCheckbox"
                  className="ml-4 mr-2 accent-[#66b72e]"
                  checked={removeHighlightEnabled}
                  onChange={() => {
                    if (!removeHighlightEnabled) {
                      setHighlightEnabled(false);
                    }
                    setRemoveHighlightEnabled(
                      (removeHighlightEnabled) => !removeHighlightEnabled
                    );
                  }}
                />
                <label htmlFor="highlightCheckbox">Remover resaltador</label>
              </div>
            </div>
          </div>
        </div>
        <div
          id="pdfContent"
          className="cursor-text mt-4 whitespace-pre-line"
        ></div>
      </div>
    </LayoutWithHeader>
  );
};

export default PdfViewer;
