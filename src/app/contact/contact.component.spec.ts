import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.nativeElement as HTMLElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('embeds the Google Form with a title, fluidly sized', () => {
    const frame = el.querySelector('iframe.contact-form-frame') as HTMLIFrameElement;
    expect(frame).toBeTruthy();
    expect(frame.getAttribute('src')).toContain('docs.google.com/forms');
    expect(frame.title.length).toBeGreaterThan(0);
  });

  it('shows the CV download and exactly the three real social links, above the form', () => {
    const intro = el.querySelector('.contact-intro') as HTMLElement;
    expect(intro).toBeTruthy();
    expect(intro.querySelector('a[href$="CV_camille_2026.pdf"][download]')).toBeTruthy();
    expect(intro.querySelectorAll('.social-links a').length).toBe(3);
  });

  it('drops the leftover template placeholder links and headings', () => {
    expect(el.querySelector('.hm-foot-icon')).toBeNull();
    expect(el.querySelector('.txt')).toBeNull();
    expect(el.textContent).not.toContain('Camille PROTHIN');
  });
});
