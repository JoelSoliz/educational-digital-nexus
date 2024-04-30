import { useEffect, useState } from "react";
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

const contentsRef = collection(db, "contents");

export function useContents() {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(null);
  const actions = {
    createContent: async (contentData) => {
      console.log(contentData);
      const result = await addDoc(contentsRef, {
        ...contentData,
      });
      console.log(result);
    },
  };

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(contentsRef, (snapshot) => {
      const contentsData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return { ...data, id: doc.id };
      });
      setContents(contentsData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return [{ data: contents, loading }, actions];
}
