/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CreatorDashboard from "./pages/dashboard/CreatorDashboard";
import AudienceDashboard from "./pages/dashboard/AudienceDashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard/creator" 
          element={
            <ProtectedRoute allowedRole="creator">
              <CreatorDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/audience" 
          element={
            <ProtectedRoute allowedRole="audience">
              <AudienceDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}
