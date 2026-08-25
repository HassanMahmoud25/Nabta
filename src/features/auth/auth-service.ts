import { env } from "@/config/env";
import { storage } from "@/services/storage/local-storage";
import { getSupabaseClient } from "@/services/supabase/client";
import { normalizeError } from "@/utils/errors";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import type { AuthCredentials, ParentSession } from "./types";

const FIXTURE_SESSION_KEY = "nabta.fixture.session";

function mapSession(session: Session | null): ParentSession | null {
  return session?.user.email
    ? { parentId: session.user.id, email: session.user.email }
    : null;
}

export const authService = {
  async getSession(): Promise<ParentSession | null> {
    if (env.useDevFixtures || !env.hasSupabaseConfig)
      return storage.get<ParentSession>(FIXTURE_SESSION_KEY);
    const { data, error } = await getSupabaseClient().auth.getSession();
    if (error) throw normalizeError(error);
    return mapSession(data.session);
  },
  async signUp(credentials: AuthCredentials): Promise<ParentSession> {
    if (env.useDevFixtures || !env.hasSupabaseConfig) {
      const session = {
        parentId: "parent-dev",
        email: credentials.email.toLowerCase(),
      };
      storage.set(FIXTURE_SESSION_KEY, session);
      return session;
    }
    const { data, error } = await getSupabaseClient().auth.signUp(credentials);
    if (error) throw normalizeError(error);
    const session = mapSession(data.session);
    if (!session)
      throw normalizeError(
        new Error("Check your email to confirm your account."),
      );
    return session;
  },
  async signIn(credentials: AuthCredentials): Promise<ParentSession> {
    if (env.useDevFixtures || !env.hasSupabaseConfig) {
      const session = {
        parentId: "parent-dev",
        email: credentials.email.toLowerCase(),
      };
      storage.set(FIXTURE_SESSION_KEY, session);
      return session;
    }
    const { data, error } =
      await getSupabaseClient().auth.signInWithPassword(credentials);
    if (error) throw normalizeError(error);
    const session = mapSession(data.session);
    if (!session)
      throw normalizeError(new Error("Unable to create a session."));
    return session;
  },
  async signOut() {
    if (env.useDevFixtures || !env.hasSupabaseConfig) {
      storage.remove(FIXTURE_SESSION_KEY);
      return;
    }
    const { error } = await getSupabaseClient().auth.signOut();
    if (error) throw normalizeError(error);
  },
  async requestPasswordReset(email: string) {
    if (env.useDevFixtures || !env.hasSupabaseConfig) return;
    const { error } = await getSupabaseClient().auth.resetPasswordForEmail(
      email,
      { redirectTo: "nabta://reset-password" },
    );
    if (error) throw normalizeError(error);
  },
  async verifyParentCredentials(
    credentials: AuthCredentials,
    expectedParentId: string,
  ) {
    if (env.useDevFixtures || !env.hasSupabaseConfig) {
      const session = storage.get<ParentSession>(FIXTURE_SESSION_KEY);
      return (
        session?.parentId === expectedParentId &&
        session.email === credentials.email.toLowerCase() &&
        credentials.password.length >= 8
      );
    }
    const { data, error } =
      await getSupabaseClient().auth.signInWithPassword(credentials);
    if (error) return false;
    return data.user.id === expectedParentId;
  },
  subscribe(callback: (session: ParentSession | null) => void) {
    if (env.useDevFixtures || !env.hasSupabaseConfig) return () => undefined;
    const { data } = getSupabaseClient().auth.onAuthStateChange(
      (_event: AuthChangeEvent, session) => callback(mapSession(session)),
    );
    return () => data.subscription.unsubscribe();
  },
};
