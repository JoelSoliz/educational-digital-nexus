import Navbar from "@/components/common/Navbar";
import ContentCard from "@/components/home/ContentCard";
import contents from "@/data/content.json";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="h-auto flex flex-wrap items-center justify-center text-center gap-6 my-6">
        {contents.map((content) => (
          <ContentCard key={content.title} value={content} />
        ))}
      </div>
    </div>
  );
}
