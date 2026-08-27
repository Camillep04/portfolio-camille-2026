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
});
