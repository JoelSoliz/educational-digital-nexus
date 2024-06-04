import { useEffect, useState } from "react";
import { doc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export function useFileData(userId, documentId) {
  const [fileData, setFileData] = useState(null);
  const actions = {
    updateDoc: async (movements, highlighted) => {
      const docRef = doc(db, "interactions", `${userId}_${documentId}`);
      await updateDoc(docRef, { movements, highlighted });
    },
  };

  useEffect(() => {
    let unsubscribe = () => null;
    if (userId && documentId) {
      const docRef = doc(db, "interactions", `${userId}_${documentId}`);
      unsubscribe = onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setFileData({ ...data });
        } else {
          const data = {
            user: userId,
            content: documentId,
            movements: {},
            highlighted: [],
          };
          setDoc(docRef, data);
          setFileData(data);
        }
      });
    }

    return unsubscribe;
  }, [userId, documentId]);

  return [fileData, actions];
}
