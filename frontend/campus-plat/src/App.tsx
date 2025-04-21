import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./app/page";
import LoginPage from "./app/login/page";
import SignupPage from "./app/signup/page";
import NotFoundPage from "./app/not-found/page";
import AcademicProgressPage from '../src/app/dashboard/academic-progress/page';
import EventsPage from "./app/dashboard/upcoming-events/page";
import ResourceBookingsPage from "./app/dashboard/resource-bookings/page";
import ClubActivitiesPage from "./app/dashboard/club-activities/page";
import DashboardRouter from "./components/DashboardRouter";
import ClubsPage from "./app/dashboard/club-activities/page";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardRouter />} />
        <Route path="/not-found" element={<NotFoundPage />} />
        <Route path="/dashboard/academic-progress" element={<AcademicProgressPage />} />
        <Route path="/dashboard/upcoming-events" element={<EventsPage />} />
        <Route path="/dashboard/resource-bookings" element={<ResourceBookingsPage />} />
        <Route path="/dashboard/club-activities" element={<ClubActivitiesPage />} />
        <Route path="/clubs/:clubId" element={<ClubsPage />} />
        
        {/* more routes */}
      </Routes>
    </BrowserRouter>
  );
}
