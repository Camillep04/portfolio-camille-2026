import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription, filter } from 'rxjs';

import { LanguageService } from '../i18n/language.service';
import { ActionHintDirective } from '../ui/action-hint.directive';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ActionHintDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('navbarMenu') navbarMenu?: ElementRef<HTMLElement>;

  readonly i18n = inject(LanguageService);

  private sub?: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Navigation is client-side now, so the burger menu no longer closes by
    // itself the way a full page reload used to close it. Bootstrap 3 marks
    // the open state with `in` on the collapsing element.
    this.sub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.navbarMenu?.nativeElement.classList.remove('in'));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
