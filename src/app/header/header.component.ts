import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('navbarMenu') navbarMenu?: ElementRef<HTMLElement>;

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
