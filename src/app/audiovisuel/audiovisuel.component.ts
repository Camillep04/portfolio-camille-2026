import { Component, inject } from '@angular/core';

import { PROJECTS, type Project } from '../data/projects';
import { FavouritesService } from '../favourites.service';
import { LanguageService } from '../i18n/language.service';
import type { UiKey } from '../i18n/translations';

const LINK_LABEL_KEY: Record<NonNullable<Project['linkKind']>, UiKey> = {
  video: 'projects.link.video',
  project: 'projects.link.project',
  site: 'projects.link.site',
};

@Component({
  selector: 'app-audiovisuel',
  standalone: true,
  imports: [],
  templateUrl: './audiovisuel.component.html',
  styleUrl: './audiovisuel.component.css'
})
export class AudiovisuelComponent {
  readonly projects = PROJECTS;
  readonly i18n = inject(LanguageService);

  private readonly favourites = inject(FavouritesService);

  isFavourite(id: string): boolean {
    return this.favourites.has(id);
  }

  toggleFavourite(id: string): void {
    this.favourites.toggle(id);
  }

  /** The link button's text: an explicit `linkLabel` override, else the
   *  default for the `linkKind` ("Voir la vidéo" / "Watch the video", …). */
  linkLabel(project: Project): string {
    if (project.linkLabel) {
      return this.i18n.tc(project.linkLabel);
    }
    return this.i18n.t(LINK_LABEL_KEY[project.linkKind ?? 'site']);
  }

  /** Accessible label for the heart toggle, with the project title spliced in
   *  where each language wants it. */
  favouriteLabel(project: Project): string {
    const key: UiKey = this.isFavourite(project.id)
      ? 'projects.fav.remove'
      : 'projects.fav.add';
    return this.i18n.t(key).replace('%s', this.i18n.tc(project.title));
  }
}
