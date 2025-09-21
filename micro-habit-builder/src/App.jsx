import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HabitProvider } from './context/HabitContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { initializeDemoData } from './utils/demoData';
import './index.css';

function App() {
  useEffect(() => {
    // Initialize demo data on first visit
    initializeDemoData();
  }, []);

  return (
    <HabitProvider>
      <Router>
        <div className="App min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/library" element={<Library />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </Router>
    </HabitProvider>
  );
}

export default App;