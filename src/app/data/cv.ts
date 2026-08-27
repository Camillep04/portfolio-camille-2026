/**
 * The "Expériences" and "Formations" timelines on the home page, as data.
 *
 * Array order is display order (most recent first). To add an entry, add one
 * object — the timeline markup is generated per entry, so the duplicate
 * `id="education"` sections and their copied `bi-circle-fill` markup are gone.
 *
 * `period`   — the big date label ("2026", "2025-2027"); not translated
 * `headline` — the kind of entry ("Stage - 4 mois" / "4-month internship")
 * `place`    — the organisation or school (often identical in both languages)
 * `description` — the one-line summary
 *
 * `headline`, `place` and `description` are `{ fr, en }` pairs so the site's
 * language toggle can swap them at runtime.
 */
import type { Localized } from '../i18n/translations';

export interface TimelineEntry {
  period: string;
  headline: Localized;
  place: Localized;
  description: Localized;
}

export const EXPERIENCES: TimelineEntry[] = [
  {
    period: '2026',
    headline: { fr: 'Stage - 4 mois', en: 'Internship - 4 months' },
    place: {
      fr: 'Université Paul Valéry - MSH SUD',
      en: 'Paul Valéry University - MSH SUD',
    },
    description: {
      fr: 'Création de vidéos corporate - Interviews - Vulgarisation audiovisuelle R&D - Montage - Captation événementielle/terrain',
      en: 'Corporate video production - Interviews - Turning R&D into accessible video - Editing - Event and field filming',
    },
  },
  {
    period: '2024',
    headline: { fr: 'Alternance', en: 'Work-study year' },
    place: { fr: 'Agence web Ciweb', en: 'Ciweb web agency' },
    description: {
      fr: 'Refonte site web - front et back end - Laravel - JQuery - BDD - PHP - JS - HTML - CSS',
      en: 'Website rebuild - front and back end - Laravel - jQuery - databases - PHP - JS - HTML - CSS',
    },
  },
  {
    period: '2023',
    headline: { fr: 'Stage - 8 semaines', en: 'Internship - 8 weeks' },
    place: { fr: 'Artemis NC', en: 'Artemis NC' },
    description: {
      fr: 'Refonte graphique, refonte site web, communication sur les réseaux',
      en: 'Visual redesign, website rebuild, social media communication',
    },
  },
  {
    period: '2023',
    headline: { fr: 'Monitorat', en: 'Student assistant' },
    place: { fr: 'IUT - UNC', en: 'IUT - University of New Caledonia' },
    description: {
      fr: "Monitorat de communication de l'IUT. Participation à la présence numérique de l'IUT",
      en: "Communication assistant for the IUT, helping run the institute's online presence",
    },
  },
  {
    period: '2022',
    headline: { fr: 'Stage - 4 semaines', en: 'Internship - 4 weeks' },
    place: {
      fr: 'Agence de communication Trait d’Union Pacifique',
      en: 'Trait d’Union Pacifique communication agency',
    },
    description: {
      fr: 'Posts Facebook - Etiquette produit - Détourage produit',
      en: 'Facebook posts - Product labels - Product cut-outs',
    },
  },
];

export type TimelineKind = 'experience' | 'formation';

/** One entry of the merged home-page "parcours" strand. `year` is the entry's
 *  most recent year, used as the big watermark millésime beside the card. */
export interface TimelineItem extends TimelineEntry {
  kind: TimelineKind;
  year: number;
}

export const EDUCATION: TimelineEntry[] = [
  {
    period: '2025-2027',
    headline: {
      fr: 'Master cinéma et audiovisuel XR',
      en: "Master's in Film and XR Audiovisual",
    },
    place: {
      fr: "École Nationale Supérieure d'AudioVisuel - Toulouse",
      en: "École Nationale Supérieure d'AudioVisuel (ENSAV) - Toulouse",
    },
    description: {
      fr: '3D - Éffets spéciaux - Animation',
      en: '3D - Visual effects - Animation',
    },
  },
  {
    period: '2022 - 2024',
    headline: { fr: 'BUT MMI', en: 'BUT MMI (Multimedia & Internet, BSc)' },
    place: {
      fr: 'Université de la Nouvelle-Calédonie - IUT',
      en: 'University of New Caledonia - IUT',
    },
    description: {
      fr: 'Stratégie de communication - Gestion de projet - Développement web - Intégration web',
      en: 'Communication strategy - Project management - Web development - Web integration',
    },
  },
  {
    period: '2021',
    headline: {
      fr: 'Baccalauréat général - Mention Bien',
      en: 'French Baccalauréat - awarded with merit',
    },
    place: {
      fr: 'Lycée Jules Garnier Nouvelle-Calédonie',
      en: 'Lycée Jules Garnier, New Caledonia',
    },
    description: {
      fr: 'Spécialité maths physique-chimie',
      en: 'Majors in mathematics and physics-chemistry',
    },
  },
];

/** The most recent 4-digit year mentioned in a `period` label
 *  ("2022 - 2024" -> 2024, "2026" -> 2026). */
function endYear(period: string): number {
  const found = period.match(/\d{4}/g);
  return found ? Math.max(...found.map(Number)) : 0;
}

/**
 * `EXPERIENCES` and `EDUCATION` woven into one strand for the home-page
 * "parcours" section: most recent first, and — when an experience and a
 * formation end the same year — the experience comes first. The section
 * renders experiences on the left of the shared axis and formations on the
 * right, so `kind` drives the side and array order drives the vertical order.
 */
export const TIMELINE: TimelineItem[] = [
  ...EXPERIENCES.map((e) => ({ ...e, kind: 'experience' as const, year: endYear(e.period) })),
  ...EDUCATION.map((e) => ({ ...e, kind: 'formation' as const, year: endYear(e.period) })),
].sort(
  (a, b) =>
    b.year - a.year || (a.kind === b.kind ? 0 : a.kind === 'experience' ? -1 : 1),
);
