import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GoalPage() {
  const navigate = useNavigate();
  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [savedAmount, setSavedAmount] = useState(0);
  const [goals, setGoals] = useState([]);
  const [activeGoal, setActiveGoal] = useState(null);

  // Load goals from localStorage on component mount
  useEffect(() => {
    const savedGoals = JSON.parse(localStorage.getItem("savingsGoals") || "[]");
    setGoals(savedGoals);
    
    // Set active goal if exists
    const active = savedGoals.find(goal => goal.isActive);
    setActiveGoal(active || null);
    
    if (active) {
      setSavedAmount(active.savedAmount || 0);
    }
  }, []);

  // Calculate progress percentage
  const progress = activeGoal ? Math.min((savedAmount / activeGoal.goalAmount) * 100, 100) : 0;
  const monthsRemaining = activeGoal && monthlyContribution > 0 
    ? Math.ceil((activeGoal.goalAmount - savedAmount) / monthlyContribution)
    : 0;

  const createNewGoal = () => {
    if (!goalName || !goalAmount) {
      alert("Please enter goal name and amount!");
      return;
    }

    const budget = parseFloat(localStorage.getItem("budget") || 0);
    const desiredSavings = parseFloat(localStorage.getItem("desiredSavings") || 0);
    
    if (!budget || !desiredSavings) {
      alert("Please set your budget and savings first!");
      navigate("/SetBudget");
      return;
    }

    const newGoal = {
      id: Date.now(),
      name: goalName,
      goalAmount: parseFloat(goalAmount),
      monthlyContribution: monthlyContribution ? parseFloat(monthlyContribution) : 0,
      savedAmount: 0,
      createdAt: new Date().toISOString(),
      isActive: true
    };

    // Deactivate any existing active goal
    const updatedGoals = goals.map(goal => ({ ...goal, isActive: false }));
    updatedGoals.push(newGoal);
    
    setGoals(updatedGoals);
    setActiveGoal(newGoal);
    setSavedAmount(0);
    localStorage.setItem("savingsGoals", JSON.stringify(updatedGoals));

    // Clear form
    setGoalName("");
    setGoalAmount("");
    setMonthlyContribution("");
    
    alert(`🎯 Goal "${goalName}" created successfully!`);
  };

  const handleMonthlyContribution = () => {
    if (!activeGoal) {
      alert("Please create a goal first!");
      return;
    }

    const budget = parseFloat(localStorage.getItem("budget") || 0);
    const desiredSavings = parseFloat(localStorage.getItem("desiredSavings") || 0);
    const currentSavings = budget - desiredSavings;

    if (monthlyContribution > currentSavings) {
      alert(`⚠️ Monthly contribution (₹${monthlyContribution}) exceeds your available savings (₹${currentSavings})!`);
      return;
    }

    const contribution = parseFloat(monthlyContribution);
    const newSavedAmount = savedAmount + contribution;
    
    // Update goal progress
    const updatedGoals = goals.map(goal => 
      goal.id === activeGoal.id 
        ? { ...goal, savedAmount: newSavedAmount, monthlyContribution: contribution }
        : goal
    );
    
    setGoals(updatedGoals);
    setActiveGoal({ ...activeGoal, savedAmount: newSavedAmount, monthlyContribution: contribution });
    setSavedAmount(newSavedAmount);
    localStorage.setItem("savingsGoals", JSON.stringify(updatedGoals));

    // Deduct from monthly savings (simulate automatic deduction)
    const newDesiredSavings = desiredSavings - contribution;
    localStorage.setItem("desiredSavings", newDesiredSavings.toString());
    
    alert(`✅ ₹${contribution.toLocaleString()} added to your goal! Remaining savings: ₹${newDesiredSavings.toLocaleString()}`);
    setMonthlyContribution("");
  };

  const autoDeductFromSavings = () => {
    if (!activeGoal) {
      alert("Please create a goal first!");
      return;
    }

    const budget = parseFloat(localStorage.getItem("budget") || 0);
    const desiredSavings = parseFloat(localStorage.getItem("desiredSavings") || 0);
    const monthlyContribution = activeGoal.monthlyContribution || 0;

    if (monthlyContribution === 0) {
      alert("Please set a monthly contribution amount first!");
      return;
    }

    if (monthlyContribution > desiredSavings) {
      alert(`⚠️ Auto-deduction failed! Monthly contribution (₹${monthlyContribution}) exceeds available savings (₹${desiredSavings})`);
      return;
    }

    const newSavedAmount = savedAmount + monthlyContribution;
    const newDesiredSavings = desiredSavings - monthlyContribution;
    
    // Update goal progress
    const updatedGoals = goals.map(goal => 
      goal.id === activeGoal.id 
        ? { ...goal, savedAmount: newSavedAmount }
        : goal
    );
    
    setGoals(updatedGoals);
    setActiveGoal({ ...activeGoal, savedAmount: newSavedAmount });
    setSavedAmount(newSavedAmount);
    localStorage.setItem("savingsGoals", JSON.stringify(updatedGoals));
    localStorage.setItem("desiredSavings", newDesiredSavings.toString());
    
    alert(`✅ Auto-deducted ₹${monthlyContribution.toLocaleString()} from savings! Goal progress updated.`);
  };

  const completeGoal = () => {
    if (!activeGoal) return;
    
    if (window.confirm(`Mark "${activeGoal.name}" as completed?`)) {
      const updatedGoals = goals.map(goal => 
        goal.id === activeGoal.id 
          ? { ...goal, isActive: false, completedAt: new Date().toISOString() }
          : goal
      );
      
      setGoals(updatedGoals);
      setActiveGoal(null);
      setSavedAmount(0);
      localStorage.setItem("savingsGoals", JSON.stringify(updatedGoals));
      alert(`🎉 Congratulations! You've completed your goal: ${activeGoal.name}`);
    }
  };

  const getMotivation = () => {
    if (!activeGoal) return "Set a financial goal to start your savings journey! 💫";
    if (progress === 0) return "Start today, even small steps matter! 🌱";
    if (progress < 30) return "Great start! Consistency is key to reaching your goal. 💪";
    if (progress < 70) return "You're making excellent progress! Keep going! 🚀";
    if (progress < 100) return "Almost there! Stay focused, success is near! 🔥";
    return "Congratulations 🎉 You achieved your goal! Time to set a new one!";
  };

  // CSS Styles
  const styles = {
    // Layout and Base Styles
    container: {
      minHeight: "100vh",
      padding: "20px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    },

    backgroundPattern: {
      position: "absolute",
      top: "-50%",
      left: "-50%",
      width: "200%",
      height: "200%",
      background: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
      backgroundSize: "20px 20px",
      animation: "float 20s infinite linear"
    },

    content: {
      position: "relative",
      zIndex: 1,
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      padding: "48px 40px",
      borderRadius: "24px",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
      width: "100%",
      maxWidth: "600px",
      animation: "slideUp 0.6s ease-out"
    },

    // Brand Styles
    brand: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "24px",
      gap: "12px"
    },

    brandIcon: {
      width: "44px",
      height: "44px",
      background: "linear-gradient(135deg, #667eea, #764ba2)",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontWeight: "bold",
      fontSize: "20px"
    },

    brandName: {
      fontSize: "24px",
      fontWeight: 700,
      background: "linear-gradient(135deg, #667eea, #764ba2)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text"
    },

    // Header Styles
    header: {
      textAlign: "center",
      marginBottom: "32px"
    },

    title: {
      fontSize: "32px",
      fontWeight: 700,
      color: "#1e293b",
      marginBottom: "8px"
    },

    subtitle: {
      color: "#64748b",
      fontSize: "16px",
      lineHeight: 1.5
    },

    // Form Styles
    formGroup: {
      marginBottom: "24px"
    },

    label: {
      display: "block",
      marginBottom: "8px",
      fontWeight: 600,
      color: "#374151",
      fontSize: "14px"
    },

    input: {
      width: "100%",
      padding: "16px",
      borderRadius: "12px",
      border: "2px solid #e2e8f0",
      fontSize: "16px",
      outline: "none",
      background: "#ffffff",
      color: "#1e293b",
      transition: "all 0.3s ease",
      fontFamily: "inherit"
    },

    inputFocus: {
      borderColor: "#667eea",
      boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)"
    },

    inputRow: {
      display: "grid",
      gridTemplateColumns: "1fr auto",
      gap: "12px",
      alignItems: "end"
    },

    // Button Styles
    primaryButton: {
      padding: "16px 24px",
      border: "none",
      borderRadius: "12px",
      background: "linear-gradient(135deg, #667eea, #764ba2)",
      color: "white",
      fontSize: "16px",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.3s ease",
      whiteSpace: "nowrap"
    },

    primaryButtonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 20px rgba(102, 126, 234, 0.3)"
    },

    secondaryButton: {
      padding: "16px 24px",
      border: "2px solid #10b981",
      borderRadius: "12px",
      background: "transparent",
      color: "#10b981",
      fontSize: "16px",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.3s ease"
    },

    secondaryButtonHover: {
      background: "#10b981",
      color: "white",
      transform: "translateY(-2px)"
    },

    // Progress Section Styles
    progressSection: {
      background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
      borderRadius: "16px",
      padding: "24px",
      margin: "24px 0",
      textAlign: "center"
    },

    progressHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "16px"
    },

    goalName: {
      fontSize: "20px",
      fontWeight: 700,
      color: "#1e293b"
    },

    progressStats: {
      fontSize: "14px",
      color: "#64748b",
      marginBottom: "16px"
    },

    progressBarContainer: {
      width: "100%",
      height: "20px",
      background: "#e2e8f0",
      borderRadius: "10px",
      overflow: "hidden",
      margin: "16px 0"
    },

    progressBar: {
      height: "100%",
      background: "linear-gradient(135deg, #10b981, #34d399)",
      borderRadius: "10px",
      transition: "width 0.5s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: "12px",
      fontWeight: 600
    },

    monthsRemaining: {
      fontSize: "14px",
      color: "#64748b",
      marginTop: "8px"
    },

    // Action Buttons
    actionButtons: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px",
      margin: "24px 0"
    },

    // Motivation Section
    motivation: {
      textAlign: "center",
      fontSize: "16px",
      fontWeight: 600,
      color: "#3730a3",
      margin: "24px 0",
      padding: "16px",
      background: "linear-gradient(135deg, #e0e7ff, #c7d2fe)",
      borderRadius: "12px",
      border: "1px solid #c7d2fe"
    },

    // Navigation
    navigation: {
      display: "flex",
      gap: "12px",
      marginTop: "24px"
    },

    // Responsive
    responsive: {
      mobile: {
        content: {
          padding: "32px 24px",
          margin: "20px"
        },
        inputRow: {
          gridTemplateColumns: "1fr"
        },
        actionButtons: {
          gridTemplateColumns: "1fr"
        },
        title: {
          fontSize: "28px"
        }
      }
    }
  };

  // Inline styles with hover effects
  const getInputStyle = (isFocused = false) => ({
    ...styles.input,
    ...(isFocused && styles.inputFocus)
  });

  const getButtonStyle = (type = "primary", isHovered = false) => ({
    ...(type === "primary" ? styles.primaryButton : styles.secondaryButton),
    ...(isHovered && (type === "primary" ? styles.primaryButtonHover : styles.secondaryButtonHover))
  });

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

        .goal-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .primary-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        .secondary-button:hover {
          background: #10b981;
          color: white;
          transform: translateY(-2px);
        }

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

        @media (max-width: 768px) {
          .goal-content {
            padding: 32px 24px;
            margin: 20px;
          }

          .input-row {
            grid-template-columns: 1fr;
          }

          .action-buttons {
            grid-template-columns: 1fr;
          }

          h2 {
            font-size: 28px;
          }
        }
      `}</style>

      <div style={styles.container}>
        <div style={styles.backgroundPattern} />
        <div className="goal-content" style={styles.content}>
          {/* Brand */}
          <div style={styles.brand}>
            <div style={styles.brandIcon}>🎯</div>
            <div style={styles.brandName}>SmartExpense</div>
          </div>
          
          {/* Header */}
          <div style={styles.header}>
            <h2 style={styles.title}>Savings Goals</h2>
            <p style={styles.subtitle}>Set financial goals and track your progress automatically</p>
          </div>

          {!activeGoal ? (
            <>
              {/* Create New Goal Form */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Goal Name</label>
                <input
                  type="text"
                  className="goal-input"
                  style={styles.input}
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  placeholder="e.g., New Laptop, Vacation, Emergency Fund"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Target Amount (₹)</label>
                <input
                  type="number"
                  className="goal-input"
                  style={styles.input}
                  value={goalAmount}
                  onChange={(e) => setGoalAmount(e.target.value)}
                  placeholder="e.g., 50000"
                  min="0"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Monthly Contribution (₹)</label>
                <input
                  type="number"
                  className="goal-input"
                  style={styles.input}
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  placeholder="e.g., 5000"
                  min="0"
                />
              </div>

              <button 
                className="primary-button" 
                onClick={createNewGoal} 
                style={{ ...styles.primaryButton, width: '100%' }}
              >
                🎯 Create Savings Goal
              </button>
            </>
          ) : (
            <>
              {/* Active Goal Progress */}
              <div style={styles.progressSection}>
                <div style={styles.progressHeader}>
                  <div style={styles.goalName}>{activeGoal.name}</div>
                  <button 
                    className="secondary-button" 
                    onClick={completeGoal}
                    style={{ ...styles.secondaryButton, padding: '8px 16px', fontSize: '14px' }}
                  >
                    ✅ Complete
                  </button>
                </div>
                
                <div style={styles.progressStats}>
                  Saved: ₹{savedAmount.toLocaleString()} / ₹{activeGoal.goalAmount.toLocaleString()}
                </div>
                
                <div style={styles.progressBarContainer}>
                  <div 
                    className="progress-bar" 
                    style={{ ...styles.progressBar, width: `${progress}%` }}
                  >
                    {progress >= 25 && `${progress.toFixed(1)}%`}
                  </div>
                </div>
                
                {progress < 100 && (
                  <div style={styles.monthsRemaining}>
                    {monthsRemaining > 0 
                      ? `Estimated completion: ${monthsRemaining} month${monthsRemaining !== 1 ? 's' : ''}`
                      : 'Set monthly contribution to see estimated completion time'
                    }
                  </div>
                )}
              </div>

              {/* Monthly Contribution */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Add Monthly Contribution (₹)</label>
                <div className="input-row" style={styles.inputRow}>
                  <input
                    type="number"
                    className="goal-input"
                    style={styles.input}
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(e.target.value)}
                    placeholder="Enter amount to contribute"
                    min="0"
                  />
                  <button className="primary-button" onClick={handleMonthlyContribution}>
                    Add
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons" style={styles.actionButtons}>
                <button className="secondary-button" onClick={autoDeductFromSavings}>
                  🔄 Auto-Deduct
                </button>
                <button className="primary-button" onClick={() => setActiveGoal(null)}>
                  ✨ New Goal
                </button>
              </div>
            </>
          )}

          {/* Motivation Message */}
          <div style={styles.motivation}>
            {getMotivation()}
          </div>

          {/* Navigation */}
          <div style={styles.navigation}>
            <button 
              className="secondary-button" 
              onClick={() => navigate("/reports")}
              style={{ ...styles.secondaryButton, flex: 1 }}
            >
              📊 Back to Reports
            </button>
            <button 
              className="primary-button" 
              onClick={() => navigate("/SetBudget")}
              style={{ ...styles.primaryButton, flex: 1 }}
            >
              💰 Set Budget
            </button>
          </div>
        </div>
      </div>
    </>
  );
}