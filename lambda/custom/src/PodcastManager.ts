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
  private podcastIndex: number;

  constructor() {
    this.podcastIndex = 0;
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

  // TODO
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

  private playPodcast(
    input: HandlerInput,
    index: number,
    offset: number = 0
  ): Response {
    const podcast = this.podcasts![index];
    const speakOutput =
      offset > 0
        ? `${t(input, 'PLAYING')} ${podcast.title}`
        : `${t(input, 'RESUMING')} ${podcast.title}`;

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
