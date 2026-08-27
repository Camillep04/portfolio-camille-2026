import { Injectable, signal } from '@angular/core';

import { UI, type Lang, type Localized, type UiKey } from './translations';

const STORAGE_KEY = 'camille-portfolio:lang';

/**
 * Holds the current language and translates.
 *
 * The site is French by default; English is opt-in through the header toggle
 * and remembered per visitor in `localStorage`. There is no browser-language
 * sniffing on purpose — the default is predictable and the toggle is the one
 * discovery path.
 *
 * `lang` is a signal, and `t()` / `tc()` read it, so a template that calls
 * either re-renders when the toggle flips.
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly lang = signal<Lang>(this.readStored());

  constructor() {
    this.reflectOnDocument(this.lang());
  }

  set(lang: Lang): void {
    this.lang.set(lang);
    this.reflectOnDocument(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* private mode / storage disabled — the choice just won't persist */
    }
  }

  toggle(): void {
    this.set(this.lang() === 'fr' ? 'en' : 'fr');
  }

  /** A key from the UI string table (`translations.ts`). */
  t(key: UiKey): string {
    return UI[this.lang()][key] ?? UI.fr[key] ?? key;
  }

  /** A `{ fr, en }` pair from the content data. Falls back to French. */
  tc(value: Localized): string {
    return value[this.lang()] || value.fr;
  }

  private readStored(): Lang {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'fr' || saved === 'en') {
        return saved;
      }
    } catch {
      /* ignore */
    }
    return 'fr';
  }

  private reflectOnDocument(lang: Lang): void {
    try {
      document.documentElement.lang = lang;
    } catch {
      /* no document (unit test env with a stripped DOM) */
    }
  }
}
