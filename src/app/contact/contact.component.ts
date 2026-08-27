import { Component, inject } from '@angular/core';

import { LanguageService } from '../i18n/language.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  readonly i18n = inject(LanguageService);
}
