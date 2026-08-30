import {
  Component,
  HostListener,
  computed,
  effect,
  inject,
} from '@angular/core';
import { DomSanitizer, type SafeResourceUrl } from '@angular/platform-browser';

import { LanguageService } from '../i18n/language.service';
import { VideoModalService } from './video-modal.service';

/**
 * The in-site YouTube player. Rendered once, in `AppComponent`, and invisible
 * until `VideoModalService` holds a video id.
 *
 * A visitor never has to leave the portfolio to watch a video: every YouTube
 * link on the site is intercepted (see `AppComponent`) and opens here instead,
 * in a `youtube-nocookie.com` embed. Closes on the ✕, a backdrop click or
 * Escape. Locks body scroll while open.
 */
@Component({
  selector: 'app-video-modal',
  standalone: true,
  imports: [],
  templateUrl: './video-modal.component.html',
  styleUrl: './video-modal.component.css',
})
export class VideoModalComponent {
  private readonly modal = inject(VideoModalService);
  private readonly sanitizer = inject(DomSanitizer);
  readonly i18n = inject(LanguageService);

  readonly videoId = this.modal.videoId;

  readonly embedUrl = computed<SafeResourceUrl | null>(() => {
    const id = this.videoId();
    if (!id) {
      return null;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`,
    );
  });

  constructor() {
    effect(() => {
      const open = this.videoId() !== null;
      try {
        document.body.classList.toggle('video-modal-open', open);
      } catch {
        /* no document (unit test env with a stripped DOM) */
      }
    });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.modal.close();
  }

  close(): void {
    this.modal.close();
  }
}
