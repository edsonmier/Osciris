import React, { useState } from 'react';
import Notice from './Notice';
import '../styles/Notice.css';

function NoticeScreen({ notices, onDismiss }) {
    return (
      <div className="notice-screen">
        {notices.map((notice) => (
          <Notice key={notice.id} notice={notice} onDismiss={onDismiss} />
        ))}
      </div>
    );
  }

export default NoticeScreen;
  