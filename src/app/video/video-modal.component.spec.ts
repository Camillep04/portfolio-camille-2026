import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoModalComponent } from './video-modal.component';
import { VideoModalService } from './video-modal.service';

describe('VideoModalComponent', () => {
  let fixture: ComponentFixture<VideoModalComponent>;
  let modal: VideoModalService;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoModalComponent);
    modal = TestBed.inject(VideoModalService);
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    modal.close();
    document.body.classList.remove('video-modal-open');
  });

  it('renders nothing while closed', () => {
    expect(el.querySelector('.video-backdrop')).toBeNull();
    expect(document.body.classList.contains('video-modal-open')).toBe(false);
  });

  it('shows a nocookie embed for the open video and locks body scroll', () => {
    modal.open('yZl2QbWaGJA');
    fixture.detectChanges();

    const frame = el.querySelector('iframe') as HTMLIFrameElement;
    expect(frame).toBeTruthy();
    expect(frame.src).toContain('youtube-nocookie.com/embed/yZl2QbWaGJA');
    expect(document.body.classList.contains('video-modal-open')).toBe(true);
  });

  it('close() dismisses the player and releases body scroll', () => {
    modal.open('yZl2QbWaGJA');
    fixture.detectChanges();

    fixture.componentInstance.close();
    fixture.detectChanges();

    expect(el.querySelector('.video-backdrop')).toBeNull();
    expect(document.body.classList.contains('video-modal-open')).toBe(false);
  });

  it('Escape closes the player', () => {
    modal.open('yZl2QbWaGJA');
    fixture.detectChanges();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();

    expect(el.querySelector('.video-backdrop')).toBeNull();
  });
});
