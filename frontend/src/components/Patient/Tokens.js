import React, { useState, useEffect } from 'react';
import { appointmentsAPI } from '../../services/api';

const Tokens = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        appointmentsAPI.getMyAppointments()
            .then(res => {
                const active = res.data.data.filter(a => ['pending', 'in-progress'].includes(a.status));
                setAppointments(active);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="container page-enter">
            <div className="page-header glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', padding: '24px', marginTop: '16px' }}>
                <button onClick={() => window.history.back()} className="btn btn-secondary btn-sm" style={{ padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', width: '40px', height: '40px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <div>
                    <h1 className="page-title" style={{ margin: 0 }}>🎫 My Tokens</h1>
                    <p className="page-subtitle" style={{ marginTop: '4px', marginBottom: 0 }}>Live queue status for your active appointments</p>
                </div>
            </div>

            {loading ? (
                <div className="loading-container"><div className="spinner" /></div>
            ) : appointments.length === 0 ? (
                <div className="empty-state glass-card">
                    <div className="empty-state-icon">🎫</div>
                    <h3>No active tokens</h3>
                    <p>You don't have any pending appointments today</p>
                </div>
            ) : (
                <div className="grid-3">
                    {appointments.map(appt => (
                        <div key={appt._id} className="glass-card" style={{ padding: '24px', borderRadius: 'var(--radius-landing-card)', border: '2px solid var(--color-primary-cta)' }}>
                            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Token Number</div>
                                <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--color-primary-cta)' }}>
                                    {appt.tokenNumber?.split('-').pop() || '?'}
                                </div>
                            </div>
                            
                            <div style={{ padding: '16px', background: 'var(--color-bg)', borderRadius: '12px' }}>
                                <div style={{ fontWeight: 700, color: 'var(--color-ink)' }}>
                                    Dr. {appt.doctorId?.firstName} {appt.doctorId?.lastName}
                                </div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
                                    ⌚ {appt.timeSlot?.startTime} - {appt.timeSlot?.endTime}
                                </div>
                                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status</span>
                                    <span className={`badge ${appt.status === 'in-progress' ? 'badge-in-progress' : 'badge-pending'}`}>
                                        {appt.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Tokens;
