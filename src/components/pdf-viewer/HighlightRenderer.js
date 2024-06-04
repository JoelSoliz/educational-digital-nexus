import React, { useEffect, useState } from "react";
import HighlightText from "./HighlightText";

const HighlightRenderer = ({ content, highlightPositions }) => {
  const [highlightedContent, setHighlightedContent] = useState([]);

  const highlight = (highlightPositions) => {
    const groupedPositions = highlightPositions.reduce(
      (acc, { start, length, paragraph }) => {
        if (!acc[paragraph]) acc[paragraph] = [];
        acc[paragraph].push({
          start: parseInt(start),
          length: parseInt(length),
        });
        return acc;
      },
      {}
    );

    const newHighlightedContent = content.map((text, paragraph) => {
      if (!groupedPositions[paragraph]) {
        return <p key={paragraph}>{text}</p>;
      }

      const positions = groupedPositions[paragraph].sort(
        (a, b) => a.start - b.start
      );
      const parts = [];
      let lastIndex = 0;

      positions.forEach(({ start, length }) => {
        parts.push(text.slice(lastIndex, start));
        parts.push(
          <HighlightText
            key={`${start}-${length}-${paragraph}`}
            text={text.slice(start, start + length)}
            start={start}
            length={length}
          />
        );
        lastIndex = start + length;
      });

      parts.push(text.slice(lastIndex));
      return <p key={paragraph}>{parts}</p>;
    });

    setHighlightedContent(newHighlightedContent);
  };

  useEffect(() => {
    if (typeof content === "string") {
      setHighlightedContent([<p>{content}</p>]);
    }

    if (Array.isArray(content) && Array.isArray(highlightPositions)) {
      highlight(highlightPositions);
    }
  }, [content, highlightPositions]);

  return <div id="pdf-content">{highlightedContent}</div>;
};

export default HighlightRenderer;
