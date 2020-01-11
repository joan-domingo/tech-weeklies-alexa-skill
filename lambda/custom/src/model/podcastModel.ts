export interface Podcast {
  title: string;
  itunes: Itunes;
  enclosure: Enclosure;
}

export interface Itunes {
  summary: string;
  image: string;
  episode: number;
}

export interface Enclosure {
  url: string;
  type: string;
}
