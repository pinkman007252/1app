import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const DashboardCard = ({ icon: Icon, title, description, linkTo, highlight }) => {
    return (
        <Link to={linkTo} className="baba-card" style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: highlight ? 'var(--color-primary-cta)' : 'var(--color-accent-soft)', color: highlight ? 'white' : 'var(--color-primary-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={24} />
                </div>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-cream-warm)', color: 'var(--color-ink-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChevronRight size={18} />
                </div>
            </div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-ink)', marginBottom: '8px' }}>{title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.4' }}>{description}</p>
        </Link>
    );
};

export default DashboardCard;
