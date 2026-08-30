import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionHintDirective } from './action-hint.directive';

@Component({
  standalone: true,
  imports: [ActionHintDirective],
  template: `<button type="button" [appActionHint]="hint">Go</button>`,
})
class HostComponent {
  hint = 'Nouvel onglet';
}

describe('ActionHintDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let button: HTMLButtonElement;

  const tip = () => document.body.querySelector('.action-hint');

  beforeEach(async () => {
    // Force the "real cursor" branch — headless Chrome's pointer capabilities
    // are not guaranteed.
    spyOn(window, 'matchMedia').and.returnValue({
      matches: true,
      addEventListener: () => {},
      removeEventListener: () => {},
    } as unknown as MediaQueryList);

    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    button = fixture.nativeElement.querySelector('button');
  });

  afterEach(() => {
    document.body.querySelectorAll('.action-hint').forEach(n => n.remove());
  });

  it('shows the hint text on mouseenter and clears it on mouseleave', () => {
    button.dispatchEvent(new MouseEvent('mouseenter'));
    expect(tip()?.textContent).toBe('Nouvel onglet');

    button.dispatchEvent(new MouseEvent('mouseleave'));
    expect(tip()).toBeNull();
  });

  it('removes the hint on click, so it does not linger after navigating', () => {
    button.dispatchEvent(new MouseEvent('mouseenter'));
    expect(tip()).not.toBeNull();

    button.click();
    expect(tip()).toBeNull();
  });

  it('shows nothing when the hint string is blank', () => {
    fixture.componentInstance.hint = '   ';
    fixture.detectChanges();

    button.dispatchEvent(new MouseEvent('mouseenter'));
    expect(tip()).toBeNull();
  });

  it('cleans up the tip when the host is destroyed', () => {
    button.dispatchEvent(new MouseEvent('mouseenter'));
    expect(tip()).not.toBeNull();

    fixture.destroy();
    expect(tip()).toBeNull();
  });
});
