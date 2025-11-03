import React from "react";
import { Link } from "react-router-dom";
import { Wallet, BarChart3, PieChart, FileText } from "lucide-react";

export default function HomePage() {
  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>💰</span>
          <h1 style={styles.title}>Smart Expenses Tracker</h1>
        </div>
        <p style={styles.subtitle}>
          Take control of your finances with our intelligent expense tracking system.  
          Monitor your <strong style={styles.highlight}>daily spending</strong>, analyze your 
          <strong style={styles.highlight}> financial habits</strong>, and achieve your 
          <strong style={styles.highlight}> savings goals</strong> with ease.  
          Your journey to financial freedom starts here! 🚀
        </p>
      </div>

      {/* Features Grid */}
      <div style={styles.featuresGrid}>
        <FeatureCard
          icon={<Wallet size={40} style={styles.walletIcon} />}
          title="Expense Management"
          desc="Add, categorize, and manage all your expenses in one convenient place."
        />
        <FeatureCard
          icon={<BarChart3 size={40} style={styles.chartIcon} />}
          title="Spending Analytics"
          desc="Gain insights into your spending patterns with interactive visualizations."
        />
        <FeatureCard
          icon={<PieChart size={40} style={styles.pieIcon} />}
          title="Budget Tracking"
          desc="Set monthly budgets and track your progress against financial goals."
        />
        <FeatureCard
          icon={<FileText size={40} style={styles.reportIcon} />}
          title="Smart Reports"
          desc="Generate detailed financial reports and export your expense data."
        />
      </div>

      {/* Call to Action */}
      <div style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Ready to Transform Your Financial Life?</h2>
        <p style={styles.ctaText}>
          Join thousands of users who have already taken control of their expenses
        </p>
        <div style={styles.ctaButtons}>
          <Link to="/login" style={styles.primaryButton}>
            Get Started Now
          </Link>
          <Link to="/Register" style={styles.secondaryButton}>
            Create Account
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          © {new Date().getFullYear()} Smart Expenses Tracker | Designed with ❤️ for better financial management
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div style={styles.featureCard}>
      <div style={styles.cardIcon}>{icon}</div>
      <h3 style={styles.cardTitle}>{title}</h3>
      <p style={styles.cardDesc}>{desc}</p>
      <div style={styles.cardFeatures}>
        <span style={styles.featureTag}>Smart</span>
        <span style={styles.featureTag}>Easy</span>
        <span style={styles.featureTag}>Secure</span>
      </div>
    </div>
  );
}

// Professional CSS Styles for Smart Expenses Tracker
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '40px 20px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    textAlign: 'center',
    maxWidth: '800px',
    marginBottom: '60px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '24px',
  },
  logoIcon: {
    fontSize: '48px',
    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
  },
  title: {
    color: 'white',
    fontSize: '48px',
    fontWeight: '800',
    margin: 0,
    textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    background: 'linear-gradient(135deg, #ffffff, #f0f0f0)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '18px',
    lineHeight: '1.6',
    margin: 0,
    fontWeight: '500',
  },
  highlight: {
    color: '#ffffff',
    fontWeight: '600',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '30px',
    width: '100%',
    maxWidth: '1200px',
    marginBottom: '60px',
  },
  featureCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    padding: '32px 24px',
    borderRadius: '20px',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  cardIcon: {
    marginBottom: '20px',
  },
  walletIcon: {
    color: '#10b981',
  },
  chartIcon: {
    color: '#3b82f6',
  },
  pieIcon: {
    color: '#ef4444',
  },
  reportIcon: {
    color: '#8b5cf6',
  },
  cardTitle: {
    color: '#000000',
    fontSize: '20px',
    fontWeight: '700',
    margin: '0 0 12px 0',
  },
  cardDesc: {
    color: '#000000',
    fontSize: '14px',
    lineHeight: '1.5',
    margin: '0 0 20px 0',
    opacity: 0.8,
  },
  cardFeatures: {
    display: 'flex',
    gap: '8px',
    marginTop: 'auto',
  },
  featureTag: {
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  ctaSection: {
    textAlign: 'center',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    padding: '40px',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    maxWidth: '600px',
    marginBottom: '40px',
  },
  ctaTitle: {
    color: 'white',
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 16px 0',
  },
  ctaText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '16px',
    margin: '0 0 30px 0',
  },
  ctaButtons: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: 'white',
    padding: '14px 32px',
    borderRadius: '12px',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
  },
  secondaryButton: {
    background: 'transparent',
    color: 'white',
    padding: '14px 32px',
    borderRadius: '12px',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '600',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s ease',
  },
  footer: {
    textAlign: 'center',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '14px',
    margin: 0,
  },
};

// Add CSS animations and hover effects
if (typeof document !== 'undefined') {
  const styleSheet = document.styleSheets[0];
  
  styleSheet.insertRule(`
    .feature-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
    }
  `, styleSheet.cssRules.length);

  styleSheet.insertRule(`
    .primary-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
    }
  `, styleSheet.cssRules.length);

  styleSheet.insertRule(`
    .secondary-button:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-2px);
    }
  `, styleSheet.cssRules.length);

  // Responsive design
  styleSheet.insertRule(`
    @media (max-width: 768px) {
      .home-title {
        font-size: 36px;
      }
      
      .home-subtitle {
        font-size: 16px;
        padding: 0 20px;
      }
      
      .cta-buttons {
        flex-direction: column;
        align-items: center;
      }
      
      .cta-button {
        width: 200px;
      }
    }
  `, styleSheet.cssRules.length);

  styleSheet.insertRule(`
    @media (max-width: 480px) {
      .home-title {
        font-size: 28px;
      }
      
      .features-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      
      .feature-card {
        padding: 24px 20px;
      }
    }
  `, styleSheet.cssRules.length);
}