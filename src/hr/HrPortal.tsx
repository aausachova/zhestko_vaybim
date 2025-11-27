import React from 'react';
import HrStandaloneApp from '../../hr/src/App';
import '../../hr/src/index.css';
import '../../hr/src/styles/globals.css';

interface HrPortalProps {
  username: string;
  token: string;
  onSignOut: () => void;
}

function HrPortal({ username, token, onSignOut }: HrPortalProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <HrStandaloneApp
        username={username}
        roleTitle="Frontend Developer"
        token={token}
        onSignOut={onSignOut}
      />
    </div>
  );
}

export default HrPortal;