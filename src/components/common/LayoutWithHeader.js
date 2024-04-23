import { Toaster } from "sonner";
import Navbar from "./Navbar";

const LayoutWithHeader = ({ children }) => {
  return (
    <div>
      <Toaster richColors />
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default LayoutWithHeader;
