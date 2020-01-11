import * as Parser from 'rss-parser';
import { Podcast } from './model/podcastModel';
import { HandlerInput } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import { getPodcastMetadata } from './util/podcastUtil';
import { t } from './util/attributesUtil';

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

  public getNextPodcast() {
    if (this.podcasts !== null) {
      this.podcastIndex++;
      if (this.podcastIndex === this.podcasts!.length) {
        this.podcastIndex = 0;
      }
      return this.podcasts![this.podcastIndex];
    }
  }

  public playRandomPodcast(input: HandlerInput): Response | Promise<Response> {
    if (this.podcasts === undefined) {
      return new Promise(resolve => {
        this.fetchPodcasts(podcasts => {
          // TODO undefined podcasts value
          this.podcasts = podcasts;
          resolve(
            this.playPodcast(
              input,
              Math.floor(Math.random() * podcasts!.length - 1)
            )
          );
        });
      });
    } else {
      return this.playPodcast(
        input,
        Math.floor(Math.random() * this.podcasts!.length - 1)
      );
    }
  }

  public playLatestPodcast(input: HandlerInput): Response | Promise<Response> {
    if (this.podcasts === undefined) {
      return new Promise(resolve => {
        this.fetchPodcasts(podcasts => {
          this.podcasts = podcasts;
          resolve(this.playPodcast(input, 0));
        });
      });
    } else {
      return this.playPodcast(input, 0);
    }
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
