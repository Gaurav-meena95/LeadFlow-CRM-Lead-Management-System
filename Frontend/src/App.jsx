import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Signup } from "./components/Auth/Signup";
import { MainLayout } from "./components/Layout/MainLayout";
import Login from './components/Auth/Login'


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
        </Route> */}
      </Routes>
    </BrowserRouter>
  );
}