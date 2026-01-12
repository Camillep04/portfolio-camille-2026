import { Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { ContactComponent } from './contact/contact.component';
import { AudiovisuelComponent } from './audiovisuel/audiovisuel.component';
import { PhotoComponent } from './photo/photo.component';

export const routes: Routes = [
    {path: '', component: AccueilComponent},
    { path: 'contact', component: ContactComponent},
    { path: 'audiovisuel', component: AudiovisuelComponent},
    { path: 'photo', component: PhotoComponent },
];