import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from './auth-service';
import type { AuthCredentials, ParentSession } from './types';

type AuthContextValue = {
  session: ParentSession | null; isLoading: boolean;
  signUp: (values: AuthCredentials) => Promise<void>; signIn: (values: AuthCredentials) => Promise<void>; signOut: () => Promise<void>;
};
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<ParentSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    let active = true;
    void authService.getSession().then((value) => { if (active) setSession(value); }).finally(() => { if (active) setIsLoading(false); });
    const unsubscribe = authService.subscribe(setSession);
    return () => { active = false; unsubscribe(); };
  }, []);
  const signUp = useCallback(async (values: AuthCredentials) => setSession(await authService.signUp(values)), []);
  const signIn = useCallback(async (values: AuthCredentials) => setSession(await authService.signIn(values)), []);
  const signOut = useCallback(async () => { await authService.signOut(); setSession(null); }, []);
  const value = useMemo(() => ({ session, isLoading, signUp, signIn, signOut }), [session, isLoading, signUp, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

