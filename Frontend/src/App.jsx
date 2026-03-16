import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Signup } from "./components/Auth/Signup";
import { MainLayout } from "./components/Layout/MainLayout";
import Login from './components/Auth/Login'
import { Dashboard } from "./components/Pages/Dashboard";


export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/leads" element={<Leads />} />

      </Route>
    </Routes>
  );
}