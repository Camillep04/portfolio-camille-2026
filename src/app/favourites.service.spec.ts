import { TestBed } from '@angular/core/testing';

import { FavouritesService } from './favourites.service';

const STORAGE_KEY = 'camille-portfolio:favourites';

describe('FavouritesService', () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    localStorage.removeItem(STORAGE_KEY);
  });

  it('toggles a favourite on and off', () => {
    const svc = TestBed.inject(FavouritesService);
    expect(svc.has('showreel')).toBe(false);
    svc.toggle('showreel');
    expect(svc.has('showreel')).toBe(true);
    svc.toggle('showreel');
    expect(svc.has('showreel')).toBe(false);
  });

  it('persists favourites to localStorage', () => {
    const svc = TestBed.inject(FavouritesService);
    svc.toggle('room-tour');
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual(['room-tour']);
  });

  it('reads existing favourites from localStorage on creation', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['wrong-guy']));
    const svc = TestBed.inject(FavouritesService);
    expect(svc.has('wrong-guy')).toBe(true);
  });

  it('tolerates malformed stored data', () => {
    localStorage.setItem(STORAGE_KEY, 'not json');
    const svc = TestBed.inject(FavouritesService);
    expect(svc.has('anything')).toBe(false);
  });
});
