export type AnalyticsEvent = 'parent_signed_up' | 'child_created' | 'child_added' | 'child_switched' | 'child_updated' | 'child_deleted' | 'kids_mode_child_selected' | 'skills_selected' | 'kids_mode_started' | 'mission_started' | 'mission_step_answered' | 'mission_completed' | 'badge_unlocked' | 'offline_activity_viewed';
type SafeProperties = Record<string, string | number | boolean>;
export interface AnalyticsProvider { track(event: AnalyticsEvent, properties?: SafeProperties): void }
class DevelopmentAnalytics implements AnalyticsProvider { track(event: AnalyticsEvent, properties: SafeProperties = {}) { if (__DEV__) console.info('[analytics]', event, properties); } }
export const analytics: AnalyticsProvider = new DevelopmentAnalytics();
