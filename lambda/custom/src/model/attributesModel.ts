export interface PersistentAttributes {
  profile?: {
    isFirstTimeOnboarded: boolean;
  };
  activity?: {
    playedPodcastEpisodes?: number[];
    pausedPodcast?: {
      offset: number;
      episode: number;
    };
  };
}

export interface SessionAttributes {
  isWaitingForAnAnswer: boolean;
  askedQuestionKey: string | undefined;
}
