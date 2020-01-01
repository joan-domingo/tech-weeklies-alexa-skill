import * as Parser from 'rss-parser';
import { Podcast } from './model/podcastModel';

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
}
