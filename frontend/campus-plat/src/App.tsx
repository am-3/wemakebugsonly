import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./app/page";
import LoginPage from "./app/login/page";
import SignupPage from "./app/signup/page";
import DashboardPage from "./app/dashboard/page";
import NotFoundPage from "./app/not-found/page";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/not-found" element={<NotFoundPage />} />
        {/* more routes */}
      </Routes>
    </BrowserRouter>
  );
}
