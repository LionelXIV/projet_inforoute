import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{ backgroundColor: '#f8f9fa', textAlign: 'center', color: '#6c757d', padding: '1rem 0', marginTop: '3rem' }}>
      <div className="container">
        <p style={{ margin: 0 }}>&copy; 2024 DataQC - Plateforme de données ouvertes du Québec</p>
      </div>
    </footer>
  );
};

export default Footer;

