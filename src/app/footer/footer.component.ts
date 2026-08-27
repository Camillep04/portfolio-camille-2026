import { Component, inject } from '@angular/core';

import { LanguageService } from '../i18n/language.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  readonly i18n = inject(LanguageService);

  /** Rendered in the copyright line so it never goes stale. */
  readonly currentYear = new Date().getFullYear();
}
