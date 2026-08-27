/**
 * The photo gallery, as data.
 *
 * Array order is display order: move an object and the grid reflows, no markup
 * to touch. `src` is decoupled from position — the file can stay `12.jpg` while
 * the photo sits first. `id` is a stable slug used for the `@for` track and for
 * the per-photo DOM ids, so reordering never collides two ids.
 *
 * To add a photo: drop the file in `public/img/galerie/` and add one object
 * here. `title` is a `{ fr, en }` pair — it is the lightbox heading and the
 * image alt text, so write both for a human. `description` is optional and also
 * a `{ fr, en }` pair; the lightbox shows it when present.
 */
import type { Localized } from '../i18n/translations';

export interface Photo {
  id: string;
  title: Localized;
  src: string;
  description?: Localized;
}

export const PHOTOS: Photo[] = [
  { id: 'ballet-de-meduses', title: { fr: 'Ballet de méduses', en: 'Jellyfish ballet' }, src: 'img/galerie/1.jpg' },
  { id: 'grande-roue', title: { fr: 'Grande roue', en: 'Ferris wheel' }, src: 'img/galerie/2.jpg' },
  { id: 'instant', title: { fr: 'Instant', en: 'Moment' }, src: 'img/galerie/3.jpg' },
  { id: 'full-moon', title: { fr: 'Full moon', en: 'Full moon' }, src: 'img/galerie/4.jpg' },
  { id: 'flamboyant', title: { fr: 'Flamboyant', en: 'Flame tree' }, src: 'img/galerie/5.jpg' },
  { id: 'legerete', title: { fr: 'Légèreté', en: 'Lightness' }, src: 'img/galerie/6.jpg' },
  { id: 'ephemere', title: { fr: 'Éphémère', en: 'Ephemeral' }, src: 'img/galerie/7.jpg' },
  { id: 'ring', title: { fr: 'Ring', en: 'Ring' }, src: 'img/galerie/8.jpg' },
  { id: 'loutre-pirate', title: { fr: 'Loutre pirate', en: 'Pirate otter' }, src: 'img/galerie/9.jpg' },
  { id: 'reverbere', title: { fr: 'Réverbère', en: 'Street lamp' }, src: 'img/galerie/10.jpg' },
  { id: 'le-chemin-de-la-vie', title: { fr: 'Le chemin de la vie', en: 'The path of life' }, src: 'img/galerie/11.jpg' },
  { id: 'givre', title: { fr: 'Givré', en: 'Frosted' }, src: 'img/galerie/12.jpg' },
  { id: 'contraste-coucher-de-soleil', title: { fr: 'Contraste du coucher de soleil', en: 'Sunset contrast' }, src: 'img/galerie/13.jpg' },
  { id: 'nenuphare', title: { fr: 'Nénuphare', en: 'Water lily' }, src: 'img/galerie/14.jpg' },
  { id: 'details', title: { fr: 'Details', en: 'Details' }, src: 'img/galerie/15.jpg' },
  { id: 'diamond', title: { fr: 'Diamond', en: 'Diamond' }, src: 'img/galerie/16.jpg' },
  { id: 'fog', title: { fr: 'Fog', en: 'Fog' }, src: 'img/galerie/17.jpg' },
  { id: 'la-grave', title: { fr: 'La Grave', en: 'La Grave' }, src: 'img/galerie/18.jpg' },
  { id: 'prony', title: { fr: 'Prony', en: 'Prony' }, src: 'img/galerie/19.jpg' },
  { id: 'colors', title: { fr: 'Colors', en: 'Colors' }, src: 'img/galerie/20.jpg' },
  { id: 'peche', title: { fr: 'Pêche', en: 'Fishing' }, src: 'img/galerie/21.jpg' },
  { id: 'loup-garou', title: { fr: 'Loup garou', en: 'Werewolf' }, src: 'img/galerie/22.jpg' },
  { id: 'fleur-de-bourao', title: { fr: 'Fleur de bourao', en: 'Bourao flower' }, src: 'img/galerie/23.jpg' },
  { id: 'un-air-de-vacances', title: { fr: 'Un air de vacances', en: 'A holiday feeling' }, src: 'img/galerie/24.jpg' },
  { id: 'lac-vert-mont-blanc', title: { fr: 'Lac vert surplombé par le mont Blanc', en: 'Green lake below Mont Blanc' }, src: 'img/galerie/25.jpg' },
  { id: 'enfant-des-bois', title: { fr: 'Enfant des bois', en: 'Child of the woods' }, src: 'img/galerie/26.jpg' },
  { id: 'lunetier', title: { fr: 'Lunetier', en: 'The optician' }, src: 'img/galerie/27.jpg' },
  { id: 'urbain', title: { fr: 'Urbain', en: 'Urban' }, src: 'img/galerie/28.jpg' },
  { id: 'tournesol', title: { fr: 'Tournesol', en: 'Sunflower' }, src: 'img/galerie/33.jpg' },
  { id: 'printemps', title: { fr: 'Printemps', en: 'Spring' }, src: 'img/galerie/34.jpg' },
  { id: 'vallee', title: { fr: 'Vallée', en: 'Valley' }, src: 'img/galerie/35.jpg' },
  { id: 'bcn-tennis-open-2025', title: { fr: 'BCN tennis open 2025 - Nouvelle-calédonie', en: 'BCN Tennis Open 2025 - New Caledonia' }, src: 'img/galerie/29.jpg' },
  { id: 'quiet-sunset', title: { fr: 'quiet sunset', en: 'quiet sunset' }, src: 'img/galerie/30.jpg' },
  { id: 'pissenlit', title: { fr: 'Pissenlit', en: 'Dandelion' }, src: 'img/galerie/31.jpg' },
  { id: 'au-chateau', title: { fr: 'Au château', en: 'At the castle' }, src: 'img/galerie/32.jpg' },
];
