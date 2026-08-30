import { Injectable, signal } from '@angular/core';

/**
 * Holds which YouTube video (if any) is playing in the in-site popup player.
 *
 * `videoId` is a signal: `null` means the modal is closed, a string is the
 * id currently showing. `AppComponent` intercepts clicks on YouTube links and
 * calls `open()`; `VideoModalComponent` reads the signal and renders itself.
 * Kept as a root service so any component could open the player later without
 * threading inputs through the tree.
 */
@Injectable({ providedIn: 'root' })
export class VideoModalService {
  readonly videoId = signal<string | null>(null);

  open(id: string): void {
    this.videoId.set(id);
  }

  close(): void {
    this.videoId.set(null);
  }
}
