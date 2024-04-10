import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";


export default function App() {
  return (
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about-us" element={<AboutUs />} />
    <Route path="/sign-in" element={<SignIn />} />
    <Route path="/dashboard" element={<Dashboard />} />
  </Routes>
  </BrowserRouter>
  )
}