import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SetBudget() {
  const [budget, setBudget] = useState("");
  const [desiredSavings, setDesiredSavings] = useState("");
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Calculate remaining amount whenever budget or savings change
  useEffect(() => {
    const budgetValue = parseFloat(budget) || 0;
    const savingsValue = parseFloat(desiredSavings) || 0;
    const remaining = budgetValue - savingsValue;
    setRemainingAmount(remaining);
  }, [budget, desiredSavings]);

  const handleNext = async () => {
    const budgetValue = parseFloat(budget);
    const savingsValue = parseFloat(desiredSavings);

    if (!budget || !desiredSavings) {
      alert("Please fill in all fields!");
      return;
    }

    if (budgetValue <= 0 || savingsValue <= 0) {
      alert("Please enter valid positive values!");
      return;
    }

    if (savingsValue > budgetValue) {
      alert("Savings cannot be greater than total budget!");
      return;
    }

    if (remainingAmount < 0) {
      alert("Your expenses cannot exceed your budget!");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    localStorage.setItem("budget", budgetValue);
    localStorage.setItem("desiredSavings", savingsValue);
    localStorage.setItem("remainingAmount", remainingAmount);
    setIsLoading(false);
    navigate("/expenses");
  };

  const getRemainingAmountClass = () => {
    if (remainingAmount > 0) return "positive";
    if (remainingAmount === 0) return "warning";
    return "negative";
  };

  const getRemainingMessage = () => {
    if (remainingAmount > 0) return `₹${remainingAmount.toLocaleString()} available for expenses`;
    if (remainingAmount === 0) return "No amount left for expenses after savings";
    return `Budget deficit: ₹${Math.abs(remainingAmount).toLocaleString()}`;
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
          background: #f8fafc;
        }

        .budget-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
        }

        .budget-container::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 20px 20px;
          animation: float 20s infinite linear;
        }

        .budget-content {
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
          max-width: 500px;
          animation: slideUp 0.6s ease-out;
        }

        .app-brand {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          gap: 12px;
        }

        .app-icon {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 20px;
        }

        .app-name {
          font-size: 24px;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header {
          margin-bottom: 8px;
        }

        h1 {
          font-size: 32px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .subtitle {
          color: #64748b;
          margin-bottom: 40px;
          font-size: 16px;
          line-height: 1.5;
        }

        .form-group {
          margin-bottom: 24px;
          text-align: left;
        }

        .form-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .currency-icon {
          position: absolute;
          left: 16px;
          color: #667eea;
          font-weight: 600;
          z-index: 2;
        }

        .budget-input {
          width: 100%;
          padding: 16px 16px 16px 40px;
          border-radius: 12px;
          border: 2px solid #e2e8f0;
          font-size: 16px;
          outline: none;
          background: #ffffff;
          color: #1e293b;
          transition: all 0.3s ease;
          font-family: inherit;
          font-weight: 500;
        }

        .budget-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          background: #ffffff;
        }

        .budget-input::placeholder {
          color: #9ca3af;
          font-weight: normal;
        }

        .financial-summary {
          margin: 32px 0;
          animation: fadeIn 0.5s ease-in-out;
        }

        .summary-title {
          font-size: 18px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 16px;
          text-align: center;
        }

        .summary-cards {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
          margin-bottom: 20px;
        }

        .summary-card {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .summary-card.main {
          background: linear-gradient(135deg, #d1fae5, #a7f3d0);
          border: 1px solid #a7f3d0;
        }

        .summary-label {
          font-size: 11px;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }

        .summary-value {
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
        }

        .summary-value.positive {
          color: #10b981;
        }

        .summary-value.warning {
          color: #f59e0b;
        }

        .summary-value.negative {
          color: #ef4444;
        }

        .remaining-amount-display {
          background: ${remainingAmount >= 0 
            ? 'linear-gradient(135deg, #d1fae5, #a7f3d0)' 
            : 'linear-gradient(135deg, #fee2e2, #fecaca)'};
          border: 1px solid ${remainingAmount >= 0 ? '#a7f3d0' : '#fecaca'};
          border-radius: 12px;
          padding: 20px;
          margin: 16px 0;
          text-align: center;
          animation: pulse 2s infinite;
        }

        .remaining-label {
          font-size: 14px;
          color: ${remainingAmount >= 0 ? '#065f46' : '#7f1d1d'};
          font-weight: 600;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .remaining-value {
          font-size: 24px;
          font-weight: 700;
          color: ${remainingAmount >= 0 ? '#065f46' : '#dc2626'};
          margin-bottom: 4px;
        }

        .remaining-message {
          font-size: 14px;
          color: ${remainingAmount >= 0 ? '#047857' : '#b91c1c'};
          font-weight: 500;
        }

        .savings-percentage {
          font-size: 12px;
          color: #667eea;
          font-weight: 600;
          margin-top: 4px;
        }

        .next-button {
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

        .next-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        .next-button:active {
          transform: translateY(0);
        }

        .next-button:disabled {
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

        /* Animations */
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          from {
            transform: translate(0, 0) rotate(0deg);
          }
          to {
            transform: translate(-20px, -20px) rotate(360deg);
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }

        /* Responsive */
        @media (max-width: 480px) {
          .budget-content {
            padding: 32px 24px;
            margin: 20px;
          }

          h1 {
            font-size: 28px;
          }

          .subtitle {
            font-size: 14px;
            margin-bottom: 32px;
          }

          .summary-cards {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .summary-card {
            padding: 14px;
          }

          .summary-value {
            font-size: 16px;
          }

          .remaining-value {
            font-size: 20px;
          }
        }

        /* Enhanced focus styles for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .budget-container::before,
          .budget-content,
          .budget-input,
          .next-button,
          .financial-summary,
          .remaining-amount-display {
            animation: none;
            transition: none;
          }
        }
      `}</style>

      <div className="budget-container">
        <div className="budget-content">
          <div className="app-brand">
            <div className="app-icon">$</div>
            <div className="app-name">SmartExpense</div>
          </div>
          
          <div className="header">
            <h1>Set Your Budget</h1>
            <p className="subtitle">Plan your finances by setting your total budget and savings goals</p>
          </div>
          
          <div className="form-group">
            <label className="form-label">Total Monthly Budget</label>
            <div className="input-with-icon">
              <span className="currency-icon">₹</span>
              <input
                type="number"
                className="budget-input"
                placeholder="Enter your total budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Desired Monthly Savings</label>
            <div className="input-with-icon">
              <span className="currency-icon">₹</span>
              <input
                type="number"
                className="budget-input"
                placeholder="Enter desired savings"
                value={desiredSavings}
                onChange={(e) => setDesiredSavings(e.target.value)}
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Financial Summary - Shows when both fields have values */}
          {(budget && desiredSavings) && (
            <div className="financial-summary">
              <div className="summary-title">Financial Summary</div>
              
              <div className="summary-cards">
                <div className="summary-card">
                  <div className="summary-label">Total Budget</div>
                  <div className="summary-value">₹{parseFloat(budget).toLocaleString()}</div>
                </div>
                
                <div className="summary-card">
                  <div className="summary-label">Desired Savings</div>
                  <div className="summary-value positive">₹{parseFloat(desiredSavings).toLocaleString()}</div>
                  {parseFloat(budget) > 0 && (
                    <div className="savings-percentage">
                      ({(parseFloat(desiredSavings) / parseFloat(budget) * 100).toFixed(1)}%)
                    </div>
                  )}
                </div>
                
                <div className="summary-card main">
                  <div className="summary-label">Remaining</div>
                  <div className={`summary-value ${getRemainingAmountClass()}`}>
                    ₹{remainingAmount.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Main Remaining Amount Display */}
              <div className="remaining-amount-display">
                <div className="remaining-label">Amount Available for Expenses</div>
                <div className="remaining-value">₹{remainingAmount.toLocaleString()}</div>
                <div className="remaining-message">
                  {getRemainingMessage()}
                </div>
              </div>
            </div>
          )}
          
          <button 
            onClick={handleNext}
            className="next-button"
            disabled={isLoading || !budget || !desiredSavings || remainingAmount < 0}
          >
            {isLoading ? (
              <span className="button-loading">
                <div className="spinner"></div>
                Setting Budget...
              </span>
            ) : (
              "Continue to Expenses ➡️"
            )}
          </button>
        </div>
      </div>
    </>
  );
}