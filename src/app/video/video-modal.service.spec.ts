import { TestBed } from '@angular/core/testing';

import { VideoModalService } from './video-modal.service';

describe('VideoModalService', () => {
  let service: VideoModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoModalService);
  });

  it('starts closed', () => {
    expect(service.videoId()).toBeNull();
  });

  it('open() sets the id and close() clears it', () => {
    service.open('yZl2QbWaGJA');
    expect(service.videoId()).toBe('yZl2QbWaGJA');
    service.close();
    expect(service.videoId()).toBeNull();
  });
});
