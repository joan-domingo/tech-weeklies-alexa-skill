import * as Parser from 'rss-parser';
import { Podcast } from './model/podcastModel';
import { HandlerInput } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import {
  determineEpisodeFromIndex,
  determineIndexFromEpisode,
  getPodcastMetadata,
  getRandomPodcastIndex
} from './util/podcastUtil';
import {
  deletePausedPodcastEpisode,
  getPausedPodastEpisode,
  saveListenedPodcastEpisode,
  t
} from './util/attributesUtil';
import { PersistentAttributes } from './model/attributesModel';

export class PodcastManager {
  private podcasts: Podcast[] | null | undefined = undefined;
  private parser: Parser;

  constructor() {
    this.parser = new Parser();
  }

  public async fetchPodcasts(): Promise<Podcast[] | null> {
    return new Promise(resolve => {
      if (Boolean(this.podcasts)) {
        resolve(this.podcasts);
      } else {
        this.parser.parseURL(
          'https://feed.podbean.com/techweeklies-podcast.futurice.com/feed.xml',
          (err: Error, feed: Parser.Output) => {
            if (err) {
              this.podcasts = null;
            } else {
              this.podcasts = (feed.items as Podcast[]).filter(
                (item: Podcast) => item.enclosure.type.includes('audio')
              );
            }
            resolve(this.podcasts);
          }
        );
      }
    });
  }

  public async playRandomPodcast(
    input: HandlerInput,
    persistentAttributes: PersistentAttributes
  ): Promise<Response> {
    const randomIndex = getRandomPodcastIndex(
      this.podcasts!,
      persistentAttributes?.activity?.playedPodcastEpisodes || []
    );
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

  public async playPausedPodcast(
    input: HandlerInput,
    persistentAttributes: PersistentAttributes
  ): Promise<Response> {
    const { offset, episode } = getPausedPodastEpisode(persistentAttributes);
    const pausedIndex = determineIndexFromEpisode(episode, this.podcasts!);

    await deletePausedPodcastEpisode(persistentAttributes, input);

    return this.playPodcast(input, pausedIndex, offset);
  }

  public async playNextPodcast(
    input: HandlerInput,
    persistentAttributes: PersistentAttributes,
    currentEpisode: number
  ): Promise<Response> {
    const currentIndex = determineIndexFromEpisode(
      currentEpisode,
      this.podcasts!
    );
    const nextIndex = this.getNextIndex(currentIndex);
    const nextEpisode = determineEpisodeFromIndex(nextIndex, this.podcasts!);

    await saveListenedPodcastEpisode(nextEpisode, persistentAttributes, input);

    return this.playPodcast(input, nextIndex);
  }

  public async playPreviousPodcast(
    input: HandlerInput,
    persistentAttributes: PersistentAttributes,
    currentEpisode: number
  ): Promise<Response> {
    const currentIndex = determineIndexFromEpisode(
      currentEpisode,
      this.podcasts!
    );
    const previousIndex = this.getPrevioustIndex(currentIndex);
    const previousEpisode = determineEpisodeFromIndex(
      previousIndex,
      this.podcasts!
    );

    await saveListenedPodcastEpisode(
      previousEpisode,
      persistentAttributes,
      input
    );

    return this.playPodcast(input, previousIndex);
  }

  private getNextIndex(index: number) {
    index++;
    if (index === this.podcasts!.length) {
      index = 0;
    }
    return index;
  }

  private getPrevioustIndex(index: number) {
    index--;
    if (index === -1) {
      index = this.podcasts!.length - 1;
    }
    return index;
  }

  private playPodcast(
    input: HandlerInput,
    index: number,
    offset: number = 0
  ): Response {
    const podcast = this.podcasts![index];
    const speakOutput =
      offset > 0
        ? `${t(input, 'RESUMING')} ${podcast.title}`
        : `${t(input, 'PLAYING')} ${podcast.title}`;

    return input.responseBuilder
      .speak(speakOutput)
      .addAudioPlayerPlayDirective(
        'REPLACE_ALL',
        podcast.enclosure.url,
        podcast.itunes.episode.toString(),
        offset,
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

  public hasUserListenedToLatestPodcast(listenedPodcastsTokens: number[]) {
    return listenedPodcastsTokens.includes(this.podcasts![0].itunes.episode);
  }
}
