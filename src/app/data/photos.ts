/**
 * The photo gallery, as data.
 *
 * Array order is display order: move an object and the grid reflows, no markup
 * to touch. `src` is decoupled from position — the file can stay `12.jpg` while
 * the photo sits first. `id` is a stable slug used for the `@for` track and for
 * the per-photo DOM ids, so reordering never collides two ids.
 *
 * To add a photo: drop the file in `public/img/galerie/` and add one object
 * here. `title` is the modal heading and the image alt text, so write it for a
 * human. `description` is optional and currently unused — Session 5's popup
 * will show it when present.
 */
export interface Photo {
  id: string;
  title: string;
  src: string;
  description?: string;
}

export const PHOTOS: Photo[] = [
  { id: 'ballet-de-meduses', title: 'Ballet de méduses', src: 'img/galerie/1.jpg' },
  { id: 'grande-roue', title: 'Grande roue', src: 'img/galerie/2.jpg' },
  { id: 'instant', title: 'Instant', src: 'img/galerie/3.jpg' },
  { id: 'full-moon', title: 'Full moon', src: 'img/galerie/4.jpg' },
  { id: 'flamboyant', title: 'Flamboyant', src: 'img/galerie/5.jpg' },
  { id: 'legerete', title: 'Légèreté', src: 'img/galerie/6.jpg' },
  { id: 'ephemere', title: 'Éphémère', src: 'img/galerie/7.jpg' },
  { id: 'ring', title: 'Ring', src: 'img/galerie/8.jpg' },
  { id: 'loutre-pirate', title: 'Loutre pirate', src: 'img/galerie/9.jpg' },
  { id: 'reverbere', title: 'Réverbère', src: 'img/galerie/10.jpg' },
  { id: 'le-chemin-de-la-vie', title: 'Le chemin de la vie', src: 'img/galerie/11.jpg' },
  { id: 'givre', title: 'Givré', src: 'img/galerie/12.jpg' },
  { id: 'contraste-coucher-de-soleil', title: 'Contraste du coucher de soleil', src: 'img/galerie/13.jpg' },
  { id: 'nenuphare', title: 'Nénuphare', src: 'img/galerie/14.jpg' },
  { id: 'details', title: 'Details', src: 'img/galerie/15.jpg' },
  { id: 'diamond', title: 'Diamond', src: 'img/galerie/16.jpg' },
  { id: 'fog', title: 'Fog', src: 'img/galerie/17.jpg' },
  { id: 'la-grave', title: 'La Grave', src: 'img/galerie/18.jpg' },
  { id: 'prony', title: 'Prony', src: 'img/galerie/19.jpg' },
  { id: 'colors', title: 'Colors', src: 'img/galerie/20.jpg' },
  { id: 'peche', title: 'Pêche', src: 'img/galerie/21.jpg' },
  { id: 'loup-garou', title: 'Loup garou', src: 'img/galerie/22.jpg' },
  { id: 'fleur-de-bourao', title: 'Fleur de bourao', src: 'img/galerie/23.jpg' },
  { id: 'un-air-de-vacances', title: 'Un air de vacances', src: 'img/galerie/24.jpg' },
  { id: 'lac-vert-mont-blanc', title: 'Lac vert surplombé par le mont Blanc', src: 'img/galerie/25.jpg' },
  { id: 'enfant-des-bois', title: 'Enfant des bois', src: 'img/galerie/26.jpg' },
  { id: 'lunetier', title: 'Lunetier', src: 'img/galerie/27.jpg' },
  { id: 'urbain', title: 'Urbain', src: 'img/galerie/28.jpg' },
  { id: 'tournesol', title: 'Tournesol', src: 'img/galerie/33.jpg' },
  { id: 'printemps', title: 'Printemps', src: 'img/galerie/34.jpg' },
  { id: 'vallee', title: 'Vallée', src: 'img/galerie/35.jpg' },
  { id: 'bcn-tennis-open-2025', title: 'BCN tennis open 2025 - Nouvelle-calédonie', src: 'img/galerie/29.jpg' },
  { id: 'quiet-sunset', title: 'quiet sunset', src: 'img/galerie/30.jpg' },
  { id: 'pissenlit', title: 'Pissenlit', src: 'img/galerie/31.jpg' },
  { id: 'au-chateau', title: 'Au château', src: 'img/galerie/32.jpg' },
];
