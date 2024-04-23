import { create } from "zustand";
import {
  GoogleAuthProvider,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { toast } from "sonner";

const useAuth = create((set) => ({
  user: null,
  googleSignIn: () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider)
      .then(() => {
        toast.success("Ha iniciado sesión correctamente");
      })
      .catch((error) => {
        toast.success("Hubo un error al iniciar sesión");
        console.error(error);
      });
  },
  signOut: () => {
    signOut(auth)
      .then(() => {
        toast.success("Ha cerrado sesión correctamente");
      })
      .catch((error) => {
        console.error(error);
      });
  },
}));

onAuthStateChanged(auth, (currentUser) => {
  if (currentUser?.displayName) {
    toast.success(`¡Hola ${currentUser.displayName}!`);
  }
  useAuth.setState({
    user: currentUser,
  });
});

export default useAuth;
