/**
 * All GraphQL queries for the web-bff.
 * Used by both RSC (server) and client components.
 */

export const DASHBOARD_QUERY = /* GraphQL */ `
  query Dashboard {
    dashboard {
      user {
        id
        username
        avatarUrl
        bio
      }
      progress {
        streak
        totalXp
        minutesLearned
        wordsMastered
      }
      entitlement {
        planTier
        validUntil
        features {
          code
          allowed
          quota
        }
      }
      myTracks {
        id
        title
        language
        level
        progressPct
      }
      myDecks {
        id
        name
        cardCount
        dueCount
        masteredCount
      }
    }
  }
`;

export const ME_QUERY = /* GraphQL */ `
  query Me {
    me {
      id
      username
      avatarUrl
      bio
      createdAt
    }
  }
`;

export const MY_TRACKS_QUERY = /* GraphQL */ `
  query MyTracks {
    myTracks {
      id
      title
      language
      level
      progressPct
    }
  }
`;

export const LESSONS_QUERY = /* GraphQL */ `
  query Lessons($unitId: ID!) {
    lessons(unitId: $unitId) {
      id
      title
      unitId
      orderIndex
      durationMin
      status
    }
  }
`;

export const MY_DECKS_QUERY = /* GraphQL */ `
  query MyDecks {
    myDecks {
      id
      name
      cardCount
      dueCount
      masteredCount
    }
  }
`;

export const MY_PROGRESS_QUERY = /* GraphQL */ `
  query MyProgress {
    myProgress {
      streak
      totalXp
      minutesLearned
      wordsMastered
    }
  }
`;

export const MY_ENTITLEMENTS_QUERY = /* GraphQL */ `
  query MyEntitlements {
    myEntitlements {
      planTier
      validUntil
      features {
        code
        allowed
        quota
      }
    }
  }
`;

export const CHECK_FEATURE_QUERY = /* GraphQL */ `
  query CheckFeature($code: String!) {
    checkFeature(code: $code) {
      code
      allowed
      quota
    }
  }
`;

export const WEEKLY_PROGRESS_QUERY = /* GraphQL */ `
  query WeeklyProgress($days: Int) {
    weeklyProgress(days: $days) {
      date
      xp
      minutes
    }
  }
`;
