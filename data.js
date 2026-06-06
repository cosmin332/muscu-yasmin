// ============================================================
//  Programme complet 12 semaines – Yasmin 💖
// ============================================================

const PROGRAM = {
  phases: [
    // ─────────────────────────────────────────────────────────
    //  PHASE 1 : Réveil et Fondation (Semaines 1-4)
    // ─────────────────────────────────────────────────────────
    {
      id: 1,
      name: "Réveil et Fondation",
      weeks: "Semaines 1 à 4",
      weekNumbers: [1, 2, 3, 4],
      objective: "Soulager le dos, relancer la circulation des jambes et habituer le cœur à l'effort.",
      color: "#FFB6C1",
      gradient: "linear-gradient(135deg, #FFB6C1, #FF69B4)",
      emoji: "🌸",
      restDays: [
        { day: "Mardi", note: "Repos" },
        { day: "Jeudi", note: "Repos" },
        { day: "Sam/Dim", note: "Repos total ou balade plaisir 15-20 min" }
      ],
      sessions: [
        {
          id: "p1_lundi",
          dayName: "Lundi",
          dayEmoji: "🧘",
          name: "Mobilité & Dos Soulagé",
          color: "#FFB6C1",
          warmup: {
            duration: 5,
            description: "Cercles de bras, haussements d'épaules, rotations très douces du bassin."
          },
          exercises: [
            {
              id: "p1_chat_chameau",
              name: "Le Chat-Chameau",
              description: "À quatre pattes. Alterner lentement entre le dos rond (chat) et le dos plat/creusé (chameau). Rythme très lent, respiration consciente.",
              volume: { type: "sets_reps", sets: 2, reps: "8 allers-retours lents" },
              videoUrl: null
            },
            {
              id: "p1_pont_fessier",
              name: "Le Pont Fessier",
              description: "Allongée sur le dos, pieds à plat au sol, genoux fléchis. Décoller le bassin en poussant dans les talons. Serrer les fessiers 2 secondes en haut, redescendre frôler le sol sans poser complètement.",
              volume: { type: "sets_reps", sets: 3, reps: 10, rest: "45s" },
              videoUrl: null
            },
            {
              id: "p1_dead_bug",
              name: "Le « Dead Bug » Adapté",
              description: "Allongée sur le dos, genoux levés à 90°. Bas du dos bien plaqué au tapis. Descendre un pied pour effleurer le sol, remonter, puis faire l'autre côté. Ne jamais décoller le bas du dos !",
              volume: { type: "sets_reps", sets: 2, reps: "6 effleurements par jambe" },
              videoUrl: null
            }
          ],
          cooldown: {
            duration: 3,
            description: "Posture de l'enfant : fesses sur les talons, bras tendus devant au sol. Grandes respirations lentes et profondes."
          }
        },
        {
          id: "p1_mercredi",
          dayName: "Mercredi",
          dayEmoji: "🚶",
          name: "Cardio Doux",
          color: "#FFE4E1",
          warmup: null,
          exercises: [
            {
              id: "p1_marche",
              name: "Marche Active",
              description: "Marche active sur place dans le salon (avec mouvements de bras) OU marche à plat à l'extérieur. Règle d'or : tu dois pouvoir parler sans couper tes phrases. Si le cœur s'emballe → pause immédiate de 2 min assise.",
              volume: { type: "duration", duration: "25 minutes", note: "Rythme constant – test de la parole" },
              videoUrl: null
            }
          ],
          cooldown: null
        },
        {
          id: "p1_vendredi",
          dayName: "Vendredi",
          dayEmoji: "⚡",
          name: "Tonicité Jambes & Posture",
          color: "#FFC0CB",
          warmup: {
            duration: 5,
            description: "Cercles de bras, haussements d'épaules, rotations très douces du bassin (même échauffement que le lundi)."
          },
          exercises: [
            {
              id: "p1_box_squat",
              name: "Le Box Squat",
              description: "S'asseoir et se lever d'une chaise de manière contrôlée, sans s'aider des mains si possible. Descendre lentement, dos droit, genoux dans l'axe des orteils.",
              volume: { type: "sets_reps", sets: 3, reps: 10, rest: "1 min" },
              videoUrl: null
            },
            {
              id: "p1_tirage_assis",
              name: "Tirage Poitrine Assis (Élastique léger)",
              description: "Assise au sol, jambes tendues, élastique autour des pieds. Tirer les coudes vers l'arrière en serrant les omoplates ensemble. Dos bien droit, sans se pencher en arrière.",
              volume: { type: "sets_reps", sets: 3, reps: 12, rest: "45s" },
              videoUrl: null
            },
            {
              id: "p1_gainage_mur",
              name: "Gainage au Mur",
              description: "Avant-bras posés sur le mur à hauteur d'épaules, reculer un peu les pieds. Rentrer le ventre (aspirer le nombril) et serrer les fessiers. Corps en ligne droite parfaite.",
              volume: { type: "sets_duration", sets: 3, duration: "20 à 30 secondes", rest: "45s" },
              videoUrl: null
            }
          ],
          cooldown: {
            duration: 3,
            description: "Debout, relâcher complètement le buste vers le sol, genoux légèrement fléchis, pour détendre le bas du dos et les ischio-jambiers."
          }
        }
      ]
    },

    // ─────────────────────────────────────────────────────────
    //  PHASE 2 : Tonicité et Enclenchement (Semaines 5-8)
    // ─────────────────────────────────────────────────────────
    {
      id: 2,
      name: "Tonicité et Enclenchement",
      weeks: "Semaines 5 à 8",
      weekNumbers: [5, 6, 7, 8],
      objective: "Activer la perte de poids en augmentant la dépense énergétique, tonifier et renforcer la sangle abdominale.",
      color: "#DDA0DD",
      gradient: "linear-gradient(135deg, #DDA0DD, #9B59B6)",
      emoji: "💜",
      restDays: [
        { day: "Mardi", note: "Repos" },
        { day: "Jeudi", note: "Repos" },
        { day: "Samedi", note: "Repos" },
        { day: "Dimanche", note: "Repos actif – 30 min de marche extérieure" }
      ],
      sessions: [
        {
          id: "p2_lundi",
          dayName: "Lundi",
          dayEmoji: "🦵",
          name: "Bas du Corps & Posture Élastique",
          color: "#DDA0DD",
          warmup: {
            duration: 5,
            description: "Talons-fesses lents sur place, rotations des chevilles et des hanches."
          },
          exercises: [
            {
              id: "p2_box_squat_evolue",
              name: "Box Squat Évolué",
              description: "Même exercice qu'en phase 1 sur la chaise, MAIS : effleurer seulement l'assise avec les fesses avant de remonter immédiatement, sans s'asseoir complètement. La tension reste constante dans les jambes.",
              volume: { type: "sets_reps", sets: 3, reps: 12, rest: "1 min" },
              videoUrl: null
            },
            {
              id: "p2_tirage_debout",
              name: "Tirage Élastique Debout",
              description: "Élastique coincé dans une poignée de porte fermée à hauteur de taille. Debout, genoux légèrement fléchis, tirer les deux mains vers le nombril en gardant le dos bien droit.",
              volume: { type: "sets_reps", sets: 3, reps: 12, rest: "45s" },
              videoUrl: null
            },
            {
              id: "p2_bird_dog",
              name: "Le Bird-Dog (Chien d'arrêt)",
              description: "À quatre pattes, dos bien plat. Tendre le bras droit ET la jambe gauche simultanément, sans cambrer le dos ni tourner le bassin. Tenir 1 seconde, revenir et inverser les côtés. Excellent exercice pour le dos !",
              volume: { type: "sets_reps", sets: 3, reps: "8 répétitions de chaque côté" },
              videoUrl: null
            }
          ],
          cooldown: {
            duration: 3,
            description: "Allongée sur le dos, ramener les deux genoux contre la poitrine et masser le bas du dos en faisant de petits cercles."
          }
        },
        {
          id: "p2_mercredi",
          dayName: "Mercredi",
          dayEmoji: "🚶",
          name: "Cardio Évolutif",
          color: "#E6CCFF",
          warmup: null,
          exercises: [
            {
              id: "p2_marche",
              name: "Marche Active",
              description: "Marche active sur place OU en extérieur. Rythme modéré (10 min de plus que la Phase 1 pour brûler plus de calories). Même règle : on doit pouvoir parler sans s'essouffler.",
              volume: { type: "duration", duration: "35 minutes", note: "Rythme constant" },
              videoUrl: null
            }
          ],
          cooldown: null
        },
        {
          id: "p2_vendredi",
          dayName: "Vendredi",
          dayEmoji: "🧘",
          name: "Full Body Doux & Abdos Profonds",
          color: "#D8B4FE",
          warmup: {
            duration: 5,
            description: "Échauffement doux habituel."
          },
          exercises: [
            {
              id: "p2_pont_coussin",
              name: "Pont Fessier avec Coussin",
              description: "Même position que le pont classique, mais serrer un coussin entre les genoux pendant tout le mouvement. Cela engage l'intérieur des cuisses en plus des fessiers !",
              volume: { type: "sets_reps", sets: 3, reps: 12, rest: "45s" },
              videoUrl: null
            },
            {
              id: "p2_elevations_lat",
              name: "Élévations Latérales (Élastique léger)",
              description: "Debout, marcher sur le milieu de l'élastique et tenir les deux extrémités. Monter les bras à l'horizontale en formant un grand « T ». Tonifie les épaules et affine les bras.",
              volume: { type: "sets_reps", sets: 3, reps: 10 },
              videoUrl: null
            },
            {
              id: "p2_gainage_genoux",
              name: "Gainage sur les Genoux",
              description: "Au sol, appui sur les coudes et sur les genoux (version facilitée). Aspirer le nombril vers la colonne, serrer les fessiers. Le bas du dos ne doit SURTOUT PAS creuser.",
              volume: { type: "sets_duration", sets: 3, duration: "25 secondes", rest: "45s" },
              videoUrl: null
            }
          ],
          cooldown: {
            duration: 3,
            description: "Posture du cobra doux : allongée sur le ventre, prendre appui sur les avant-bras pour redresser très légèrement le buste, étirer doucement les abdos. Ne pas pincer le bas du dos."
          }
        }
      ]
    },

    // ─────────────────────────────────────────────────────────
    //  PHASE 3 : Silhouette et Consolidation (Semaines 9-12)
    // ─────────────────────────────────────────────────────────
    {
      id: 3,
      name: "Silhouette et Consolidation",
      weeks: "Semaines 9 à 12",
      weekNumbers: [9, 10, 11, 12],
      objective: "Résultats visibles sur la fermeté des muscles, meilleure tolérance cardiaque à l'effort, dos solide au quotidien.",
      color: "#FFDAB9",
      gradient: "linear-gradient(135deg, #FFDAB9, #FF8C69)",
      emoji: "✨",
      restDays: [
        { day: "Mardi", note: "Repos" },
        { day: "Jeudi", note: "Repos" },
        { day: "Samedi", note: "Repos" },
        { day: "Dimanche", note: "Repos actif – 35-40 min de marche extérieure" }
      ],
      sessions: [
        {
          id: "p3_lundi",
          dayName: "Lundi",
          dayEmoji: "🔥",
          name: "Circuit Tonicité Express",
          color: "#FFDAB9",
          isCircuit: true,
          circuitInfo: "Enchaîner les 4 exercices SANS pause entre eux. Prendre 45 secondes de repos à la fin du circuit complet. Répéter 3 fois.",
          circuitRounds: 3,
          warmup: {
            duration: 5,
            description: "Échauffement habituel : cercles de bras, rotations des hanches, quelques pas sur place."
          },
          exercises: [
            {
              id: "p3_box_squat",
              name: "① Box Squat",
              description: "S'asseoir et se lever d'une chaise de manière contrôlée.",
              volume: { type: "circuit_reps", reps: 12 },
              videoUrl: null
            },
            {
              id: "p3_tirage_debout",
              name: "② Tirage Élastique Debout",
              description: "Élastique à la poignée de porte, tirer vers le nombril, dos droit.",
              volume: { type: "circuit_reps", reps: 15 },
              videoUrl: null
            },
            {
              id: "p3_pont_coussin",
              name: "③ Pont Fessier avec Coussin",
              description: "Pont fessier en serrant un coussin entre les genoux.",
              volume: { type: "circuit_reps", reps: 15 },
              videoUrl: null
            },
            {
              id: "p3_gainage_genoux",
              name: "④ Gainage sur les Genoux",
              description: "Sur coudes + genoux, nombril aspiré, fessiers serrés.",
              volume: { type: "circuit_duration", duration: "35 secondes" },
              videoUrl: null
            }
          ],
          cooldown: {
            duration: 3,
            description: "Étirements globaux au sol : dos, fessiers, jambes, épaules."
          }
        },
        {
          id: "p3_mercredi",
          dayName: "Mercredi",
          dayEmoji: "💓",
          name: "Cardio Intervalle Doux",
          color: "#FFE4B5",
          isInterval: true,
          warmup: null,
          exercises: [
            {
              id: "p3_intervalle",
              name: "Marche en Intervalles",
              description: "Marche sur place ou en extérieur. Format : 5 min échauffement lent → 6 blocs de (2 min soutenu + 2 min récupération lente) → 5 min retour au calme avec étirements des jambes. Total : 34 min. Ce format brûle-graisse stimule le métabolisme sans déclencher la tachycardie.",
              volume: {
                type: "interval",
                totalDuration: "34 minutes",
                steps: [
                  { label: "Échauffement", duration: "5 min", intensity: "Très lent" },
                  { label: "Bloc × 6", duration: "24 min", intensity: "2 min soutenu + 2 min lent", rounds: 6 },
                  { label: "Retour au calme", duration: "5 min", intensity: "Très lent + étirements" }
                ]
              },
              videoUrl: null
            }
          ],
          cooldown: null
        },
        {
          id: "p3_vendredi",
          dayName: "Vendredi",
          dayEmoji: "🦾",
          name: "Force Douce & Mobilité Avancée",
          color: "#FFD700",
          warmup: {
            duration: 5,
            description: "Échauffement habituel."
          },
          exercises: [
            {
              id: "p3_pont_unilateral",
              name: "Pont Fessier Unilatéral",
              description: "Garder un pied au sol, décoller l'autre jambe de quelques centimètres, et pousser le bassin avec UNE SEULE jambe. C'est difficile ! Option si trop dur : rester sur le pont classique à 15 répétitions.",
              volume: { type: "sets_reps", sets: 2, reps: "8 de chaque côté", optional: true, optionalNote: "Si trop difficile : pont classique 15 reps" },
              videoUrl: null
            },
            {
              id: "p3_developpe_palette",
              name: "Développé Palette (Élastique)",
              description: "Élastique dans le dos, passé sous les aisselles. Pousser les deux mains vers l'avant pour tendre les bras complètement, puis revenir lentement. Tonifie la poitrine et l'avant des bras.",
              volume: { type: "sets_reps", sets: 3, reps: 12 },
              videoUrl: null
            },
            {
              id: "p3_dead_bug_avance",
              name: "Le « Dead Bug » Avancé",
              description: "Même position qu'en Phase 1, mais en tendant la jambe VERS L'AVANT (quasi horizontale, sans toucher le sol !) au lieu de simplement fléchir le genou. Le bas du dos reste scellé au sol à tout moment.",
              volume: { type: "sets_reps", sets: 3, reps: "6 par jambe" },
              videoUrl: null
            }
          ],
          cooldown: {
            duration: 5,
            description: "Séance complète d'étirements (dos, fessiers, jambes) en insistant sur la respiration lente pour faire redescendre le cœur. Prendre le temps, c'est mérité !"
          }
        }
      ]
    }
  ]
};

const GOLDEN_RULES = [
  {
    emoji: "💧",
    title: "L'hydratation",
    content: "Boire de petites gorgées d'eau plate tout au long des séances. C'est encore plus important pour la tachycardie et les jambes lourdes."
  },
  {
    emoji: "💗",
    title: "L'écoute de son corps",
    content: "Si la semaine 5 paraît trop dure, tu as le droit de refaire une semaine de la Phase 1. Le corps n'est pas une machine linéaire, et c'est normal !"
  },
  {
    emoji: "🌟",
    title: "La régularité avant tout",
    content: "Manquer une séance n'est PAS grave — il suffit de la décaler au lendemain. L'important c'est d'aller au bout des 12 semaines. La constance fait la championne !"
  }
];

const QUOTES = [
  "Chaque répétition te rapproche de la meilleure version de toi 💪",
  "Tu es plus forte que tu ne le crois 🌸",
  "La constance fait la championne ✨",
  "Prends soin de toi, tu le mérites 💖",
  "Chaque séance est une petite victoire 🏆",
  "Ton corps te remerciera demain 🌺",
  "La douceur aussi, c'est du courage 🦋",
  "Un pas à la fois, une semaine à la fois 🎀"
];
