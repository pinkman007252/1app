import React from 'react';

const ProfileHeader = ({ user }) => {
    if (!user) return null;
    const initial = user.firstName ? user.firstName.charAt(0) : 'U';
    return (
        <div className="drawer-profile-info">
            <div className="drawer-avatar">{initial}</div>
            <div>
                <div className="drawer-name">{user.firstName} {user.lastName}</div>
                <div className="drawer-role">{user.role}</div>
            </div>
        </div>
    );
};

export default ProfileHeader;
