export interface Podcast {
  title: string;
  itunes: Itunes;
  enclosure: Enclosure;
  guid: string;
}

export interface Itunes {
  summary: string;
  image: string;
}

export interface Enclosure {
  url: string;
  type: string;
}
