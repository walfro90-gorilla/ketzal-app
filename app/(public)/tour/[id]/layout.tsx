import { auth } from '@/auth';
import Footer from '@/components/Footer';
import React from 'react';

const TourLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {

  // AUTHENTICATION
  const session = await auth()

  return (
    <div>
      <header>
        <h1>Tour Details</h1>
      </header>
      <main>{children}</main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default TourLayout;