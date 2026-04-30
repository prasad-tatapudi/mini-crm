import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Globe, Calendar, Clock, Send, Activity } from 'lucide-react';
import api from '../api';

const LeadDetails = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    fetchLead();
  }, [id]);

  const fetchLead = async () => {
    try {
      const res = await api.get(`/leads/${id}`);
      setLead(res.data);
    } catch (err) {
      console.error('Error fetching lead details', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    try {
      const res = await api.put(`/leads/${id}`, { status });
      setLead(res.data);
    } catch (err) {
      console.error('Error updating status', err);
    }
  };

  const addFollowUp = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    
    try {
      const res = await api.post(`/leads/${id}/followups`, { note: newNote });
      setLead(res.data);
      setNewNote('');
    } catch (err) {
      console.error('Error adding follow-up', err);
    }
  };

  if (loading) return <div className="loading-screen">Loading Lead Data...</div>;
  if (!lead) return (
    <div className="card text-center" style={{ padding: '4rem 2rem', borderStyle: 'dashed', marginTop: '2rem' }}>
      <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.5rem' }}>Lead Not Found</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>This lead may have been deleted or the ID is incorrect.</p>
      <Link to="/" className="btn btn-primary">Go Back to Dashboard</Link>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/" style={{ color: 'var(--primary-color)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500', transition: 'color 0.2s' }}>
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Left Column: Lead Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, var(--primary-color), var(--accent-color))' }}></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '50%' }}>
                  <User size={32} color="var(--primary-color)" />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem', color: '#fff' }}>{lead.name}</h2>
                  <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                    <Mail size={14} /> {lead.email}
                  </p>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem', background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: '0.75rem' }}>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Source</p>
                <p style={{ fontWeight: '500', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Globe size={16} color="var(--text-secondary)" /> {lead.source}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Added On</p>
                <p style={{ fontWeight: '500', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Calendar size={16} color="var(--text-secondary)" /> {new Date(lead.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Update Lead Status
                <span className={`status-badge status-${lead.status}`}>{lead.status}</span>
              </label>
              <select 
                className="form-select" 
                value={lead.status} 
                onChange={(e) => updateStatus(e.target.value)}
                style={{ marginTop: '0.75rem', border: '1px solid var(--border-hover)' }}
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Converted">Converted</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Follow-ups */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Activity size={20} color="var(--primary-color)" />
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Activity Timeline</h3>
          </div>
          
          <form onSubmit={addFollowUp} style={{ marginBottom: '2.5rem', position: 'relative' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <textarea 
                className="form-textarea" 
                rows="3" 
                placeholder="Add a new note or log an interaction..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                style={{ paddingBottom: '3rem', resize: 'none' }}
              ></textarea>
              <div style={{ position: 'absolute', bottom: '0.75rem', right: '0.75rem' }}>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.4rem 1rem', borderRadius: '0.4rem' }} disabled={!newNote.trim()}>
                  <Send size={16} /> Log
                </button>
              </div>
            </div>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
            {lead.followUps.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                <Clock size={32} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <p style={{ fontStyle: 'italic', fontSize: '0.95rem' }}>No activity recorded yet.</p>
              </div>
            ) : (
              <div style={{ position: 'relative', paddingLeft: '1.5rem', borderLeft: '2px solid rgba(255,255,255,0.05)' }}>
                {lead.followUps.map((item, index) => (
                  <div key={index} style={{ position: 'relative', marginBottom: index === lead.followUps.length - 1 ? 0 : '2rem' }}>
                    {/* Timeline dot */}
                    <div style={{ position: 'absolute', left: '-1.85rem', top: '0.25rem', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', border: '2px solid var(--bg-secondary)', boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.2)' }}></div>
                    
                    <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.03)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: '500' }}>
                        <Clock size={14} />
                        {new Date(item.date).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <p style={{ fontSize: '0.95rem', color: '#fff', lineHeight: 1.5 }}>{item.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;
