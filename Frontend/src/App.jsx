import { Routes, Route } from "react-router-dom";
import { Signup } from "./components/Auth/Signup";
import { MainLayout } from "./components/Layout/MainLayout";
import Login from './components/Auth/Login'
import { Dashboard } from "./components/Pages/Dashboard";
import { Leads } from "./components/Pages/Leads";
import { Pipeline } from "./components/Pages/Pipeline";
import { Agents } from "./components/Pages/Agents";
import { Settings } from "./components/Pages/Setting";
import { Visits } from "./components/Pages/Visits";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/pipeline" element={<Pipeline />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/visits" element={<Visits />} />
      </Route>
    </Routes>
  );
}