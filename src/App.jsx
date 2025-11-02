import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SetBudget from "./pages/SetBudget";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";
import Goal from "./pages/Goal";
import History from "./pages/History";

// Navbar
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* ✅ Home Page */}
        <Route path="/" element={<HomePage />} />

        {/* 🔐 Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 💰 Budget & Finance Features */}
        <Route path="/setbudget" element={<SetBudget />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/goal" element={<Goal />} />
        <Route path="/history" element={<History />} />

        {/* 🚫 Redirect any unknown path back to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
