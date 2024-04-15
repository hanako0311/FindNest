import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import ContactUs from "./pages/ContactUs";
import Header from "./components/Header";
import Features from "./pages/Features";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";


export default function App() {
  return (
  <BrowserRouter>
  <Header /> 
  <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/features" element={<Features />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route element={<PrivateRoute/>} >
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
  </Routes>
  <Footer />
  </BrowserRouter>
  )
}