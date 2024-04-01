import Navbar from "./componentes/Navbar";
import Noticia from "./componentes/Noticia";
export default function Home() {
  return (
    <div > 
      <Navbar />
      <div className="h-auto flex flex-wrap items-center justify-center text-center ">
        <Noticia />
        <Noticia />
        <Noticia />
      </div>
      
    </div>
  );
}
//flex flex-wrap