import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { VideoModalService } from './video/video-modal.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  afterEach(() => {
    TestBed.inject(VideoModalService).close();
    document.body.classList.remove('video-modal-open');
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'Camille Portfolio' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Camille Portfolio');
  });

  it('should render the header and the footer around the router outlet', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-header')).toBeTruthy();
    expect(compiled.querySelector('app-footer')).toBeTruthy();
  });

  /** Click `href` via a real anchor on `document`, without letting karma's own
   *  page actually navigate. The guard is registered on `document` *after*
   *  the component, so it runs after our handler and only mops up navigation
   *  our handler chose to leave alone. */
  function clickLink(href: string): void {
    const link = document.createElement('a');
    link.setAttribute('href', href);
    document.body.appendChild(link);
    const guard = (e: Event) => e.preventDefault();
    document.addEventListener('click', guard);
    try {
      link.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      );
    } finally {
      document.removeEventListener('click', guard);
      document.body.removeChild(link);
    }
  }

  it('intercepts a plain click on a YouTube link and opens the in-site player', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    clickLink('https://youtu.be/PTsqr9EgMaY');

    expect(TestBed.inject(VideoModalService).videoId()).toBe('PTsqr9EgMaY');
  });

  it('leaves non-YouTube links alone', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    clickLink('https://skfb.ly/pEKVW');

    expect(TestBed.inject(VideoModalService).videoId()).toBeNull();
  });
});
