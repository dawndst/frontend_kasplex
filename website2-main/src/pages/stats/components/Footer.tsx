import React from "react";
import '@/styles/stats/index.less'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="app-footer">
      <div className="footer-left">
        <span>© {currentYear} Kasplex</span>
      </div>
      <div className="footer-right">
        <a>Privacy Policy</a>
        <a>Terms</a>
        <a>API</a>
      </div>
    </footer>
  );
};

export default Footer;