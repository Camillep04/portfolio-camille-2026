import { Component } from '@angular/core';

import { PROJECTS } from '../data/projects';

@Component({
  selector: 'app-audiovisuel',
  standalone: true,
  imports: [],
  templateUrl: './audiovisuel.component.html',
  styleUrl: './audiovisuel.component.css'
})
export class AudiovisuelComponent {
  readonly projects = PROJECTS;
}
