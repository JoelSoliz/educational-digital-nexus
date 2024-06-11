"use client";
import React, { useRef, useState } from "react";
import { useContent } from "@/hooks/useContent";
import PdfViewer from "@/components/pdf-viewer/PdfViewer";
import LayoutWithHeader from "@/components/common/LayoutWithHeader";
import useAuth from "@/context/authContext";
import { toast } from "sonner";
import { Button, Select } from "@mui/material";
import Recording from "@mui/icons-material/RadioButtonChecked";
import { useFileData } from "@/hooks/useFileData";

function debounce(callback, wait) {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      callback(...args);
    }, wait);
  };
}

const PdfViewerPage = ({ params }) => {
  const { user } = useAuth();
  const [key, setKey] = useState(0);
  const [fileData, { updateMoves, updateHigh }] = useFileData(
    user?.uid,
    params.id
  );
  const [content, _] = useContent(params.id);
  const [highlightEnabled, setHighlightEnabled] = useState(true);
  const [movements, setMovements] = useState([]);
  const [recording, setRecording] = useState(false);
  const [replaying, setReplaying] = useState(false);
  const velocity = useRef(1);
  const stop = useRef(false);
  const lastScrollTimeRef = useRef(null);
  const lastRecording = useRef(null);

  const recordMovement = () => {
    const currentTime = Date.now();
    const timeBetweenScrolls = currentTime - lastScrollTimeRef.current;
    lastScrollTimeRef.current = currentTime;
    const scrollY = document.getElementById("viewfinder").scrollTop;
    setMovements((movements) => [
      ...movements,
      { scrollY, timeBetweenScrolls },
    ]);
  };

  const reproduceMovement = async () => {
    for (const event of movements) {
      if (stop.current) break;
      await new Promise((resolve) =>
        setTimeout(resolve, event.timeBetweenScrolls / velocity.current)
      );
      document
        .getElementById("viewfinder")
        .scrollTo({ top: event.scrollY, behavior: "smooth" });
    }

    setReplaying(false);
    toast.info("Reproducción terminada.");
  };

  const saveMovements = async () => {
    if (fileData) {
      updateMoves([
        ...fileData.movements,
        { date: lastRecording.current, movements },
      ]);
    }
  };

  const saveHighlighted = async () => {
    const highlighted = [];
    const elements = document.querySelectorAll("#pdf-content > p");
    let paragraph = 0,
      start = 0;
    elements.forEach((element) => {
      element.childNodes.forEach((node, idx, nodeList) => {
        let length = node.textContent.length;
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          node.tagName.toLowerCase() === "span" &&
          node.classList.contains("highlight")
        ) {
          highlighted.push({ start, length, paragraph });
        }

        start += length;
      });

      start = 0;
      paragraph++;
    });

    if (fileData) {
      updateHigh(highlighted);
      setKey((prevKey) => prevKey + 1);
    }
  };

  return (
    <LayoutWithHeader>
      <div className="py-6 px-8">
        <div className="flex justify-center mb-4">
          <div className="flex items-center flex-wrap gap-2 min-h-32 max-w-[100%] bg-[#1b1425] text-[#fffffe] border-[2px] py-2 px-4">
            <div className="flex items-center flex-col">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="highlightCheckbox"
                  className="mr-2 accent-[#66b72e]"
                  checked={highlightEnabled}
                  onChange={() => {
                    setHighlightEnabled(
                      (highlightEnabled) => !highlightEnabled
                    );
                  }}
                />
                <label htmlFor="highlightCheckbox">Activar resaltador</label>
              </div>
              {!replaying &&
                (!recording ? (
                  <Button
                    variant="text"
                    component="label"
                    sx={{
                      color: "#fffffe",
                      "&:hover": {
                        color: "#66b72e",
                      },
                    }}
                    onClick={() => {
                      setMovements((movements) => [
                        {
                          scrollY:
                            document.getElementById("viewfinder").scrollTop,
                          timeBetweenScrolls: 0,
                        },
                      ]);
                      lastScrollTimeRef.current = Date.now();
                      lastRecording.current = Date.now().toString();
                      document
                        .getElementById("viewfinder")
                        .addEventListener(
                          "scroll",
                          debounce(recordMovement, 1000)
                        );
                      toast.info("Grabación iniciada...");
                      setRecording(true);
                    }}
                  >
                    Grabar interacción
                  </Button>
                ) : (
                  <div>
                    <Recording sx={{ color: "#ff0000" }} />
                    <Button
                      variant="text"
                      component="label"
                      sx={{
                        color: "#fffffe",
                        "&:hover": {
                          color: "#66b72e",
                        },
                      }}
                      onClick={() => {
                        document
                          .getElementById("viewfinder")
                          .removeEventListener("scroll", recordMovement);
                        toast.info("Grabación terminada...");
                        setRecording(false);
                      }}
                    >
                      Parar grabación
                    </Button>
                  </div>
                ))}
              <Button
                variant="text"
                component="label"
                sx={{
                  color: "#fffffe",
                  "&:hover": {
                    color: "#66b72e",
                  },
                }}
                onClick={() => {
                  saveMovements();
                  saveHighlighted();
                  toast.info("Guardado!");
                }}
              >
                Guardar
              </Button>
            </div>
          </div>
        </div>
        <PdfViewer
          identifier={key}
          pdfData={content?.fileUrl}
          highlightEnabled={highlightEnabled}
          highlighted={!!fileData?.highlighted ? fileData.highlighted : []}
        />
        {!!fileData?.message && (
          <div className="flex justify-center">
            <div
              id="viewfinder"
              className="mt-4 max-h-20 w-[50%] p-2 overflow-y-auto rounded-md border-[3px] border-[#5ed746] text-gray-700"
            >
              {fileData?.message || "No hay retroalimentación aun"}
            </div>
          </div>
        )}
      </div>
    </LayoutWithHeader>
  );
};

export default PdfViewerPage;
