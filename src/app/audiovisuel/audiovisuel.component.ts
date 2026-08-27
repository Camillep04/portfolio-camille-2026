import { Component, inject } from '@angular/core';

import { PROJECTS } from '../data/projects';
import { FavouritesService } from '../favourites.service';

@Component({
  selector: 'app-audiovisuel',
  standalone: true,
  imports: [],
  templateUrl: './audiovisuel.component.html',
  styleUrl: './audiovisuel.component.css'
})
export class AudiovisuelComponent {
  readonly projects = PROJECTS;

  private readonly favourites = inject(FavouritesService);

  isFavourite(id: string): boolean {
    return this.favourites.has(id);
  }

  toggleFavourite(id: string): void {
    this.favourites.toggle(id);
  }
}
