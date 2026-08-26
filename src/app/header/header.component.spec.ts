import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should route internally rather than reloading the page', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const menu = Array.from(compiled.querySelectorAll('#navbar-menu a'));
    expect(menu.map(a => a.getAttribute('href'))).toEqual([
      '/', '/audiovisuel', '/photo', '/contact', 'img/CV_camille_2026.pdf'
    ]);
    expect(compiled.querySelector('.navbar-brand')?.getAttribute('href')).toBe('/');
  });
});
