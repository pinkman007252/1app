import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import PatientProfile from './Patient/PatientProfile';
import DoctorProfile from './Doctor/DoctorProfile';

const Settings = () => {
    const { user } = useAuth();

    return (
        <div className="container page-enter">
            <div className="page-header glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', padding: '24px', marginTop: '16px' }}>
                <button onClick={() => window.history.back()} className="btn btn-secondary btn-sm" style={{ padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', width: '40px', height: '40px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <div>
                    <h1 className="page-title" style={{ margin: 0 }}>⚙️ Settings</h1>
                    <p className="page-subtitle" style={{ marginTop: '4px', marginBottom: 0 }}>Manage your account preferences and profile</p>
                </div>
            </div>

            <div className="grid-2" style={{ gap: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--color-ink)' }}>Profile Details</h2>
                    {user?.role === 'patient' ? <PatientProfile /> : <DoctorProfile />}
                </div>

                <div>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--color-ink)' }}>Preferences</h2>
                    <div className="glass-card" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
                            <div>
                                <div style={{ fontWeight: 700, color: 'var(--color-ink)' }}>Email Notifications</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Receive updates about appointments</div>
                            </div>
                            <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: 700, color: 'var(--color-ink)' }}>SMS Alerts</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Get text reminders before visits</div>
                            </div>
                            <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
