import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import {
  ThorinGlobalStyles,
  lightTheme as darkTheme,
} from "@ensdomains/thorin";
import { ethers } from "ethers";

// Pages
import { Home } from "./pages/Home/Home";
import { Listings } from "./pages/Listings/Listings";
import { Profile } from "./pages/Profile/Profile";
import { Name } from "./pages/Name/Name";

// Other
import { Navbar } from "./components/Navbar/Navbar";
import { Footer } from "./components/Footer/Footer";

interface Context {
  signer: any;
  set: any;
}
const prov = new ethers.providers.JsonRpcProvider("https://rpc.ftm.tools");
export const WalletContext = React.createContext({
  signer: prov,
  set: undefined,
} as Context);

function App() {
  const [signer, setSigner] = React.useState(prov);

  return (
    // allow the signer data to be accessible to any component
    // @ts-ignore
    <WalletContext.Provider value={{ signer: signer, set: setSigner }}>
      <ThemeProvider theme={darkTheme}>
        <ThorinGlobalStyles />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listings/ftm" element={<Listings category="ftm" />} />
          <Route path="/listings/0x" element={<Listings category="0x" />} />
          <Route
            path="/listings/single"
            element={<Listings category="single" />}
          />
          <Route
            path="/listings/double"
            element={<Listings category="double" />}
          />
          <Route
            path="/listings/triple"
            element={<Listings category="triple" />}
          />
          <Route
            path="/listings/fortune500"
            element={<Listings category="fortune500" />}
          />
          <Route path="/my" element={<Profile />} />
          <Route path="/name/:name" element={<Name />} />
        </Routes>
        <Footer />
      </ThemeProvider>
    </WalletContext.Provider>
  );
}

export default App;
