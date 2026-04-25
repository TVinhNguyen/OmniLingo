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

export const LESSON_CONTENT_QUERY = /* GraphQL */ `
  query LessonContent($lessonId: ID!, $language: String) {
    lessonContent(lessonId: $lessonId, language: $language) {
      lessonId
      title
      language
      estimatedMinutes
      exercises {
        id
        kind
        prompt
        audioRef
        choices
        correctAnswer
        explanation
        skill
        maxScore
        language
      }
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

export const SKILL_SCORES_QUERY = /* GraphQL */ `
  query SkillScores($language: String!) {
    skillScores(language: $language) {
      language
      skills {
        skill
        score
        ciLow
        ciHigh
        updatedAt
      }
    }
  }
`;

export const CERT_PREDICT_QUERY = /* GraphQL */ `
  query CertPredict($cert: String!) {
    certPredict(cert: $cert) {
      certCode
      predictedScore
      predictedBand
      modelVersion
      computedAt
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

export const SRS_DUE_COUNT_QUERY = /* GraphQL */ `
  query SrsDueCount {
    srsDueCount
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

export const NOTIFICATIONS_QUERY = /* GraphQL */ `
  query Notifications($filter: String, $cursor: String, $limit: Int) {
    notifications(filter: $filter, cursor: $cursor, limit: $limit) {
      items {
        id
        type
        title
        body
        targetUrl
        icon
        priority
        read
        createdAt
      }
      nextCursor
      unreadCount
    }
  }
`;

export const UNREAD_NOTIFICATION_COUNT_QUERY = /* GraphQL */ `
  query UnreadNotificationCount {
    unreadNotificationCount
  }
`;

export const PRICING_PLANS_QUERY = /* GraphQL */ `
  query PricingPlans($currency: String, $country: String) {
    pricingPlans(currency: $currency, country: $country) {
      id
      name
      tier
      price
      currency
      period
      features
      popular
    }
  }
`;

export const MY_SUBSCRIPTION_QUERY = /* GraphQL */ `
  query MySubscription {
    mySubscription {
      id
      planId
      planName
      state
      currentPeriodStart
      currentPeriodEnd
      cancelAtPeriodEnd
      trialEndsAt
    }
  }
`;

export const BILLING_HISTORY_QUERY = /* GraphQL */ `
  query BillingHistory($cursor: String, $limit: Int) {
    billingHistory(cursor: $cursor, limit: $limit) {
      items {
        id
        amount
        currency
        paidAt
        pdfUrl
        description
      }
      nextCursor
    }
  }
`;

export const CHECKOUT_STATUS_QUERY = /* GraphQL */ `
  query CheckoutStatus($sessionId: ID!) {
    checkoutStatus(sessionId: $sessionId) {
      sessionId
      state
      planId
      activatedAt
      errorMessage
    }
  }
`;

export const ONBOARDING_STATE_QUERY = /* GraphQL */ `
  query OnboardingState {
    onboardingState {
      step
      answers
      placementCefr
      recommendedTrackId
      completedAt
    }
  }
`;

export const PLACEMENT_TEST_QUERY = /* GraphQL */ `
  query PlacementTest($lang: String!, $targetLang: String!) {
    placementTest(lang: $lang, targetLang: $targetLang) {
      testId
      lang
      targetLang
      questions {
        id
        prompt
        choices
        skill
      }
    }
  }
`;
