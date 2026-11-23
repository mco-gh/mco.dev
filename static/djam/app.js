// Djamhellvice prototype — discography + language toggle.
// Release data comes from djamhellvicepage.bandcamp.com (ids feed the embedded player).

const RELEASES = [
  { slug: "track/cube", img: "cube", title: "Cube", type: { fr: "Single", en: "Single" }, date: "2026-05-29", id: "track=1602772035", tracks: 1,
    about: { fr: "Un état des lieux du rap français, de l'underground et de la lutte sociale.", en: "Taking stock of French rap, the underground and social struggle." },
    credits: "Prod / Guitare : Bolt Cut · Record & Mix : Arthur Nové--Teissier · Master : Hadrien Staner" },
  { slug: "album/bec", img: "bec", title: "BEC", type: { fr: "Album", en: "Album" }, date: "2025-01-24", id: "album=3709509015", tracks: 7,
    about: null,
    credits: "Prods : Bolt Cut, Homage, Gro · Record, Mix & Master : Raan · Cover : Norse" },
  { slug: "album/twinz", img: "twinz", title: "TWINZ", type: { fr: "EP · avec Skalpel", en: "EP · with Skalpel" }, date: "2024-05-16", id: "album=97891292", tracks: 5,
    about: { fr: "Djamhellvice et Skalpel (Première Ligne / La K-bine) en duo — un clin d'œil au « Twinz » de Fat Joe et Big Pun.", en: "Djamhellvice and Skalpel (Première Ligne / La K-bine) as a duo — a nod to Fat Joe and Big Pun's “Twinz”." },
    credits: "Prods : Slhigh Kut & Stigmath · Mix & Masters : Raan · Artwork : Helios Figuerola Garcia" },
  { slug: "album/grabuge", img: "grabuge", title: "Grabuge", type: { fr: "EP", en: "EP" }, date: "2021-05-14", id: "album=4045520720", tracks: 6,
    about: { fr: "Feats : Res Turner, Siren, Degy le ReskP, Zarma Leone & Distill. Prods : Bolt Cut.", en: "Features: Res Turner, Siren, Degy le ReskP, Zarma Leone & Distill. Beats: Bolt Cut." },
    credits: "Mix : Raan · Master : CCK Productions · Scratches : DJ Gro · Cover : Big Cyrus" },
  { slug: "album/mauvais-augure", img: "mauvais-augure", title: "Mauvais Augure", type: { fr: "EP", en: "EP" }, date: "2020-02-08", id: "album=84440934", tracks: 6,
    about: { fr: "Feats : Original Tonio, Kaiman Lanimal, Skullo. Prods : Junior Makhno, Bolt Cut.", en: "Features: Original Tonio, Kaiman Lanimal, Skullo. Beats: Junior Makhno, Bolt Cut." },
    credits: "Mix : Djar One @ Beat House Studio · Master : Blanka · Scratches : DJ Reska · Artwork : Bourvil" },
  { slug: "album/controverse", img: "controverse", title: "Controverse", type: { fr: "Album", en: "Album" }, date: "2016-10-07", id: "album=2477035399", tracks: 11,
    about: { fr: "Avec Res Turner, Skalpel, VII, Joey Knuckles & Aztek The Barfly, Doliath & ADM. Bandcamp New & Notable.", en: "With Res Turner, Skalpel, VII, Joey Knuckles & Aztek The Barfly, Doliath & ADM. Bandcamp New & Notable." },
    credits: "Mix : Djar One · Master : Blanka · Scratches : DJ Reska, Djar One · Artwork : Juan (Primal Odd Communication)" },
  { slug: "album/des-maux-crasseries", img: "des-maux", title: "Des maux, crasseries…", type: { fr: "Mixtape", en: "Mixtape" }, date: "2014-03-30", id: "album=3303453333", tracks: 10,
    about: { fr: "Mixtape en téléchargement libre.", en: "Free-download mixtape." },
    credits: "Cuts / Mix / Master : DJ Reska · Graphisme : Doom · Photos : Benjah" },
  { slug: "album/preface", img: "preface", title: "Préface", type: { fr: "Maxi", en: "EP" }, date: "2012-04-02", id: "album=555253162", tracks: 5,
    about: { fr: "Le premier maxi, sorti en CD (boîtier cristal + livret 4 pages).", en: "The debut EP, released on CD (jewel case + 4-page booklet)." },
    credits: null },
];

const BC = "https://djamhellvicepage.bandcamp.com/";
const root = document.documentElement;
const lang = () => root.dataset.lang;
const t = (o) => (o ? o[lang()] : "");
const year = (d) => d.slice(0, 4);
const fmtDate = (d) =>
  new Date(d + "T12:00:00").toLocaleDateString(lang() === "fr" ? "fr-FR" : "en-GB", { day: "numeric", month: "long", year: "numeric" });
const trackWord = (n) => (lang() === "fr" ? (n > 1 ? "titres" : "titre") : n > 1 ? "tracks" : "track");

/* ---------- discography grid ---------- */
const list = document.querySelector(".disco");
function renderGrid() {
  list.replaceChildren(
    ...RELEASES.map((r, i) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <button type="button" data-i="${i}">
          <div class="disco__art"><img src="img/${r.img}.jpg" alt="" width="700" height="700" loading="lazy"></div>
          <p class="disco__name"></p>
          <p class="disco__meta">${year(r.date)} · ${t(r.type)} · ${r.tracks} ${trackWord(r.tracks)}</p>
        </button>`;
      li.querySelector(".disco__name").textContent = r.title;
      li.querySelector("button").setAttribute("aria-label", `${r.title}, ${year(r.date)}`);
      return li;
    })
  );
}
list.addEventListener("click", (e) => {
  const b = e.target.closest("button[data-i]");
  if (b) openRelease(RELEASES[+b.dataset.i]);
});

/* ---------- release dialog ---------- */
const dlg = document.querySelector(".release");
const $ = (s) => dlg.querySelector(s);

function openRelease(r) {
  $(".release__art").src = `img/${r.img}.jpg`;
  $(".release__art").alt = lang() === "fr" ? `Pochette de ${r.title}` : `${r.title} cover art`;
  $(".release__meta").textContent = `${t(r.type)} · ${fmtDate(r.date)}`;
  $(".release__title").textContent = r.title;
  $(".release__about").textContent = t(r.about);
  $(".release__credits").textContent = r.credits ?? "";
  const single = r.tracks === 1;
  const player = $(".release__player");
  player.style.height = single ? "120px" : `${Math.min(560, 175 + r.tracks * 38)}px`;
  player.src = `https://bandcamp.com/EmbeddedPlayer/${r.id}/size=large/bgcol=100f24/linkcol=e52e3a/tracklist=${!single}/artwork=none/transparent=true/`;
  player.title = `Bandcamp — ${r.title}`;
  $(".release__buy").href = BC + r.slug;
  dlg.showModal();
}
// Stop the audio when the dialog closes
dlg.addEventListener("close", () => { $(".release__player").src = "about:blank"; });
$(".release__close").addEventListener("click", () => dlg.close());

// Light-dismiss fallback where <dialog closedby> isn't supported (Safari)
if (!("closedBy" in HTMLDialogElement.prototype)) {
  dlg.addEventListener("click", (e) => {
    if (e.target !== dlg) return;
    const r = dlg.getBoundingClientRect();
    const inside = r.top <= e.clientY && e.clientY <= r.bottom && r.left <= e.clientX && e.clientX <= r.right;
    if (!inside) dlg.close();
  });
}

/* ---------- language toggle ---------- */
const btn = document.querySelector(".lang");
function setLang(l) {
  root.dataset.lang = l;
  root.lang = l;
  btn.textContent = l === "fr" ? "EN" : "FR";
  btn.setAttribute("aria-label", l === "fr" ? "Switch to English" : "Passer en français");
  dlg.querySelector(".release__close").setAttribute("aria-label", l === "fr" ? "Fermer" : "Close");
  localStorage.setItem("djam-lang", l);
  renderGrid();
}
btn.addEventListener("click", () => setLang(lang() === "fr" ? "en" : "fr"));
setLang(localStorage.getItem("djam-lang") || "fr");
