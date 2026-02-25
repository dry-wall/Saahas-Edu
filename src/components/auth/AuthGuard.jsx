import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

export const AuthGuard = ({ children }) => {
  const { user, login, getStoredUser } = useAuth();
  const [checked, setChecked] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    // Only run the storage check once on mount
    if (!initialized.current) {
      if (!user) {
        const stored = getStoredUser();
        if (stored) login(stored);
      }
      setChecked(true);
      initialized.current = true;
    }
  }, [user, login, getStoredUser]);

  // If we haven't checked the auth state yet, show a loader instead of nothing
  if (!checked) return <div>Loading...</div>; 

  return children;
};