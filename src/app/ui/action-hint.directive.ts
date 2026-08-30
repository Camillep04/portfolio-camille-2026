import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  inject,
} from '@angular/core';

/**
 * Desktop affordance: on hover (or keyboard focus) float a short label just
 * below a control that takes the visitor *off* the portfolio — an external
 * link ("Nouvel onglet") or a file download ("Téléchargement"). Only those:
 * the hint's whole job is to flag "this leaves the site" before the click, so
 * anything that stays in the app (in-app routes, the lightbox, the in-site
 * video player, the hearts) is left unmarked.
 *
 * Pointer hint only: it needs a real cursor, so it stays off on touch
 * (`hover: hover` + `pointer: fine`), where a control is discovered by tapping.
 * The tip is `aria-hidden` — every host already carries its own text or
 * `aria-label`, so a screen reader is never told twice.
 *
 * The tip is one `<div>` appended to `<body>` (so a clipped or `transform`ed
 * ancestor can't hide it) positioned `fixed` against the host's rect. Styling
 * lives in `src/styles.css` (`.action-hint`) because the node is outside every
 * component's view.
 */
@Directive({
  selector: '[appActionHint]',
  standalone: true,
})
export class ActionHintDirective implements OnDestroy {
  /** What a click does, already translated. Empty/blank disables the hint. */
  @Input('appActionHint') hint = '';

  private readonly host =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  private tip?: HTMLElement;

  private readonly canHover =
    typeof matchMedia === 'function' &&
    matchMedia('(hover: hover) and (pointer: fine)').matches;

  @HostListener('mouseenter')
  @HostListener('focus')
  show(): void {
    if (!this.canHover || !this.hint.trim() || this.tip) {
      return;
    }

    const tip = document.createElement('div');
    tip.className = 'action-hint';
    tip.setAttribute('aria-hidden', 'true');
    tip.textContent = this.hint;
    document.body.appendChild(tip);
    this.tip = tip;
    this.place();
  }

  @HostListener('mouseleave')
  @HostListener('blur')
  @HostListener('click')
  hide(): void {
    this.tip?.remove();
    this.tip = undefined;
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  reposition(): void {
    if (this.tip) {
      this.place();
    }
  }

  ngOnDestroy(): void {
    this.hide();
  }

  /** Centre the tip under the host, pulled back inside the viewport edges. */
  private place(): void {
    const tip = this.tip;
    if (!tip) {
      return;
    }

    const r = this.host.getBoundingClientRect();
    const margin = 8;
    const gap = 10;

    let left = r.left + r.width / 2 - tip.offsetWidth / 2;
    left = Math.max(
      margin,
      Math.min(left, window.innerWidth - tip.offsetWidth - margin),
    );

    tip.style.left = `${left}px`;
    tip.style.top = `${r.bottom + gap}px`;
  }
}
