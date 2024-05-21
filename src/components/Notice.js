import React from 'react';
import '../styles/Notice.css';
import console from '../libs/console-browserify';

function Notice({ notice, onDismiss }) {
    if (!notice.user) {
        return null; // No renderizar si user es undefined
    }

    const isDonation = notice.type === 'SONG_BOOSTED';
    const noticeStyle = isDonation ? { '--background-image': `url(${notice.coverImage})` } : {};
    const truncatedUser = notice.user.length > 8 ? notice.user.substring(0, 8) + '...' : notice.user;

    return (
        <div className={`notice ${isDonation ? 'notice-donation' : ''}`} style={noticeStyle}>
            <div className="notice-icon-container">
                <div className="cover-container" style={{ backgroundImage: `url(${notice.coverImage})` }}>
                    <div className="info-circle">{notice.infoText}</div>
                </div>
            </div>
            <div className="notice-content">
                <div className="notice-header">{truncatedUser} {notice.message}</div>
                <h4 className="notice-song-title">{notice.songTitle}</h4>
                <p className="notice-artist-name">{notice.artistName}</p>
            </div>
        </div>
    );
}

export default Notice;
