const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const laenge = alphabet.length;

function verschieben(buchstabe, schritte) {
  const position = alphabet.indexOf(buchstabe.toUpperCase());
  const ergebnis = alphabet[(position + schritte + laenge) % laenge];
  return buchstabe === buchstabe.toUpperCase() ? ergebnis : ergebnis.toLowerCase();
}

function vigenereQuadrat(quadrat, startSpalte = 12) {
  const tabellenkopf = quadrat.createTHead();
  const achsenzeile = tabellenkopf.insertRow();
  const spaltenkopf = tabellenkopf.insertRow();
  const tabellenkoerper = quadrat.createTBody();
  let aktiveZeile = 4;
  let aktiveSpalte = startSpalte;

  function kopfzelle(zeile, scope) {
    const zelle = document.createElement('th');
    if (scope) zelle.scope = scope;
    zeile.append(zelle);
    return zelle;
  }

  function tabellenknopf(zelle, buchstabe, beschriftung, auswaehlen) {
    const knopf = document.createElement('button');
    knopf.type = 'button';
    knopf.textContent = buchstabe;
    knopf.setAttribute('aria-label', beschriftung);
    knopf.setAttribute('aria-pressed', 'false');
    knopf.addEventListener('click', auswaehlen);
    zelle.append(knopf);
  }

  const ecke = kopfzelle(achsenzeile);
  ecke.colSpan = 2;
  ecke.rowSpan = 2;
  const klartextachse = kopfzelle(achsenzeile);
  klartextachse.colSpan = laenge;
  klartextachse.textContent = 'Klartextbuchstabe';
  for (const [spalte, buchstabe] of [...alphabet].entries()) {
    tabellenknopf(kopfzelle(spaltenkopf, 'col'), buchstabe, `Klartextbuchstabe ${buchstabe}`, () => {
      quadratAuswahl(aktiveZeile, spalte);
    });
  }

  for (const [zeile, schluessel] of [...alphabet].entries()) {
    const tabellenzeile = tabellenkoerper.insertRow();
    if (zeile === 0) {
      const beschriftung = kopfzelle(tabellenzeile);
      beschriftung.rowSpan = laenge;
      beschriftung.className = 'quadrat-schluesselachse';
      const text = document.createElement('span');
      text.textContent = 'Schlüsselbuchstabe';
      beschriftung.append(text);
    }
    tabellenknopf(kopfzelle(tabellenzeile, 'row'), schluessel, `Schlüsselbuchstabe ${schluessel}`, () => {
      quadratAuswahl(zeile, aktiveSpalte);
    });
    for (const [spalte, buchstabe] of [...alphabet].entries()) {
      const geheim = verschieben(buchstabe, zeile);
      tabellenknopf(tabellenzeile.insertCell(), geheim,
        `Geheimtext ${geheim}, Schlüssel ${schluessel}, Klartext ${buchstabe}`, () => {
          quadratAuswahl(zeile, spalte);
        });
    }
  }

  function quadratAuswahl(zeile, spalte) {
    aktiveZeile = zeile;
    aktiveSpalte = spalte;
    quadrat.querySelectorAll('.quadrat-markiert, .quadrat-treffer').forEach(zelle => {
      zelle.classList.remove('quadrat-markiert', 'quadrat-treffer');
    });
    quadrat.querySelectorAll('[aria-pressed="true"]').forEach(knopf => {
      knopf.setAttribute('aria-pressed', 'false');
    });

    const zeilenZellen = Array.from(tabellenkoerper.rows[zeile].cells).slice(-(laenge + 1));
    zeilenZellen.forEach(zelle => zelle.classList.add('quadrat-markiert'));
    for (const reihe of tabellenkoerper.rows) {
      reihe.cells[reihe.cells.length - laenge + spalte].classList.add('quadrat-markiert');
    }
    const spaltenZelle = spaltenkopf.cells[spalte];
    spaltenZelle.classList.add('quadrat-markiert');
    const treffer = zeilenZellen[spalte + 1];
    treffer.classList.add('quadrat-treffer');
    for (const zelle of [zeilenZellen[0], spaltenZelle, treffer]) {
      zelle.firstElementChild.setAttribute('aria-pressed', 'true');
    }
  }

  quadratAuswahl(aktiveZeile, aktiveSpalte);
  return quadratAuswahl;
}
