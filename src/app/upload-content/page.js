"use client";
import isAuth from "@/components/common/IsAuth";
import LayoutWithHeader from "@/components/common/LayoutWithHeader";
import { Button, TextField, Typography } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useState } from "react";
import { uploadFile } from "@/hooks/useFileStore";
import { toast } from "sonner";
import { useContents } from "@/hooks/useContents";

const initValues = {
  title: "",
  description: "",
  file: null,
};

const UploadContent = ({ userId }) => {
  const [_, actions] = useContents();
  const [formValues, setFormValues] = useState(initValues);
  const handleUpdate = (field, value) =>
    setFormValues({ ...formValues, [field]: value });

  const handleSubmit = () => {
    if (!formValues.file) {
      toast.error("Debe seleccionar un archivo antes de continuar.");
    } else {
      uploadFile(formValues.file[1], (downloadURL) => {
        actions.createContent(
          {
            description: formValues.description,
            title: formValues.title,
            fileUrl: downloadURL,
            createdBy: userId,
          },
          () => setFormValues(initValues)
        );
      });
    }
  };

  return (
    <LayoutWithHeader>
      <div className="py-6 px-8 w-screen flex justify-center">
        <div className="flex justify-center items-center w-full">
          <div className="flex flex-col items-center gap-4 min-w-[80%] bg-[#1b1425] text-[#fffffe] border-[2px] py-6 px-4 rounded-2xl">
            <h1 className="font-bold text-2xl mb-2">Subir PDF</h1>
            <TextField
              required
              autoComplete={false}
              id="title"
              label="Título"
              variant="filled"
              style={{ minWidth: "30%" }}
              value={formValues.title}
              onChange={(event) => handleUpdate("title", event.target.value)}
            />
            <TextField
              required
              autoComplete={false}
              id="description"
              label="Descripción"
              variant="filled"
              style={{ minWidth: "30%" }}
              value={formValues.description}
              onChange={(event) =>
                handleUpdate("description", event.target.value)
              }
            />
            <div className="flex justify-center flex-row gap-3 flex-wrap">
              <Button variant="text" component="label">
                Escoger archivo
                <input
                  id="fileInput"
                  type="file"
                  accept=".pdf"
                  hidden
                  onChange={(event) => {
                    const files = event.target.files;
                    if (files.length) {
                      handleUpdate("file", [files[0].name, files[0]]);
                    }
                  }}
                />
              </Button>
              {!!formValues.file && (
                <>
                  <Typography className="flex items-center gap-1 mt-[-4px]">
                    {formValues.file[0]}
                    <ClearIcon
                      className="cursor-pointer hover:text-red-600"
                      onClick={() => handleUpdate("file", null)}
                    />
                  </Typography>
                </>
              )}
            </div>
            <Button
              variant="contained"
              component="label"
              style={{ color: "#fffffe" }}
              onClick={handleSubmit}
            >
              Subir
            </Button>
          </div>
        </div>
      </div>
    </LayoutWithHeader>
  );
};

export default isAuth(UploadContent);
