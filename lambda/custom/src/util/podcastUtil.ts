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
