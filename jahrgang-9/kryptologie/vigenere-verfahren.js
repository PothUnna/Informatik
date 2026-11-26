const quadratAuswahl = vigenereQuadrat(document.querySelector('#vigenere-quadrat'));

function umwandeln(text, schluessel, entschluesseln) {
  const schritte = [];
  const ergebnis = text.replace(/[A-Za-z]/g, buchstabe => {
    const zeichen = schluessel[schritte.length % schluessel.length];
    const verschiebung = alphabet.indexOf(zeichen) * (entschluesseln ? -1 : 1);
    const ausgabe = verschieben(buchstabe, verschiebung);
    schritte.push({ buchstabe, zeichen, ausgabe });
    return ausgabe;
  });
  return { ergebnis, schritte };
}

const werkzeug = document.querySelector('#vigenere-werkzeug');
const schluesselfeld = document.querySelector('#schluesselwort');
const klartext = document.querySelector('#klartext');
const geheimtext = document.querySelector('#geheimtext');
const hinweis = document.querySelector('#vigenere-hinweis');
const schrittwahl = document.querySelector('#vigenere-position');
const schrittbereich = document.querySelector('#vigenere-schritte');
let letzterDurchlauf = [];
let letzteRichtung = 'encrypt';

function schrittAnzeigen() {
  const schritt = letzterDurchlauf[schrittwahl.selectedIndex];
  if (!schritt) return;
  const klar = letzteRichtung === 'decrypt' ? schritt.ausgabe : schritt.buchstabe;
  quadratAuswahl(alphabet.indexOf(schritt.zeichen), alphabet.indexOf(klar.toUpperCase()));
}

werkzeug.addEventListener('submit', ereignis => {
  ereignis.preventDefault();
  letzteRichtung = ereignis.submitter?.value ?? 'encrypt';
  const entschluesseln = letzteRichtung === 'decrypt';
  const quelle = entschluesseln ? geheimtext : klartext;
  const ziel = entschluesseln ? klartext : geheimtext;
  const { ergebnis, schritte } = umwandeln(quelle.value, schluesselfeld.value.toUpperCase(), entschluesseln);

  ziel.value = ergebnis;
  letzterDurchlauf = schritte;
  schrittwahl.replaceChildren();
  for (const [index, schritt] of schritte.entries()) {
    schrittwahl.add(new Option(`${index + 1}. ${schritt.buchstabe} mit ${schritt.zeichen} → ${schritt.ausgabe}`));
  }
  schrittbereich.hidden = schritte.length === 0;
  hinweis.textContent = schritte.length
    ? `${schritte.length} Buchstaben umgewandelt.`
    : 'Gib Text mit mindestens einem Buchstaben von A bis Z ein.';
  schrittAnzeigen();
});
schrittwahl.addEventListener('change', schrittAnzeigen);
werkzeug.addEventListener('input', () => {
  schrittbereich.hidden = true;
  hinweis.textContent = '';
});

document.querySelectorAll('.exercise').forEach(formular => {
  const feld = formular.querySelector('input');
  const rueckmeldung = formular.querySelector('.feedback');
  formular.addEventListener('submit', ereignis => {
    ereignis.preventDefault();
    const richtig = feld.value.trim().toUpperCase() === formular.dataset.loesung;
    rueckmeldung.textContent = richtig ? 'Richtig!' : 'Prüfe deine Antwort noch einmal mit dem Quadrat.';
    rueckmeldung.dataset.result = richtig ? 'correct' : 'retry';
  });
  feld.addEventListener('input', () => {
    rueckmeldung.textContent = '';
  });
});
