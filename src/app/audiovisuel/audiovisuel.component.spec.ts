import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudiovisuelComponent } from './audiovisuel.component';
import { PROJECTS } from '../data/projects';

describe('AudiovisuelComponent', () => {
  let component: AudiovisuelComponent;
  let fixture: ComponentFixture<AudiovisuelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudiovisuelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AudiovisuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders one section per project, in array order', () => {
    const ids = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('main > section')
    ).map((s) => s.id);
    expect(ids).toEqual(PROJECTS.map((p) => p.id));
  });

  it('renders a link button only for projects that have a link', () => {
    const el: HTMLElement = fixture.nativeElement;
    const withButton = el.querySelectorAll('main > section .playstore-button').length;
    expect(withButton).toBe(PROJECTS.filter((p) => p.link).length);
  });

  it('alternates the image/info side', () => {
    const el: HTMLElement = fixture.nativeElement;
    const contents = Array.from(el.querySelectorAll('main > section .content'));
    contents.forEach((c, i) => {
      expect(c.classList.contains('reversed')).toBe(i % 2 === 1);
    });
  });

  it('toggles the heart on a project and reflects it in the DOM', () => {
    localStorage.removeItem('camille-portfolio:favourites');
    const el: HTMLElement = fixture.nativeElement;
    const firstHeart = el.querySelector('main > section .save_btn') as HTMLButtonElement;

    expect(firstHeart.classList.contains('is-favourite')).toBe(false);
    firstHeart.click();
    fixture.detectChanges();
    expect(firstHeart.classList.contains('is-favourite')).toBe(true);
    expect(firstHeart.getAttribute('aria-pressed')).toBe('true');

    firstHeart.click();
    fixture.detectChanges();
    expect(firstHeart.classList.contains('is-favourite')).toBe(false);
    localStorage.removeItem('camille-portfolio:favourites');
  });
});
