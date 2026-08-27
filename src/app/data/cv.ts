/**
 * The "Expériences" and "Formations" timelines on the home page, as data.
 *
 * Array order is display order (most recent first). To add an entry, add one
 * object — the timeline markup is generated per entry, so the duplicate
 * `id="education"` sections and their copied `bi-circle-fill` markup are gone.
 *
 * `period`   — the big date label ("2026", "2025-2027")
 * `headline` — the kind of entry ("Stage - 4 mois", "Master cinéma et audiovisuel XR")
 * `place`    — the organisation or school
 * `description` — the one-line summary
 */
export interface TimelineEntry {
  period: string;
  headline: string;
  place: string;
  description: string;
}

export const EXPERIENCES: TimelineEntry[] = [
  {
    period: '2026',
    headline: 'Stage - 4 mois',
    place: 'Université Paul Valéry - MSH SUD',
    description:
      'Création de vidéos corporate - Interviews - Vulgarisation audiovisuelle R&D - Montage - Captation événementielle/terrain',
  },
  {
    period: '2024',
    headline: 'Alternance',
    place: 'Agence web Ciweb',
    description:
      'Refonte site web - front et back end - Laravel - JQuery - BDD - PHP - JS - HTML - CSS',
  },
  {
    period: '2023',
    headline: 'Stage - 8 semaines',
    place: 'Artemis NC',
    description: 'Refonte graphique, refonte site web, communication sur les réseaux',
  },
  {
    period: '2023',
    headline: 'Monitorat',
    place: 'IUT - UNC',
    description:
      'Monitorat de communication de l’IUT. Participation à la présence numérique de l’IUT',
  },
  {
    period: '2022',
    headline: 'Stage - 4 semaines',
    place: 'Agence de communication Trait d’Union Pacifique',
    description: 'Posts Facebook - Etiquette produit - Détourage produit',
  },
];

export const EDUCATION: TimelineEntry[] = [
  {
    period: '2025-2027',
    headline: 'Master cinéma et audiovisuel XR',
    place: "École Nationale Supérieure d'AudioVisuel - Toulouse",
    description: '3D - Éffets spéciaux - Animation',
  },
  {
    period: '2022 - 2024',
    headline: 'BUT MMI',
    place: 'Université de la Nouvelle-Calédonie - IUT',
    description:
      'Stratégie de communication - Gestion de projet - Développement web - Intégration web',
  },
  {
    period: '2021',
    headline: 'Baccalauréat général - Mention Bien',
    place: 'Lycée Jules Garnier Nouvelle-Calédonie',
    description: 'Spécialité maths physique-chimie',
  },
];
