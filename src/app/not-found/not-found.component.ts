import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { LanguageService } from '../i18n/language.service';

/** Frames per second for the decorative SMPTE timecode readout. */
const FPS = 25;

/**
 * The catch-all page for any URL that is not one of the four real routes
 * (`{ path: '**' }` in `app.routes.ts`). Design: Camille's "perte de signal"
 * mock — a glitching 404 on a dark film-set backdrop.
 *
 * The running timecode at the foot is purely decorative. It ticks 25 times a
 * second, so it runs *outside* the Angular zone and writes straight to the DOM
 * element — otherwise it would drive a change-detection pass every 40ms for the
 * whole app while this page is open.
 */
@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
})
export class NotFoundComponent implements AfterViewInit, OnDestroy {
  readonly i18n = inject(LanguageService);

  @ViewChild('timecode') private timecode?: ElementRef<HTMLElement>;

  private readonly zone = inject(NgZone);
  private frame = 0;
  private ticker?: ReturnType<typeof setInterval>;

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.ticker = setInterval(() => this.tick(), 1000 / FPS);
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.ticker);
  }

  private tick(): void {
    const el = this.timecode?.nativeElement;
    if (!el) {
      return;
    }
    this.frame++;
    const pad = (n: number) => String(n).padStart(2, '0');
    const frames = this.frame % FPS;
    const seconds = Math.floor(this.frame / FPS) % 60;
    const minutes = Math.floor(this.frame / (FPS * 60)) % 60;
    const hours = Math.floor(this.frame / (FPS * 3600));
    el.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
  }
}
