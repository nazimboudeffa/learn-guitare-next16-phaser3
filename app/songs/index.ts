
import song1 from './song-1.json';
import song2 from './song-2.json';

export interface Song {
  slug: string;
  name?: string;
  title?: string;
  description?: string;
  level?: string;
}

const songs: Song[] = [
  { slug: 'song-1', ...song1 },
  { slug: 'song-2', ...song2 },
];

export function getSongs(): Song[] {
  return songs;
}
