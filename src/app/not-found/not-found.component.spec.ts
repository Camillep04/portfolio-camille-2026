import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { NotFoundComponent } from './not-found.component';
import { LanguageService } from '../i18n/language.service';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  beforeEach(async () => {
    localStorage.removeItem('camille-portfolio:lang');

    await TestBed.configureTestingModule({
      imports: [NotFoundComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.removeItem('camille-portfolio:lang');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('offers internal routes back into the site', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const hrefs = Array.from(compiled.querySelectorAll('.actions a')).map(a =>
      a.getAttribute('href'),
    );
    expect(hrefs).toEqual(['/', '/projets', '/contact']);
  });

  it('translates its copy with the language toggle', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const heading = () => compiled.querySelector('h1')?.textContent?.trim();

    expect(heading()).toBe("Cette page n'est pas au catalogue");
    TestBed.inject(LanguageService).toggle();
    fixture.detectChanges();
    expect(heading()).toBe("This page isn't in the catalogue");
  });
});
