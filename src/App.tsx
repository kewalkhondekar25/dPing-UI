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

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/creator" element={<CreatorDashboard />} />
        <Route path="/dashboard/audience" element={<AudienceDashboard />} />
      </Routes>
    </Router>
  );
}
