import { Component, HostListener, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { VideoModalComponent } from './video/video-modal.component';
import { VideoModalService } from './video/video-modal.service';
import { parseYouTubeId } from './video/youtube';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, VideoModalComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'Camille Portfolio';

  private readonly videoModal = inject(VideoModalService);

  /**
   * Any click on a YouTube link, anywhere on the site, opens the in-site
   * player instead of leaving for youtube.com. One handler covers the /projets
   * buttons, the inline links in project blurbs, and anything added later.
   *
   * Left alone: modified clicks (⌘/Ctrl/Shift/Alt, middle button) still open a
   * new tab, and if this listener never runs the links are ordinary
   * `target="_blank"` anchors — so the feature degrades to the old behaviour.
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const anchor = (event.target as HTMLElement | null)?.closest('a');
    const href = anchor?.getAttribute('href');
    if (!href) {
      return;
    }

    const id = parseYouTubeId(href);
    if (!id) {
      return;
    }

    event.preventDefault();
    this.videoModal.open(id);
  }
}
