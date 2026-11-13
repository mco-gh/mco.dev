// Definition languages + UI strings.
// To add a language: add data/defs.<code>.json (one string per word, same order
// as data/words.json), add an entry below, and list the file in sw.js.

export const LANGS = {
  en: {
    name: 'English',
    defs: './data/defs.en.json',
    pos: { noun: 'noun', verb: 'verb', adj: 'adjective', adv: 'adverb', prep: 'preposition', pron: 'pronoun', conj: 'conjunction', det: 'determiner', aux: 'auxiliary', intj: 'interjection', num: 'number' },
    units: { today: 'today', d: 'd', mo: 'mo', y: 'y' },
    ui: {
      'nav.study': 'Study', 'nav.words': 'List', 'nav.progress': 'Progress', 'nav.settings': 'Settings',
      'chip.new': 'New', 'chip.learning': 'Learning', 'chip.review': 'Review',
      'study.progress': 'Today’s session progress',
      'card.new': 'New word', 'card.hint': 'Tap the card or press Space to reveal',
      'card.listen': 'Listen to pronunciation', 'card.show': 'Show answer', 'card.undo': 'Undo',
      'rate.1': 'Again', 'rate.2': 'Hard', 'rate.3': 'Good', 'rate.4': 'Easy', 'rate.prompt': 'How well did you know it?',
      'done.title': 'All done for today', 'done.sub': 'Nice work. Come back tomorrow to keep your memory fresh.',
      'done.tomorrow': 'Due tomorrow', 'done.streak': 'Day streak', 'done.today': 'Studied today',
      'done.more': 'Learn {n} more new words', 'done.finished': 'You have seen every word in the list!',
      'words.search': 'Search words', 'words.filter': 'Filter by status', 'words.all': 'All words',
      'words.count': '{n} words', 'words.empty': 'No words match.',
      'bucket.new': 'Not seen', 'bucket.learning': 'Learning', 'bucket.young': 'Young', 'bucket.mature': 'Mastered',
      'stats.streak': 'Day streak', 'stats.learned': 'Words learned', 'stats.mature': 'Mastered', 'stats.reviews': 'Total reviews',
      'stats.mastery': 'Mastery', 'stats.forecast': 'Reviews due — next 14 days', 'stats.of': 'of {n}',
      'set.title': 'Settings', 'set.lang': 'Definition language', 'set.langHelp': 'Card backs and the app interface use this language.',
      'set.theme': 'Appearance', 'set.system': 'System', 'set.light': 'Light', 'set.dark': 'Dark',
      'set.systemNow': 'System (currently {scheme})', 'set.lightLc': 'light', 'set.darkLc': 'dark',
      'set.srs': 'Spaced repetition', 'set.newPerDay': 'New words per day', 'set.maxReviews': 'Maximum reviews per day',
      'set.order': 'New word order', 'set.orderFreq': 'Most common first', 'set.orderRandom': 'Random',
      'set.pace': 'Review pace', 'set.paceHelp': 'Scales the gap between reviews. Assumes you study once a day.',
      'set.pace.0.8': 'Intensive (shorter gaps)', 'set.pace.1': 'Standard', 'set.pace.1.3': 'Relaxed (longer gaps)',
      'set.data': 'Your data', 'set.dataHelp': 'Progress is stored only in this browser.',
      'set.export': 'Export backup', 'set.import': 'Import backup', 'set.reset': 'Reset progress',
      'set.install': 'Install app', 'set.close': 'Done',
      'set.credit': 'Word list: New General Service List 1.2 (Browne, Culligan & Phillips), via the',
      'set.creditLink': 'NGSL Learning Dictionary',
      'reset.title': 'Reset all progress?', 'reset.body': 'This erases your review history and schedule on this device. It cannot be undone.',
      'reset.cancel': 'Cancel', 'reset.confirm': 'Erase progress',
      'msg.exported': 'Backup downloaded.', 'msg.imported': 'Backup restored.', 'msg.importBad': 'That file is not a valid backup.',
      'msg.reset': 'Progress erased.', 'msg.installed': 'App installed.', 'msg.installCancelled': 'Installation was cancelled.',
      'msg.storage': 'Could not save — browser storage is unavailable.',
      'load.error': 'Could not load the word list. Check your connection and reload.',
    },
  },
  fr: {
    name: 'Français',
    defs: './data/defs.fr.json',
    pos: { noun: 'nom', verb: 'verbe', adj: 'adjectif', adv: 'adverbe', prep: 'préposition', pron: 'pronom', conj: 'conjonction', det: 'déterminant', aux: 'auxiliaire', intj: 'interjection', num: 'nombre' },
    units: { today: 'auj.', d: 'j', mo: 'mois', y: 'an' },
    ui: {
      'nav.study': 'Étudier', 'nav.words': 'Liste', 'nav.progress': 'Progrès', 'nav.settings': 'Réglages',
      'chip.new': 'Nouveaux', 'chip.learning': 'En cours', 'chip.review': 'À revoir',
      'study.progress': 'Progression de la séance du jour',
      'card.new': 'Nouveau mot', 'card.hint': 'Touchez la carte ou appuyez sur Espace pour révéler',
      'card.listen': 'Écouter la prononciation', 'card.show': 'Voir la réponse', 'card.undo': 'Annuler',
      'rate.1': 'À revoir', 'rate.2': 'Difficile', 'rate.3': 'Bien', 'rate.4': 'Facile', 'rate.prompt': 'Connaissiez-vous ce mot ?',
      'done.title': 'C’est tout pour aujourd’hui', 'done.sub': 'Bravo ! Revenez demain pour entretenir votre mémoire.',
      'done.tomorrow': 'À revoir demain', 'done.streak': 'Jours d’affilée', 'done.today': 'Étudiés aujourd’hui',
      'done.more': 'Apprendre {n} nouveaux mots de plus', 'done.finished': 'Vous avez vu tous les mots de la liste !',
      'words.search': 'Rechercher un mot', 'words.filter': 'Filtrer par statut', 'words.all': 'Tous les mots',
      'words.count': '{n} mots', 'words.empty': 'Aucun mot ne correspond.',
      'bucket.new': 'Pas encore vu', 'bucket.learning': 'En cours', 'bucket.young': 'Récent', 'bucket.mature': 'Maîtrisé',
      'stats.streak': 'Jours d’affilée', 'stats.learned': 'Mots appris', 'stats.mature': 'Maîtrisés', 'stats.reviews': 'Révisions au total',
      'stats.mastery': 'Maîtrise', 'stats.forecast': 'Révisions prévues — 14 prochains jours', 'stats.of': 'sur {n}',
      'set.title': 'Réglages', 'set.lang': 'Langue des définitions', 'set.langHelp': 'Le dos des cartes et l’interface utilisent cette langue.',
      'set.theme': 'Apparence', 'set.system': 'Système', 'set.light': 'Clair', 'set.dark': 'Sombre',
      'set.systemNow': 'Système (actuellement {scheme})', 'set.lightLc': 'clair', 'set.darkLc': 'sombre',
      'set.srs': 'Répétition espacée', 'set.newPerDay': 'Nouveaux mots par jour', 'set.maxReviews': 'Révisions maximum par jour',
      'set.order': 'Ordre des nouveaux mots', 'set.orderFreq': 'Les plus courants d’abord', 'set.orderRandom': 'Aléatoire',
      'set.pace': 'Rythme des révisions', 'set.paceHelp': 'Ajuste l’écart entre les révisions. Suppose une séance par jour.',
      'set.pace.0.8': 'Intensif (écarts plus courts)', 'set.pace.1': 'Standard', 'set.pace.1.3': 'Détendu (écarts plus longs)',
      'set.data': 'Vos données', 'set.dataHelp': 'Vos progrès sont enregistrés uniquement dans ce navigateur.',
      'set.export': 'Exporter une sauvegarde', 'set.import': 'Importer une sauvegarde', 'set.reset': 'Réinitialiser',
      'set.install': 'Installer l’application', 'set.close': 'Terminé',
      'set.credit': 'Liste de mots : New General Service List 1.2 (Browne, Culligan et Phillips), via le',
      'set.creditLink': 'NGSL Learning Dictionary',
      'reset.title': 'Réinitialiser tous les progrès ?', 'reset.body': 'Votre historique et votre calendrier de révision seront effacés de cet appareil. Cette action est irréversible.',
      'reset.cancel': 'Annuler', 'reset.confirm': 'Effacer les progrès',
      'msg.exported': 'Sauvegarde téléchargée.', 'msg.imported': 'Sauvegarde restaurée.', 'msg.importBad': 'Ce fichier n’est pas une sauvegarde valide.',
      'msg.reset': 'Progrès effacés.', 'msg.installed': 'Application installée.', 'msg.installCancelled': 'Installation annulée.',
      'msg.storage': 'Enregistrement impossible : le stockage du navigateur est indisponible.',
      'load.error': 'Impossible de charger la liste de mots. Vérifiez votre connexion et rechargez la page.',
    },
  },
};

let current = 'en';

export const getLang = () => current;
export function setLang(code) {
  current = LANGS[code] ? code : 'en';
  return current;
}

export function t(key, vars) {
  let s = LANGS[current].ui[key] ?? LANGS.en.ui[key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, v);
  return s;
}

/** "verb, noun" -> localized, comma-separated part-of-speech label. */
export function posLabel(pos) {
  const map = LANGS[current].pos;
  return pos.split(/,\s*/).map((p) => map[p] ?? p).join(', ');
}

/** Short interval label for rating buttons, e.g. "4 d", "2.5 mo". */
export function fmtInterval(days) {
  const u = LANGS[current].units;
  const nf = new Intl.NumberFormat(current, { maximumFractionDigits: 1 });
  if (days <= 0) return u.today;
  if (days < 30) return `${days} ${u.d}`;
  if (days < 365) return `${nf.format(days / 30)} ${u.mo}`;
  return `${nf.format(days / 365)} ${u.y}`;
}
