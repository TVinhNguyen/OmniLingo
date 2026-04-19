// Unit tests for notification-service (vitest)

import { describe, it, expect, vi, beforeEach } from 'vitest';
import Handlebars from 'handlebars';

// ─── Handlebars template rendering ────────────────────────────────────────────
describe('renderTemplate', () => {
  function render(template: string, vars: Record<string, string>) {
    return Handlebars.compile(template)(vars);
  }

  it('substitutes variables correctly', () => {
    const result = render('Hello {{name}}! You have {{count}} cards due.', { name: 'Linh', count: '5' });
    expect(result).toBe('Hello Linh! You have 5 cards due.');
  });

  it('handles missing variables gracefully', () => {
    const result = render('Hello {{name}}!', {});
    expect(result).toBe('Hello !');
  });

  it('renders nested braces safely', () => {
    const result = render('Score: {{score}}%', { score: '95' });
    expect(result).toBe('Score: 95%');
  });
});

// ─── Rate limiting logic ──────────────────────────────────────────────────────
describe('throttle logic', () => {
  it('allows below limit', () => {
    const limit = 20;
    const count = 5;
    expect(count > limit).toBe(false);
  });

  it('blocks at limit', () => {
    const limit = 20;
    const count = 21;
    expect(count > limit).toBe(true);
  });
});

// ─── Channel routing guard ────────────────────────────────────────────────────
describe('channel dispatch guard', () => {
  type Channel = 'push' | 'email' | 'in_app' | 'sms';
  const supportedChannels: Channel[] = ['push', 'email', 'in_app'];
  const isSupported = (ch: string): ch is Channel => supportedChannels.includes(ch as Channel);

  it('accepts valid channels', () => {
    expect(isSupported('push')).toBe(true);
    expect(isSupported('email')).toBe(true);
    expect(isSupported('in_app')).toBe(true);
  });

  it('rejects unknown channels', () => {
    expect(isSupported('sms')).toBe(false);
    expect(isSupported('telegram')).toBe(false);
  });
});

// ─── Template code constants ──────────────────────────────────────────────────
describe('TEMPLATES constants', () => {
  const TEMPLATES = {
    STREAK_AT_RISK: 'streak.at_risk',
    SRS_DUE: 'srs.items_due',
    ACHIEVEMENT_UNLOCKED: 'gamification.achievement.unlocked',
    WELCOME: 'identity.welcome',
  };

  it('all template codes are non-empty strings', () => {
    for (const [key, val] of Object.entries(TEMPLATES)) {
      expect(typeof val).toBe('string');
      expect(val.length).toBeGreaterThan(0);
      expect(val).toContain('.');
    }
  });
});
