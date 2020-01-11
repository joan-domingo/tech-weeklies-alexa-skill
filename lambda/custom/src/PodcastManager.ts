import * as Parser from 'rss-parser';
import { Podcast } from './model/podcastModel';
import { HandlerInput } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import {
  determineEpisodeFromIndex,
  getPodcastMetadata
} from './util/podcastUtil';
import { saveListenedPodcastEpisode, t } from './util/attributesUtil';
import { PersistentAttributes } from './model/attributesModel';

export class PodcastManager {
  private podcasts: Podcast[] | null | undefined = undefined;
  private parser: Parser;
  private podcastIndex: number;

  constructor() {
    this.podcastIndex = 0;
    this.parser = new Parser();
  }

  public async fetchPodcasts(): Promise<Podcast[] | null> {
    return new Promise(resolve => {
      this.parser.parseURL(
        'https://feed.podbean.com/techweeklies-podcast.futurice.com/feed.xml',
        (err: Error, feed: Parser.Output) => {
          if (err) {
            this.podcasts = null;
          } else {
            this.podcasts = (feed.items as Podcast[]).filter((item: Podcast) =>
              item.enclosure.type.includes('audio')
            );
          }
          resolve(this.podcasts);
        }
      );
    });
  }

  public getNextPodcast() {
    if (this.podcasts !== null) {
      this.podcastIndex++;
      if (this.podcastIndex === this.podcasts!.length) {
        this.podcastIndex = 0;
      }
      return this.podcasts![this.podcastIndex];
    }
  }

  public async playRandomPodcast(
    input: HandlerInput,
    persistentAttributes: PersistentAttributes
  ): Promise<Response> {
    const randomIndex = Math.floor(Math.random() * this.podcasts!.length - 1);
    const episode = determineEpisodeFromIndex(randomIndex, this.podcasts!);

    await saveListenedPodcastEpisode(episode, persistentAttributes, input);

    return this.playPodcast(input, randomIndex);
  }

  public async playLatestPodcast(
    input: HandlerInput,
    persistentAttributes: PersistentAttributes
  ): Promise<Response> {
    const latestPodastIndex = 0;
    const episode = determineEpisodeFromIndex(
      latestPodastIndex,
      this.podcasts!
    );
    await saveListenedPodcastEpisode(episode, persistentAttributes, input);

    return this.playPodcast(input, latestPodastIndex);
  }

  private playPodcast(input: HandlerInput, index: number): Response {
    if (this.podcasts) {
      const podcast = this.podcasts[index];
      const speakOutput = `${t(input, 'PLAYING')} ${podcast.title}`;
      return input.responseBuilder
        .speak(speakOutput)
        .addAudioPlayerPlayDirective(
          'REPLACE_ALL',
          podcast.enclosure.url,
          podcast.itunes.episode.toString(),
          0,
          undefined,
          getPodcastMetadata(podcast)
        )
        .withStandardCard(
          podcast.title,
          podcast.itunes.summary,
          podcast.itunes.image,
          podcast.itunes.image
        )
        .withShouldEndSession(true)
        .getResponse();
    }
    return input.responseBuilder
      .speak(input.attributesManager.getRequestAttributes().t('GOODBYE_MSG'))
      .withShouldEndSession(true)
      .getResponse();
  }

  hasUserListenedToLatestPodcast(listenedPodcastsTokens: number[]) {
    return listenedPodcastsTokens.includes(this.podcasts![0].itunes.episode);
  }
}
