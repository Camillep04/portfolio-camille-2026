import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoComponent } from './photo.component';
import { PHOTOS } from '../data/photos';

describe('PhotoComponent', () => {
  let component: PhotoComponent;
  let fixture: ComponentFixture<PhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.close();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders one thumbnail per photo', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelectorAll('.gallery .item').length).toBe(PHOTOS.length);
  });

  it('uses the photo title as the image alt text', () => {
    const el: HTMLElement = fixture.nativeElement;
    const firstAlt = el.querySelector('.gallery .item img')?.getAttribute('alt');
    expect(firstAlt).toBe(PHOTOS[0].title);
  });

  it('opens the lightbox on the clicked photo and closes it', () => {
    const el: HTMLElement = fixture.nativeElement;
    (el.querySelectorAll('.gallery .item .btn')[2] as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(component.activeIndex).toBe(2);
    const caption = el.querySelector('.lightbox-title')?.textContent?.trim();
    expect(caption).toBe(PHOTOS[2].title);

    (el.querySelector('.lightbox-close') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(el.querySelector('.lightbox')).toBeNull();
  });

  it('wraps around when browsing past the ends', () => {
    component.open(0);
    component.prev();
    expect(component.activeIndex).toBe(PHOTOS.length - 1);
    component.next();
    expect(component.activeIndex).toBe(0);
  });

  it('shows the description only when the active photo has one', () => {
    const withDesc = PHOTOS.findIndex((p) => p.description);
    const withoutDesc = PHOTOS.findIndex((p) => !p.description);
    const el: HTMLElement = fixture.nativeElement;

    if (withoutDesc !== -1) {
      component.open(withoutDesc);
      fixture.detectChanges();
      expect(el.querySelector('.lightbox-desc')).toBeNull();
    }
    if (withDesc !== -1) {
      component.open(withDesc);
      fixture.detectChanges();
      expect(el.querySelector('.lightbox-desc')?.textContent?.trim()).toBe(PHOTOS[withDesc].description);
    }
  });

  it('links the Instagram call to action to the real profile', () => {
    const el: HTMLElement = fixture.nativeElement;
    const href = el.querySelector('.instagram-cta a')?.getAttribute('href');
    expect(href).toBe('https://www.instagram.com/p___camille/');
  });
});
