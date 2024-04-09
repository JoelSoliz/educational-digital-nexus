import Navbar from "./Navbar";

const LayoutWithHeader = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default LayoutWithHeader;
