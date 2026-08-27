import { TestBed } from '@angular/core/testing';

import { LanguageService } from './language.service';

const STORAGE_KEY = 'camille-portfolio:lang';

describe('LanguageService', () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
    document.documentElement.lang = 'fr';
  });

  afterEach(() => {
    localStorage.removeItem(STORAGE_KEY);
  });

  function make(): LanguageService {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    return TestBed.inject(LanguageService);
  }

  it('defaults to French when nothing is stored', () => {
    expect(make().lang()).toBe('fr');
  });

  it('toggles between the two languages and reflects it on <html lang>', () => {
    const svc = make();
    svc.toggle();
    expect(svc.lang()).toBe('en');
    expect(document.documentElement.lang).toBe('en');
    svc.toggle();
    expect(svc.lang()).toBe('fr');
    expect(document.documentElement.lang).toBe('fr');
  });

  it('remembers the choice across instances via localStorage', () => {
    make().set('en');
    expect(make().lang()).toBe('en');
  });

  it('translates a UI key for the current language', () => {
    const svc = make();
    expect(svc.t('nav.home')).toBe('Accueil');
    svc.set('en');
    expect(svc.t('nav.home')).toBe('Home');
  });

  it('picks the right side of a {fr,en} pair and falls back to fr', () => {
    const svc = make();
    expect(svc.tc({ fr: 'Chat', en: 'Cat' })).toBe('Chat');
    svc.set('en');
    expect(svc.tc({ fr: 'Chat', en: 'Cat' })).toBe('Cat');
    expect(svc.tc({ fr: 'Seulement FR', en: '' })).toBe('Seulement FR');
  });
});
