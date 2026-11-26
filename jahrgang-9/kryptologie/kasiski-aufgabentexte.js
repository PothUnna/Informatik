// Eigenständige Nacherzählungen nach den gemeinfreien Originalen.
const kasiskiAufgabentexte = [
  {
    titel: 'Alice im Wunderland',
    autor: 'Lewis Carroll',
    romanLink: 'https://de.wikisource.org/wiki/Alice_im_Wunderland',
    romanLinkText: 'Deutsche Ausgabe auf Wikisource lesen',
    text: `Alice lag mit ihrer Schwester am Fluss. Ihre Schwester las ein Buch, und Alice fragte sich, wie ein Buch ohne Bilder und Gespräche überhaupt interessant sein konnte. Gerade wollte sie ein paar Gänseblümchen pflücken, da lief ein weißes Kaninchen an ihr vorbei. Das weiße Kaninchen zog eine Uhr aus der Westentasche und sah darauf. Es murmelte, dass es zu spät kommen würde. Jetzt sprang Alice auf. Sie war schon vielen Kaninchen begegnet, doch noch keines hatte eine Uhr dabeigehabt.
Am Ende der Wiese verschwand das weiße Kaninchen in einem Loch unter der Hecke. Alice kroch hinterher. Der Gang führte eine Weile geradeaus und fiel dann so plötzlich ab, dass Alice sich nirgends mehr festhalten konnte. Sie fiel und fiel. An der Wand entdeckte sie Regale, Landkarten und ein leeres Marmeladenglas. Sie stellte das Marmeladenglas zurück, als sie an einem weiteren Regal vorbeikam. Während sie weiterfiel, fragte sie sich, ob sie auf der anderen Seite der Erde wieder herauskommen würde.
Schließlich landete Alice auf einem Haufen trockener Blätter. Das weiße Kaninchen war schon wieder ein Stück voraus. Alice hörte noch, wie es um die Ecke lief. Dann stand sie in einer langen Halle mit vielen Türen. Jede Tür war verschlossen. Auf einem kleinen Glastisch lag ein goldener Schlüssel. Mit dem goldenen Schlüssel konnte Alice nur eine winzige Tür öffnen, die sie zuerst übersehen hatte. Dahinter lag ein Garten. Sie konnte die Blumen sehen, doch durch die Tür passte gerade einmal ihr Kopf. Als sie zum Glastisch zurückkehrte, stand dort eine kleine Flasche. Nun fragte sich Alice, welche Überraschung als Nächstes auf sie wartete.`
  },
  {
    titel: 'Die Schatzinsel',
    autor: 'Robert Louis Stevenson',
    romanLink: 'https://www.gutenberg.org/files/49424/49424-h/49424-h.htm',
    romanLinkText: 'Deutsche Ausgabe bei Project Gutenberg lesen',
    text: `Jim Hawkins half seiner Mutter im Gasthaus an der Küste. Eines Tages kam ein Seemann mit einer schweren Kiste herein und verlangte ein Zimmer mit Blick auf das Meer. Er trug einen alten blauen Mantel und eine Narbe auf der Wange. Für jeden Monat, in dem Jim nach einem Seemann mit nur einem Bein Ausschau hielt, versprach er ihm eine Münze. Wenn der Wind nachts gegen die Fenster drückte, sang der Seemann immer wieder dasselbe Lied.
Eines Abends lag dichter Nebel über der Straße. Der Seemann war gerade draußen, als ein Fremder das Gasthaus betrat. Jim hörte später aus der Gaststube ein Krachen. Der Fremde lief davon, und der alte Seemann blieb zitternd zurück. Nun hielt Jim noch genauer nach dem Mann mit nur einem Bein Ausschau. Stattdessen kam ein blinder Besucher. Er bat Jim, ihn in die Gaststube zu führen, und drückte dem Seemann einen kleinen Zettel in die Hand.
In der Nacht öffneten Jim und seine Mutter die schwere Kiste. Seine Mutter zählte die Münzen, die der Gast ihnen schuldete, während Jim draußen auf jedes Geräusch achtete. Neben den Münzen fand er ein in Wachstuch gewickeltes Päckchen. Plötzlich hörte er das Klopfen eines Stocks. Es kam immer näher. Jim nahm das Päckchen, und beide flohen aus dem Gasthaus. Beim Arzt öffnete Jim das Päckchen. Darin lag eine Karte mit einer Bucht, mehreren Hügeln und drei roten Kreuzen. Jim ahnte noch nicht, dass ihm derselbe Mann, nach dem er so lange Ausschau gehalten hatte, auf der Fahrt zur Insel begegnen würde.`
  },
  {
    titel: 'Der Zauberer von Oz',
    autor: 'L. Frank Baum',
    romanLink: 'https://www.gutenberg.org/cache/epub/43936/pg43936-images.html',
    romanLinkText: 'Englisches Original bei Project Gutenberg lesen',
    text: `Dorothy wohnte mit ihrer Tante und ihrem Onkel in einem kleinen Haus in Kansas. An diesem Nachmittag stand die Luft still. Dann kam ein tiefer Ton aus der Ferne, und das Gras legte sich in eine Richtung. Ihre Tante rief nach ihr und öffnete die Falltür zum Schutzkeller. Dorothy wollte ihr folgen, doch Toto hatte sich unter dem Bett versteckt. Gerade als sie ihn zu fassen bekam, hob sich das ganze Haus vom Boden.
Das Haus drehte sich im Sturm. Dorothy hielt Toto fest und wartete, bis das Schaukeln aufhörte. Als sie endlich die Tür öffnete, war der Himmel blau. Vor dem Haus standen Menschen, die ihr dankten, obwohl Dorothy noch gar nicht wusste, was sie getan hatte. Sie wollte nur zurück nach Kansas. Eine alte Frau sagte ihr, dass der Zauberer in der Smaragdstadt vielleicht helfen könne. Der Weg aus gelben Ziegeln führe direkt dorthin.
Der Weg aus gelben Ziegeln führte zuerst an Feldern vorbei. Auf einem Zaun entdeckte Dorothy eine Vogelscheuche, die ihr zuwinkte. Dorothy half ihr vom Pfahl, und die Vogelscheuche beschloss mitzugehen. Weiter hinten im Wald hörten sie ein Stöhnen. Zwischen den Bäumen stand ein Mann aus Blech, der sich nicht bewegen konnte. Dorothy fand seine Ölkanne und ölte seine Gelenke. Auch er wollte den Zauberer um Hilfe bitten.
Als sie weitergingen, wurde der Wald so dicht, dass sie den Himmel kaum noch sahen. Toto sprang plötzlich nach vorn und bellte. Ein Löwe trat auf den Weg aus gelben Ziegeln. Dorothy stellte sich vor Toto. Zu ihrer Überraschung wich der Löwe zurück und gestand, dass er vor fast allem Angst hatte. Bald gingen sie zu viert weiter. Jeder hoffte auf etwas anderes, aber alle mussten denselben Weg finden.`
  }
];

const kasiskiAufgabenschluessel = [
  'EVA', 'UHU', 'MOND', 'SPUK', 'BESEN', 'MAGIE',
  'ZAUBER', 'WOLKEN', 'KOMPASS', 'GOLDSTAB', 'BERGPFAD'
];
