import React from 'react';

const AppLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-blue-100">
      

      <main role="main" className="flex-grow relative">
        {children} 
      </main>

      <footer 
        role="contentinfo" 
        className="bg-gray-100 p-3 text-center text-xs text-gray-600 flex-shrink-0 print:hidden"
      >
        &copy; {new Date().getFullYear()} QuickStop.
      </footer>
    </div>
  );
};

export default AppLayout;