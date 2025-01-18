import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserSubmissionForm from "./components/UserSubmissionForm";
import AdminRegister from "./components/AdminRegister";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<UserSubmissionForm />} />
          <Route path="/register" element={<AdminRegister />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
