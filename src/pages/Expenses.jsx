import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Expenses() {
  const navigate = useNavigate();
  const budget = parseFloat(localStorage.getItem("budget") || 0);
  const desiredSavings = parseFloat(localStorage.getItem("desiredSavings") || 0);
  const [expenses, setExpenses] = useState([]);
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(budget - desiredSavings);

  // Calculate totals whenever expenses change
  useEffect(() => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    setTotalExpenses(total);
    setRemainingAmount(budget - desiredSavings - total);
  }, [expenses, budget, desiredSavings]);

  const addExpense = () => {
    if (!expenseName || !expenseAmount) {
      alert("Please enter expense details!");
      return;
    }

    const amount = parseFloat(expenseAmount);
    if (amount <= 0) {
      alert("Please enter a valid amount!");
      return;
    }

    const newTotal = totalExpenses + amount;

    if (newTotal > budget - desiredSavings) {
      alert("⚠️ This expense exceeds your available budget!");
      return;
    }

    setExpenses([...expenses, { name: expenseName, amount: amount }]);
    setExpenseName("");
    setExpenseAmount("");
  };

  const addDefaultExpenses = () => {
    const defaults = [
      { name: "🏠 Rent", amount: Math.min(budget * 0.3, remainingAmount * 0.4) },
      { name: "🍔 Food", amount: Math.min(budget * 0.2, remainingAmount * 0.3) },
      { name: "🚗 Travel", amount: Math.min(budget * 0.1, remainingAmount * 0.2) },
      { name: "💡 Utilities", amount: Math.min(budget * 0.15, remainingAmount * 0.25) },
      { name: "🎬 Entertainment", amount: Math.min(budget * 0.1, remainingAmount * 0.15) },
    ].filter(expense => expense.amount > 0);

    const newExpenses = [...expenses, ...defaults];
    const newTotal = newExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    if (newTotal > budget - desiredSavings) {
      alert("Default expenses would exceed your budget! Adding what fits...");
      // Add only what fits
      let accumulated = totalExpenses;
      const filteredDefaults = defaults.filter(expense => {
        if (accumulated + expense.amount <= budget - desiredSavings) {
          accumulated += expense.amount;
          return true;
        }
        return false;
      });
      setExpenses([...expenses, ...filteredDefaults]);
    } else {
      setExpenses(newExpenses);
    }
  };

  const removeExpense = (index) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (expenses.length === 0) {
      alert("Please add at least one expense before proceeding!");
      return;
    }
    localStorage.setItem("expenses", JSON.stringify(expenses));
    navigate("/reports");
  };

  const getRemainingPercentage = () => {
    return ((remainingAmount / (budget - desiredSavings)) * 100).toFixed(1);
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

        .expenses-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
        }

        .expenses-container::before {
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

        .expenses-content {
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
          width: 100%;
          max-width: 600px;
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
          text-align: center;
        }

        h1 {
          font-size: 32px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .subtitle {
          color: #64748b;
          margin-bottom: 32px;
          font-size: 16px;
          line-height: 1.5;
        }

        .financial-overview {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
          margin-bottom: 32px;
        }

        .overview-card {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }

        .overview-card.remaining {
          background: linear-gradient(135deg, #d1fae5, #a7f3d0);
          border: 1px solid #10b981;
        }

        .overview-label {
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .overview-value {
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
        }

        .overview-value.remaining {
          color: #10b981;
        }

        .overview-value.total {
          color: #667eea;
        }

        .overview-value.spent {
          color: #ef4444;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          margin: 16px 0;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(135deg, #10b981, #34d399);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 12px;
          color: #64748b;
          text-align: center;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .input-row {
          display: grid;
          grid-template-columns: 2fr 1fr auto;
          gap: 12px;
          align-items: end;
        }

        .form-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }

        .expense-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 10px;
          border: 2px solid #e2e8f0;
          font-size: 14px;
          outline: none;
          background: #ffffff;
          color: #1e293b;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .expense-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .expense-input::placeholder {
          color: #9ca3af;
        }

        .add-button {
          padding: 12px 20px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, #10b981, #34d399);
          color: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .add-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .action-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin: 24px 0;
        }

        .suggest-button {
          padding: 12px 16px;
          border: 2px solid #667eea;
          border-radius: 10px;
          background: transparent;
          color: #667eea;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .suggest-button:hover {
          background: #667eea;
          color: white;
          transform: translateY(-1px);
        }

        .expenses-list {
          margin: 24px 0;
          max-height: 300px;
          overflow-y: auto;
        }

        .expense-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          margin-bottom: 8px;
          transition: all 0.3s ease;
        }

        .expense-item:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transform: translateY(-1px);
        }

        .expense-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .expense-name {
          font-weight: 600;
          color: #1e293b;
        }

        .expense-amount {
          font-weight: 700;
          color: #ef4444;
        }

        .delete-button {
          padding: 8px 12px;
          border: none;
          border-radius: 8px;
          background: #fee2e2;
          color: #dc2626;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .delete-button:hover {
          background: #dc2626;
          color: white;
        }

        .next-button {
          width: 100%;
          padding: 16px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: #ffffff;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 16px;
        }

        .next-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        .next-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #64748b;
        }

        .empty-state-icon {
          font-size: 48px;
          margin-bottom: 16px;
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

        /* Responsive */
        @media (max-width: 768px) {
          .expenses-content {
            padding: 32px 24px;
            margin: 20px;
          }

          .financial-overview {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .input-row {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .action-buttons {
            grid-template-columns: 1fr;
          }

          h1 {
            font-size: 28px;
          }
        }
      `}</style>

      <div className="expenses-container">
        <div className="expenses-content">
          <div className="app-brand">
            <div className="app-icon">$</div>
            <div className="app-name">SmartExpense</div>
          </div>
          
          <div className="header">
            <h1>Manage Expenses</h1>
            <p className="subtitle">Add your monthly expenses and track your spending</p>
          </div>

          {/* Financial Overview */}
          <div className="financial-overview">
            <div className="overview-card">
              <div className="overview-label">Total Budget</div>
              <div className="overview-value total">₹{budget.toLocaleString()}</div>
            </div>
            <div className="overview-card">
              <div className="overview-label">Spent</div>
              <div className="overview-value spent">₹{totalExpenses.toLocaleString()}</div>
            </div>
            <div className="overview-card remaining">
              <div className="overview-label">Remaining</div>
              <div className="overview-value remaining">₹{remainingAmount.toLocaleString()}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-section">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${Math.min((totalExpenses / (budget - desiredSavings)) * 100, 100)}%` 
                }}
              ></div>
            </div>
            <div className="progress-text">
              {getRemainingPercentage()}% of your expense budget remaining
            </div>
          </div>

          {/* Add Expense Form */}
          <div className="form-group">
            <label className="form-label">Add New Expense</label>
            <div className="input-row">
              <input
                type="text"
                className="expense-input"
                placeholder="Expense name"
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
              />
              <input
                type="number"
                className="expense-input"
                placeholder="Amount"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                min="0"
                step="0.01"
              />
              <button 
                className="add-button"
                onClick={addExpense}
                disabled={!expenseName || !expenseAmount}
              >
                Add
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className="suggest-button"
              onClick={addDefaultExpenses}
              disabled={remainingAmount <= 0}
            >
              ✨ Suggest Default Expenses
            </button>
          </div>

          {/* Expenses List */}
          <div className="expenses-list">
            {expenses.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📝</div>
                <p>No expenses added yet</p>
                <p style={{ fontSize: '14px', marginTop: '8px' }}>
                  Start by adding your first expense above
                </p>
              </div>
            ) : (
              expenses.map((expense, index) => (
                <div key={index} className="expense-item">
                  <div className="expense-info">
                    <span className="expense-name">{expense.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="expense-amount">₹{expense.amount.toLocaleString()}</span>
                    <button 
                      className="delete-button"
                      onClick={() => removeExpense(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Next Button */}
          <button 
            className="next-button"
            onClick={handleNext}
            disabled={expenses.length === 0}
          >
            {expenses.length === 0 ? 'Add Expenses to Continue' : 'View Reports ➡️'}
          </button>
        </div>
      </div>
    </>
  );
}