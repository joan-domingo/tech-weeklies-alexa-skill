export interface PersistentAttributes {
  profile?: {
    isFirstTimeOnboarded: boolean;
  };
  activity?: {
    playedPodcastEpisodes: string[];
  };
}

export interface SessionAttributes {
  isWaitingForAnAnswer: boolean;
  askedQuestionKey: string | undefined;
}
