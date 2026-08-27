import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { EDUCATION, EXPERIENCES } from '../data/cv';

const WORDS = ['vidéo', 'photo', 'cinéma', 'création', 'développement', ':)'];
const TYPE_MS = 75;
const ERASE_MS = 25;
const PAUSE_MS = 1000;

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent implements OnInit, OnDestroy {
  /** The word being typed in the hero. Was public/js/indexCam.js, which only
   *  ran on DOMContentLoaded and so stayed empty after a client-side
   *  navigation back to this page. */
  typed = '';

  readonly experiences = EXPERIENCES;
  readonly education = EDUCATION;

  private wordIndex = 0;
  private timer?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.type();
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }

  private type(): void {
    const word = WORDS[this.wordIndex];
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
      this.wordIndex = (this.wordIndex + 1) % WORDS.length;
      this.timer = setTimeout(() => this.type(), TYPE_MS);
    }
  }
}
