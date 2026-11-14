// Languages and UI strings.
//
// STUDY lists the languages that can be learned (front of the cards). Each has a
// folder data/<study>/ holding words.json and one defs.<lang>.json per explanation
// language. LANGS lists the explanation languages (back of the cards + interface).
// To add either kind, add the data files and an entry below, then list the files
// in sw.js.
// `about` is the About dialog: sections with a heading `h` and either a paragraph
// `p` (strings and { text, href } links) or a bullet list `ul`.

export const STUDY = {
  en: { name: 'English', voice: 'en-US' },
  fr: { name: 'Français', voice: 'fr-FR' },
  es: { name: 'Español', voice: 'es-MX' },
  de: { name: 'Deutsch', voice: 'de-DE' },
};

export const dataPath = (study, file) => `./data/${study}/${file}`;

export const LANGS = {
  en: {
    name: 'English',
    about: [
      { h: 'What it is', p: ['Words is a free flashcard app for learning the most useful words in English, French, Spanish or German. Pick the language you’re studying and the language you want explanations in. Each card shows a word in your study language; flip it to see what it means in your explanation language.'] },
      { h: 'What you can do', ul: [
        'Study English, French, Spanish or German, with explanations in English or French. Change either at any time in Settings; each study language keeps its own progress.',
        'Learn a few new words each day: 10 by default, adjustable in Settings.',
        'Choose the order new words come in: Mixed (the default), Most common first, or Random. Settings explains which one suits you.',
        'Review each word just before you’re likely to forget it. This is called spaced repetition: words you know well come back less and less often.',
        'Rate each card Again, Hard, Good or Easy. Your answer decides when you’ll see it next.',
        'Hear how a word is pronounced, and browse or search the whole word list in the List.',
        'Follow your streak, mastery and upcoming reviews in Progress.',
        'Use it offline, or install it on your phone or computer. There’s no account: your progress stays in this browser, and you can export a backup from Settings.',
      ] },
      { h: 'Where the English words come from', p: ['The 2,809 English words are the ', { text: 'New General Service List (NGSL) 1.2', href: 'https://www.newgeneralservicelist.com/new-general-service-list' }, ', created by Charles Browne, Brent Culligan and Joseph Phillips. It updates Michael West’s classic General Service List of 1953, using a large corpus of modern English to find the words that are most common across many kinds of text.'] },
      { h: 'Where the French words come from', p: ['The French words come from the ', { text: 'Liste de fréquence lexicale', href: 'https://eduscol.education.gouv.fr/6873/liste-de-frequence-lexicale' }, ' published by Éduscol, the French Ministry of Education: nearly 1,500 of the most frequent words in French, compiled by the lexicologist Étienne Brunet from the kinds of text French-speaking pupils read. Here, a word with several roles (such as “le”, both article and pronoun) gets a single card, which gives 1,354 cards.'] },
      { h: 'Where the Spanish words come from', p: ['The 2,107 Spanish words are the most frequent lemmas in ', { text: 'CORPES XXI', href: 'https://www.rae.es/corpes/' }, ', the Spanish Royal Academy’s corpus of 21st-century Spanish from more than 20 countries (CC BY-SA 4.0). Punctuation, numbers, names and most nationalities were left out.'] },
      { h: 'Where the German words come from', p: ['The 2,088 German words are the most frequent lemmas in ', { text: 'DeReWo', href: 'https://www.ids-mannheim.de/en/s/corpus-linguistics/projects/methods-of-analysis/corpus-based-lemma-and-word-form-lists/' }, ', the word lists that the Leibniz Institute for the German Language (IDS Mannheim) built from its German Reference Corpus, used under ', { text: 'CC BY-NC 3.0', href: 'https://creativecommons.org/licenses/by-nc/3.0/' }, '. Names, abbreviations and terms for local government bodies were left out. Nouns are shown with their article (der, die, das).'] },
      { h: 'Why these words matter', p: ['A small set of words does most of the work in any language. The roughly 2,800 NGSL words make up about 92% of the words in typical English texts, and the most frequent words of French, Spanish and German likewise make up most of any text in those languages. Learning them first gives you the biggest return on your study time: you’ll understand most of what you read and hear, and can work out many of the rest from context.'] },
      { h: 'Credits', p: ['English word list, pronunciations and definitions: the ', { text: 'NGSL Learning Dictionary', href: 'https://www.linguaeruditio.com/Glossary/NGSL/NGSL_gloss.html' }, ' (CC BY-SA 4.0). French word list: Éduscol’s Liste de fréquence lexicale (Étienne Brunet). Spanish word list: CORPES XXI, Real Academia Española (CC BY-SA 4.0). German word list: DeReWo, © Leibniz Institute for the German Language (IDS), Mannheim, 2013 (CC BY-NC 3.0). The French, Spanish and German pronunciations, genders and definitions, and all translations, were written for this app.'] },
    ],
    pos: { noun: 'noun', nm: 'masculine noun', nf: 'feminine noun', nn: 'neuter noun', nmf: 'noun (m/f)', npl: 'plural noun', verb: 'verb', adj: 'adjective', adv: 'adverb', prep: 'preposition', pron: 'pronoun', conj: 'conjunction', det: 'determiner', aux: 'auxiliary', intj: 'interjection', num: 'number' },
    units: { today: 'today', d: 'd', mo: 'mo', y: 'y' },
    ui: {
      'app.title': 'Words — flashcards for the most common words in English, French, Spanish and German',
      'app.tagline': 'Learn the most common words, in the language of your choice, in just a few minutes a day.',
      'study.en': 'English', 'study.fr': 'French', 'study.es': 'Spanish', 'study.de': 'German',
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
      'set.title': 'Settings', 'set.study': 'Study language', 'set.studyHelp': 'The language you are learning. The word on the front of each card is in this language. Each study language keeps its own progress.',
      'set.lang': 'Explanation language', 'set.langHelp': 'The meaning on the back of each card, and the app’s menus and messages, are in this language.',
      'msg.studyError': 'Could not load that language. Check your connection and try again.',
      'set.theme': 'Appearance', 'set.system': 'System', 'set.light': 'Light', 'set.dark': 'Dark',
      'set.systemNow': 'System (currently {scheme})', 'set.lightLc': 'light', 'set.darkLc': 'dark',
      'set.srs': 'Spaced repetition', 'set.newPerDay': 'New words per day', 'set.maxReviews': 'Maximum reviews per day',
      'set.order': 'New word order', 'set.orderFreq': 'Most common first', 'set.orderRandom': 'Random',
      'set.orderMixed': 'Mixed', 'set.recommended': 'Recommended',
      'set.orderMixedHelp': 'Each day blends very common words with less common ones, weighted toward the most useful. Suits most learners, especially if you already know some English.',
      'set.orderFreqHelp': 'Strict frequency order, starting with “{a}”, “{b}” and “{c}”. Best for beginners: each new word is the most useful one you don’t know yet.',
      'set.orderRandomHelp': 'Any word from the whole list, each equally likely. Since most of the list is less common words, this suits advanced learners who want a challenge.',
      'set.pace': 'Review pace', 'set.paceHelp': 'Scales the gap between reviews. Assumes you study once a day.',
      'set.pace.0.8': 'Intensive (shorter gaps)', 'set.pace.1': 'Standard', 'set.pace.1.3': 'Relaxed (longer gaps)',
      'set.data': 'Your data', 'set.dataHelp': 'Progress is stored only in this browser.',
      'set.export': 'Export backup', 'set.import': 'Import backup', 'set.reset': 'Reset progress',
      'set.install': 'Install app', 'set.close': 'Done',
      'reset.title': 'Reset your {language} progress?', 'reset.body': 'This erases your review history and schedule for {language} on this device. It cannot be undone.',
      'reset.cancel': 'Cancel', 'reset.confirm': 'Erase progress',
      'msg.exported': 'Backup downloaded.', 'msg.imported': 'Backup restored.', 'msg.importBad': 'That file is not a valid backup.',
      'msg.reset': 'Progress erased.', 'msg.installed': 'App installed.', 'msg.installCancelled': 'Installation was cancelled.',
      'msg.storage': 'Could not save — browser storage is unavailable.',
      'load.error': 'Could not load the word list. Check your connection and reload.',
    },
  },
  fr: {
    name: 'Français',
    about: [
      { h: 'De quoi s’agit-il ?', p: ['Words est une application gratuite de cartes mémoire pour apprendre les mots les plus utiles de l’anglais, du français, de l’espagnol ou de l’allemand. Choisissez la langue que vous étudiez et la langue des explications. Chaque carte montre un mot de la langue étudiée ; retournez-la pour voir son sens dans la langue des explications.'] },
      { h: 'Ce que vous pouvez faire', ul: [
        'Étudier l’anglais, le français, l’espagnol ou l’allemand, avec des explications en anglais ou en français. Changez l’une ou l’autre à tout moment dans les Réglages ; chaque langue étudiée garde ses propres progrès.',
        'Apprendre quelques nouveaux mots chaque jour : 10 par défaut, réglable dans les Réglages.',
        'Choisir l’ordre des nouveaux mots : Mélangé (par défaut), Les plus courants d’abord ou Aléatoire. Les Réglages expliquent lequel vous convient.',
        'Revoir chaque mot juste avant de risquer de l’oublier. C’est la répétition espacée : les mots que vous connaissez bien reviennent de moins en moins souvent.',
        'Noter chaque carte À revoir, Difficile, Bien ou Facile. Votre réponse décide quand vous la reverrez.',
        'Écouter la prononciation d’un mot, et parcourir ou rechercher toute la liste de mots dans la Liste.',
        'Suivre vos jours d’affilée, votre maîtrise et vos prochaines révisions dans Progrès.',
        'L’utiliser hors connexion, ou l’installer sur votre téléphone ou votre ordinateur. Pas de compte : vos progrès restent dans ce navigateur, et vous pouvez en exporter une sauvegarde depuis les Réglages.',
      ] },
      { h: 'D’où viennent les mots anglais ?', p: ['Les 2 809 mots anglais sont ceux de la ', { text: 'New General Service List (NGSL) 1.2', href: 'https://www.newgeneralservicelist.com/new-general-service-list' }, ', créée par Charles Browne, Brent Culligan et Joseph Phillips. Elle actualise la célèbre General Service List de Michael West (1953) à l’aide d’un vaste corpus d’anglais moderne, pour retenir les mots les plus fréquents dans de nombreux types de textes.'] },
      { h: 'D’où viennent les mots français ?', p: ['Les mots français proviennent de la ', { text: 'Liste de fréquence lexicale', href: 'https://eduscol.education.gouv.fr/6873/liste-de-frequence-lexicale' }, ' publiée par Éduscol (ministère de l’Éducation nationale) : près de 1 500 mots parmi les plus fréquents du français, réunis par le lexicologue Étienne Brunet à partir des textes que lisent les élèves francophones. Ici, un mot qui a plusieurs rôles (comme « le », article et pronom) n’a qu’une seule carte, soit 1 354 cartes.'] },
      { h: 'D’où viennent les mots espagnols ?', p: ['Les 2 107 mots espagnols sont les lemmes les plus fréquents du ', { text: 'CORPES XXI', href: 'https://www.rae.es/corpes/' }, ', le corpus de l’espagnol du XXIᵉ siècle de la Real Academia Española, couvrant plus de 20 pays (CC BY-SA 4.0). La ponctuation, les nombres, les noms propres et la plupart des nationalités ont été écartés.'] },
      { h: 'D’où viennent les mots allemands ?', p: ['Les 2 088 mots allemands sont les lemmes les plus fréquents de ', { text: 'DeReWo', href: 'https://www.ids-mannheim.de/en/s/corpus-linguistics/projects/methods-of-analysis/corpus-based-lemma-and-word-form-lists/' }, ', les listes établies par l’Institut Leibniz pour la langue allemande (IDS Mannheim) à partir de son corpus de référence de l’allemand, utilisées sous licence ', { text: 'CC BY-NC 3.0', href: 'https://creativecommons.org/licenses/by-nc/3.0/' }, '. Les noms propres, les abréviations et les termes de l’administration locale ont été écartés. Les noms sont donnés avec leur article (der, die, das).'] },
      { h: 'Pourquoi ces mots comptent', p: ['Un petit nombre de mots fait l’essentiel du travail dans toute langue. Les quelque 2 800 mots de la NGSL représentent environ 92 % des mots d’un texte anglais courant, et les mots les plus fréquents du français, de l’espagnol et de l’allemand forment de même l’essentiel de tout texte dans ces langues. Les apprendre en premier rentabilise au mieux votre temps d’étude : vous comprendrez l’essentiel de ce que vous lisez et entendez, et pourrez deviner une bonne partie du reste grâce au contexte.'] },
      { h: 'Crédits', p: ['Liste de mots, prononciations et définitions anglaises : le ', { text: 'NGSL Learning Dictionary', href: 'https://www.linguaeruditio.com/Glossary/NGSL/NGSL_gloss.html' }, ' (CC BY-SA 4.0). Liste de mots française : la Liste de fréquence lexicale d’Éduscol (Étienne Brunet). Liste de mots espagnole : CORPES XXI, Real Academia Española (CC BY-SA 4.0). Liste de mots allemande : DeReWo, © Institut Leibniz pour la langue allemande (IDS), Mannheim, 2013 (CC BY-NC 3.0). Les prononciations, genres et définitions des mots français, espagnols et allemands, ainsi que toutes les traductions, ont été rédigés pour cette application.'] },
    ],
    pos: { noun: 'nom', nm: 'nom masculin', nf: 'nom féminin', nn: 'nom neutre', nmf: 'nom (m/f)', npl: 'nom pluriel', verb: 'verbe', adj: 'adjectif', adv: 'adverbe', prep: 'préposition', pron: 'pronom', conj: 'conjonction', det: 'déterminant', aux: 'auxiliaire', intj: 'interjection', num: 'nombre' },
    units: { today: 'auj.', d: 'j', mo: 'mois', y: 'an' },
    ui: {
      'app.title': 'Words — cartes mémoire des mots les plus courants en anglais, français, espagnol et allemand',
      'app.tagline': 'Les mots les plus courants, dans la langue de votre choix, en quelques minutes par jour.',
      'study.en': 'anglais', 'study.fr': 'français', 'study.es': 'espagnol', 'study.de': 'allemand',
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
      'set.title': 'Réglages', 'set.study': 'Langue étudiée', 'set.studyHelp': 'La langue que vous apprenez. Le mot au recto de chaque carte est dans cette langue. Chaque langue étudiée garde ses propres progrès.',
      'set.lang': 'Langue des explications', 'set.langHelp': 'Le sens au dos de chaque carte, ainsi que les menus et les messages de l’application, sont dans cette langue.',
      'msg.studyError': 'Impossible de charger cette langue. Vérifiez votre connexion et réessayez.',
      'set.theme': 'Apparence', 'set.system': 'Système', 'set.light': 'Clair', 'set.dark': 'Sombre',
      'set.systemNow': 'Système (actuellement {scheme})', 'set.lightLc': 'clair', 'set.darkLc': 'sombre',
      'set.srs': 'Répétition espacée', 'set.newPerDay': 'Nouveaux mots par jour', 'set.maxReviews': 'Révisions maximum par jour',
      'set.order': 'Ordre des nouveaux mots', 'set.orderFreq': 'Les plus courants d’abord', 'set.orderRandom': 'Aléatoire',
      'set.orderMixed': 'Mélangé', 'set.recommended': 'Recommandé',
      'set.orderMixedHelp': 'Chaque jour mêle des mots très courants et d’autres moins courants, en privilégiant les plus utiles. Convient à la plupart des apprenants, surtout si vous connaissez déjà un peu d’anglais.',
      'set.orderFreqHelp': 'Ordre strict de fréquence, en commençant par « {a} », « {b} » et « {c} ». Idéal pour les débutants : chaque nouveau mot est le plus utile que vous ne connaissez pas encore.',
      'set.orderRandomHelp': 'N’importe quel mot de la liste, avec la même probabilité. La liste comptant surtout des mots moins courants, ce choix convient aux apprenants avancés qui veulent un défi.',
      'set.pace': 'Rythme des révisions', 'set.paceHelp': 'Ajuste l’écart entre les révisions. Suppose une séance par jour.',
      'set.pace.0.8': 'Intensif (écarts plus courts)', 'set.pace.1': 'Standard', 'set.pace.1.3': 'Détendu (écarts plus longs)',
      'set.data': 'Vos données', 'set.dataHelp': 'Vos progrès sont enregistrés uniquement dans ce navigateur.',
      'set.export': 'Exporter une sauvegarde', 'set.import': 'Importer une sauvegarde', 'set.reset': 'Réinitialiser',
      'set.install': 'Installer l’application', 'set.close': 'Terminé',
      'reset.title': 'Réinitialiser vos progrès en {language} ?', 'reset.body': 'Votre historique et votre calendrier de révision en {language} seront effacés de cet appareil. Cette action est irréversible.',
      'reset.cancel': 'Annuler', 'reset.confirm': 'Effacer les progrès',
      'msg.exported': 'Sauvegarde téléchargée.', 'msg.imported': 'Sauvegarde restaurée.', 'msg.importBad': 'Ce fichier n’est pas une sauvegarde valide.',
      'msg.reset': 'Progrès effacés.', 'msg.installed': 'Application installée.', 'msg.installCancelled': 'Installation annulée.',
      'msg.storage': 'Enregistrement impossible : le stockage du navigateur est indisponible.',
      'load.error': 'Impossible de charger la liste de mots. Vérifiez votre connexion et rechargez la page.',
    },
  },
};

let current = 'en';
let study = 'en';

export const getStudy = () => study;
export function setStudy(code) {
  study = STUDY[code] ? code : 'en';
  return study;
}

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
