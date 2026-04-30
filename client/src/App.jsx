import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LogOut, Activity } from 'lucide-react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LeadDetails from './pages/LeadDetails';
import api from './api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify token
          await api.get('/auth/me');
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div className="loading-screen">Nexus CRM Loading...</div>;
  }

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && (
          <nav className="navbar">
            <div className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={24} color="var(--primary-color)" />
              Nexus CRM
            </div>
            <button className="btn btn-logout" onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </button>
          </nav>
        )}
        <main className="main-content">
          <Routes>
            <Route 
              path="/login" 
              element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} 
            />
            <Route 
              path="/" 
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/lead/:id" 
              element={isAuthenticated ? <LeadDetails /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
