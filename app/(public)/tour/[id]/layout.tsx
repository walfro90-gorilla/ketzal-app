import Footer from '@/components/Footer';
import React from 'react';

const TourLayout: React.FC = ({ children }) => {
  return (
    <div>
      <header>
        <h1>Tour Details</h1>
      </header>
      <main>{children}</main>
      <footer>
        <Footer/>
      </footer>
    </div>
  );
};

export default TourLayout;