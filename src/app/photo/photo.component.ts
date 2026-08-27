import { Component } from '@angular/core';

import { PHOTOS } from '../data/photos';

@Component({
  selector: 'app-photo',
  standalone: true,
  imports: [],
  templateUrl: './photo.component.html',
  styleUrl: './photo.component.css'
})
export class PhotoComponent {
  readonly photos = PHOTOS;
}
