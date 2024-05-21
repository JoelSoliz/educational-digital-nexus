import React from "react";

const HighlightText = ({ text, start, length }) => {
  return (
    <span data-start={start} data-length={length} className="highlight">
      {text}
    </span>
  );
};

export default HighlightText;
