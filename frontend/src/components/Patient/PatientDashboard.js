import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { appointmentsAPI } from '../../services/api';
import DashboardCard from '../DashboardCard';
import { PATIENT_MENU } from '../../config/menuItems';
import './Patient.css';

const formatDate = (d) => { const dt = new Date(d); return { day: dt.getDate(), month: dt.toLocaleString('default', { month: 'short' }), full: dt.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }) }; };

const PatientDashboard = () => {
    const { profile } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        appointmentsAPI.getMyAppointments()
            .then(res => setAppointments(res.data.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const upcoming = appointments.filter(a => ['confirmed', 'pending', 'in-progress'].includes(a.status));
    
    const getBadgeClass = (status) => {
        const map = { confirmed: 'badge-confirmed', completed: 'badge-completed', cancelled: 'badge-cancelled', pending: 'badge-pending', 'in-progress': 'badge-in-progress' };
        return map[status] || 'badge-pending';
    };

    return (
        <div className="container page-enter">
            <div className="page-header">
                <div className="doctor-dash-hero" style={{ background: 'var(--color-primary-cta)', borderRadius: 'var(--radius-landing-card)', padding: '32px', marginBottom: '32px' }}>
                    <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>
                        👋 Welcome back
                    </div>
                    <h1 style={{ color: 'white', fontSize: '2rem', fontFamily: 'var(--font-heading)', margin: 0 }}>
                        {profile?.firstName} {profile?.lastName}
                    </h1>
                </div>
            </div>
            
            <div className="grid-3" style={{ marginBottom: '40px' }}>
                {PATIENT_MENU.filter(m => m.path !== '/dashboard').map((item, idx) => (
                    <DashboardCard key={idx} icon={item.icon} title={item.label} description={`Go to ${item.label}`} linkTo={item.path} highlight={item.label === 'Book Appointment'} />
                ))}
            </div>

            {/* Upcoming Appointments */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--color-ink)' }}>Upcoming Appointments</h2>
                <Link to="/medical-history" style={{ color: 'var(--color-primary-cta)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: '700' }}>View All →</Link>
            </div>

            {loading ? (
                <div className="loading-container"><div className="spinner" /></div>
            ) : upcoming.length === 0 ? (
                <div className="empty-state glass-card">
                    <div className="empty-state-icon">📅</div>
                    <h3>No Upcoming Appointments</h3>
                    <p>Book an appointment with a doctor to get started</p>
                    <Link to="/search-doctors" className="btn btn-primary" style={{ marginTop: '16px' }}>Find a Doctor</Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '32px' }}>
                    {upcoming.slice(0, 5).map(appt => {
                        const date = formatDate(appt.appointmentDate);
                        return (
                            <div key={appt._id} className="appointment-row">
                                <div className="appointment-date-block">
                                    <div className="appointment-day">{date.day}</div>
                                    <div className="appointment-month">{date.month}</div>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '700', color: 'var(--color-ink)', fontSize: '1rem' }}>
                                        Dr. {appt.doctorId?.firstName} {appt.doctorId?.lastName}
                                    </div>
                                    <div style={{ color: 'var(--color-secondary-deep)', fontSize: '0.83rem', fontWeight: '600' }}>{appt.doctorId?.specialization}</div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '4px' }}>
                                        🕐 {appt.timeSlot?.startTime} – {appt.timeSlot?.endTime}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span className={`badge ${getBadgeClass(appt.status)}`}>{appt.status}</span>
                                    <div style={{ color: 'var(--color-primary-cta)', fontSize: '0.78rem', marginTop: '6px', fontWeight: '700' }}>Token: {appt.tokenNumber?.split('-').pop()}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default PatientDashboard;
