import Link from "next/link";
import React from "react";

const ContentCard = ({ value }) => {
  const { id, title, description } = value;

  return (
    <Link
      href={`/new-viewer/${id}`}
      className="w-4/5 sm:w-3/5 h-70 flex flex-col bg-[#1b1425] rounded-md border-s-[6px] border-l-[#c0f49c] hover:border-l-[#66b72e] py-4 px-8 text-center text-lg font-lato font-normal leading-6 gap-1 cursor-pointer hover:scale-105"
    >
      <h3 className="text-xl pb-1 underline-offset-8 text-[#fffffe] text-left font-medium">
        {title}
      </h3>
      <p className="text-base text-left sm:text-justify text-[#a7a9be]">
        {description}
      </p>
    </Link>
  );
};

export default ContentCard;
