import { useState } from 'react';
import { Activity, Lock, User, LogIn } from 'lucide-react';
import api from '../api';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { username, password });
      onLogin(res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ 
            background: 'rgba(99, 102, 241, 0.1)', 
            padding: '1rem', 
            borderRadius: '50%',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)'
          }}>
            <Activity size={32} color="var(--primary-color)" />
          </div>
        </div>
        
        <h2 className="text-center mb-4" style={{ color: 'var(--text-primary)', fontSize: '1.75rem', marginBottom: '2rem' }}>
          Welcome Back
        </h2>
        
        {error && (
          <div style={{ 
            backgroundColor: 'rgba(248, 113, 113, 0.1)', 
            color: 'var(--status-lost)', 
            padding: '0.75rem', 
            borderRadius: '0.5rem', 
            marginBottom: '1.5rem', 
            textAlign: 'center',
            border: '1px solid rgba(248, 113, 113, 0.3)'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Username</label>
            <div style={{ position: 'relative' }}>
              <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                className="form-input" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                placeholder="Enter your username"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>
          
          <div className="form-group" style={{ position: 'relative', marginBottom: '2rem' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="password" 
                className="form-input" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="Enter your password"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.875rem' }}>
            <LogIn size={18} />
            Sign In
          </button>
        </form>
        
        <p className="mt-4 text-center" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '2rem' }}>
          Initial setup: POST request to <code style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '0.2rem 0.4rem', borderRadius: '0.25rem' }}>/api/auth/setup</code>
        </p>
      </div>
    </div>
  );
};

export default Login;
