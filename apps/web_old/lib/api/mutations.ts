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
