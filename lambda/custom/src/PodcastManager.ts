import * as Parser from 'rss-parser';
import { Podcast } from './model/podcastModel';
import { HandlerInput } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import {
  determineEpisodeFromIndex,
  getPodcastMetadata
} from './util/podcastUtil';
import { t } from './util/attributesUtil';

export class PodcastManager {
  private podcasts: Podcast[] | null | undefined = undefined;
  private parser: Parser;
  private podcastIndex: number;

  constructor() {
    this.podcastIndex = 0;
    this.parser = new Parser();
  }

  public async fetchPodcasts(): Promise<void> {
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
      }
    );
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

  public playRandomPodcast(
    input: HandlerInput,
    callback: (episode: number) => void
  ): Response | Promise<Response> {
    const randomIndex = Math.floor(Math.random() * this.podcasts!.length - 1);
    const episode = determineEpisodeFromIndex(randomIndex, this.podcasts!);
    callback(episode);
    return this.playPodcast(input, randomIndex);
  }

  public playLatestPodcast(
    input: HandlerInput,
    callback: (episode: number) => void
  ): Response | Promise<Response> {
    const latestPodastIndex = 0;
    callback(latestPodastIndex);
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
          podcast.episode.toString(),
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

  public hasFetchedPodcastsSuccessfully() {
    return Boolean(this.podcasts);
  }

  hasUserListenedToLatestPodcast(listenedPodcastsTokens: number[]) {
    return listenedPodcastsTokens.includes(this.podcasts![0].episode);
  }
}
