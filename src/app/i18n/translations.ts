/**
 * Runtime i18n for the site: a two-language UI string table plus the shared
 * types used by the localized content in `src/app/data/`.
 *
 * The site ships French first. English is a runtime toggle (see
 * `LanguageService`) — no second build, no second URL. To translate a new
 * string of UI chrome, add one key to BOTH `fr` and `en` below; the `UiKey`
 * type then forces every `i18n.t(...)` call to use a real key.
 *
 * Camille's own words — project blurbs, photo titles, the bio, the CV
 * timelines — are NOT here. They live next to the data they describe as
 * `{ fr, en }` pairs (the `Localized` type), so adding a project still means
 * editing one object in one file.
 */

export type Lang = 'fr' | 'en';

/** A piece of Camille's content that exists in both languages. */
export interface Localized {
  fr: string;
  en: string;
}

const FR = {
  'nav.home': 'Accueil',
  'nav.projects': 'Projets',
  'nav.photos': 'Photos',
  'nav.contact': 'Contact',
  'nav.cv': 'CV',

  'lang.other': 'EN',
  'lang.switch': 'Switch to English',

  'hero.funIn': "J'aime m'amuser en :",
  'hero.cta': 'VOIR MES PROJETS',

  'about.title': 'Qui est Camille ?',
  'about.bio':
    "Je suis une jeune diplômée d'un Bachelor Universitaire de Technologie dans les Métiers du Multimédia et de l'Internet et depuis quelques années je pratique la photo et la vidéo. Durant ma dernière année de MMI, j'ai découvert la réalisation du documentaire et j'ai par la même occasion développé une nouvelle passion. " +
    'Je suis actuellement en <b>Master cinéma et audiovisuel XR en France.</b> Modélisation 3D, fond vert, compositing, réalités virtuelles, scènes 3D, logiciels sont mes nouveaux mots favoris. ' +
    "J'apprends et je suis la pipeline du monde de la 3D comme les plus grands de l'industrie.",

  'cvVideo.title': 'CV vidéo',
  'cta.downloadCv': 'Télécharger mon CV',

  'skills.title': 'Compétences',

  'universe.title': 'Plongez dans mon univers',
  'ticket.label': 'TICKET',
  'ticket.role': 'réalisatrice',
  'ticket.yearLabel': 'année',
  'ticket.viewsLabel': 'vues',
  'ticket.doc.title': 'Athlète quel est ton rêve ?',
  'ticket.doc.kind': 'Documentaire',
  'ticket.photo.title': 'Photographies',
  'ticket.photo.kind': 'Images',

  'experiences.title': 'Expériences',
  'formations.title': 'Formations',

  'home.photo.title': 'PHOTO',

  'photo.instagramCta': 'Retrouvez plus de photos sur mon Instagram',
  'photo.close': 'Fermer',
  'photo.prev': 'Photo précédente',
  'photo.next': 'Photo suivante',

  'contact.title': 'Contactez-moi',
  'contact.form': 'Formulaire de contact',
  'contact.socials': 'Mes réseaux :',

  'footer.madeBy': 'Réalisé par Camille PROTHIN',

  // %s is replaced with the project title.
  'projects.link.video': 'Voir la vidéo',
  'projects.link.project': 'Voir le projet',
  'projects.link.site': 'Voir le site',
  'projects.fav.add': 'Ajouter %s aux favoris',
  'projects.fav.remove': 'Retirer %s des favoris',
} as const;

export type UiKey = keyof typeof FR;

const EN: Record<UiKey, string> = {
  'nav.home': 'Home',
  'nav.projects': 'Projects',
  'nav.photos': 'Photos',
  'nav.contact': 'Contact',
  'nav.cv': 'CV',

  'lang.other': 'FR',
  'lang.switch': 'Passer en français',

  'hero.funIn': 'I like to have fun with:',
  'hero.cta': 'SEE MY PROJECTS',

  'about.title': 'Who is Camille?',
  'about.bio':
    "I recently graduated with a Bachelor's in Multimedia and Internet Technologies, and I have been shooting photo and video for a few years now. During my final year I discovered documentary filmmaking, and picked up a new passion along the way. " +
    "I am currently studying for a <b>Master's in Film and XR Audiovisual in France.</b> 3D modelling, green screen, compositing, virtual reality, 3D scenes and the software that goes with them are my new favourite words. " +
    'I am learning the 3D pipeline and following it the way the biggest studios in the industry do.',

  'cvVideo.title': 'Video CV',
  'cta.downloadCv': 'Download my CV',

  'skills.title': 'Skills',

  'universe.title': 'Step into my world',
  'ticket.label': 'TICKET',
  'ticket.role': 'director',
  'ticket.yearLabel': 'year',
  'ticket.viewsLabel': 'views',
  'ticket.doc.title': 'Athlete, what is your dream?',
  'ticket.doc.kind': 'Documentary',
  'ticket.photo.title': 'Photography',
  'ticket.photo.kind': 'Images',

  'experiences.title': 'Experience',
  'formations.title': 'Education',

  'home.photo.title': 'PHOTO',

  'photo.instagramCta': 'See more photos on my Instagram',
  'photo.close': 'Close',
  'photo.prev': 'Previous photo',
  'photo.next': 'Next photo',

  'contact.title': 'Contact me',
  'contact.form': 'Contact form',
  'contact.socials': 'My socials:',

  'footer.madeBy': 'Made by Camille PROTHIN',

  'projects.link.video': 'Watch the video',
  'projects.link.project': 'View the project',
  'projects.link.site': 'Visit the site',
  'projects.fav.add': 'Add %s to favourites',
  'projects.fav.remove': 'Remove %s from favourites',
};

export const UI: Record<Lang, Record<UiKey, string>> = {
  fr: FR,
  en: EN,
};
