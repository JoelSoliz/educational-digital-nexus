import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";

const contentsRef = collection(db, "contents");
const contentsQuery = query(contentsRef, orderBy("title"));

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
    const unsubscribe = onSnapshot(contentsQuery, (snapshot) => {
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
