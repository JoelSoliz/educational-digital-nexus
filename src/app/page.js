"use client";
import LayoutWithHeader from "@/components/common/LayoutWithHeader";
import ContentCard from "@/components/home/ContentCard";
import { useContents } from "@/hooks/useContents";

export default function Home() {
  const [{ data, loading }, _] = useContents();

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
