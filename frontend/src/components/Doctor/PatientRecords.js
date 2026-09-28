import React, { useState, useEffect } from 'react';
import { doctorsAPI } from '../../services/api';

const PatientRecords = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        doctorsAPI.getRecords()
            .then(res => setRecords(res.data.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', {
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
    });

    return (
        <div className="container page-enter">
            <div className="page-header glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', padding: '24px', marginTop: '16px' }}>
                <button onClick={() => window.history.back()} className="btn btn-secondary btn-sm" style={{ padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', width: '40px', height: '40px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <div>
                    <h1 className="page-title" style={{ margin: 0 }}>📋 Patient Records</h1>
                    <p className="page-subtitle" style={{ marginTop: '4px', marginBottom: 0 }}>Past completed appointments and prescriptions</p>
                </div>
            </div>

            {loading ? (
                <div className="loading-container"><div className="spinner" /></div>
            ) : records.length === 0 ? (
                <div className="empty-state glass-card">
                    <div className="empty-state-icon">📋</div>
                    <h3>No records found</h3>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {records.map(record => (
                        <div key={record._id} className="glass-card" style={{ padding: '20px', borderRadius: 'var(--radius-landing-card)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
                                <div>
                                    <h3 style={{ margin: 0, color: 'var(--color-ink)', fontWeight: 700 }}>
                                        {record.patientId?.firstName} {record.patientId?.lastName}
                                    </h3>
                                    <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                        {formatDate(record.appointmentDate)} • {record.timeSlot?.startTime} - {record.timeSlot?.endTime}
                                    </p>
                                </div>
                                <span className="badge badge-completed">Completed</span>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <h4 style={{ margin: '0 0 8px 0', color: 'var(--color-ink)', fontSize: '0.9rem' }}>Doctor Notes</h4>
                                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                                    {record.doctorNotes || 'No notes provided.'}
                                </p>
                            </div>

                            {record.prescription && record.prescription.length > 0 && (
                                <div>
                                    <h4 style={{ margin: '0 0 8px 0', color: 'var(--color-ink)', fontSize: '0.9rem' }}>Prescription</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {record.prescription.map((p, i) => (
                                            <div key={i} style={{ background: 'var(--color-bg)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
                                                <strong style={{ color: 'var(--color-ink)' }}>{p.medicine}</strong>
                                                <span style={{ color: 'var(--text-secondary)' }}>{p.dosage} • {p.frequency} • {p.duration}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PatientRecords;
