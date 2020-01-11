export interface PersistentAttributes {
  profile?: {
    isFirstTimeOnboarded: boolean;
  };
  activity?: {
    playedPodcastEpisodes: number[];
  };
}

export interface SessionAttributes {
  isWaitingForAnAnswer: boolean;
  askedQuestionKey: string | undefined;
}
