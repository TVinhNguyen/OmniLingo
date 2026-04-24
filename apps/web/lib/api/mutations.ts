/**
 * All GraphQL mutations for the web-bff.
 */

export const START_LESSON_MUTATION = /* GraphQL */ `
  mutation StartLesson($lessonId: ID!) {
    startLesson(lessonId: $lessonId) {
      sessionId
      lessonId
    }
  }
`;

export const SUBMIT_ANSWER_MUTATION = /* GraphQL */ `
  mutation SubmitAnswer(
    $lessonId: ID!
    $exerciseId: ID!
    $exerciseKind: String!
    $answer: JSON!
    $correctAnswer: JSON
    $maxScore: Float!
    $skillTag: String!
    $language: String!
  ) {
    submitAnswer(
      lessonId: $lessonId
      exerciseId: $exerciseId
      exerciseKind: $exerciseKind
      answer: $answer
      correctAnswer: $correctAnswer
      maxScore: $maxScore
      skillTag: $skillTag
      language: $language
    ) {
      correct
      score
      maxScore
      xpDelta
      explanation
    }
  }
`;

export const CREATE_DECK_MUTATION = /* GraphQL */ `
  mutation CreateDeck($name: String!, $language: String!) {
    createDeck(name: $name, language: $language) {
      id
      name
      cardCount
      dueCount
      masteredCount
    }
  }
`;

export const TUTOR_CHAT_MUTATION = /* GraphQL */ `
  mutation TutorChat($conversationId: String, $message: String!, $language: String) {
    tutorChat(conversationId: $conversationId, message: $message, language: $language) {
      conversationId
      message {
        role
        content
      }
      quotaRemaining
    }
  }
`;

export const EXPLAIN_MUTATION = /* GraphQL */ `
  mutation Explain($text: String!, $context: String, $language: String) {
    explain(text: $text, context: $context, language: $language) {
      explanation
      examples
    }
  }
`;

export const UPDATE_PROFILE_MUTATION = /* GraphQL */ `
  mutation UpdateProfile(
    $displayName: String
    $bio: String
    $uiLanguage: String
    $timezone: String
    $avatarUrl: String
  ) {
    updateProfile(
      displayName: $displayName
      bio: $bio
      uiLanguage: $uiLanguage
      timezone: $timezone
      avatarUrl: $avatarUrl
    ) {
      id
      username
      avatarUrl
      bio
      createdAt
    }
  }
`;

export const ADD_CARD_MUTATION = /* GraphQL */ `
  mutation AddCard($deckId: ID!, $lemma: String!, $meaning: String!, $ipa: String, $pos: String) {
    addCard(deckId: $deckId, lemma: $lemma, meaning: $meaning, ipa: $ipa, pos: $pos) {
      id
      deckId
      lemma
      meaning
    }
  }
`;

export const REVIEW_CARD_MUTATION = /* GraphQL */ `
  mutation ReviewCard($itemId: ID!, $rating: Int!) {
    reviewCard(itemId: $itemId, rating: $rating) {
      nextDueAt
    }
  }
`;

export const COMPLETE_LESSON_MUTATION = /* GraphQL */ `
  mutation CompleteLesson($lessonId: ID!, $xpEarned: Int!) {
    completeLesson(lessonId: $lessonId, xpEarned: $xpEarned) {
      ok
    }
  }
`;

export const ENROLL_TRACK_MUTATION = /* GraphQL */ `
  mutation EnrollTrack($language: String!, $templateId: String) {
    enrollTrack(language: $language, templateId: $templateId) {
      trackId
      ok
    }
  }
`;

export const RENAME_CONVERSATION_MUTATION = /* GraphQL */ `
  mutation RenameConversation($id: ID!, $title: String!) {
    renameConversation(id: $id, title: $title) {
      ok
    }
  }
`;

export const DELETE_CONVERSATION_MUTATION = /* GraphQL */ `
  mutation DeleteConversation($id: ID!) {
    deleteConversation(id: $id) {
      ok
    }
  }
`;

export const DELETE_CARD_MUTATION = /* GraphQL */ `
  mutation DeleteCard($deckId: ID!, $cardId: ID!) {
    deleteCard(deckId: $deckId, cardId: $cardId) {
      ok
    }
  }
`;

export const DELETE_DECK_MUTATION = /* GraphQL */ `
  mutation DeleteDeck($deckId: ID!) {
    deleteDeck(deckId: $deckId) {
      ok
    }
  }
`;

export const ADD_CARD_FROM_CHAT_MUTATION = /* GraphQL */ `
  mutation AddCardFromChat($deckId: ID!, $lemma: String!, $meaning: String!, $ipa: String, $pos: String) {
    addCardFromChat(deckId: $deckId, lemma: $lemma, meaning: $meaning, ipa: $ipa, pos: $pos) {
      id
      lemma
      meaning
    }
  }
`;

export const MARK_NOTIFICATIONS_READ_MUTATION = /* GraphQL */ `
  mutation MarkNotificationsRead($ids: [ID!]!) {
    markNotificationsRead(ids: $ids)
  }
`;

export const MARK_ALL_NOTIFICATIONS_READ_MUTATION = /* GraphQL */ `
  mutation MarkAllNotificationsRead {
    markAllNotificationsRead
  }
`;

export const UPDATE_NOTIFICATION_PREFS_MUTATION = /* GraphQL */ `
  mutation UpdateNotificationPrefs($prefs: JSON!) {
    updateNotificationPrefs(prefs: $prefs)
  }
`;

export const CREATE_CHECKOUT_SESSION_MUTATION = /* GraphQL */ `
  mutation CreateCheckoutSession(
    $planId: ID!
    $period: String!
    $provider: String!
    $successUrl: String!
    $cancelUrl: String!
  ) {
    createCheckoutSession(
      planId: $planId
      period: $period
      provider: $provider
      successUrl: $successUrl
      cancelUrl: $cancelUrl
    ) {
      sessionId
      checkoutUrl
    }
  }
`;

export const CANCEL_SUBSCRIPTION_MUTATION = /* GraphQL */ `
  mutation CancelSubscription($reason: String) {
    cancelSubscription(reason: $reason) {
      id
      state
      cancelAtPeriodEnd
      currentPeriodEnd
    }
  }
`;

export const REACTIVATE_SUBSCRIPTION_MUTATION = /* GraphQL */ `
  mutation ReactivateSubscription {
    reactivateSubscription {
      id
      state
      cancelAtPeriodEnd
    }
  }
`;
