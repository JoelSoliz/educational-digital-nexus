import React from "react";

const Noticia = () => {
  return (
    /*cmbiar aqui*/<div className="w-3/5 h-80 mx-10 my-10  flex items-center justify-center bg-gray-600 rounded-md border-s-[12px] border-l-fuchsia-500"> 
      <div className="w-full text-center text-lg font-lato font-normal leading-6 p-10 ">
        <p className=" text-4xl pb-1 underline-offset-8">TEMA 1 Sistemas de información</p>
        <p className="text-base text-justify ">Descripcion: Conjunto de informaciones que afectan a una o más entidades en alguna de sus Conjunto de informaciones que afectan
a una o más entidades en alguna de sus actividades, unido a las normas, recursos y procedimientos de que se disponen para recoger, elaborar y permitir el acceso a esas informaciones
Conj p qp unto formal de procesos que, o perando sobre una colección de datos estructurada según las necesidades de la empresa, recopilan, elaboran y
distribuyen la información necesaria para las operaciones de dicha empresa y para las actividades de dirección y control correspondientes para desempeñar
su actividad de acuerdo a su estrategia de negocio [Andreu et al 1991]</p>
<button className="cursor-pointer hover:bg-lime-200 bg-green-300 text-blue-500 px-4 py-2 rounded-lg shadow-md mr-4 mt-10 ">Ver mas</button>
      </div>
    </div>
  );
}

export default Noticia;