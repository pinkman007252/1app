import React from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { PATIENT_MENU, DOCTOR_MENU } from '../config/menuItems';
import ProfileHeader from './ProfileHeader';

const NavigationDrawer = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    if (!user) return null;
    
    const menuItems = user.role === 'doctor' ? DOCTOR_MENU : PATIENT_MENU;
    
    return (
        <>
            <div className={`drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
            <div className={`drawer ${isOpen ? 'open' : ''}`}>
                <div className="drawer-header">
                    <span className="app-brand"><img src="/logo.jpg" alt="MediBook Logo" className="app-brand-icon" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} /> MediBook</span>
                    <button className="menu-btn" onClick={onClose} aria-label="Close menu"><X size={24} /></button>
                </div>
                <div className="drawer-nav">
                    {menuItems.map((item, idx) => (
                        <NavLink key={idx} to={item.path} onClick={onClose} className={({ isActive }) => `drawer-link ${isActive ? 'active' : ''}`}>
                            <item.icon className="drawer-link-icon" size={20} />
                            {item.label}
                        </NavLink>
                    ))}
                </div>
                <div className="drawer-profile">
                    <ProfileHeader user={user} />
                    <button onClick={() => { logout(); onClose(); }} className="btn btn-outline-cancel btn-full" style={{ marginTop: '16px', borderRadius: '12px' }}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </div>
        </>
    );
};

export default NavigationDrawer;
