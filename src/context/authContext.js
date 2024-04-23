import { create } from "zustand";
import {
  GoogleAuthProvider,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/firebase/firebase";

const useAuth = create((set) => ({
  user: null,
  googleSignIn: async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error(error);
    }
  },
  signOut: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  },
}));

onAuthStateChanged(auth, (currentUser) => {
  useAuth.setState({
    user: currentUser,
  });
});

export default useAuth;
