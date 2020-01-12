import { interfaces } from 'ask-sdk-model';
import AudioItemMetadata = interfaces.audioplayer.AudioItemMetadata;
import { Podcast } from '../model/podcastModel';

export function getPodcastMetadata(podcast: Podcast): AudioItemMetadata {
  return {
    title: podcast.title,
    subtitle: podcast.itunes.summary,
    art: {
      sources: [{ url: podcast.itunes.image, size: 'SMALL' }]
    },
    backgroundImage: {
      sources: [{ url: podcast.itunes.image, size: 'LARGE' }]
    }
  };
}

export function determineEpisodeFromIndex(
  index: number,
  podcasts: Podcast[]
): number {
  return podcasts[index].itunes.episode;
}

export function determineIndexFromEpisode(
  episode: number,
  podcasts: Podcast[]
): number {
  return podcasts.findIndex(value => value.itunes.episode === episode);
}

export function getRandomPodcastIndex(
  podcasts: Podcast[],
  excludedEpisodes: number[]
): number {
  const uniqueExcludedEpisodes = excludedEpisodes.filter(
    (x, i, a) => a.indexOf(x) == i
  );
  const index = Math.floor(Math.random() * podcasts.length);
  if (uniqueExcludedEpisodes.length === podcasts.length) {
    return index;
  }
  const episode = determineEpisodeFromIndex(index, podcasts);
  return excludedEpisodes.includes(episode)
    ? getRandomPodcastIndex(podcasts, excludedEpisodes)
    : index;
}
