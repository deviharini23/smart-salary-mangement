import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register({ setIsRegistered }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    alert(`Registered successfully: ${email}`);
    setIsLoading(false);
    setIsRegistered(true);
    navigate("/login");
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

        .register-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        .register-container::before {
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
        }

        form input::placeholder {
          color: #9ca3af;
        }

        .password-requirements {
          margin-top: 8px;
          font-size: 12px;
          color: #64748b;
        }

        .password-requirements ul {
          margin-left: 16px;
          margin-top: 4px;
        }

        .password-requirements li {
          margin-bottom: 2px;
        }

        .register-button {
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
        }

        .register-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        .register-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
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

        .login-section {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid #e2e8f0;
        }

        .login-text {
          color: #64748b;
          font-size: 15px;
          margin-bottom: 16px;
        }

        .login-button {
          display: block;
          padding: 14px;
          border: 2px solid #667eea;
          border-radius: 12px;
          background: transparent;
          color: #667eea;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          text-align: center;
        }

        .login-button:hover {
          background: #667eea;
          color: white;
          transform: translateY(-1px);
        }

        .terms-agreement {
          margin: 20px 0;
          text-align: left;
          font-size: 14px;
          color: #64748b;
        }

        .terms-checkbox {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 16px;
        }

        .terms-checkbox input[type="checkbox"] {
          width: 18px;
          height: 18px;
          margin-top: 2px;
          accent-color: #667eea;
        }

        .terms-checkbox label {
          font-size: 14px;
          line-height: 1.4;
          color: #374151;
          cursor: pointer;
        }

        .terms-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
        }

        .terms-link:hover {
          text-decoration: underline;
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

      <div className="register-container">
        <div className="form-content">
          <div className="app-brand">
            <div className="app-icon">$</div>
            <div className="app-name">SmartExpense</div>
          </div>

          <h2>Create Account</h2>
          <p className="subtitle">Join SmartExpense to manage your expenses smarter</p>

          <form onSubmit={handleRegister}>
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
              <label className="form-label">Password</label>
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
              />
              <div className="password-requirements">
                <small>Password must contain:</small>
                <ul>
                  <li>At least 6 characters</li>
                  <li>Letters and numbers</li>
                </ul>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="terms-agreement">
              <div className="terms-checkbox">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">
                  I agree to the <a href="#" className="terms-link">Terms of Service</a> and <a href="#" className="terms-link">Privacy Policy</a>
                </label>
              </div>
            </div>

            <button type="submit" className="register-button" disabled={isLoading}>
              {isLoading ? (
                <span className="button-loading">
                  <div className="spinner"></div>
                  Creating Account...
                </span>
              ) : "Create Account"}
            </button>
          </form>

          <div className="login-section">
            <p className="login-text">Already have an account?</p>
            <Link to="/login" className="login-button">Sign In</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
