import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute onlyAdmin={true} deniedPath="/">
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  </Router>
);

export default AppRouter;
