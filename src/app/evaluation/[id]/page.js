"use client";
import React, { useEffect, useRef, useState } from "react";
import { useContent } from "@/hooks/useContent";
import PdfViewer from "@/components/pdf-viewer/PdfViewer";
import LayoutWithHeader from "@/components/common/LayoutWithHeader";
import useAuth from "@/context/authContext";
import { toast } from "sonner";
import { Button, Select, TextField } from "@mui/material";
import Recording from "@mui/icons-material/RadioButtonChecked";
import { useFileData } from "@/hooks/useFileData";
import { redirect, useSearchParams } from "next/navigation";

const PdfViewerPage = ({ params }) => {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const userId = searchParams.get("user");
  if (!userId) {
    redirect("/evaluation");
  }

  const [key, setKey] = useState(0);
  const [fileData, { giveComment }] = useFileData(userId, params.id);
  const [content, _] = useContent(params.id);
  const [movements, setMovements] = useState([]);
  const [message, setMessage] = useState("");
  const [replaying, setReplaying] = useState(false);
  const velocity = useRef(1);
  const stop = useRef(false);

  useEffect(() => {
    if (fileData) {
      setMessage(fileData.message);
    }
  }, [fileData]);

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

  const saveMessage = () => {
    if (message) {
      giveComment(message);
    }
  };

  // <div className="flex items-center flex-wrap gap-2 min-h-32 max-w-[100%] bg-[#1b1425] text-[#fffffe] border-[2px] py-2 px-4">
  //           <div className="flex items-center flex-col">
  //             {!recording &&
  //               !!movements.length &&
  //               (!replaying ? (
  //                 <>
  //                   {/* <Select
  //                     value={age}
  //                     onChange={handleChange}
  //                     label="Grabación"
  //                   >
  //                     {Object.keys(fileData?.movements).map((key) => {
  //                       <MenuItem value={key}>
  //                         {new Date(key).toString().split(" GMT")[0]}
  //                       </MenuItem>;
  //                     })}
  //                   </Select> */}
  //                   <Button
  //                     variant="text"
  //                     component="label"
  //                     sx={{
  //                       color: "#fffffe",
  //                       "&:hover": {
  //                         color: "#66b72e",
  //                       },
  //                     }}
  //                     onClick={() => {
  //                       toast.info("Reproduciendo grabación...");
  //                       stop.current = false;
  //                       setReplaying(true);
  //                       reproduceMovement();
  //                     }}
  //                   >
  //                     Reproducir interacción
  //                   </Button>
  //                 </>
  //               ) : (
  //                 <div>
  //                   <Recording sx={{ color: "#ff0000" }} />
  //                   <Button
  //                     variant="text"
  //                     component="label"
  //                     sx={{
  //                       color: "#fffffe",
  //                       "&:hover": {
  //                         color: "#66b72e",
  //                       },
  //                     }}
  //                     onClick={() => {
  //                       toast.info("Reproducción terminada");
  //                       stop.current = true;
  //                       setReplaying(false);
  //                     }}
  //                   >
  //                     Parar reproducción
  //                   </Button>
  //                   <Button
  //                     variant="text"
  //                     component="label"
  //                     sx={{
  //                       color: velocity.current != 1 ? "#fffffe" : "#66b72e",
  //                       "&:hover": {
  //                         color: "#66b72e",
  //                       },
  //                     }}
  //                     onClick={() => {
  //                       velocity.current = 1;
  //                     }}
  //                   >
  //                     x1
  //                   </Button>
  //                   <Button
  //                     variant="text"
  //                     component="label"
  //                     sx={{
  //                       color: velocity.current != 2 ? "#fffffe" : "#66b72e",
  //                       "&:hover": {
  //                         color: "#66b72e",
  //                       },
  //                     }}
  //                     onClick={() => {
  //                       velocity.current = 2;
  //                     }}
  //                   >
  //                     x2
  //                   </Button>
  //                   <Button
  //                     variant="text"
  //                     component="label"
  //                     sx={{
  //                       color: velocity.current != 4 ? "#fffffe" : "#66b72e",
  //                       "&:hover": {
  //                         color: "#66b72e",
  //                       },
  //                     }}
  //                     onClick={() => {
  //                       velocity.current = 4;
  //                     }}
  //                   >
  //                     x4
  //                   </Button>{" "}
  //                 </div>
  //               ))}
  //           </div>
  //         </div>
  return (
    <LayoutWithHeader>
      <div className="py-6 px-8">
        <div className="flex justify-center mb-4">
          <div className="flex items-center flex-wrap gap-2 min-h-32 max-w-[100%] bg-[#1b1425] text-[#fffffe] border-[2px] py-2 px-4">
            <div className="flex items-center flex-col">
              <TextField
                required
                multiline
                autoComplete={false}
                id="message"
                label="Retroalimentación"
                variant="filled"
                style={{ minWidth: "30%" }}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
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
                  saveMessage();
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
          highlightEnabled={false}
          highlighted={!!fileData?.highlighted ? fileData.highlighted : []}
        />
      </div>
    </LayoutWithHeader>
  );
};

export default PdfViewerPage;
