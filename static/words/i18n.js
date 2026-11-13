// Definition languages + UI strings.
// To add a language: add data/defs.<code>.json (one string per word, same order
// as data/words.json), add an entry below, and list the file in sw.js.
// `about` is the About dialog: sections with a heading `h` and either a paragraph
// `p` (strings and { text, href } links) or a bullet list `ul`.

export const LANGS = {
  en: {
    name: 'English',
    defs: './data/defs.en.json',
    about: [
      { h: 'What it is', p: ['Words is a free flashcard app for learning the most useful words in English. Each card shows an English word; flip it to see its meaning in English or French.'] },
      { h: 'What you can do', ul: [
        'Learn a few new words each day: 10 by default, adjustable in Settings.',
        'Review each word just before you’re likely to forget it. This is called spaced repetition: words you know well come back less and less often.',
        'Rate each card Again, Hard, Good or Easy. Your answer decides when you’ll see it next.',
        'Hear how a word is pronounced, and browse or search all 2,809 words in the List.',
        'Follow your streak, mastery and upcoming reviews in Progress.',
        'Use it offline, or install it on your phone or computer. There’s no account: your progress stays in this browser, and you can export a backup from Settings.',
      ] },
      { h: 'Where the words come from', p: ['The words come from the ', { text: 'New General Service List (NGSL) 1.2', href: 'https://www.newgeneralservicelist.com/new-general-service-list' }, ', created by Charles Browne, Brent Culligan and Joseph Phillips. It updates Michael West’s classic General Service List of 1953, using a large corpus of modern English to find the words that are most common across many kinds of text.'] },
      { h: 'Why these words matter', p: ['A small set of words does most of the work in any language. The roughly 2,800 NGSL words make up about 92% of the words in typical English texts. Learning them first gives you the biggest return on your study time: you’ll understand most of what you read and hear, and can work out many of the rest from context.'] },
      { h: 'Credits', p: ['Word list, pronunciations and English definitions: the ', { text: 'NGSL Learning Dictionary', href: 'https://www.linguaeruditio.com/Glossary/NGSL/NGSL_gloss.html' }, ' (CC BY-SA 4.0). The French translations were written for this app.'] },
    ],
    pos: { noun: 'noun', verb: 'verb', adj: 'adjective', adv: 'adverb', prep: 'preposition', pron: 'pronoun', conj: 'conjunction', det: 'determiner', aux: 'auxiliary', intj: 'interjection', num: 'number' },
    units: { today: 'today', d: 'd', mo: 'mo', y: 'y' },
    ui: {
      'app.tagline': 'Learn the most common English words, covering 90% of text, in a few minutes a day.',
      'nav.about': 'About', 'about.title': 'About Words', 'about.close': 'Close',
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
    about: [
      { h: 'De quoi s’agit-il ?', p: ['Words est une application gratuite de cartes mémoire pour apprendre les mots les plus utiles de l’anglais. Chaque carte montre un mot anglais ; retournez-la pour voir sa signification en anglais ou en français.'] },
      { h: 'Ce que vous pouvez faire', ul: [
        'Apprendre quelques nouveaux mots chaque jour : 10 par défaut, réglable dans les Réglages.',
        'Revoir chaque mot juste avant de risquer de l’oublier. C’est la répétition espacée : les mots que vous connaissez bien reviennent de moins en moins souvent.',
        'Noter chaque carte À revoir, Difficile, Bien ou Facile. Votre réponse décide quand vous la reverrez.',
        'Écouter la prononciation d’un mot, et parcourir ou rechercher les 2 809 mots dans la Liste.',
        'Suivre vos jours d’affilée, votre maîtrise et vos prochaines révisions dans Progrès.',
        'L’utiliser hors connexion, ou l’installer sur votre téléphone ou votre ordinateur. Pas de compte : vos progrès restent dans ce navigateur, et vous pouvez en exporter une sauvegarde depuis les Réglages.',
      ] },
      { h: 'D’où viennent les mots ?', p: ['Les mots proviennent de la ', { text: 'New General Service List (NGSL) 1.2', href: 'https://www.newgeneralservicelist.com/new-general-service-list' }, ', créée par Charles Browne, Brent Culligan et Joseph Phillips. Elle actualise la célèbre General Service List de Michael West (1953) à l’aide d’un vaste corpus d’anglais moderne, pour retenir les mots les plus fréquents dans de nombreux types de textes.'] },
      { h: 'Pourquoi ces mots comptent', p: ['Un petit nombre de mots fait l’essentiel du travail dans toute langue. Les quelque 2 800 mots de la NGSL représentent environ 92 % des mots d’un texte anglais courant. Les apprendre en premier rentabilise au mieux votre temps d’étude : vous comprendrez l’essentiel de ce que vous lisez et entendez, et pourrez deviner une bonne partie du reste grâce au contexte.'] },
      { h: 'Crédits', p: ['Liste de mots, prononciations et définitions anglaises : le ', { text: 'NGSL Learning Dictionary', href: 'https://www.linguaeruditio.com/Glossary/NGSL/NGSL_gloss.html' }, ' (CC BY-SA 4.0). Les traductions françaises ont été rédigées pour cette application.'] },
    ],
    pos: { noun: 'nom', verb: 'verbe', adj: 'adjectif', adv: 'adverbe', prep: 'préposition', pron: 'pronom', conj: 'conjonction', det: 'déterminant', aux: 'auxiliaire', intj: 'interjection', num: 'nombre' },
    units: { today: 'auj.', d: 'j', mo: 'mois', y: 'an' },
    ui: {
      'app.tagline': 'Apprenez les mots anglais les plus courants, 90 % des textes, en quelques minutes par jour.',
      'nav.about': 'À propos', 'about.title': 'À propos de Words', 'about.close': 'Fermer',
      'nav.study': 'Étudier', 'nav.words': 'Liste', 'nav.progress': 'Progrès', 'nav.settings': 'Réglages',
      'chip.new': 'Nouveaux', 'chip.learning': 'En cours', 'chip.review': 'À revoir',
      'study.progress': 'Progression de la séance du jour',
      'card.new': 'Nouveau mot', 'card.hint': 'Touchez la carte ou appuyez sur Espace pour révéler',
      'card.listen': 'Écouter la prononciation', 'card.show': 'Voir la réponse', 'card.undo': 'Annuler',
      'rate.1': 'À revoir', 'rate.2': 'Difficile', 'rate.3': 'Bien', 'rate.4': 'Facile', 'rate.prompt': 'Connaissiez-vous ce mot ?',
      'done.title': 'C’est tout pour aujourd’hui', 'done.sub': 'Bravo ! Revenez demain pour entretenir votre mémoire.',
      'done.tomorrow': 'À revoir demain', 'done.streak': 'Jours d’affilée', 'done.today': 'Étudiés aujourd’hui',
      'done.more': 'Apprendre {n} nouveaux mots de plus', 'done.finished': 'Vous avez vu tous les mots de la liste !',
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
      'set.credit': 'Liste de mots : New General Service List 1.2 (Browne, Culligan et Phillips), via le',
      'set.creditLink': 'NGSL Learning Dictionary',
      'reset.title': 'Réinitialiser tous les progrès ?', 'reset.body': 'Votre historique et votre calendrier de révision seront effacés de cet appareil. Cette action est irréversible.',
      'reset.cancel': 'Annuler', 'reset.confirm': 'Effacer les progrès',
      'msg.exported': 'Sauvegarde téléchargée.', 'msg.imported': 'Sauvegarde restaurée.', 'msg.importBad': 'Ce fichier n’est pas une sauvegarde valide.',
      'msg.reset': 'Progrès effacés.', 'msg.installed': 'Application installée.', 'msg.installCancelled': 'Installation annulée.',
      'msg.storage': 'Enregistrement impossible : le stockage du navigateur est indisponible.',
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

/** Structured About-dialog content for the current language. */
export const aboutContent = () => LANGS[current].about ?? LANGS.en.about;

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
