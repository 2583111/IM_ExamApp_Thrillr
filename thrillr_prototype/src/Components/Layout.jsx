import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header  from './Header';
import Sidebar from './Sidebar';
import Footer  from './Footer';

export default function Layout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(open => !open);
  };

  return (
    <>
      {/* Pass toggleSidebar to Header */}
      <Header onToggleSidebar={toggleSidebar} />

      {/* Show Sidebar when isSidebarOpen */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <main style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
        <Outlet />
      </main>

      {/* Footer on every page */}
      <Footer />
    </>
  );
}
