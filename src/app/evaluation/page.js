"use client";
import isAuth from "@/components/common/IsAuth";
import LayoutWithHeader from "@/components/common/LayoutWithHeader";
import { useEvaluationInfo } from "@/hooks/useEvaluationInfo";
import ContentCard from "@/components/evaluation/ContentCard";
import { useEffect, useState } from "react";

const Evaluation = ({ userId }) => {
  const [{ data, loading }] = useEvaluationInfo(userId);
  const [information, setInformation] = useState([]);
  useEffect(() => {
    if (data) {
      const result = Object.keys(data).map((key) => [key, data[key]]);
      setInformation(result);
    }
  }, [data]);
  return (
    <LayoutWithHeader>
      <div className="h-auto flex flex-wrap items-center justify-center text-center gap-6 my-6">
        {!!loading && <span>Cargando contenidos...</span>}
        {!loading &&
          !!information.length &&
          information.map((info) => (
            <ContentCard key={info[0]} value={info[1]} />
          ))}
        {!loading && !information.length && <span>No existen contenidos</span>}
      </div>
    </LayoutWithHeader>
  );
};

export default isAuth(Evaluation);
