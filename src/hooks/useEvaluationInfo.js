import { db } from "@/firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

const contentsRef = collection(db, "contents");
const usersRef = collection(db, "users");
const interactionsRef = collection(db, "interactions");

export function useEvaluationInfo(userId) {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(null);

  async function getUserContentsInteractions(userId) {
    try {
      const contQuery = query(contentsRef, where("createdBy", "==", userId));
      const contentsSnapshot = await getDocs(contQuery);
      if (contentsSnapshot.empty) {
        console.log("No contents found for this user.");
        setLoading(false);
        return;
      }

      const contents = {};
      contentsSnapshot.forEach((doc) => {
        contents[doc.id] = { ...doc.data(), interactions: [] };
      });
      const contentIds = Object.keys(contents);

      const intQuery = query(
        interactionsRef,
        where("content", "in", contentIds)
      );
      const interactionsSnapshot = await getDocs(intQuery);
      if (interactionsSnapshot.empty) {
        setLoading(false);
        console.log("No interactions found for these contents.");
        return;
      }

      const userIds = new Set();
      interactionsSnapshot.forEach((doc) => {
        const interaction = doc.data();
        const contentId = interaction.content;
        if (contents[contentId]) {
          contents[contentId].interactions.push({
            ...interaction,
          });
          userIds.add(interaction.user);
        }
      });

      const userIdsLs = Array.from(userIds);
      const usersQuery = query(usersRef, where("id", "in", userIdsLs));
      const usersSnapshot = await getDocs(usersQuery);
      if (usersSnapshot.empty) {
        console.log("No users found for these interactions.");
        setLoading(false);
        return;
      }

      const users = {};
      usersSnapshot.forEach((doc) => {
        const data = doc.data();
        users[data.id] = data;
      });

      console.log(users);
      for (const contentId in contents) {
        contents[contentId].interactions.forEach((interaction) => {
          console.log(interaction.user);

          interaction.userName =
            users[interaction.user]?.displayName || "Unknown User";
          interaction.userPhoto =
            users[interaction.user]?.photoURL ||
            "https://static.thenounproject.com/png/3825456-200.png";
        });
      }

      setLoading(false);
      setContents(contents);
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  }

  useEffect(() => {
    if (userId) {
      setLoading(true);
      getUserContentsInteractions(userId);
    }
  }, [userId]);

  return [{ data: contents, loading }];
}
