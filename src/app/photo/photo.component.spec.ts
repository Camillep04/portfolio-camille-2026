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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders one thumbnail and one modal per photo', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelectorAll('.gallery .item').length).toBe(PHOTOS.length);
    expect(el.querySelectorAll('.gallery .item .modal').length).toBe(PHOTOS.length);
  });

  it('gives every photo a unique modal id', () => {
    const el: HTMLElement = fixture.nativeElement;
    const ids = Array.from(el.querySelectorAll('.gallery .item .modal')).map((m) => m.id);
    expect(new Set(ids).size).toBe(PHOTOS.length);
  });

  it('uses the photo title as the image alt text', () => {
    const el: HTMLElement = fixture.nativeElement;
    const firstAlt = el.querySelector('.gallery .item img')?.getAttribute('alt');
    expect(firstAlt).toBe(PHOTOS[0].title);
  });
});
