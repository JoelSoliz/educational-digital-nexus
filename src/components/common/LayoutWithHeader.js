import { Toaster } from "sonner";
import Navbar from "./Navbar";
import { ThemeProvider } from "@mui/material";
import theme from "@/styles/theme";

const LayoutWithHeader = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <div>
        <Toaster richColors />
        <Navbar />
        <main>{children}</main>
      </div>
    </ThemeProvider>
  );
};

export default LayoutWithHeader;
