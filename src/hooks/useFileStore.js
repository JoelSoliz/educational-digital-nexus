import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase/firebase";

async function hashFile(file) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

export const uploadFile = (file, callback) => {
  hashFile(file).then((hash) => {
    const fileRef = ref(storage, `${hash}.pdf`);

    getDownloadURL(fileRef)
      .then((downloadURL) => {
        console.log("File available at", downloadURL);
        callback(downloadURL);
      })
      .catch((error) => {
        if (error.code === "storage/object-not-found") {
          const metadata = {
            contentType: "application/pdf",
          };
          uploadBytes(fileRef, file, metadata)
            .then((snapshot) => {
              getDownloadURL(snapshot.ref).then((downloadURL) => {
                console.log("File available at", downloadURL);
                callback(downloadURL);
              });
            })
            .catch((error) => console.error(error));
        }
      });
  });
};
