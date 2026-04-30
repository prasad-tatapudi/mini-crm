import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserPlus, TrendingUp, Search, ExternalLink } from 'lucide-react';
import api from '../api';

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await api.get('/leads');
        setLeads(res.data);
      } catch (err) {
        console.error('Error fetching leads:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const getStatusCount = (status) => leads.filter(l => l.status === status).length;

  if (loading) return <div className="loading-screen">Loading dashboard...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', background: 'linear-gradient(135deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Leads Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage and track your prospective clients.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '1rem', borderRadius: '0.75rem' }}>
            <Users size={24} color="var(--primary-color)" />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>Total Leads</p>
            <h3 style={{ fontSize: '1.75rem', margin: 0 }}>{leads.length}</h3>
          </div>
        </div>
        
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--status-new-bg)', padding: '1rem', borderRadius: '0.75rem' }}>
            <UserPlus size={24} color="var(--status-new)" />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>New Leads</p>
            <h3 style={{ fontSize: '1.75rem', margin: 0 }}>{getStatusCount('New')}</h3>
          </div>
        </div>
        
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--status-converted-bg)', padding: '1rem', borderRadius: '0.75rem' }}>
            <TrendingUp size={24} color="var(--status-converted)" />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>Converted</p>
            <h3 style={{ fontSize: '1.75rem', margin: 0 }}>{getStatusCount('Converted')}</h3>
          </div>
        </div>
      </div>

      {leads.length === 0 ? (
        <div className="card text-center" style={{ padding: '4rem 2rem', borderStyle: 'dashed' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '50%' }}>
              <Search size={40} color="var(--text-muted)" />
            </div>
          </div>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.5rem' }}>No Leads Yet</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
            When visitors submit their information through your website form, they will automatically appear here.
          </p>
        </div>
      ) : (
        <div className="card" style={{ padding: '0', overflowX: 'auto', background: 'var(--bg-tertiary)' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Source</th>
                <th>Status</th>
                <th>Added On</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id}>
                  <td style={{ fontWeight: '500', color: '#fff' }}>{lead.name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{lead.email}</td>
                  <td>
                    <span style={{ background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
                      {lead.source}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-${lead.status}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link to={`/lead/${lead._id}`} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}>
                      View <ExternalLink size={14} style={{ marginLeft: '0.25rem' }} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
