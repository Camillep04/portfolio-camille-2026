import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AccueilComponent } from './accueil.component';
import { EDUCATION, EXPERIENCES } from '../data/cv';

describe('AccueilComponent', () => {
  let component: AccueilComponent;
  let fixture: ComponentFixture<AccueilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccueilComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccueilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should type the hero word one letter at a time', () => {
    expect(component.typed).toBe('v');
  });

  it('renders one parcours card per experience and per formation', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelectorAll('#parcours .tl-item.is-experience').length)
      .toBe(EXPERIENCES.length);
    expect(el.querySelectorAll('#parcours .tl-item.is-formation').length)
      .toBe(EDUCATION.length);
    expect(el.querySelectorAll('#parcours .tl-item').length)
      .toBe(EXPERIENCES.length + EDUCATION.length);
  });

  it('orders the parcours strand most recent first', () => {
    const el: HTMLElement = fixture.nativeElement;
    const years = Array.from(el.querySelectorAll('#parcours .tl-year'))
      .map((n) => Number(n.textContent));
    expect(years).toEqual([...years].sort((a, b) => b - a));
  });

  it('has no duplicate section ids', () => {
    const el: HTMLElement = fixture.nativeElement;
    const ids = Array.from(el.querySelectorAll('section[id]')).map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
