export interface PersistentAttributes {
  profile: {
    isFirstTimeOnboarded: boolean;
  };
}

export interface SessionAttributes {
  isWaitingForAnAnswer: boolean;
  askedQuestionKey: string;
}
