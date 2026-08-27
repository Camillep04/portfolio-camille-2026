/**
 * The projects shown on /projets (the component is still named audiovisuel), as data.
 *
 * Array order is display order — the first object is the top of the page. To
 * add a project, add one object at the position you want it; nothing else in
 * the file shifts, and there is no `filmN` number to keep in sync.
 *
 * `background` is the full-bleed hero behind the section (was a positional
 * `nth-child` rule, which is why reordering used to scramble the page).
 * `image` is the preview card. `icon` is the small glyph before the blurb.
 *
 * `title` and `description` are `{ fr, en }` pairs for the site's language
 * toggle. `description` may contain links — `<a>`, `<u>`, `<br>` are kept,
 * scripts and styles are stripped by Angular.
 *
 * A project with no `link` (e.g. Old phone) renders the card without a button.
 * `linkKind` picks the button's leading icon AND its default label
 * ("Voir la vidéo" / "Watch the video", etc., from `translations.ts`):
 *   video   → play-circle glyph
 *   project → pen glyph + `linkThumb` image
 *   site    → link glyph
 * Set `linkLabel` only to override that default.
 */
import type { Localized } from '../i18n/translations';

export interface Project {
  id: string;
  title: Localized;
  year: number;
  background: string;
  image: string;
  icon: string;
  description: Localized;
  link?: string;
  linkLabel?: Localized;
  linkKind?: 'video' | 'project' | 'site';
  linkThumb?: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'athlete-reve',
    title: {
      fr: 'À vos marques : Athlète quel est ton rêve ?',
      en: 'On your marks: Athlete, what is your dream?',
    },
    year: 2024,
    background: 'img/portfolio/a&h.jpg',
    image: 'img/portfolio/affiche-stand.png',
    icon: 'img/camera.png',
    description: {
      fr: `Audiovisuel : Mini web documentaire sur des athlètes calédoniennes atteintes de surdité. Réalisation Par Louanne Dronne et Camille Prothin. “Athlète quel est ton rêve ?” est le second épisode de la série “À vos marques”, voir l’épisode 1 : <a href="https://youtu.be/UcOifiVvQrQ?si=8YIsXwBHDpH1YrbO" target="_blank"><u class="text-white">À vos marques : Loan Ville, à la pointe de la performance</u></a>. <br/>Voir l’épisode 2 :`,
      en: `Video: a short web documentary about deaf sportswomen from New Caledonia. Directed by Louanne Dronne and Camille Prothin. “Athlete, what is your dream?” is the second episode of the series “On your marks” — watch episode 1: <a href="https://youtu.be/UcOifiVvQrQ?si=8YIsXwBHDpH1YrbO" target="_blank"><u class="text-white">On your marks: Loan Ville, at the edge of performance</u></a>. <br/>Watch episode 2:`,
    },
    link: 'https://www.youtube.com/watch?v=yZl2QbWaGJA',
    linkKind: 'video',
  },
  {
    id: 'showreel',
    title: { fr: 'Showreel', en: 'Showreel' },
    year: 2025,
    background: 'img/portfolio/reel.png',
    image: 'img/portfolio/showreel.jpg',
    icon: 'img/camera.png',
    description: {
      fr: `Showreel de mes productions, réalisations, étalonnage, montage.`,
      en: `A showreel of my work: producing, directing, colour grading and editing.`,
    },
    link: 'https://youtu.be/PTsqr9EgMaY',
    linkKind: 'video',
  },
  {
    id: 'room-tour',
    title: { fr: 'ROOM TOUR', en: 'ROOM TOUR' },
    year: 2026,
    background: 'img/portfolio/room-tour.png',
    image: 'img/portfolio/affiche_roomtour.png',
    icon: 'img/camera.png',
    description: {
      fr: `Court métrage de mon premier projet 3D entièrement réalisé par moi-même. 3D - Modélisation - Texturing - Lighting - Tournage - Montage - Compositing - Colorimétrie - Maya - Substance 3D painter - Davinci résilve - Fusion.`,
      en: `A short film — my first 3D project, made entirely on my own. 3D - Modelling - Texturing - Lighting - Filming - Editing - Compositing - Colour - Maya - Substance 3D Painter - DaVinci Resolve - Fusion.`,
    },
    link: 'https://youtu.be/q5ojmXe1VoM',
    linkKind: 'video',
  },
  {
    id: 'menageum-rapidax',
    title: { fr: 'Menageum Rapidax', en: 'Menageum Rapidax' },
    year: 2026,
    background: 'img/portfolio/mr.png',
    image: 'img/portfolio/cr.jpg',
    icon: 'img/camera.png',
    description: {
      fr: `Projet commun master 1 & 2, mon rôle a été de faire le montage sur le tournage mais aussi le montage image.`,
      en: `A joint first- and second-year Master's project. My role was on-set editing as well as picture editing.`,
    },
    link: 'https://www.youtube.com/watch?v=lTzdhUEXXx0',
    linkKind: 'video',
  },
  {
    id: 'wrong-guy',
    title: { fr: 'Wrong guy', en: 'Wrong guy' },
    year: 2025,
    background: 'img/portfolio/wg.png',
    image: 'img/portfolio/wrong_guy.jpg',
    icon: 'img/camera.png',
    description: {
      fr: `Court métrage good cop/bad cop. Projet de groupe en tant que réalisatrice et assitante cadre. Filmé en log, j'ai pu au montage, faire le color grading.`,
      en: `A good cop / bad cop short film. A group project where I was director and assistant camera. Shot in log, which let me handle the colour grading in the edit.`,
    },
    link: 'https://youtu.be/Ev-wXZEwXEk',
    linkKind: 'video',
  },
  {
    id: 'magical-forest',
    title: { fr: 'Magical forest', en: 'Magical forest' },
    year: 2025,
    background: 'img/portfolio/mf.png',
    image: 'img/portfolio/magical_forest.jpg',
    icon: 'img/3d.png',
    description: {
      fr: `Un univers magique où la forêt est immense et sombre. Des éléments enchantés, imposants voire vivants y sont cachés. Serez-vous happé par la lumière ?`,
      en: `A magical world where the forest is vast and dark. Enchanted things — huge, even alive — are hidden inside it. Will the light pull you in?`,
    },
    link: 'https://skfb.ly/pEKVW',
    linkKind: 'project',
    linkThumb: 'img/3d.png',
  },
  {
    id: 'old-phone',
    title: { fr: 'Old phone', en: 'Old phone' },
    year: 2025,
    background: 'img/portfolio/phone_fond.png',
    image: 'img/portfolio/phone.png',
    icon: 'img/3d.png',
    description: {
      fr: `Modélisation d'un vieux téléphone en 3D avec Maya. Lighting puis rendu avec Arnold. Texturing avec Substance Painter 3D. Intégration et compositing de l'objet 3D chez moi avec Nuke.`,
      en: `An old telephone modelled in 3D with Maya. Lighting and rendering with Arnold. Texturing with Substance 3D Painter. The 3D object integrated and composited into my home with Nuke.`,
    },
  },
  {
    id: 'voydof-space',
    title: { fr: 'Voydof space', en: 'Voydof space' },
    year: 2023,
    background: 'img/portfolio/plateau.jpg',
    image: 'img/portfolio/voydofspace.jpg',
    icon: 'img/vecteur.png',
    description: {
      fr: `Jeu de société : Incarnez des contrebandiers de l’espace et partez en mission pour chercher des monstres et réalisez vos quêtes… Mais faites attention à la police stellaire pendant vos magouilles ! <br/>Projet de groupe où j’ai pu créer les designs du jeu tout en participant à l’élaboration des règles, de la brandboard/moodboard et d’une vidéo teaser.`,
      en: `A board game: play as space smugglers, head out on missions to hunt monsters and complete your quests… but watch out for the stellar police while you scheme! <br/>A group project where I created the game's artwork and helped shape the rules, the brand and mood boards, and a teaser video.`,
    },
    link: 'https://drive.google.com/drive/folders/1HSqk7K_5SLldIYRRgmI6EvUHKhymKear?usp=sharing',
    linkKind: 'project',
    linkThumb: 'img/vecteur.png',
  },
  {
    id: 'clip-mmi',
    title: { fr: 'Clip MMI', en: 'MMI clip' },
    year: 2023,
    background: 'img/portfolio/clip_mmi.png',
    image: 'img/portfolio/mmi.png',
    icon: 'img/camera.png',
    description: {
      fr: `Audiovisuel : Clip vidéo descriptif de la formation du BUT MMI, projet de classe où j’ai pu apporter mon aide au niveau du cadrage. Prix du NUMÉRIQUE remporté lors du concours je filme ma formation ainsi que le 1er prix du Grand Prix Parcoursmétiers.`,
      en: `Video: a clip presenting the BUT MMI degree. A class project where I helped with the camera work. It won the DIGITAL prize at the "Je filme ma formation" contest, as well as first prize at the Grand Prix Parcoursmétiers.`,
    },
    link: 'https://youtu.be/3YvoYxvwd28?si=L7W_pO-4BACyeDdd',
    linkKind: 'video',
  },
  {
    id: 'inlive-sport',
    title: { fr: 'Inlive-sport', en: 'Inlive-sport' },
    year: 2024,
    background: 'img/portfolio/inlive.png',
    image: 'img/portfolio/inlive-sport.png',
    icon: 'img/globe.png',
    description: {
      fr: `Refonte du site web inlive-sport, un site qui publie des résultats sportifs en VTT, trail, triathlon… J’ai effectué cette refonte durant mon alternance d’un an dans l’agence web <a href="https://www.ciweb.nc/" target="_blank"><u class="text-white">Ciweb</u></a>. J’ai pu approfondir mes connaissances en PHP, HTML, CSS, JS, base de données tout en développant des fonctionnalités comme des requêtes, de l'Ajax, une recherche, un backoffice…`,
      en: `A rebuild of the inlive-sport website, which publishes results for mountain biking, trail running, triathlon and more. I did this rebuild during my one-year work-study placement at the web agency <a href="https://www.ciweb.nc/" target="_blank"><u class="text-white">Ciweb</u></a>. I deepened my knowledge of PHP, HTML, CSS, JS and databases while building features such as queries, Ajax, a search and a back office.`,
    },
    link: 'https://www.inlive-sport.nc/',
    linkKind: 'site',
  },
];
