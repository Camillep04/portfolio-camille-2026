/**
 * Pull the 11-character video id out of any shape of YouTube URL.
 *
 * Handles `youtube.com/watch?v=ID`, `youtu.be/ID`, `youtube.com/embed/ID`,
 * `/shorts/ID` and `/v/ID`, on `www.`, `m.` or bare hosts, with any trailing
 * query (`?si=`, `&t=`, playlist params). Returns `null` for anything else —
 * a non-YouTube link, a relative href, junk — so callers can treat `null` as
 * "not a YouTube link, leave it alone".
 */
export function parseYouTubeId(rawUrl: string): string | null {
  let url: URL;
  try {
    // The second arg only matters for relative hrefs; those resolve against a
    // host that is deliberately never YouTube, so they fall through to null.
    url = new URL(rawUrl, 'https://not-youtube.invalid');
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^(www\.|m\.)/, '');
  let id: string | null = null;

  if (host === 'youtu.be') {
    id = url.pathname.split('/')[1] ?? null;
  } else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    if (url.pathname === '/watch') {
      id = url.searchParams.get('v');
    } else {
      const match = url.pathname.match(/^\/(?:embed|shorts|v)\/([^/?#]+)/);
      id = match ? match[1] : null;
    }
  }

  return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
}
