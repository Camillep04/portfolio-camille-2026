import { Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { ContactComponent } from './contact/contact.component';
import { AudiovisuelComponent } from './audiovisuel/audiovisuel.component';
import { PhotoComponent } from './photo/photo.component';

export const routes: Routes = [
    {path: '', component: AccueilComponent},
    { path: 'contact', component: ContactComponent},
    { path: 'projets', component: AudiovisuelComponent},
    // Old path kept as a redirect so existing links and bookmarks survive.
    { path: 'audiovisuel', redirectTo: 'projets', pathMatch: 'full' },
    { path: 'photo', component: PhotoComponent },
];