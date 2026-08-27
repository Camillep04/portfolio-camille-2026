import { Injectable } from '@angular/core';

const STORAGE_KEY = 'camille-portfolio:favourites';

/**
 * Per-visitor "hearted" projects on /projets.
 *
 * A private favourite: the set lives only in this browser's localStorage, is
 * never sent anywhere, and no count is shown. localStorage (not a cookie) so
 * there is nothing to consent to. Every access is guarded — a private window or
 * blocked site data must not break the page, it just means favourites don't
 * persist.
 */
@Injectable({ providedIn: 'root' })
export class FavouritesService {
  private readonly ids = new Set<string>(this.read());

  has(id: string): boolean {
    return this.ids.has(id);
  }

  toggle(id: string): void {
    if (this.ids.has(id)) {
      this.ids.delete(id);
    } else {
      this.ids.add(id);
    }
    this.write();
  }

  private read(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
    } catch {
      return [];
    }
  }

  private write(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...this.ids]));
    } catch {
      // Storage unavailable (private mode, blocked): favourites are in-memory
      // only for this session, which is an acceptable degradation.
    }
  }
}
