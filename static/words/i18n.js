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
        'Study English, French, Spanish or German, with explanations in any of those four languages. Change either at any time in Settings; each study language keeps its own progress.',
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
      'set.orderMixedHelp': 'Each day blends very common words with less common ones, weighted toward the most useful. Suits most learners, especially if you already know some of the language.',
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
        'Étudier l’anglais, le français, l’espagnol ou l’allemand, avec des explications dans l’une de ces quatre langues. Changez l’une ou l’autre à tout moment dans les Réglages ; chaque langue étudiée garde ses propres progrès.',
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
      'set.orderMixedHelp': 'Chaque jour mêle des mots très courants et d’autres moins courants, en privilégiant les plus utiles. Convient à la plupart des apprenants, surtout si vous connaissez déjà un peu la langue.',
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
  es: {
    name: 'Español',
    about: [
      { h: '¿Qué es?', p: ['Words es una aplicación gratuita de tarjetas para aprender las palabras más útiles del inglés, el francés, el español o el alemán. Elige el idioma que estudias y el idioma de las explicaciones. Cada tarjeta muestra una palabra del idioma que estudias; dale la vuelta para ver qué significa en el idioma de las explicaciones.'] },
      { h: 'Qué puedes hacer', ul: [
        'Estudiar inglés, francés, español o alemán, con explicaciones en cualquiera de estos cuatro idiomas. Cambia cualquiera de los dos en Ajustes cuando quieras; cada idioma de estudio guarda su propio progreso.',
        'Aprender unas cuantas palabras nuevas cada día: 10 por defecto, ajustable en Ajustes.',
        'Elegir el orden de las palabras nuevas: Mezclado (por defecto), Las más comunes primero o Aleatorio. En Ajustes se explica cuál te conviene.',
        'Repasar cada palabra justo antes de que se te olvide. Es la repetición espaciada: las palabras que conoces bien vuelven cada vez con menos frecuencia.',
        'Valorar cada tarjeta con Otra vez, Difícil, Bien o Fácil. Tu respuesta decide cuándo volverás a verla.',
        'Escuchar cómo se pronuncia una palabra, y consultar o buscar en toda la lista de palabras en Lista.',
        'Seguir tu racha, tu dominio y tus próximos repasos en Progreso.',
        'Usarla sin conexión o instalarla en tu móvil u ordenador. No hay cuenta: tu progreso se queda en este navegador, y puedes exportar una copia de seguridad desde Ajustes.',
      ] },
      { h: '¿De dónde salen las palabras en inglés?', p: ['Las 2809 palabras en inglés son las de la ', { text: 'New General Service List (NGSL) 1.2', href: 'https://www.newgeneralservicelist.com/new-general-service-list' }, ', creada por Charles Browne, Brent Culligan y Joseph Phillips. Actualiza la clásica General Service List de Michael West (1953) a partir de un gran corpus de inglés moderno, para quedarse con las palabras más frecuentes en muchos tipos de texto.'] },
      { h: '¿De dónde salen las palabras en francés?', p: ['Las palabras en francés proceden de la ', { text: 'Liste de fréquence lexicale', href: 'https://eduscol.education.gouv.fr/6873/liste-de-frequence-lexicale' }, ' publicada por Éduscol, del Ministerio de Educación francés: casi 1500 de las palabras más frecuentes del francés, reunidas por el lexicólogo Étienne Brunet a partir de los textos que leen los alumnos francófonos. Aquí, una palabra con varias funciones (como «le», artículo y pronombre) tiene una sola tarjeta, lo que da 1354 tarjetas.'] },
      { h: '¿De dónde salen las palabras en español?', p: ['Las 2107 palabras en español son los lemas más frecuentes del ', { text: 'CORPES XXI', href: 'https://www.rae.es/corpes/' }, ', el corpus del español del siglo XXI de la Real Academia Española, con textos de más de 20 países (CC BY-SA 4.0). Se dejaron fuera la puntuación, los números, los nombres propios y la mayoría de los gentilicios.'] },
      { h: '¿De dónde salen las palabras en alemán?', p: ['Las 2088 palabras en alemán son los lemas más frecuentes de ', { text: 'DeReWo', href: 'https://www.ids-mannheim.de/en/s/corpus-linguistics/projects/methods-of-analysis/corpus-based-lemma-and-word-form-lists/' }, ', las listas que el Instituto Leibniz de la Lengua Alemana (IDS Mannheim) elaboró a partir de su corpus de referencia del alemán, usadas con licencia ', { text: 'CC BY-NC 3.0', href: 'https://creativecommons.org/licenses/by-nc/3.0/' }, '. Se dejaron fuera los nombres propios, las abreviaturas y los términos de la administración local. Los sustantivos se muestran con su artículo (der, die, das).'] },
      { h: 'Por qué importan estas palabras', p: ['Un pequeño grupo de palabras hace casi todo el trabajo en cualquier idioma. Las unas 2800 palabras de la NGSL suponen alrededor del 92 % de las palabras de un texto típico en inglés, y las palabras más frecuentes del francés, el español y el alemán forman igualmente la mayor parte de cualquier texto en esos idiomas. Aprenderlas primero es la forma más rentable de usar tu tiempo de estudio: entenderás la mayor parte de lo que lees y oyes, y podrás deducir mucho del resto por el contexto.'] },
      { h: 'Créditos', p: ['Lista, pronunciación y definiciones de las palabras en inglés: el ', { text: 'NGSL Learning Dictionary', href: 'https://www.linguaeruditio.com/Glossary/NGSL/NGSL_gloss.html' }, ' (CC BY-SA 4.0). Palabras en francés: Liste de fréquence lexicale de Éduscol (Étienne Brunet). Palabras en español: CORPES XXI, Real Academia Española (CC BY-SA 4.0). Palabras en alemán: DeReWo, © Instituto Leibniz de la Lengua Alemana (IDS), Mannheim, 2013 (CC BY-NC 3.0). La pronunciación, el género y las definiciones de las palabras en francés, español y alemán, y todas las traducciones, se escribieron para esta aplicación.'] },
    ],
    pos: { noun: 'sustantivo', nm: 'sustantivo masculino', nf: 'sustantivo femenino', nn: 'sustantivo neutro', nmf: 'sustantivo (m/f)', npl: 'sustantivo plural', verb: 'verbo', adj: 'adjetivo', adv: 'adverbio', prep: 'preposición', pron: 'pronombre', conj: 'conjunción', det: 'determinante', aux: 'auxiliar', intj: 'interjección', num: 'número' },
    units: { today: 'hoy', d: 'd', mo: 'meses', y: 'años' },
    ui: {
      'app.title': 'Words — tarjetas con las palabras más comunes en inglés, francés, español y alemán',
      'app.tagline': 'Las palabras más comunes, en el idioma que elijas, en pocos minutos al día.',
      'study.en': 'inglés', 'study.fr': 'francés', 'study.es': 'español', 'study.de': 'alemán',
      'nav.about': 'Acerca de', 'about.title': 'Acerca de Words', 'about.close': 'Cerrar',
      'nav.study': 'Estudiar', 'nav.words': 'Lista', 'nav.progress': 'Progreso', 'nav.settings': 'Ajustes',
      'chip.new': 'Nuevas', 'chip.learning': 'Aprendiendo', 'chip.review': 'Repaso',
      'study.progress': 'Progreso de la sesión de hoy',
      'card.new': 'Palabra nueva', 'card.hint': 'Toca la tarjeta o pulsa Espacio para verla',
      'card.listen': 'Escuchar la pronunciación', 'card.show': 'Mostrar respuesta', 'card.undo': 'Deshacer',
      'rate.1': 'Otra vez', 'rate.2': 'Difícil', 'rate.3': 'Bien', 'rate.4': 'Fácil', 'rate.prompt': '¿Qué tal la sabías?',
      'done.title': '¡Listo por hoy!', 'done.sub': 'Buen trabajo. Vuelve mañana para mantener fresca la memoria.',
      'done.tomorrow': 'Para mañana', 'done.streak': 'Días seguidos', 'done.today': 'Estudiadas hoy',
      'done.more': 'Aprender {n} palabras nuevas más', 'done.finished': '¡Has visto todas las palabras de la lista!',
      'words.search': 'Buscar palabras', 'words.filter': 'Filtrar por estado', 'words.all': 'Todas las palabras',
      'words.count': '{n} palabras', 'words.empty': 'Ninguna palabra coincide.',
      'bucket.new': 'Sin ver', 'bucket.learning': 'Aprendiendo', 'bucket.young': 'Reciente', 'bucket.mature': 'Dominada',
      'stats.streak': 'Días seguidos', 'stats.learned': 'Palabras aprendidas', 'stats.mature': 'Dominadas', 'stats.reviews': 'Repasos en total',
      'stats.mastery': 'Dominio', 'stats.forecast': 'Repasos previstos — próximos 14 días', 'stats.of': 'de {n}',
      'set.title': 'Ajustes', 'set.study': 'Idioma de estudio', 'set.studyHelp': 'El idioma que estás aprendiendo. La palabra del anverso de cada tarjeta está en este idioma. Cada idioma de estudio guarda su propio progreso.',
      'set.lang': 'Idioma de las explicaciones', 'set.langHelp': 'El significado del reverso de cada tarjeta, y los menús y mensajes de la aplicación, están en este idioma.',
      'msg.studyError': 'No se pudo cargar ese idioma. Comprueba la conexión e inténtalo de nuevo.',
      'set.theme': 'Apariencia', 'set.system': 'Sistema', 'set.light': 'Claro', 'set.dark': 'Oscuro',
      'set.systemNow': 'Sistema (ahora {scheme})', 'set.lightLc': 'claro', 'set.darkLc': 'oscuro',
      'set.srs': 'Repetición espaciada', 'set.newPerDay': 'Palabras nuevas al día', 'set.maxReviews': 'Máximo de repasos al día',
      'set.order': 'Orden de las palabras nuevas', 'set.orderFreq': 'Las más comunes primero', 'set.orderRandom': 'Aleatorio',
      'set.orderMixed': 'Mezclado', 'set.recommended': 'Recomendado',
      'set.orderMixedHelp': 'Cada día mezcla palabras muy comunes con otras menos comunes, dando más peso a las más útiles. Va bien a la mayoría, sobre todo si ya sabes algo del idioma.',
      'set.orderFreqHelp': 'Orden estricto de frecuencia, empezando por «{a}», «{b}» y «{c}». Ideal para principiantes: cada palabra nueva es la más útil que aún no conoces.',
      'set.orderRandomHelp': 'Cualquier palabra de la lista, todas con la misma probabilidad. Como la mayor parte de la lista son palabras menos comunes, va bien a quien ya tiene buen nivel y busca un reto.',
      'set.pace': 'Ritmo de repaso', 'set.paceHelp': 'Ajusta el intervalo entre repasos. Supone que estudias una vez al día.',
      'set.pace.0.8': 'Intensivo (intervalos más cortos)', 'set.pace.1': 'Normal', 'set.pace.1.3': 'Relajado (intervalos más largos)',
      'set.data': 'Tus datos', 'set.dataHelp': 'El progreso se guarda solo en este navegador.',
      'set.export': 'Exportar copia', 'set.import': 'Importar copia', 'set.reset': 'Restablecer progreso',
      'set.install': 'Instalar la aplicación', 'set.close': 'Listo',
      'reset.title': '¿Restablecer tu progreso en {language}?', 'reset.body': 'Se borrarán de este dispositivo tu historial y tu calendario de repaso en {language}. No se puede deshacer.',
      'reset.cancel': 'Cancelar', 'reset.confirm': 'Borrar progreso',
      'msg.exported': 'Copia descargada.', 'msg.imported': 'Copia restaurada.', 'msg.importBad': 'Ese archivo no es una copia válida.',
      'msg.reset': 'Progreso borrado.', 'msg.installed': 'Aplicación instalada.', 'msg.installCancelled': 'Se canceló la instalación.',
      'msg.storage': 'No se pudo guardar: el almacenamiento del navegador no está disponible.',
      'load.error': 'No se pudo cargar la lista de palabras. Comprueba la conexión y vuelve a cargar la página.',
    },
  },
  de: {
    name: 'Deutsch',
    about: [
      { h: 'Was ist das?', p: ['Words ist eine kostenlose Karteikarten-App, mit der du die nützlichsten Wörter auf Englisch, Französisch, Spanisch oder Deutsch lernst. Wähle die Sprache, die du lernst, und die Sprache der Erklärungen. Jede Karte zeigt ein Wort in deiner Lernsprache; dreh sie um, um zu sehen, was es in deiner Erklärungssprache bedeutet.'] },
      { h: 'Was du tun kannst', ul: [
        'Englisch, Französisch, Spanisch oder Deutsch lernen, mit Erklärungen in einer dieser vier Sprachen. Beides lässt sich jederzeit in den Einstellungen ändern; jede Lernsprache hat ihren eigenen Fortschritt.',
        'Jeden Tag ein paar neue Wörter lernen: standardmäßig 10, einstellbar in den Einstellungen.',
        'Die Reihenfolge neuer Wörter wählen: Gemischt (Standard), Häufigste zuerst oder Zufällig. In den Einstellungen steht, was zu dir passt.',
        'Jedes Wort wiederholen, kurz bevor du es vergessen würdest. Das nennt man verteiltes Wiederholen: Wörter, die du gut kennst, kommen immer seltener wieder.',
        'Jede Karte mit Nochmal, Schwer, Gut oder Leicht bewerten. Deine Antwort bestimmt, wann du sie wiedersiehst.',
        'Die Aussprache eines Wortes anhören und die ganze Wortliste unter Liste durchsehen oder durchsuchen.',
        'Deine Serie, deinen Lernstand und anstehende Wiederholungen unter Fortschritt verfolgen.',
        'Die App offline nutzen oder auf Handy oder Computer installieren. Es gibt kein Konto: Dein Fortschritt bleibt in diesem Browser, und du kannst in den Einstellungen eine Sicherung exportieren.',
      ] },
      { h: 'Woher die englischen Wörter stammen', p: ['Die 2809 englischen Wörter sind die der ', { text: 'New General Service List (NGSL) 1.2', href: 'https://www.newgeneralservicelist.com/new-general-service-list' }, ', erstellt von Charles Browne, Brent Culligan und Joseph Phillips. Sie aktualisiert Michael Wests klassische General Service List von 1953 anhand eines großen Korpus modernen Englischs und enthält die Wörter, die in vielen Textarten am häufigsten vorkommen.'] },
      { h: 'Woher die französischen Wörter stammen', p: ['Die französischen Wörter stammen aus der ', { text: 'Liste de fréquence lexicale', href: 'https://eduscol.education.gouv.fr/6873/liste-de-frequence-lexicale' }, ', herausgegeben von Éduscol, dem französischen Bildungsministerium: fast 1500 der häufigsten französischen Wörter, zusammengestellt vom Lexikologen Étienne Brunet aus Texten, die französischsprachige Schüler lesen. Ein Wort mit mehreren Funktionen (etwa „le“, Artikel und Pronomen) hat hier nur eine Karte, insgesamt 1354 Karten.'] },
      { h: 'Woher die spanischen Wörter stammen', p: ['Die 2107 spanischen Wörter sind die häufigsten Lemmata im ', { text: 'CORPES XXI', href: 'https://www.rae.es/corpes/' }, ', dem Korpus des Spanischen des 21. Jahrhunderts der Real Academia Española mit Texten aus mehr als 20 Ländern (CC BY-SA 4.0). Satzzeichen, Zahlen, Namen und die meisten Herkunftsbezeichnungen wurden weggelassen.'] },
      { h: 'Woher die deutschen Wörter stammen', p: ['Die 2088 deutschen Wörter sind die häufigsten Lemmata aus ', { text: 'DeReWo', href: 'https://www.ids-mannheim.de/en/s/corpus-linguistics/projects/methods-of-analysis/corpus-based-lemma-and-word-form-lists/' }, ', den Wortlisten, die das Leibniz-Institut für Deutsche Sprache (IDS Mannheim) aus seinem Deutschen Referenzkorpus erstellt hat, verwendet unter ', { text: 'CC BY-NC 3.0', href: 'https://creativecommons.org/licenses/by-nc/3.0/' }, '. Namen, Abkürzungen und Begriffe der Kommunalverwaltung wurden weggelassen. Nomen stehen mit Artikel (der, die, das).'] },
      { h: 'Warum diese Wörter wichtig sind', p: ['Ein kleiner Teil der Wörter leistet in jeder Sprache den Großteil der Arbeit. Die rund 2800 Wörter der NGSL machen etwa 92 % der Wörter eines typischen englischen Textes aus, und die häufigsten Wörter des Französischen, Spanischen und Deutschen bilden ebenso den Großteil jedes Textes in diesen Sprachen. Wer sie zuerst lernt, holt am meisten aus seiner Lernzeit heraus: Du verstehst das meiste von dem, was du liest und hörst, und kannst vieles andere aus dem Zusammenhang erschließen.'] },
      { h: 'Quellen', p: ['Englische Wortliste, Aussprache und Definitionen: das ', { text: 'NGSL Learning Dictionary', href: 'https://www.linguaeruditio.com/Glossary/NGSL/NGSL_gloss.html' }, ' (CC BY-SA 4.0). Französische Wörter: Liste de fréquence lexicale von Éduscol (Étienne Brunet). Spanische Wörter: CORPES XXI, Real Academia Española (CC BY-SA 4.0). Deutsche Wörter: DeReWo, © Leibniz-Institut für Deutsche Sprache (IDS), Mannheim, 2013 (CC BY-NC 3.0). Aussprache, Genus und Definitionen der französischen, spanischen und deutschen Wörter sowie alle Übersetzungen wurden für diese App geschrieben.'] },
    ],
    pos: { noun: 'Nomen', nm: 'Nomen (maskulin)', nf: 'Nomen (feminin)', nn: 'Nomen (neutrum)', nmf: 'Nomen (m/f)', npl: 'Nomen (Plural)', verb: 'Verb', adj: 'Adjektiv', adv: 'Adverb', prep: 'Präposition', pron: 'Pronomen', conj: 'Konjunktion', det: 'Artikelwort', aux: 'Hilfsverb', intj: 'Interjektion', num: 'Zahlwort' },
    units: { today: 'heute', d: 'T.', mo: 'Mon.', y: 'J.' },
    ui: {
      'app.title': 'Words – Karteikarten mit den häufigsten Wörtern auf Englisch, Französisch, Spanisch und Deutsch',
      'app.tagline': 'Die häufigsten Wörter, in der Sprache deiner Wahl, in wenigen Minuten am Tag.',
      'study.en': 'Englisch', 'study.fr': 'Französisch', 'study.es': 'Spanisch', 'study.de': 'Deutsch',
      'nav.about': 'Über', 'about.title': 'Über Words', 'about.close': 'Schließen',
      'nav.study': 'Lernen', 'nav.words': 'Liste', 'nav.progress': 'Fortschritt', 'nav.settings': 'Einstellungen',
      'chip.new': 'Neu', 'chip.learning': 'Lernen', 'chip.review': 'Wiederholen',
      'study.progress': 'Fortschritt der heutigen Sitzung',
      'card.new': 'Neues Wort', 'card.hint': 'Tippe auf die Karte oder drücke die Leertaste',
      'card.listen': 'Aussprache anhören', 'card.show': 'Antwort zeigen', 'card.undo': 'Rückgängig',
      'rate.1': 'Nochmal', 'rate.2': 'Schwer', 'rate.3': 'Gut', 'rate.4': 'Leicht', 'rate.prompt': 'Wie gut wusstest du es?',
      'done.title': 'Für heute geschafft', 'done.sub': 'Gut gemacht! Komm morgen wieder, damit nichts in Vergessenheit gerät.',
      'done.tomorrow': 'Morgen fällig', 'done.streak': 'Tage in Folge', 'done.today': 'Heute gelernt',
      'done.more': '{n} weitere neue Wörter lernen', 'done.finished': 'Du hast alle Wörter der Liste gesehen!',
      'words.search': 'Wörter suchen', 'words.filter': 'Nach Status filtern', 'words.all': 'Alle Wörter',
      'words.count': '{n} Wörter', 'words.empty': 'Keine passenden Wörter.',
      'bucket.new': 'Noch nicht gesehen', 'bucket.learning': 'In Arbeit', 'bucket.young': 'Frisch gelernt', 'bucket.mature': 'Sicher',
      'stats.streak': 'Tage in Folge', 'stats.learned': 'Gelernte Wörter', 'stats.mature': 'Sicher', 'stats.reviews': 'Wiederholungen insgesamt',
      'stats.mastery': 'Lernstand', 'stats.forecast': 'Fällige Wiederholungen – nächste 14 Tage', 'stats.of': 'von {n}',
      'set.title': 'Einstellungen', 'set.study': 'Lernsprache', 'set.studyHelp': 'Die Sprache, die du lernst. Das Wort auf der Vorderseite jeder Karte ist in dieser Sprache. Jede Lernsprache hat ihren eigenen Fortschritt.',
      'set.lang': 'Erklärungssprache', 'set.langHelp': 'Die Bedeutung auf der Rückseite jeder Karte sowie die Menüs und Meldungen der App sind in dieser Sprache.',
      'msg.studyError': 'Diese Sprache konnte nicht geladen werden. Prüfe deine Verbindung und versuche es noch einmal.',
      'set.theme': 'Darstellung', 'set.system': 'System', 'set.light': 'Hell', 'set.dark': 'Dunkel',
      'set.systemNow': 'System (gerade {scheme})', 'set.lightLc': 'hell', 'set.darkLc': 'dunkel',
      'set.srs': 'Verteiltes Wiederholen', 'set.newPerDay': 'Neue Wörter pro Tag', 'set.maxReviews': 'Höchstens Wiederholungen pro Tag',
      'set.order': 'Reihenfolge neuer Wörter', 'set.orderFreq': 'Häufigste zuerst', 'set.orderRandom': 'Zufällig',
      'set.orderMixed': 'Gemischt', 'set.recommended': 'Empfohlen',
      'set.orderMixedHelp': 'Jeder Tag mischt sehr häufige mit selteneren Wörtern, mit Schwerpunkt auf den nützlichsten. Passt für die meisten, besonders wenn du die Sprache schon ein wenig kannst.',
      'set.orderFreqHelp': 'Streng nach Häufigkeit, beginnend mit „{a}“, „{b}“ und „{c}“. Ideal für Anfänger: Jedes neue Wort ist das nützlichste, das du noch nicht kennst.',
      'set.orderRandomHelp': 'Irgendein Wort aus der ganzen Liste, jedes gleich wahrscheinlich. Da die Liste überwiegend seltenere Wörter enthält, passt das für Fortgeschrittene, die eine Herausforderung suchen.',
      'set.pace': 'Wiederholungstempo', 'set.paceHelp': 'Verändert die Abstände zwischen Wiederholungen. Geht davon aus, dass du einmal am Tag lernst.',
      'set.pace.0.8': 'Intensiv (kürzere Abstände)', 'set.pace.1': 'Standard', 'set.pace.1.3': 'Entspannt (längere Abstände)',
      'set.data': 'Deine Daten', 'set.dataHelp': 'Der Fortschritt wird nur in diesem Browser gespeichert.',
      'set.export': 'Sicherung exportieren', 'set.import': 'Sicherung importieren', 'set.reset': 'Fortschritt zurücksetzen',
      'set.install': 'App installieren', 'set.close': 'Fertig',
      'reset.title': 'Deinen Fortschritt für {language} zurücksetzen?', 'reset.body': 'Dein Verlauf und dein Wiederholungsplan für {language} werden auf diesem Gerät gelöscht. Das lässt sich nicht rückgängig machen.',
      'reset.cancel': 'Abbrechen', 'reset.confirm': 'Fortschritt löschen',
      'msg.exported': 'Sicherung heruntergeladen.', 'msg.imported': 'Sicherung wiederhergestellt.', 'msg.importBad': 'Diese Datei ist keine gültige Sicherung.',
      'msg.reset': 'Fortschritt gelöscht.', 'msg.installed': 'App installiert.', 'msg.installCancelled': 'Installation abgebrochen.',
      'msg.storage': 'Speichern nicht möglich – der Browserspeicher ist nicht verfügbar.',
      'load.error': 'Die Wortliste konnte nicht geladen werden. Prüfe deine Verbindung und lade die Seite neu.',
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
