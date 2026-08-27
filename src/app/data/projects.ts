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
 * `description` may contain links — `<a>`, `<u>`, `<br>` are kept, scripts and
 * styles are stripped by Angular.
 *
 * A project with no `link` (e.g. Old phone) renders the card without a button.
 * `linkKind` picks the button's leading icon:
 *   video   → play-circle glyph
 *   project → pen glyph + `linkThumb` image
 *   site    → link glyph
 */
export interface Project {
  id: string;
  title: string;
  year: number;
  background: string;
  image: string;
  icon: string;
  description: string;
  link?: string;
  linkLabel?: string;
  linkKind?: 'video' | 'project' | 'site';
  linkThumb?: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'athlete-reve',
    title: 'À vos marques : Athlète quel est ton rêve ?',
    year: 2024,
    background: 'img/portfolio/a&h.jpg',
    image: 'img/portfolio/affiche-stand.png',
    icon: 'img/camera.png',
    description:
      `Audiovisuel : Mini web documentaire sur des athlètes calédoniennes atteintes de surdité. Réalisation Par Louanne Dronne et Camille Prothin. “Athlète quel est ton rêve ?” est le second épisode de la série “À vos marques”, voir l’épisode 1 : <a href="https://youtu.be/UcOifiVvQrQ?si=8YIsXwBHDpH1YrbO" target="_blank"><u class="text-white">À vos marques : Loan Ville, à la pointe de la performance</u></a>. <br/>Voir l’épisode 2 :`,
    link: 'https://www.youtube.com/watch?v=yZl2QbWaGJA',
    linkLabel: 'Voir la vidéo',
    linkKind: 'video',
  },
  {
    id: 'showreel',
    title: 'Showreel',
    year: 2025,
    background: 'img/portfolio/reel.png',
    image: 'img/portfolio/showreel.jpg',
    icon: 'img/camera.png',
    description: `Showreel de mes productions, réalisations, étalonnage, montage.`,
    link: 'https://youtu.be/PTsqr9EgMaY',
    linkLabel: 'Voir la vidéo',
    linkKind: 'video',
  },
  {
    id: 'room-tour',
    title: 'ROOM TOUR',
    year: 2026,
    background: 'img/portfolio/room-tour.png',
    image: 'img/portfolio/affiche_roomtour.png',
    icon: 'img/camera.png',
    description:
      `Court métrage de mon premier projet 3D entièrement réalisé par moi-même. 3D - Modélisation - Texturing - Lighting - Tournage - Montage - Compositing - Colorimétrie - Maya - Substance 3D painter - Davinci résilve - Fusion.`,
    link: 'https://youtu.be/q5ojmXe1VoM',
    linkLabel: 'Voir la vidéo',
    linkKind: 'video',
  },
  {
    id: 'menageum-rapidax',
    title: 'Menageum Rapidax',
    year: 2026,
    background: 'img/portfolio/mr.png',
    image: 'img/portfolio/cr.jpg',
    icon: 'img/camera.png',
    description:
      `Projet commun master 1 & 2, mon rôle a été de faire le montage sur le tournage mais aussi le montage image.`,
    link: 'https://www.youtube.com/watch?v=lTzdhUEXXx0',
    linkLabel: 'Voir la vidéo',
    linkKind: 'video',
  },
  {
    id: 'wrong-guy',
    title: 'Wrong guy',
    year: 2025,
    background: 'img/portfolio/wg.png',
    image: 'img/portfolio/wrong_guy.jpg',
    icon: 'img/camera.png',
    description:
      `Court métrage good cop/bad cop. Projet de groupe en tant que réalisatrice et assitante cadre. Filmé en log, j'ai pu au montage, faire le color grading.`,
    link: 'https://youtu.be/Ev-wXZEwXEk',
    linkLabel: 'Voir la vidéo',
    linkKind: 'video',
  },
  {
    id: 'magical-forest',
    title: 'Magical forest',
    year: 2025,
    background: 'img/portfolio/mf.png',
    image: 'img/portfolio/magical_forest.jpg',
    icon: 'img/3d.png',
    description:
      `Un univers magique où la forêt est immense et sombre. Des éléments enchantés, imposants voire vivants y sont cachés. Serez-vous happé par la lumière ?`,
    link: 'https://skfb.ly/pEKVW',
    linkLabel: 'Voir le projet',
    linkKind: 'project',
    linkThumb: 'img/3d.png',
  },
  {
    id: 'old-phone',
    title: 'Old phone',
    year: 2025,
    background: 'img/portfolio/phone_fond.png',
    image: 'img/portfolio/phone.png',
    icon: 'img/3d.png',
    description:
      `Modélisation d'un vieux téléphone en 3D avec Maya. Lighting puis rendu avec Arnold. Texturing avec Substance Painter 3D. Intégration et compositing de l'objet 3D chez moi avec Nuke.`,
  },
  {
    id: 'voydof-space',
    title: 'Voydof space',
    year: 2023,
    background: 'img/portfolio/plateau.jpg',
    image: 'img/portfolio/voydofspace.jpg',
    icon: 'img/vecteur.png',
    description:
      `Jeu de société : Incarnez des contrebandiers de l’espace et partez en mission pour chercher des monstres et réalisez vos quêtes… Mais faites attention à la police stellaire pendant vos magouilles ! <br/>Projet de groupe où j’ai pu créer les designs du jeu tout en participant à l’élaboration des règles, de la brandboard/moodboard et d’une vidéo teaser.`,
    link: 'https://drive.google.com/drive/folders/1HSqk7K_5SLldIYRRgmI6EvUHKhymKear?usp=sharing',
    linkLabel: 'Voir le projet',
    linkKind: 'project',
    linkThumb: 'img/vecteur.png',
  },
  {
    id: 'clip-mmi',
    title: 'Clip MMI',
    year: 2023,
    background: 'img/portfolio/clip_mmi.png',
    image: 'img/portfolio/mmi.png',
    icon: 'img/camera.png',
    description:
      `Audiovisuel : Clip vidéo descriptif de la formation du BUT MMI, projet de classe où j’ai pu apporter mon aide au niveau du cadrage. Prix du NUMÉRIQUE remporté lors du concours je filme ma formation ainsi que le 1er prix du Grand Prix Parcoursmétiers.`,
    link: 'https://youtu.be/3YvoYxvwd28?si=L7W_pO-4BACyeDdd',
    linkLabel: 'Voir la vidéo',
    linkKind: 'video',
  },
  {
    id: 'inlive-sport',
    title: 'Inlive-sport',
    year: 2024,
    background: 'img/portfolio/inlive.png',
    image: 'img/portfolio/inlive-sport.png',
    icon: 'img/globe.png',
    description:
      `Refonte du site web inlive-sport, un site qui publie des résultats sportifs en VTT, trail, triathlon… J’ai effectué cette refonte durant mon alternance d’un an dans l’agence web <a href="https://www.ciweb.nc/" target="_blank"><u class="text-white">Ciweb</u></a>. J’ai pu approfondir mes connaissances en PHP, HTML, CSS, JS, base de données tout en développant des fonctionnalités comme des requêtes, de l'Ajax, une recherche, un backoffice…`,
    link: 'https://www.inlive-sport.nc/',
    linkLabel: 'Voir le site',
    linkKind: 'site',
  },
];
