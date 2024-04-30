import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export function useContent(id) {
  const [content, setContent] = useState(null);
  const actions = {};

  useEffect(() => {
    let unsubscribe = () => null;
    if (id) {
      unsubscribe = onSnapshot(doc(db, "contents", id), (snapshot) => {
        const data = snapshot.data();
        setContent({ ...data });
      });
    }

    return unsubscribe;
  }, [id]);

  return [content, actions];
}
