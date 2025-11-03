import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    alert(`Logged in as ${email}`);
    setIsLoading(false);
    navigate("/SetBudget");
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body, html {
          height: 100%;
          font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
          background: url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaPR9Amm-TPAegI8fqcx1KC1Df9kihZrOxTw&s') no-repeat center center fixed;
          background-size: cover;
        }

        .login-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        .login-container::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 20px 20px;
          animation: float 20s infinite linear;
        }

        .form-content {
          position: relative;
          z-index: 1;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 48px 40px;
          border-radius: 24px;
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.1),
            0 0 0 1px rgba(255, 255, 255, 0.2);
          text-align: center;
          width: 100%;
          max-width: 440px;
          animation: slideUp 0.6s ease-out;
        }

        .app-brand {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 32px;
          gap: 12px;
        }

        .app-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 18px;
        }

        .app-name {
          font-size: 24px;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        h2 {
          margin-bottom: 8px;
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
        }

        .subtitle {
          color: #64748b;
          margin-bottom: 32px;
          font-size: 16px;
          line-height: 1.5;
        }

        .form-group {
          margin-bottom: 20px;
          text-align: left;
        }

        .form-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }

        form input {
          width: 100%;
          padding: 16px;
          border-radius: 12px;
          border: 2px solid #e2e8f0;
          font-size: 16px;
          outline: none;
          background: #ffffff;
          color: #1e293b;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        form input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          background: #ffffff;
        }

        form input::placeholder {
          color: #9ca3af;
        }

        .password-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .forgot-link {
          color: #667eea;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .forgot-link:hover {
          color: #764ba2;
        }

        .login-button {
          width: 100%;
          padding: 16px;
          margin-top: 8px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: #ffffff;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          font-family: inherit;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        .login-button:active {
          transform: translateY(0);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .button-loading {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid transparent;
          border-top: 2px solid #ffffff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .divider {
          margin: 32px 0;
          position: relative;
          text-align: center;
          color: #64748b;
          font-size: 14px;
        }

        .divider::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #e2e8f0;
        }

        .divider span {
          background: #ffffff;
          padding: 0 16px;
          position: relative;
        }

        .register-section {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid #e2e8f0;
        }

        .register-text {
          color: #64748b;
          font-size: 15px;
          margin-bottom: 16px;
        }

        .register-button {
          display: block;
          padding: 14px;
          border: 2px solid #667eea;
          border-radius: 12px;
          background: transparent;
          color: #667eea;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          text-align: center;
        }

        .register-button:hover {
          background: #667eea;
          color: white;
          transform: translateY(-1px);
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes float {
          from { transform: translate(0, 0) rotate(0deg); }
          to { transform: translate(-20px, -20px) rotate(360deg); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div className="login-container">
        <div className="form-content">
          <div className="app-brand">
            <div className="app-icon">$</div>
            <div className="app-name">SmartExpense</div>
          </div>

          <h2>Welcome Back</h2>
          <p className="subtitle">Sign in to manage your expenses and budget</p>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <div className="password-header">
                <label className="form-label">Password</label>
                <a href="#" className="forgot-link">Forgot Password?</a>
              </div>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? (
                <span className="button-loading">
                  <div className="spinner"></div>
                  Signing In...
                </span>
              ) : "Sign In"}
            </button>
          </form>

          <div className="register-section">
            <p className="register-text">Don't have an account?</p>
            <Link to="/register" className="register-button">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
