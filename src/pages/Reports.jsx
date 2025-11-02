import React, { useState, useEffect } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function Reports() {
  const navigate = useNavigate();
  const budget = parseFloat(localStorage.getItem("budget") || 0);
  const desiredSavings = parseFloat(localStorage.getItem("desiredSavings") || 0);
  const [expenses, setExpenses] = useState(
    JSON.parse(localStorage.getItem("expenses") || "[]")
  );
  const [months, setMonths] = useState([]);
  const [monthData, setMonthData] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(1);
  const [motivation, setMotivation] = useState("");
  const [showCharts, setShowCharts] = useState(false);
  const [activeTab, setActiveTab] = useState("current"); // "current" or "history"

  const totalExpenses = expenses.reduce((a, b) => a + b.amount, 0);
  const actualSavings = budget - totalExpenses;
  const savingsDifference = actualSavings - desiredSavings;

  useEffect(() => {
    // Load history on component mount
    const savedHistory = JSON.parse(localStorage.getItem("history") || "[]");
    if (savedHistory.length > 0) {
      setMonths(savedHistory.map(item => item.month));
      setMonthData(savedHistory.map(item => ({
        used: item.totalExpenses,
        saved: item.actualSavings
      })));
      setCurrentMonth(savedHistory.length + 1);
      setShowCharts(true);
    }
  }, []);

  const completeCurrentMonth = () => {
    if (expenses.length === 0) {
      alert("Please add some expenses before completing this month!");
      return;
    }

    // Prepare this month's entry
    const newEntry = {
      month: `Month ${currentMonth}`,
      budget,
      desiredSavings,
      totalExpenses,
      actualSavings,
      expenses: [...expenses],
      date: new Date().toISOString()
    };

    // Save to history in localStorage
    const savedHistory = JSON.parse(localStorage.getItem("history") || "[]");
    const updatedHistory = [...savedHistory, newEntry];
    localStorage.setItem("history", JSON.stringify(updatedHistory));

    // Update local state
    setMonths([...months, `Month ${currentMonth}`]);
    setMonthData([...monthData, { used: totalExpenses, saved: actualSavings }]);

    // Motivation message
    if (actualSavings >= desiredSavings) {
      setMotivation("🎉 Excellent! You met or exceeded your savings goal!");
    } else if (actualSavings > 0) {
      setMotivation("💪 Good effort! You saved some money, try to reach your goal next month!");
    } else {
      setMotivation("⚠️ You overspent this month. Review your expenses and adjust your budget.");
    }

    setShowCharts(true);
    setActiveTab("history");
    
    // Show success message
    alert(`Month ${currentMonth} completed successfully! Ready to set up next month's budget.`);
    
    // Navigate to SetBudget page for new month
    navigate("/SetBudget");
  };

  const resetToBudget = () => {
    if (window.confirm("Are you sure you want to start a completely new budget? This will clear all current data including history.")) {
      localStorage.removeItem("budget");
      localStorage.removeItem("desiredSavings");
      localStorage.removeItem("expenses");
      localStorage.removeItem("history");
      navigate("/SetBudget");
    }
  };

  const viewHistory = () => {
    setActiveTab("history");
  };

  const viewCurrent = () => {
    setActiveTab("current");
  };

  // Current Month Pie Chart Data
  const pieData = {
    labels: ["Money Spent", "Money Saved"],
    datasets: [
      {
        data: [totalExpenses, actualSavings],
        backgroundColor: ["#FF7043", "#4CAF50"],
        hoverBackgroundColor: ["#FF5722", "#388E3C"],
        borderWidth: 2,
        borderColor: "#fff"
      },
    ],
  };

  // History Bar Chart Data
  const barData = {
    labels: months,
    datasets: [
      {
        label: 'Money Spent',
        data: monthData.map(data => data.used),
        backgroundColor: 'rgba(255, 112, 67, 0.8)',
        borderColor: 'rgba(255, 87, 34, 1)',
        borderWidth: 2,
      },
      {
        label: 'Money Saved',
        data: monthData.map(data => data.saved),
        backgroundColor: 'rgba(76, 175, 80, 0.8)',
        borderColor: 'rgba(56, 142, 60, 1)',
        borderWidth: 2,
      }
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Spending vs Savings Trend'
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount (₹)'
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ₹${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    }
  };

  const savedHistory = JSON.parse(localStorage.getItem("history") || "[]");

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

        .reports-container {
          min-height: 100vh;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
        }

        .reports-container::before {
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

        .reports-content {
          position: relative;
          z-index: 1;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 48px 40px;
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
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
          text-align: center;
          margin-bottom: 32px;
        }

        h1 {
          font-size: 32px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .subtitle {
          color: #64748b;
          font-size: 16px;
          line-height: 1.5;
        }

        .month-indicator {
          background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
          border-radius: 12px;
          padding: 16px;
          text-align: center;
          margin-bottom: 24px;
        }

        .month-text {
          font-size: 18px;
          font-weight: 600;
          color: #3730a3;
          margin: 0;
        }

        .financial-summary {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }

        .summary-card {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }

        .summary-card.highlight {
          background: linear-gradient(135deg, #d1fae5, #a7f3d0);
          border: 1px solid #10b981;
        }

        .summary-card.warning {
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          border: 1px solid #f59e0b;
        }

        .summary-card.danger {
          background: linear-gradient(135deg, #fee2e2, #fecaca);
          border: 1px solid #ef4444;
        }

        .summary-label {
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .summary-value {
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
        }

        .summary-value.positive {
          color: #10b981;
        }

        .summary-value.negative {
          color: #ef4444;
        }

        .summary-value.neutral {
          color: #667eea;
        }

        .tabs {
          display: flex;
          margin-bottom: 24px;
          background: #f1f5f9;
          border-radius: 12px;
          padding: 4px;
        }

        .tab {
          flex: 1;
          padding: 12px 16px;
          border: none;
          background: transparent;
          color: #64748b;
          font-weight: 600;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .tab.active {
          background: white;
          color: #667eea;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .tab:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .chart-container {
          background: white;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .chart-title {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 16px;
          text-align: center;
        }

        .motivation-card {
          background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
          border: 1px solid #c7d2fe;
          border-radius: 12px;
          padding: 20px;
          margin: 24px 0;
          text-align: center;
        }

        .motivation-text {
          font-size: 16px;
          font-weight: 600;
          color: #3730a3;
          margin: 0;
        }

        .action-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 32px;
        }

        .next-month-button {
          padding: 16px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #10b981, #34d399);
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .next-month-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
        }

        .next-month-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .reset-button {
          padding: 16px;
          border: 2px solid #667eea;
          border-radius: 12px;
          background: transparent;
          color: #667eea;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .reset-button:hover {
          background: #667eea;
          color: white;
          transform: translateY(-2px);
        }

        .history-button {
          padding: 16px;
          border: 2px solid #8b5cf6;
          border-radius: 12px;
          background: transparent;
          color: #8b5cf6;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .history-button:hover {
          background: #8b5cf6;
          color: white;
          transform: translateY(-2px);
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
          .reports-content {
            padding: 32px 24px;
            margin: 20px;
          }

          .financial-summary {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .action-buttons {
            grid-template-columns: 1fr;
          }

          h1 {
            font-size: 28px;
          }
        }

        @media (max-width: 480px) {
          .financial-summary {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="reports-container">
        <div className="reports-content">
          <div className="app-brand">
            <div className="app-icon">$</div>
            <div className="app-name">SmartExpense</div>
          </div>
          
          <div className="header">
            <h1>Financial Reports</h1>
            <p className="subtitle">Track your spending and savings progress</p>
          </div>

          {/* Current Month Indicator */}
          <div className="month-indicator">
            <p className="month-text">📅 Current: Month {currentMonth}</p>
            {savedHistory.length > 0 && (
              <p style={{ fontSize: '14px', color: '#6366f1', marginTop: '8px', marginBottom: '0' }}>
                {savedHistory.length} previous month{savedHistory.length !== 1 ? 's' : ''} completed
              </p>
            )}
          </div>

          {/* Financial Summary */}
          <div className="financial-summary">
            <div className="summary-card">
              <div className="summary-label">Total Budget</div>
              <div className="summary-value neutral">₹{budget.toLocaleString()}</div>
            </div>
            <div className="summary-card">
              <div className="summary-label">Money Spent</div>
              <div className="summary-value">₹{totalExpenses.toLocaleString()}</div>
            </div>
            <div className={`summary-card ${
              actualSavings >= desiredSavings ? 'highlight' : 
              actualSavings > 0 ? 'warning' : 'danger'
            }`}>
              <div className="summary-label">Money Saved</div>
              <div className={`summary-value ${
                actualSavings >= desiredSavings ? 'positive' : 
                actualSavings > 0 ? 'neutral' : 'negative'
              }`}>
                ₹{actualSavings.toLocaleString()}
              </div>
            </div>
            <div className={`summary-card ${savingsDifference >= 0 ? 'highlight' : 'warning'}`}>
              <div className="summary-label">Vs Target</div>
              <div className={`summary-value ${savingsDifference >= 0 ? 'positive' : 'negative'}`}>
                {savingsDifference >= 0 ? '+' : ''}₹{Math.abs(savingsDifference).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Tabs for Current vs History */}
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'current' ? 'active' : ''}`}
              onClick={viewCurrent}
            >
              Current Month
            </button>
            <button 
              className={`tab ${activeTab === 'history' ? 'active' : ''}`}
              onClick={viewHistory}
              disabled={savedHistory.length === 0}
            >
              History ({savedHistory.length})
            </button>
          </div>

          {/* Charts Section */}
          {activeTab === 'current' ? (
            <div className="chart-container">
              <div className="chart-title">Current Month Distribution</div>
              {totalExpenses > 0 || actualSavings > 0 ? (
                <Pie data={pieData} options={pieOptions} />
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">📊</div>
                  <p>No expenses added yet</p>
                  <p style={{ fontSize: '14px', marginTop: '8px' }}>
                    Add expenses to see your financial distribution
                  </p>
                </div>
              )}
            </div>
          ) : (
            savedHistory.length > 0 ? (
              <div className="chart-container">
                <div className="chart-title">Monthly Trends</div>
                <Bar data={barData} options={barOptions} />
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">📊</div>
                <p>No historical data available</p>
                <p style={{ fontSize: '14px', marginTop: '8px' }}>
                  Complete months to see your spending trends here
                </p>
              </div>
            )
          )}

          {/* Motivation Message */}
          {motivation && (
            <div className="motivation-card">
              <p className="motivation-text">{motivation}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="reset-button" onClick={resetToBudget}>
              🔄 Start Fresh
            </button>
            <button 
              className="next-month-button" 
              onClick={completeCurrentMonth}
              disabled={expenses.length === 0}
            >
              ✅ Complete Month & Set New Budget
            </button>
          </div>

          {/* Additional History Button if there's history */}
          {savedHistory.length > 0 && activeTab === 'current' && (
            <button className="history-button" onClick={viewHistory} style={{ width: '100%', marginTop: '16px' }}>
              📈 View History
            </button>
          )}
        </div>
      </div>
    </>
  );
}