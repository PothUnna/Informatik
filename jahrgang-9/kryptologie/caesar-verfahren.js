const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function verschieben(text, schritte) {
  return text.replace(/[A-Za-z]/g, buchstabe => {
    const position = alphabet.indexOf(buchstabe.toUpperCase());
    const neu = alphabet[(position + schritte + alphabet.length) % alphabet.length];
    return buchstabe === buchstabe.toUpperCase() ? neu : neu.toLowerCase();
  });
}

const klartext = document.querySelector('#klartext');
const geheimtext = document.querySelector('#geheimtext');
const schluessel = document.querySelector('#schluessel');
const verschluesseln = document.querySelector('#verschluesseln');
const entschluesseln = document.querySelector('#entschluesseln');
const schluesselHinweis = document.querySelector('#key-error');
const geheimtextAlphabet = document.querySelector('#alphabet-ausgabe');

function alphabetAktualisieren() {
  const gueltig = schluessel.validity.valid;
  schluesselHinweis.hidden = gueltig;
  verschluesseln.disabled = !gueltig;
  entschluesseln.disabled = !gueltig;
  geheimtextAlphabet.textContent = gueltig
    ? [...verschieben(alphabet, schluessel.valueAsNumber)].join(' ')
    : '–';
}

schluessel.addEventListener('input', alphabetAktualisieren);
verschluesseln.addEventListener('click', () => {
  geheimtext.value = verschieben(klartext.value, schluessel.valueAsNumber);
});
entschluesseln.addEventListener('click', () => {
  klartext.value = verschieben(geheimtext.value, -schluessel.valueAsNumber);
});
alphabetAktualisieren();

const aufgaben = {
  encrypt: {
    loesung: [verschieben('ZEBRA', 3)],
    richtig: 'Richtig! Aus Z wird C, weil du nach Z bei A weiterzählst.',
    falsch: 'Prüfe, ob du überall drei Schritte nach rechts gegangen bist.'
  },
  decrypt: {
    loesung: [verschieben('NSKTWRFYNP', -5)],
    richtig: 'Richtig! Fünf Schritte nach links machen aus dem Geheimtext wieder INFORMATIK.',
    falsch: 'Gehe von jedem Buchstaben fünf Schritte nach links.'
  },
  crack: {
    loesung: ['7', verschieben('NLOLPT', -7)],
    richtig: 'Richtig! Mit Schlüssel 7 erhältst du den Klartext GEHEIM.',
    falsch: 'Prüfe, ob dein Schlüssel den ganzen Geheimtext in ein verständliches Wort verwandelt.'
  },
  count: {
    loesung: ['25'],
    richtig: 'Richtig! Die Schlüssel 1 bis 25 verändern den Text. Ab 26 wiederholen sich die Verschiebungen.',
    falsch: 'Zähle die Schlüssel von 1 bis einschließlich 25.'
  }
};

document.querySelectorAll('.exercise').forEach(formular => {
  const aufgabe = aufgaben[formular.dataset.check];
  const felder = [...formular.querySelectorAll('input')];
  const rueckmeldung = formular.querySelector('.feedback');

  formular.addEventListener('submit', ereignis => {
    ereignis.preventDefault();
    const richtig = felder.every((feld, index) => {
      const antwort = feld.type === 'number' ? String(feld.valueAsNumber) : feld.value.trim().toUpperCase();
      return antwort === aufgabe.loesung[index];
    });
    rueckmeldung.textContent = richtig ? aufgabe.richtig : aufgabe.falsch;
    rueckmeldung.dataset.result = richtig ? 'correct' : 'retry';
  });

  formular.addEventListener('input', () => {
    rueckmeldung.textContent = '';
  });
});
