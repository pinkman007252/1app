import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import NavigationDrawer from './NavigationDrawer';

const AppHeader = () => {
    const { user } = useAuth();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    if (!user) return null;

    return (
        <>
            <header className="app-header">
                <div className="app-brand">
                    <img src="/logo.jpg" alt="MediBook Logo" className="app-brand-icon" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} /> MediBook
                </div>
                <button className="menu-btn" onClick={() => setIsDrawerOpen(true)} aria-label="Open menu">
                    <Menu size={24} />
                </button>
            </header>
            <NavigationDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
        </>
    );
};

export default AppHeader;
