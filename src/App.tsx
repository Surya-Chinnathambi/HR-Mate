import React from 'react';
import { useQuery, useAction, useConvexAuth } from 'convex/react';
import { SignInForm } from './SignInForm';
import { api } from '../convex/_generated/api';
import { EnhancedHRMSDashboard } from './components/EnhancedHRMSDashboard';

function App() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const user = useQuery(api.auth.loggedInUser);
  const signOut = useAction(api.auth.signOut);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SignInForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedHRMSDashboard user={user} onLogout={signOut} />
    </div>
  );
}

export default App;
