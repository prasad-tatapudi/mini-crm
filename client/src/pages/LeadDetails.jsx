import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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

  if (loading) return <div>Loading...</div>;
  if (!lead) return <div>Lead not found. <Link to="/">Go back</Link></div>;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>&larr; Back to Dashboard</Link>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Left Column: Lead Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{lead.name}</h2>
                <p style={{ color: 'var(--text-secondary)' }}>{lead.email}</p>
              </div>
              <span className={`status-badge status-${lead.status}`}>{lead.status}</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Source</p>
                <p style={{ fontWeight: '500' }}>{lead.source}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Added On</p>
                <p style={{ fontWeight: '500' }}>{new Date(lead.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Update Status</label>
              <select 
                className="form-select" 
                value={lead.status} 
                onChange={(e) => updateStatus(e.target.value)}
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
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Activity & Notes</h3>
          
          <form onSubmit={addFollowUp} style={{ marginBottom: '2rem' }}>
            <div className="form-group">
              <textarea 
                className="form-textarea" 
                rows="3" 
                placeholder="Add a new note or follow-up details..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Add Note</button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {lead.followUps.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.875rem' }}>No activity recorded yet.</p>
            ) : (
              lead.followUps.map((item, index) => (
                <div key={index} style={{ padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: '0.375rem' }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    {new Date(item.date).toLocaleString()}
                  </p>
                  <p style={{ fontSize: '0.95rem' }}>{item.note}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;
