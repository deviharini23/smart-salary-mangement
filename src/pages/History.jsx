import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("overview"); // "overview" or "detailed" or "comparison"

  // Load data from localStorage and set up auto-refresh
  useEffect(() => {
    const loadHistory = () => {
      const savedHistory = JSON.parse(localStorage.getItem("history") || "[]");
      setHistory(savedHistory);
    };

    // Load initially
    loadHistory();

    // Set up storage event listener for cross-tab updates
    const handleStorageChange = (e) => {
      if (e.key === "history") {
        loadHistory();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check for changes every second (fallback)
    const interval = setInterval(loadHistory, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Prepare monthly data for charts
  const chartData = history.map((item, index) => ({
    name: `Month ${index + 1}`,
    month: `Month ${index + 1}`,
    budget: item.budget,
    savings: item.actualSavings,
    expenses: item.totalExpenses,
    desiredSavings: item.desiredSavings,
    date: item.date,
    savingsRate: item.budget > 0 ? ((item.actualSavings / item.budget) * 100) : 0,
  }));

  // Comparison data for last 2 months
  const lastTwoMonths = history.slice(-2);
  const comparisonData = lastTwoMonths.map((month, index) => ({
    name: `Month ${history.length - lastTwoMonths.length + index + 1}`,
    savings: month.actualSavings,
    expenses: month.totalExpenses,
    budget: month.budget,
  }));

  // Progress data (month-over-month changes)
  const progressData = history.map((month, index) => {
    const prevMonth = history[index - 1];
    const savingsChange = prevMonth ? month.actualSavings - prevMonth.actualSavings : 0;
    const expensesChange = prevMonth ? month.totalExpenses - prevMonth.totalExpenses : 0;
    
    return {
      name: `Month ${index + 1}`,
      savings: month.actualSavings,
      expenses: month.totalExpenses,
      savingsChange,
      expensesChange,
      improvement: savingsChange > 0 ? "Better" : savingsChange < 0 ? "Worse" : "Same",
    };
  });

  // Pie chart for last month
  const lastMonth = history[history.length - 1] || {
    totalExpenses: 0,
    actualSavings: 0,
    budget: 0,
  };
  const pieData = [
    { name: "Money Spent", value: lastMonth.totalExpenses },
    { name: "Money Saved", value: lastMonth.actualSavings },
  ];
  const COLORS = ["#FF7043", "#4CAF50"];

  const getSavingsPercentage = (month) => {
    return month.budget > 0 ? ((month.actualSavings / month.budget) * 100).toFixed(1) : 0;
  };

  const getTotalStats = () => {
    const totalBudget = history.reduce((sum, month) => sum + month.budget, 0);
    const totalExpenses = history.reduce((sum, month) => sum + month.totalExpenses, 0);
    const totalSavings = history.reduce((sum, month) => sum + month.actualSavings, 0);
    const avgSavingsRate = totalBudget > 0 ? ((totalSavings / totalBudget) * 100).toFixed(1) : 0;

    // Calculate month-over-month improvements
    const improvements = history.reduce((count, month, index) => {
      if (index === 0) return count;
      const prevMonth = history[index - 1];
      return month.actualSavings > prevMonth.actualSavings ? count + 1 : count;
    }, 0);

    const improvementRate = history.length > 1 ? ((improvements / (history.length - 1)) * 100).toFixed(1) : 0;

    return { totalBudget, totalExpenses, totalSavings, avgSavingsRate, improvements, improvementRate };
  };

  const totalStats = getTotalStats();

  // Get comparison insights
  const getComparisonInsights = () => {
    if (history.length < 2) return "Add more months to see comparisons!";

    const current = history[history.length - 1];
    const previous = history[history.length - 2];

    const savingsDiff = current.actualSavings - previous.actualSavings;
    const expensesDiff = current.totalExpenses - previous.totalExpenses;

    if (savingsDiff > 0 && expensesDiff < 0) {
      return "🎉 Excellent! You saved more AND spent less this month!";
    } else if (savingsDiff > 0) {
      return "👍 Great job! You saved more this month!";
    } else if (expensesDiff < 0) {
      return "💪 Good work! You spent less this month!";
    } else if (savingsDiff < 0 && expensesDiff > 0) {
      return "⚠️ You saved less and spent more. Review your expenses.";
    } else {
      return "📊 Similar performance to last month. Keep consistent!";
    }
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear all history? This action cannot be undone.")) {
      localStorage.removeItem("history");
      setHistory([]);
    }
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

        .history-container {
          min-height: 100vh;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
        }

        .history-container::before {
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

        .history-content {
          position: relative;
          z-index: 1;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 48px 40px;
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 1200px;
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

        .navigation-buttons {
          display: flex;
          gap: 12px;
          margin-bottom: 32px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .nav-button {
          padding: 12px 24px;
          border: 2px solid #667eea;
          border-radius: 10px;
          background: transparent;
          color: #667eea;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .nav-button:hover {
          background: #667eea;
          color: white;
          transform: translateY(-1px);
        }

        .nav-button.primary {
          background: #667eea;
          color: white;
        }

        .nav-button.danger {
          border-color: #ef4444;
          color: #ef4444;
        }

        .nav-button.danger:hover {
          background: #ef4444;
          color: white;
        }

        .stats-overview {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        .stat-card.highlight {
          background: linear-gradient(135deg, #d1fae5, #a7f3d0);
          border: 1px solid #10b981;
        }

        .stat-card.warning {
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          border: 1px solid #f59e0b;
        }

        .stat-label {
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .stat-value.positive {
          color: #10b981;
        }

        .stat-value.negative {
          color: #ef4444;
        }

        .stat-subtext {
          font-size: 12px;
          color: #64748b;
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

        .insight-card {
          background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
          border: 1px solid #c7d2fe;
          border-radius: 12px;
          padding: 20px;
          margin: 20px 0;
          text-align: center;
        }

        .insight-text {
          font-size: 16px;
          font-weight: 600;
          color: #3730a3;
          margin: 0;
        }

        .monthly-details {
          display: grid;
          gap: 16px;
        }

        .month-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          transition: all 0.3s ease;
        }

        .month-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-1px);
        }

        .month-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .month-name {
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
        }

        .month-date {
          font-size: 12px;
          color: #64748b;
        }

        .month-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .month-stat {
          text-align: center;
        }

        .month-stat-label {
          font-size: 11px;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .month-stat-value {
          font-size: 16px;
          font-weight: 700;
          color: #1e293b;
        }

        .month-stat-value.positive {
          color: #10b981;
        }

        .month-stat-value.negative {
          color: #ef4444;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #64748b;
        }

        .empty-state-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }

        .empty-state-text {
          font-size: 18px;
          margin-bottom: 8px;
        }

        .empty-state-subtext {
          font-size: 14px;
          opacity: 0.8;
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
        @media (max-width: 1024px) {
          .stats-overview {
            grid-template-columns: repeat(2, 1fr);
          }

          .month-stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .history-content {
            padding: 32px 24px;
            margin: 20px;
          }

          .stats-overview {
            grid-template-columns: 1fr;
          }

          .month-stats {
            grid-template-columns: 1fr;
          }

          .navigation-buttons {
            flex-direction: column;
          }

          h1 {
            font-size: 28px;
          }

          .chart-container {
            padding: 16px;
          }

          .tabs {
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          .month-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }
      `}</style>

      <div className="history-container">
        <div className="history-content">
          <div className="app-brand">
            <div className="app-icon">$</div>
            <div className="app-name">SmartExpense</div>
          </div>
          
          <div className="header">
            <h1>Financial History</h1>
            <p className="subtitle">Track and compare your financial progress across months</p>
          </div>

          {/* Navigation Buttons */}
          <div className="navigation-buttons">
            <button className="nav-button" onClick={() => navigate("/reports")}>
              📊 Back to Reports
            </button>
            <button className="nav-button primary" onClick={() => navigate("/SetBudget")}>
              💰 Set New Budget
            </button>
            {history.length > 0 && (
              <button className="nav-button danger" onClick={clearHistory}>
                🗑️ Clear History
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📈</div>
              <div className="empty-state-text">No History Available</div>
              <div className="empty-state-subtext">
                Complete months in the Reports section to see your financial history here
              </div>
            </div>
          ) : (
            <>
              {/* Total Statistics */}
              <div className="stats-overview">
                <div className="stat-card">
                  <div className="stat-label">Total Months</div>
                  <div className="stat-value">{history.length}</div>
                  <div className="stat-subtext">Tracked</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Budget</div>
                  <div className="stat-value">₹{totalStats.totalBudget.toLocaleString()}</div>
                  <div className="stat-subtext">Across all months</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Saved</div>
                  <div className="stat-value positive">₹{totalStats.totalSavings.toLocaleString()}</div>
                  <div className="stat-subtext">Cumulative savings</div>
                </div>
                <div className="stat-card highlight">
                  <div className="stat-label">Improvement Rate</div>
                  <div className="stat-value positive">{totalStats.improvementRate}%</div>
                  <div className="stat-subtext">Months with better savings</div>
                </div>
              </div>

              {/* Monthly Comparison Insights */}
              {history.length >= 2 && (
                <div className="insight-card">
                  <div className="insight-text">{getComparisonInsights()}</div>
                </div>
              )}

              {/* Tabs */}
              <div className="tabs">
                <button 
                  className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  📈 Overview
                </button>
                <button 
                  className={`tab ${activeTab === 'comparison' ? 'active' : ''}`}
                  onClick={() => setActiveTab('comparison')}
                >
                  🔄 Comparison
                </button>
                <button 
                  className={`tab ${activeTab === 'detailed' ? 'active' : ''}`}
                  onClick={() => setActiveTab('detailed')}
                >
                  📋 Detailed View
                </button>
              </div>

              {activeTab === 'overview' ? (
                <>
                  {/* Last Month Pie Chart */}
                  <div className="chart-container">
                    <div className="chart-title">Last Month Distribution (Month {history.length})</div>
                    <div style={{ width: "100%", height: 400 }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ₹${value.toLocaleString()}`}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Bar Chart for all months */}
                  <div className="chart-container">
                    <div className="chart-title">Monthly Trends Comparison</div>
                    <div style={{ width: "100%", height: 400 }}>
                      <ResponsiveContainer>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="name" stroke="#64748b" />
                          <YAxis stroke="#64748b" />
                          <Tooltip 
                            formatter={(value) => [`₹${value.toLocaleString()}`, '']}
                            labelStyle={{ color: '#1e293b', fontWeight: '600' }}
                          />
                          <Legend />
                          <Bar dataKey="expenses" name="Money Spent" fill="#FF7043" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="savings" name="Money Saved" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="budget" name="Total Budget" fill="#667eea" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </>
              ) : activeTab === 'comparison' ? (
                <>
                  {/* Last 2 Months Comparison */}
                  {history.length >= 2 && (
                    <div className="chart-container">
                      <div className="chart-title">Last 2 Months Comparison</div>
                      <div style={{ width: "100%", height: 400 }}>
                        <ResponsiveContainer>
                          <BarChart data={comparisonData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="name" stroke="#64748b" />
                            <YAxis stroke="#64748b" />
                            <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
                            <Legend />
                            <Bar dataKey="savings" name="Money Saved" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="expenses" name="Money Spent" fill="#FF7043" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* Progress Over Time */}
                  {history.length > 1 && (
                    <div className="chart-container">
                      <div className="chart-title">Savings Progress Over Time</div>
                      <div style={{ width: "100%", height: 400 }}>
                        <ResponsiveContainer>
                          <LineChart data={progressData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="name" stroke="#64748b" />
                            <YAxis stroke="#64748b" />
                            <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="savings" 
                              name="Total Savings" 
                              stroke="#4CAF50" 
                              strokeWidth={3}
                              dot={{ fill: '#4CAF50', strokeWidth: 2, r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Detailed Monthly View */
                <div className="monthly-details">
                  {history.map((month, index) => (
                    <div key={index} className="month-card">
                      <div className="month-header">
                        <div className="month-name">Month {index + 1}</div>
                        <div className="month-date">
                          {month.date ? new Date(month.date).toLocaleDateString() : 'No date'}
                        </div>
                      </div>
                      <div className="month-stats">
                        <div className="month-stat">
                          <div className="month-stat-label">Budget</div>
                          <div className="month-stat-value">₹{month.budget.toLocaleString()}</div>
                        </div>
                        <div className="month-stat">
                          <div className="month-stat-label">Spent</div>
                          <div className="month-stat-value">₹{month.totalExpenses.toLocaleString()}</div>
                        </div>
                        <div className="month-stat">
                          <div className="month-stat-label">Saved</div>
                          <div className={`month-stat-value ${
                            month.actualSavings >= month.desiredSavings ? 'positive' : 'negative'
                          }`}>
                            ₹{month.actualSavings.toLocaleString()}
                          </div>
                        </div>
                        <div className="month-stat">
                          <div className="month-stat-label">Savings Rate</div>
                          <div className="month-stat-value positive">
                            {getSavingsPercentage(month)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}