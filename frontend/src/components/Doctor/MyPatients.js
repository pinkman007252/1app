import React, { useState, useEffect } from 'react';
import { doctorsAPI } from '../../services/api';

const MyPatients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        doctorsAPI.getMyPatients()
            .then(res => setPatients(res.data.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filtered = patients.filter(p => 
        (p.firstName + ' ' + p.lastName).toLowerCase().includes(search.toLowerCase()) || 
        p.phone?.includes(search)
    );

    return (
        <div className="container page-enter">
            <div className="page-header glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', padding: '24px', marginTop: '16px' }}>
                <button onClick={() => window.history.back()} className="btn btn-secondary btn-sm" style={{ padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', width: '40px', height: '40px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <div>
                    <h1 className="page-title" style={{ margin: 0 }}>👥 My Patients</h1>
                    <p className="page-subtitle" style={{ marginTop: '4px', marginBottom: 0 }}>Patients you have treated</p>
                </div>
            </div>

            <div className="search-container" style={{ marginBottom: '24px' }}>
                <span className="search-icon">🔍</span>
                <input 
                    className="search-input" 
                    placeholder="Search patients by name or phone..." 
                    value={search} 
                    onChange={e => setSearch(e.target.value)} 
                />
            </div>

            {loading ? (
                <div className="loading-container"><div className="spinner" /></div>
            ) : filtered.length === 0 ? (
                <div className="empty-state glass-card">
                    <div className="empty-state-icon">👥</div>
                    <h3>No patients found</h3>
                </div>
            ) : (
                <div className="grid-3">
                    {filtered.map(p => (
                        <div key={p.id} className="glass-card" style={{ padding: '20px', borderRadius: 'var(--radius-landing-card)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div className="doctor-avatar" style={{ width: '50px', height: '50px', fontSize: '1.2rem' }}>
                                    {p.firstName?.[0]}{p.lastName?.[0]}
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, color: 'var(--color-ink)', fontWeight: 700 }}>
                                        {p.firstName} {p.lastName}
                                    </h3>
                                    <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                        📱 {p.phone || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyPatients;
