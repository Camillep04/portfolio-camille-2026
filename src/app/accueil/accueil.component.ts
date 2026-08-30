import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TIMELINE } from '../data/cv';
import { PHOTOS } from '../data/photos';
import { LanguageService } from '../i18n/language.service';
import { ActionHintDirective } from '../ui/action-hint.directive';

/** Hero typewriter words, one list per language. Keep the two the same length
 *  so the rotating index never falls off the end when the language changes. */
const WORDS: Record<'fr' | 'en', string[]> = {
  fr: ['vidéo', 'photo', 'cinéma', 'création', 'développement', ':)'],
  en: ['video', 'photo', 'cinema', 'creating', 'coding', ':)'],
};
const TYPE_MS = 75;
const ERASE_MS = 25;
const PAUSE_MS = 1000;

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [RouterLink, ActionHintDirective],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent implements OnInit, OnDestroy {
  readonly i18n = inject(LanguageService);

  /** The word being typed in the hero. Was public/js/indexCam.js, which only
   *  ran on DOMContentLoaded and so stayed empty after a client-side
   *  navigation back to this page. */
  typed = '';

  /** Experiences and formations woven into one chronological strand for the
   *  "parcours" section — see `TIMELINE` in `data/cv.ts`. */
  readonly timeline = TIMELINE;

  /** The five teaser polaroids echo the first five gallery photos — driven
   *  from the same data so the titles translate and never drift. */
  readonly polaroids = PHOTOS.slice(0, 5);

  private wordIndex = 0;
  private timer?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.type();
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }

  private type(): void {
    const word = WORDS[this.i18n.lang()][this.wordIndex];
    if (this.typed.length < word.length) {
      this.typed = word.slice(0, this.typed.length + 1);
      this.timer = setTimeout(() => this.type(), TYPE_MS);
    } else {
      this.timer = setTimeout(() => this.erase(), PAUSE_MS);
    }
  }

  private erase(): void {
    if (this.typed.length > 0) {
      this.typed = this.typed.slice(0, -1);
      this.timer = setTimeout(() => this.erase(), ERASE_MS);
    } else {
      const count = WORDS[this.i18n.lang()].length;
      this.wordIndex = (this.wordIndex + 1) % count;
      this.timer = setTimeout(() => this.type(), TYPE_MS);
    }
  }
}
