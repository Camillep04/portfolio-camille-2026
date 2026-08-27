import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HeaderComponent } from './header.component';
import { LanguageService } from '../i18n/language.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    localStorage.removeItem('camille-portfolio:lang');

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.removeItem('camille-portfolio:lang');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should route internally rather than reloading the page', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const menu = Array.from(compiled.querySelectorAll('#navbar-menu a'));
    expect(menu.map(a => a.getAttribute('href'))).toEqual([
      '/', '/projets', '/photo', '/contact', 'img/CV_camille_2026.pdf'
    ]);
    expect(compiled.querySelector('.navbar-brand')?.getAttribute('href')).toBe('/');
  });

  it('leaves the five nav links untouched by the language toggle', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('#navbar-menu a').length).toBe(5);
    expect(compiled.querySelector('.lang-switch button')).not.toBeNull();
  });

  it('swaps the nav labels when the language is toggled', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const firstLink = () => compiled.querySelector('#navbar-menu a')?.textContent?.trim();

    expect(firstLink()).toBe('Accueil');
    TestBed.inject(LanguageService).toggle();
    fixture.detectChanges();
    expect(firstLink()).toBe('Home');
  });
});
