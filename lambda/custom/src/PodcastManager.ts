import * as Parser from 'rss-parser';
import { Podcast } from './model/podcastModel';
import { HandlerInput } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import { getPodcastMetadata } from './util/podcastUtil';

export class PodcastManager {
  private podcasts: Podcast[] | null | undefined = undefined;
  private parser: Parser;
  private podcastIndex: number;

  constructor() {
    this.podcastIndex = 0;
    this.parser = new Parser();
  }

  public fetchPodcasts(callback: (podcasts: Podcast[] | null) => void) {
    this.parser.parseURL(
      'https://feed.podbean.com/techweeklies-podcast.futurice.com/feed.xml',
      (err: Error, feed: Parser.Output) => {
        if (err) {
          callback(null);
        } else {
          const podcasts = feed.items as Podcast[];
          callback(
            podcasts.filter((item: Podcast) =>
              item.enclosure.type.includes('audio')
            )
          );
        }
      }
    );
  }

  public async getCurrentPodcast() {
    if (this.podcasts === undefined) {
      await this.fetchPodcasts(podcasts => {
        console.log('fetched podcasts: ', podcasts);
        this.podcasts = podcasts;
        if (podcasts === null) {
          return null;
        }
        return podcasts[this.podcastIndex];
      });
    }
    return this.podcasts![this.podcastIndex];
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

  public playCurrentPodcast(
    input: HandlerInput,
    speakOutputKey: string
  ): Response | Promise<Response> {
    if (this.podcasts === undefined) {
      return new Promise(resolve => {
        this.fetchPodcasts(podcasts => {
          this.podcasts = podcasts;
          resolve(this.playPodcast(input, speakOutputKey));
        });
      });
    } else {
      return this.playPodcast(input, speakOutputKey);
    }
  }

  private playPodcast(input: HandlerInput, speakOutputKey: string): Response {
    if (this.podcasts) {
      const podcast = this.podcasts[this.podcastIndex];
      return input.responseBuilder
        .speak(input.attributesManager.getRequestAttributes().t(speakOutputKey))
        .addAudioPlayerPlayDirective(
          'REPLACE_ALL',
          podcast.enclosure.url,
          podcast.guid,
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
}
