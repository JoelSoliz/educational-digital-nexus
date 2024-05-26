"use client";
import LayoutWithHeader from "@/components/common/LayoutWithHeader";
import ContentCard from "@/components/home/ContentCard";
import { useContents } from "@/hooks/useContents";
import { useEffect } from "react";

export default function Home() {
  const [{ data, loading }, _] = useContents();
  // useEffect(() => {
  //   console.log(new URLSearchParams(window.location.search).keys());
  // }, []);

  useEffect(() => {
    fetch("/api/lti", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(window.location.search),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <LayoutWithHeader>
      <div className="h-auto flex flex-wrap items-center justify-center text-center gap-6 my-6">
        {!!loading && <span>Cargando contenidos...</span>}
        {!loading &&
          data.map((content) => (
            <ContentCard key={content.title} value={content} />
          ))}
      </div>
    </LayoutWithHeader>
  );
}
