function verschluesseln(buchstaben, schluesselzeile) {
  return Array.from(buchstaben, (zeichen, index) => {
    const summe = zeichen.charCodeAt(0) - 65 + schluesselzeile.charCodeAt(index) - 65;
    return String.fromCharCode(65 + summe % 26);
  }).join('');
}

function wiederholungenFinden(text, laenge) {
  const folgen = new Map();
  for (let position = 0; position <= text.length - laenge; position++) {
    const folge = text.slice(position, position + laenge);
    if (!folgen.has(folge)) folgen.set(folge, []);
    folgen.get(folge).push(position);
  }
  return new Map([...folgen].filter(([, positionen]) => positionen.length > 1));
}

function abstaende(positionen) {
  return positionen.slice(1).map((position, index) => position - positionen[index]);
}

function teilerZaehlen(abstandswerte) {
  const zaehler = new Map();
  for (const abstand of abstandswerte) {
    const teilen = new Set(abstand > 1 ? [abstand] : []);
    for (let zahl = 2; zahl * zahl <= abstand; zahl++) {
      if (abstand % zahl === 0) {
        teilen.add(zahl);
        teilen.add(abstand / zahl);
      }
    }
    for (const zahl of teilen) zaehler.set(zahl, (zaehler.get(zahl) ?? 0) + 1);
  }
  return [...zaehler].sort(([a, anzahlA], [b, anzahlB]) => anzahlB - anzahlA || a - b);
}

function element(tag, text) {
  const knoten = document.createElement(tag);
  knoten.textContent = text;
  return knoten;
}

function textVerschluesseln(text, schluessel) {
  const buchstaben = text.replace(/[^A-Za-z]/g, '').toUpperCase();
  const wort = schluessel.toUpperCase();
  const schluesselzeile = wort.repeat(Math.ceil(buchstaben.length / wort.length)).slice(0, buchstaben.length);
  return { buchstaben, schluesselzeile, geheimtext: verschluesseln(buchstaben, schluesselzeile) };
}

function unterschiedlicheAbstaende(fundstellen) {
  const werte = new Set();
  for (const positionen of fundstellen.values()) {
    for (const abstand of abstaende(positionen)) werte.add(abstand);
  }
  return werte;
}

function kasiskiAnsicht(ergebnisse, praefix = '') {
  const finde = id => ergebnisse.querySelector('#' + praefix + id.slice(1));
  const folgenlaenge = finde('#folgenlaenge');
  const wiederholung = finde('#wiederholung');
  const wiederholungInfo = finde('#wiederholung-info');
  const buchstabenAnzeige = finde('#analyse-buchstaben');
  const fundspruenge = finde('#fundspruenge');
  const geheimtextAnzeige = finde('#analyse-geheimtext');
  const folgenliste = finde('#folgenliste');
  const abstandwahl = finde('#abstandwahl');
  const abstandsbild = finde('#abstandsbild');
  const teilerliste = finde('#teilerliste');
  const teilerprobe = finde('#teilerprobe');

  let geheimtext = '';
  let fundstellen = new Map();
  let paarIndex = 0;
  let teiler = null;

  function analyseErstellen() {
    fundstellen = wiederholungenFinden(geheimtext, Number(folgenlaenge.value));
    paarIndex = 0;
    wiederholung.replaceChildren();
    folgenliste.replaceChildren();
    wiederholung.disabled = fundstellen.size === 0;

    const liste = document.createElement('ul');
    const rangfolge = [...fundstellen].sort((a, b) => b[1].length - a[1].length);
    for (const [folge, positionen] of rangfolge) {
      wiederholung.add(new Option(`${folge} (${positionen.length}×)`, folge));
      liste.append(element('li', `${folge} · Positionen ${positionen.map(index => index + 1).join(', ')}`));
    }
    folgenliste.append(fundstellen.size ? liste : element('p', 'Keine Wiederholungen dieser Länge.'));

    const abstandswerte = unterschiedlicheAbstaende(fundstellen);
    const rang = teilerZaehlen(abstandswerte);
    teiler = rang[0]?.[0] ?? null;
    teilerliste.replaceChildren();
    if (abstandswerte.size) {
      const details = document.createElement('details');
      details.append(
        element('summary', `${abstandswerte.size} unterschiedliche Abstände anzeigen`),
        element('p', [...abstandswerte].sort((a, b) => a - b).join(', '))
      );
      teilerliste.append(details);
    } else {
      teilerliste.append(element('p', 'Sobald Wiederholungen vorliegen, erscheinen hier ihre Abstände und Teiler.'));
    }

    const balkenliste = document.createElement('ul');
    balkenliste.className = 'kasiski-balken';
    const weitere = document.createElement('ul');
    weitere.className = 'kasiski-balken';
    for (const [index, [zahl, anzahl]] of rang.entries()) {
      const zeile = document.createElement('li');
      const knopf = element('button', `Teiler ${zahl}`);
      knopf.type = 'button';
      knopf.dataset.teiler = zahl;
      const balken = document.createElement('progress');
      balken.max = abstandswerte.size;
      balken.value = anzahl;
      balken.setAttribute('aria-label', `Abstände mit Teiler ${zahl}`);
      zeile.append(knopf, balken, element('span', `${anzahl} von ${abstandswerte.size}`));
      (index < 8 ? balkenliste : weitere).append(zeile);
    }
    teilerliste.append(balkenliste);
    if (weitere.childElementCount) {
      const details = document.createElement('details');
      details.append(element('summary', 'Weitere Teiler anzeigen'), weitere);
      teilerliste.append(details);
    }
    auswahlAnzeigen();
  }

  function auswahlAnzeigen() {
    const positionen = fundstellen.get(wiederholung.value) ?? [];
    wiederholungInfo.textContent = positionen.length
      ? `${wiederholung.value} kommt ${positionen.length}-mal im Geheimtext vor.`
      : 'Keine Wiederholung gefunden. Probiere eine kürzere Folge.';
    geheimtextAnzeige.replaceChildren();
    const laenge = Number(folgenlaenge.value);
    const farben = new Uint8Array(geheimtext.length);
    for (const start of positionen) farben.fill(1, start, start + laenge);
    for (const start of positionen.slice(paarIndex, paarIndex + 2)) {
      farben.fill(2, start, start + laenge);
    }
    let start = 0;
    while (start < geheimtext.length) {
      const farbe = farben[start];
      let ende = start + 1;
      while (ende < geheimtext.length && farben[ende] === farbe) ende++;
      const text = geheimtext.slice(start, ende);
      if (farbe) {
        const markierung = element('mark', text);
        if (farbe === 2) markierung.className = 'kasiski-auswahl';
        geheimtextAnzeige.append(markierung);
      } else {
        geheimtextAnzeige.append(text);
      }
      start = ende;
    }

    abstandwahl.replaceChildren();
    const werte = abstaende(positionen);
    if (werte.length) {
      const liste = document.createElement('ul');
      liste.className = 'kasiski-abstaende';
      for (const [index, abstand] of werte.entries()) {
        const zeile = document.createElement('li');
        const knopf = element('button', `${positionen[index] + 1} → ${positionen[index + 1] + 1} · Abstand ${abstand}`);
        knopf.type = 'button';
        knopf.dataset.paar = index;
        knopf.setAttribute('aria-pressed', String(index === paarIndex));
        zeile.append(knopf);
        liste.append(zeile);
      }
      abstandwahl.append(liste);
    }
    abstandsbild.hidden = werte.length === 0;
    fundspruenge.hidden = werte.length === 0;
    if (werte.length) {
      const links = positionen[paarIndex] + 1;
      const rechts = positionen[paarIndex + 1] + 1;
      finde('#sprung-links').textContent = `Zu Position ${links}`;
      finde('#sprung-rechts').textContent = `Zu Position ${rechts}`;
      for (const [seite, position] of [['links', links], ['rechts', rechts]]) {
        const beschriftung = finde(`#messung-${seite}`);
        beschriftung.replaceChildren(element('strong', String(position)), element('code', wiederholung.value));
      }
      finde('#messung-rechnung').textContent = `${rechts} − ${links} = ${rechts - links} Buchstaben Abstand`;
    }
    teilerAnzeigen();
  }

  function teilerAnzeigen() {
    for (const knopf of teilerliste.querySelectorAll('button')) {
      knopf.setAttribute('aria-pressed', String(Number(knopf.dataset.teiler) === teiler));
    }
    const positionen = fundstellen.get(wiederholung.value);
    teilerprobe.textContent = '';
    if (!teiler || !positionen) return;
    const abstand = positionen[paarIndex + 1] - positionen[paarIndex];
    const umlaeufe = Math.floor(abstand / teiler);
    const rest = abstand % teiler;
    teilerprobe.textContent = rest
      ? `${abstand} = ${umlaeufe} × ${teiler} + ${rest}. Es bleiben ${rest} Stellen übrig. Bei Länge ${teiler} lägen diese Starts an verschiedenen Stellen im Schlüsselzyklus.`
      : `${abstand} = ${umlaeufe} × ${teiler}. Bei Länge ${teiler} passen ${umlaeufe} ganze Schlüsselumläufe zwischen die beiden Starts.`;
  }

  function zurFundstelleSpringen(index) {
    const position = fundstellen.get(wiederholung.value)[paarIndex + index];
    const buchstabenbreite = geheimtextAnzeige.getBoundingClientRect().width / geheimtext.length;
    buchstabenAnzeige.scrollLeft = Math.max(0, position - 3) * buchstabenbreite;
  }

  finde('#sprung-links').addEventListener('click', () => zurFundstelleSpringen(0));
  finde('#sprung-rechts').addEventListener('click', () => zurFundstelleSpringen(1));

  folgenlaenge.addEventListener('change', analyseErstellen);
  wiederholung.addEventListener('change', () => {
    paarIndex = 0;
    auswahlAnzeigen();
  });
  abstandwahl.addEventListener('click', ereignis => {
    const knopf = ereignis.target.closest('button');
    if (!knopf) return;
    paarIndex = Number(knopf.dataset.paar);
    auswahlAnzeigen();
    abstandwahl.querySelectorAll('button')[paarIndex].focus();
    zurFundstelleSpringen(0);
  });
  teilerliste.addEventListener('click', ereignis => {
    const knopf = ereignis.target.closest('button');
    if (!knopf) return;
    teiler = Number(knopf.dataset.teiler);
    teilerAnzeigen();
  });
  return text => {
    geheimtext = text;
    buchstabenAnzeige.scrollLeft = 0;
    ergebnisse.hidden = !geheimtext;
    if (geheimtext) analyseErstellen();
  };
}

const formular = document.querySelector('#kasiski-form');
const klartext = document.querySelector('#analyse-klartext');
const schluessel = document.querySelector('#analyse-schluessel');
const analyseStatus = document.querySelector('#analyse-status');
const ergebnisse = document.querySelector('#analyse-ergebnisse');
const aufgabenAnsicht = ergebnisse.cloneNode(true);
const aufgabenPraefix = 'aufgabe-';
aufgabenAnsicht.id = 'aufgabe-kasiski-ergebnisse';
for (const knoten of aufgabenAnsicht.querySelectorAll('[id], [for]')) {
  if (knoten.id) knoten.id = aufgabenPraefix + knoten.id;
  if (knoten.htmlFor) knoten.htmlFor = aufgabenPraefix + knoten.htmlFor;
}
aufgabenAnsicht.querySelector('#aufgabe-analyse-klarzeile').parentElement.remove();
aufgabenAnsicht.querySelector('#aufgabe-analyse-schluesselzeile').parentElement.remove();
aufgabenAnsicht.querySelector('#aufgabe-analyse-buchstaben').setAttribute('aria-label', 'Geheimtext der Aufgabe');
aufgabenAnsicht.querySelector('#aufgabe-analyse-buchstaben').previousElementSibling.textContent =
  'Scrolle im Geheimtext nach rechts oder springe zu einer markierten Fundstelle.';
document.querySelector('#aufgabe-analyse').append(aufgabenAnsicht);
const beispielAnzeigen = kasiskiAnsicht(ergebnisse);
const aufgabeAnzeigen = kasiskiAnsicht(aufgabenAnsicht, aufgabenPraefix);

function starten() {
  const daten = textVerschluesseln(klartext.value, schluessel.value);
  document.querySelector('#analyse-klarzeile').textContent = daten.buchstaben;
  document.querySelector('#analyse-schluesselzeile').textContent = daten.schluesselzeile;
  analyseStatus.textContent = daten.geheimtext
    ? `Der Geheimtext hat ${daten.geheimtext.length} Buchstaben.`
    : 'Gib einen Klartext mit mindestens einem Buchstaben von A bis Z ein.';
  beispielAnzeigen(daten.geheimtext);
}

formular.addEventListener('submit', ereignis => {
  ereignis.preventDefault();
  starten();
});
document.querySelector('#analyse-beispiel').addEventListener('click', () => {
  formular.reset();
  folgenlaenge.value = '3';
  starten();
});
formular.addEventListener('input', () => {
  analyseStatus.textContent = 'Starte die Untersuchung mit deinen geänderten Eingaben.';
  ergebnisse.hidden = true;
});

function buchstabengruppen(text, anzahl) {
  const gruppen = Array.from({ length: anzahl }, () => ({ buchstaben: [], zaehler: new Map() }));
  for (let index = 0; index < text.length; index++) {
    const buchstabe = text[index];
    const gruppe = gruppen[index % anzahl];
    gruppe.buchstaben.push(buchstabe);
    gruppe.zaehler.set(buchstabe, (gruppe.zaehler.get(buchstabe) ?? 0) + 1);
  }
  return gruppen;
}

function haeufigsteBuchstaben(zaehler) {
  const maximum = Math.max(...zaehler.values());
  return [...zaehler].filter(([, anzahl]) => anzahl === maximum).map(([buchstabe]) => buchstabe).sort();
}

const umschriften = { ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' };
const aufgabenKombinationen = [];
for (const vorlage of kasiskiAufgabentexte) {
  const textform = vorlage.text.replace(/[äöüß]/gi, zeichen => umschriften[zeichen.toLowerCase()]).toUpperCase();
  const buchstaben = textform.replace(/[^A-Z]/g, '');
  for (const wort of kasiskiAufgabenschluessel) {
    const gruppen = buchstabengruppen(buchstaben, wort.length);
    if (!gruppen.every(gruppe => haeufigsteBuchstaben(gruppe.zaehler).includes('E'))) continue;

    const { geheimtext } = textVerschluesseln(textform, wort);
    const fundstellen = wiederholungenFinden(geheimtext, 3);
    const rang = teilerZaehlen(unterschiedlicheAbstaende(fundstellen));
    const platz = rang.findIndex(([zahl]) => zahl === wort.length);
    // Ein echter Teiler der Schlüssellänge kann in der Rangliste weiter oben stehen.
    if (platz >= 0 && platz < 3 && rang[platz][1] >= 3 &&
        rang.slice(0, platz).every(([zahl]) => wort.length % zahl === 0)) {
      aufgabenKombinationen.push({ textform, geheimtext });
    }
  }
}

const haeufigkeitsformular = document.querySelector('#haeufigkeitsanalyse');
const laengenfeld = document.querySelector('#vermutete-laenge');
const haeufigkeitsergebnis = document.querySelector('#haeufigkeits-ergebnis');
const gruppenliste = document.querySelector('#haeufigkeits-gruppen');
const entschluesselungsformular = document.querySelector('#aufgabe-entschluesseln');
const wortfeld = document.querySelector('#vermutetes-wort');
const entschluesselterText = document.querySelector('#aufgabe-klartext');
vigenereQuadrat(document.querySelector('#analyse-quadrat'), alphabet.indexOf('E'));
let aktuelleAufgabe;

function neueAufgabe() {
  const auswahl = aufgabenKombinationen.filter(kombination => kombination !== aktuelleAufgabe);
  aktuelleAufgabe = auswahl[Math.floor(Math.random() * auswahl.length)] ?? aktuelleAufgabe;
  document.querySelector('#aufgabe-folgenlaenge').value = '3';
  haeufigkeitsformular.reset();
  entschluesselungsformular.reset();
  entschluesselterText.value = '';
  haeufigkeitsergebnis.hidden = true;
  laengenfeld.max = aktuelleAufgabe.geheimtext.length;
  document.querySelector('#aufgabe-kasiski-status').textContent =
    `Neuer Geheimtext mit ${aktuelleAufgabe.geheimtext.length} Buchstaben.`;
  aufgabeAnzeigen(aktuelleAufgabe.geheimtext);
}

document.querySelector('#neue-kasiski-aufgabe').addEventListener('click', neueAufgabe);
haeufigkeitsformular.addEventListener('submit', ereignis => {
  ereignis.preventDefault();
  const anzahl = laengenfeld.valueAsNumber;
  const gruppen = buchstabengruppen(aktuelleAufgabe.geheimtext, anzahl);
  gruppenliste.replaceChildren();
  for (const [index, gruppe] of gruppen.entries()) {
    const haeufigste = haeufigsteBuchstaben(gruppe.zaehler);
    const eintrag = document.createElement('li');
    const details = document.createElement('details');
    const positionen = gruppe.buchstaben.slice(0, 3).map((_, stelle) => index + 1 + stelle * anzahl);
    const fortsetzung = gruppe.buchstaben.length > 3 ? ', …' : '';
    details.append(
      element('summary', `Gruppenbuchstaben · Positionen ${positionen.join(', ')}${fortsetzung}`),
      element('code', gruppe.buchstaben.join(''))
    );
    eintrag.append(element('strong', `${haeufigste.join(', ')} · je ${gruppe.zaehler.get(haeufigste[0])}×`), details);
    gruppenliste.append(eintrag);
  }
  entschluesselungsformular.reset();
  entschluesselterText.value = '';
  haeufigkeitsergebnis.hidden = false;
});
laengenfeld.addEventListener('input', () => {
  haeufigkeitsergebnis.hidden = true;
});

function aufgabentextEntschluesseln({ textform, geheimtext }, wort) {
  let index = 0;
  return textform.replace(/[A-Z]/g, () => {
    const geheim = geheimtext[index];
    const schluesselbuchstabe = wort[index % wort.length];
    index++;
    return verschieben(geheim, -alphabet.indexOf(schluesselbuchstabe));
  });
}

entschluesselungsformular.addEventListener('submit', ereignis => {
  ereignis.preventDefault();
  entschluesselterText.value = aufgabentextEntschluesseln(aktuelleAufgabe, wortfeld.value.toUpperCase());
});
wortfeld.addEventListener('input', () => { entschluesselterText.value = ''; });

starten();
neueAufgabe();
