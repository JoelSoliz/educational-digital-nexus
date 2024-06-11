import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import Link from "next/link";
import React from "react";

const ContentCard = ({ value }) => {
  const { title, interactions } = value;
  console.log(value);
  return (
    <Accordion
      sx={{ backgroundColor: "#1b1425" }}
      className="w-4/5 sm:w-3/5 h-70 flex flex-col bg-[#1b1425] rounded-md border-s-[6px] border-l-[#c0f49c] hover:border-l-[#66b72e] py-4 px-8 text-center text-lg font-lato font-normal leading-6 gap-1"
    >
      <AccordionSummary>
        <h3 className="text-xl pb-1 underline-offset-8 text-[#fffffe] text-left font-medium cursor-pointer">
          {title}
        </h3>
      </AccordionSummary>
      <AccordionDetails>
        <div className="ml-8 flex flex-col gap-4">
          {interactions.map((interaction) => (
            <Link
              key={`${interaction.content}-${interaction.user}`}
              className="w-fit"
              href={`/evaluation/${interaction.content}?user=${interaction.user}`}
            >
              <div className="flex flex-row justify-start items-center gap-4 hover:scale-105 cursor-pointer group ">
                <img
                  className="bg-[#fffffe] group-hover:bg-[#66b72e] rounded-full w-8 "
                  alt={`Foto de usuario ${interaction.userName}`}
                  src={interaction.userPhoto}
                />
                <p className="text-[#fffffe] group-hover:text-[#66b72e]">
                  {interaction.userName}
                </p>
              </div>
            </Link>
          ))}
        </div>
        {!interactions.length && (
          <span>No hubieron interacciones con este contenido.</span>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default ContentCard;
