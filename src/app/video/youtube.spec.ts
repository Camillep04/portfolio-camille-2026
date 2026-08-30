import { parseYouTubeId } from './youtube';

describe('parseYouTubeId', () => {
  it('reads the watch?v= form', () => {
    expect(parseYouTubeId('https://www.youtube.com/watch?v=yZl2QbWaGJA')).toBe(
      'yZl2QbWaGJA',
    );
  });

  it('reads the youtu.be short form, with and without tracking params', () => {
    expect(parseYouTubeId('https://youtu.be/PTsqr9EgMaY')).toBe('PTsqr9EgMaY');
    expect(
      parseYouTubeId('https://youtu.be/3YvoYxvwd28?si=L7W_pO-4BACyeDdd'),
    ).toBe('3YvoYxvwd28');
  });

  it('reads embed / shorts / v paths and m. hosts', () => {
    expect(parseYouTubeId('https://www.youtube.com/embed/oq8p9SE9Dm8')).toBe(
      'oq8p9SE9Dm8',
    );
    expect(parseYouTubeId('https://m.youtube.com/watch?v=oq8p9SE9Dm8')).toBe(
      'oq8p9SE9Dm8',
    );
    expect(parseYouTubeId('https://www.youtube.com/shorts/oq8p9SE9Dm8')).toBe(
      'oq8p9SE9Dm8',
    );
  });

  it('returns null for non-YouTube links, relative hrefs and junk', () => {
    expect(parseYouTubeId('https://skfb.ly/pEKVW')).toBeNull();
    expect(parseYouTubeId('https://www.inlive-sport.nc/')).toBeNull();
    expect(parseYouTubeId('/photo')).toBeNull();
    expect(parseYouTubeId('#')).toBeNull();
    expect(parseYouTubeId('not a url')).toBeNull();
    expect(parseYouTubeId('https://www.youtube.com/watch?v=tooshort')).toBeNull();
  });
});
