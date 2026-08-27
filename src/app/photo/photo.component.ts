import { Component, HostListener, inject } from '@angular/core';

import { PHOTOS } from '../data/photos';
import { LanguageService } from '../i18n/language.service';

@Component({
  selector: 'app-photo',
  standalone: true,
  imports: [],
  templateUrl: './photo.component.html',
  styleUrl: './photo.component.css'
})
export class PhotoComponent {
  readonly photos = PHOTOS;
  readonly i18n = inject(LanguageService);

  /** Index into `photos` of the photo shown in the lightbox, or null when closed.
   *  A single Angular-driven dialog replaces the 35 Bootstrap modals — the
   *  carousel arrows need one reused dialog anyway, and `PHOTOS` array order is
   *  the browse order. */
  activeIndex: number | null = null;

  get activePhoto() {
    return this.activeIndex === null ? null : this.photos[this.activeIndex];
  }

  open(index: number): void {
    this.activeIndex = index;
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    this.activeIndex = null;
    document.body.style.overflow = '';
  }

  next(): void {
    if (this.activeIndex === null) return;
    this.activeIndex = (this.activeIndex + 1) % this.photos.length;
  }

  prev(): void {
    if (this.activeIndex === null) return;
    this.activeIndex = (this.activeIndex - 1 + this.photos.length) % this.photos.length;
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (this.activeIndex === null) return;
    if (event.key === 'Escape') this.close();
    else if (event.key === 'ArrowRight') this.next();
    else if (event.key === 'ArrowLeft') this.prev();
  }
}
