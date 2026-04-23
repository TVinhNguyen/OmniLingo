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

export const SEARCH_WORDS_QUERY = /* GraphQL */ `
  query SearchWords($query: String!, $language: String, $pageSize: Int) {
    searchWords(query: $query, language: $language, pageSize: $pageSize) {
      id
      lemma
      language
      definition
    }
  }
`;

export const DECK_QUERY = /* GraphQL */ `
  query Deck($id: ID!) {
    deck(id: $id) {
      id
      name
      cardCount
      dueCount
      masteredCount
    }
  }
`;

export const DECK_CARDS_QUERY = /* GraphQL */ `
  query DeckCards($deckId: ID!) {
    deckCards(deckId: $deckId) {
      id
      deckId
      lemma
      meaning
      ipa
      pos
      status
    }
  }
`;

export const CONVERSATIONS_QUERY = /* GraphQL */ `
  query Conversations {
    conversations {
      id
      messageCount
      lastMessage
      ttlSeconds
    }
  }
`;

export const CONVERSATION_QUERY = /* GraphQL */ `
  query Conversation($id: ID!) {
    conversation(id: $id) {
      id
      messages {
        role
        content
      }
    }
  }
`;

export const DUE_CARDS_QUERY = /* GraphQL */ `
  query DueCards($limit: Int) {
    dueCards(limit: $limit) {
      itemId
      state
      reps
    }
  }
`;

export const SRS_STATS_QUERY = /* GraphQL */ `
  query SrsStats {
    srsStats {
      total
      dueToday
      matureCount
    }
  }
`;

export const MY_STREAK_QUERY = /* GraphQL */ `
  query MyStreak {
    myStreak {
      current
      longest
      freezesLeft
      totalXp
      level
    }
  }
`;

export const MY_ACHIEVEMENTS_QUERY = /* GraphQL */ `
  query MyAchievements {
    myAchievements {
      id
      code
      title
      description
      icon
      rarity
      earnedAt
      xpReward
    }
  }
`;

export const MY_LEADERBOARD_QUERY = /* GraphQL */ `
  query MyLeaderboard {
    myLeaderboard {
      league
      myRank
      myXp
      entries {
        rank
        userId
        displayName
        avatarUrl
        xp
        isCurrentUser
      }
    }
  }
`;
