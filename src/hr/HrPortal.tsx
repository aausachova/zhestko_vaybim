import React from 'react';
import HrStandaloneApp from '../../hr/src/App.tsx';
import '../../hr/src/index.css';
import '../../hr/src/styles/globals.css';

interface HrPortalProps {
  username: string;
  onSignOut: () => void;
}

function HrPortal({ username, onSignOut }: HrPortalProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <HrStandaloneApp username={username} roleTitle="Frontend Developer" onSignOut={onSignOut} />
    </div>
  );
}

export default HrPortal;

