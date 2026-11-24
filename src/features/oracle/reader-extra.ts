/**
 * Frases do leitor do oráculo em francês, alemão e italiano (as de PT, EN e ES ficam em reader.ts).
 * {c} = carta no meio da frase, {C} = no começo, {m} = significado. No alemão, {c} aparece sempre
 * no nominativo, para o artigo da carta ("der Narr", "die Karte …") continuar correto.
 */
import type { ExtraLang } from '@/content/types';
import type { Suit } from '@/engines/divination';
import type { Role, Topic, Verdict } from './reader';

type X<T> = Record<ExtraLang, T>;

export const X_ROLE_LINES: X<Record<Role, string[]>> = {
  fr: {
    answer: ['La carte venue répondre est {c}. {M}'],
    past: ['En regardant en arrière, {c} est sortie : {m} C’est de là que vient cette histoire, et elle résonne encore en toi.', 'La racine de tout cela est {c} : {m} C’est derrière toi, mais cela t’a aidé à arriver ici.'],
    present: ['Maintenant, dans ton moment, c’est {c} qui parle : {m}', 'Le portrait d’aujourd’hui, c’est {c} : {m} Voilà où en sont les choses, sans fard.'],
    future: ['Pour la suite, la tendance arrive avec {c} : {m}', 'Ce qui vient, c’est {c} : {m} Si tu gardes le cap, c’est là que cela mène.'],
    you: ['À ton sujet dans cette histoire, {c} est sortie : {m} C’est ainsi que tu arrives dans cette relation.'],
    other: ['L’autre personne apparaît comme {c} : {m} Essaie de regarder un instant avec ses yeux.'],
    bond: ['Et votre relation, aujourd’hui, c’est {c} : {m}'],
    advice: ['Le conseil vient avec {c} : {m} Garde-le précieusement.', 'Et que faire ? {C} répond : {m}'],
    obstacle: ['Ce qui traverse ton chemin, c’est {c} : {m} Ce n’est pas là pour t’arrêter, mais pour te garder attentif.', 'Le défi ici a un nom : {c}. {M}'],
    potential: ['Ce qui peut fleurir apparaît comme {c} : {m} Cela existe déjà en toi, il lui faut seulement de l’espace.'],
    base: ['Tout au fond, soutenant l’ensemble, il y a {c} : {m}'],
    goal: ['Ce que tu cherches, même sans le dire, c’est {c} : {m}'],
    near: ['Pour les prochaines semaines, arrive {c} : {m}'],
    environment: ['Les personnes et l’environnement autour de toi apparaissent comme {c} : {m}'],
    hopes: ['Entre ce que tu espères et ce que tu crains, surgit {c} : {m} Parfois, la peur et le désir sont la même chose vue de deux côtés.'],
    outcome: ['Et l’issue, si rien ne change, c’est {c} : {m}'],
    situation: ['La situation, telle qu’elle est, est venue avec {c} : {m}'],
    development: ['À mi-chemin apparaît {c} : {m}'],
    weighs: ['Ce qui pèse maintenant, c’est {c} : {m} Inutile de faire comme si tu ne le ressentais pas.'],
    helps: ['Ce qui t’aide, c’est {c} : {m} C’est l’outil que tu as en main.'],
    goes: ['Et où cela mène-t-il ? {C} est sortie : {m}'],
    path: ['Le chemin qui s’ouvre arrive avec {c} : {m}'],
  },
  de: {
    answer: ['Die Karte, die antwortet, ist {c}. {M}'],
    past: ['Im Rückblick zeigt sich {c}: {m} Daher kommt diese Geschichte, und sie klingt noch in dir nach.', 'Die Wurzel von allem ist {c}: {m} Das liegt hinter dir, hat dich aber hierher gebracht.'],
    present: ['Jetzt, in deinem Moment, spricht {c}: {m}', 'Das Bild von heute ist {c}: {m} So stehen die Dinge, ganz ohne Beschönigung.'],
    future: ['Für die Zukunft zeigt sich {c}: {m}', 'Was kommt, ist {c}: {m} Wenn du deinen Kurs hältst, geht es dorthin.'],
    you: ['Für dich in dieser Geschichte steht {c}: {m} So trittst du in diese Beziehung.'],
    other: ['Die andere Person zeigt sich als {c}: {m} Versuche, einen Moment lang mit ihren Augen zu sehen.'],
    bond: ['Und eure Beziehung ist heute {c}: {m}'],
    advice: ['Der Rat lautet {c}: {m} Bewahre ihn gut.', 'Und was tun? {C} antwortet: {m}'],
    obstacle: ['Was dir im Weg steht, ist {c}: {m} Es soll dich nicht aufhalten, sondern wachsam machen.', 'Die Herausforderung hat einen Namen: {c}. {M}'],
    potential: ['Was aufblühen kann, zeigt sich als {c}: {m} Es ist schon in dir und braucht nur Raum.'],
    base: ['Ganz unten, als Fundament von allem, liegt {c}: {m}'],
    goal: ['Was du suchst, auch ohne es auszusprechen, ist {c}: {m}'],
    near: ['Für die nächsten Wochen kommt {c}: {m}'],
    environment: ['Die Menschen und dein Umfeld zeigen sich als {c}: {m}'],
    hopes: ['Zwischen dem, was du hoffst, und dem, was du fürchtest, erscheint {c}: {m} Manchmal sind Angst und Wunsch dasselbe, von zwei Seiten gesehen.'],
    outcome: ['Und der Ausgang, wenn sich nichts ändert, ist {c}: {m}'],
    situation: ['Die Lage, so wie sie ist, zeigt {c}: {m}'],
    development: ['Auf halbem Weg erscheint {c}: {m}'],
    weighs: ['Was dich gerade belastet, ist {c}: {m} Du musst nicht so tun, als würdest du es nicht spüren.'],
    helps: ['Was dir hilft, ist {c}: {m} Das ist das Werkzeug in deiner Hand.'],
    goes: ['Und wohin führt das? Es erscheint {c}: {m}'],
    path: ['Der Weg, der sich öffnet, ist {c}: {m}'],
  },
  it: {
    answer: ['La carta venuta a rispondere è {c}. {M}'],
    past: ['Guardando indietro, è uscita {c}: {m} È da lì che viene questa storia, e risuona ancora in te.', 'La radice di tutto questo è {c}: {m} È alle tue spalle, ma ti ha aiutato ad arrivare qui.'],
    present: ['Adesso, nel tuo momento, parla {c}: {m}', 'Il ritratto di oggi è {c}: {m} Le cose stanno così, senza abbellimenti.'],
    future: ['Guardando avanti, la tendenza arriva con {c}: {m}', 'Ciò che arriva è {c}: {m} Se mantieni la rotta, è lì che si va.'],
    you: ['Su di te in questa storia è uscita {c}: {m} È così che arrivi in questa relazione.'],
    other: ['L’altra persona appare come {c}: {m} Prova per un istante a guardare con i suoi occhi.'],
    bond: ['E la vostra relazione, oggi, è {c}: {m}'],
    advice: ['Il consiglio arriva con {c}: {m} Custodiscilo con cura.', 'E cosa fare? {C} risponde: {m}'],
    obstacle: ['Ciò che attraversa il tuo cammino è {c}: {m} Non è lì per fermarti, ma per tenerti attento.', 'La sfida qui ha un nome: {c}. {M}'],
    potential: ['Ciò che può fiorire appare come {c}: {m} Esiste già in te, ha solo bisogno di spazio.'],
    base: ['In fondo, a sostenere tutto, c’è {c}: {m}'],
    goal: ['Ciò che cerchi, anche senza dirlo, è {c}: {m}'],
    near: ['Per le prossime settimane arriva {c}: {m}'],
    environment: ['Le persone e l’ambiente intorno a te appaiono come {c}: {m}'],
    hopes: ['Tra ciò che speri e ciò che temi, sorge {c}: {m} A volte la paura e il desiderio sono la stessa cosa vista da lati diversi.'],
    outcome: ['E l’esito, se nulla cambia, è {c}: {m}'],
    situation: ['La situazione, così com’è, è arrivata con {c}: {m}'],
    development: ['A metà strada appare {c}: {m}'],
    weighs: ['Ciò che ti pesa adesso è {c}: {m} Non serve fingere di non sentirlo.'],
    helps: ['Ciò che ti aiuta è {c}: {m} È lo strumento che hai in mano.'],
    goes: ['E dove porta tutto questo? È uscita {c}: {m}'],
    path: ['Il cammino che si apre arriva con {c}: {m}'],
  },
};

const end = (q: string) => (/[?!.…]$/.test(q) ? '' : '.');

export const X_OPEN_WITH_Q: X<(n: string, q: string) => string> = {
  fr: (n, q) => `${n}, tu m’as demandé : « ${q} »${end(q)}`,
  de: (n, q) => `${n}, du hast mich gefragt: „${q}“${end(q)}`,
  it: (n, q) => `${n}, mi hai chiesto: “${q}”${end(q)}`,
};

export const X_OPEN_NO_Q: X<(n: string) => string> = {
  fr: (n) => `${n}, tu n’as pas écrit de question, alors les cartes ont parlé de ton moment dans son ensemble. Lis cela comme un portrait d’aujourd’hui.`,
  de: (n) => `${n}, du hast keine Frage geschrieben, also haben die Karten über deinen Moment als Ganzes gesprochen. Lies es wie ein Bild des Jetzt.`,
  it: (n) => `${n}, non hai scritto una domanda, così le carte hanno parlato del tuo momento nel suo insieme. Leggilo come un ritratto di adesso.`,
};

export const X_TOPIC_INTRO: X<Record<Topic, string>> = {
  fr: {
    love: 'C’est une affaire de cœur, alors je vais la lire avec soin.',
    work: 'C’est une question de travail, et les cartes ont été très directes.',
    money: 'L’argent est un sujet concret, et les cartes ont répondu sur le même ton.',
    health: 'Avant tout : sur la santé, les cartes montrent le côté émotionnel et énergétique, et ne remplacent pas un médecin.',
    family: 'La famille touche nos racines, et les cartes en ont parlé.',
    study: 'Les études demandent de la concentration, et les cartes ont montré où est la tienne.',
    travel: 'Déménager et voyager demandent du courage, et les cartes l’ont vu.',
    friends: 'L’amitié est un miroir, et les cartes en ont montré le reflet.',
    spirit: 'C’est une question de l’âme, et les cartes ont répondu à ce niveau.',
    general: 'Voyons ensemble ce qui est sorti.',
  },
  de: {
    love: 'Es ist eine Herzensangelegenheit, also lese ich sie mit Sorgfalt.',
    work: 'Es ist eine Frage zur Arbeit, und die Karten waren sehr direkt.',
    money: 'Geld ist ein konkretes Thema, und die Karten haben im selben Ton geantwortet.',
    health: 'Vorab: Bei Gesundheit zeigen die Karten die emotionale und energetische Seite und ersetzen keinen Arzt.',
    family: 'Familie berührt unsere Wurzeln, und die Karten haben darüber gesprochen.',
    study: 'Lernen braucht Fokus, und die Karten haben gezeigt, wo deiner liegt.',
    travel: 'Umziehen und Reisen brauchen Mut, und die Karten haben das gesehen.',
    friends: 'Freundschaft ist ein Spiegel, und die Karten haben das Spiegelbild gezeigt.',
    spirit: 'Es ist eine Frage der Seele, und die Karten haben auf dieser Ebene geantwortet.',
    general: 'Schauen wir gemeinsam, was gekommen ist.',
  },
  it: {
    love: 'È una questione di cuore, quindi la leggerò con cura.',
    work: 'È una domanda di lavoro, e le carte sono state molto dirette.',
    money: 'Il denaro è un tema concreto, e le carte hanno risposto con lo stesso tono.',
    health: 'Prima di tutto: sulla salute, le carte mostrano il lato emotivo ed energetico e non sostituiscono un medico.',
    family: 'La famiglia tocca le nostre radici, e le carte ne hanno parlato.',
    study: 'Lo studio chiede concentrazione, e le carte hanno mostrato dov’è la tua.',
    travel: 'Trasferirsi e viaggiare chiedono coraggio, e le carte lo hanno visto.',
    friends: 'L’amicizia è uno specchio, e le carte ne hanno mostrato il riflesso.',
    spirit: 'È una domanda dell’anima, e le carte hanno risposto a quel livello.',
    general: 'Vediamo insieme che cosa è uscito.',
  },
};

export const X_SUIT_PATTERN: X<Record<Suit, (n: number) => string>> = {
  fr: {
    cups: (n) => `Remarque que ${n} cartes de Coupes sont sorties : cette question est avant tout émotionnelle.`,
    wands: (n) => `${n} cartes de Bâtons sont sorties : il y a beaucoup d’énergie d’action ici, et le moment demande du mouvement.`,
    swords: (n) => `${n} cartes d’Épées sont sorties : ta tête travaille beaucoup. Attention à ne pas souffrir par anticipation.`,
    pentacles: (n) => `${n} cartes de Deniers sont sorties : le côté pratique (argent, routine, corps) est au centre de tout cela.`,
  },
  de: {
    cups: (n) => `Beachte: ${n} Kelch-Karten sind gekommen. Diese Frage ist vor allem emotional.`,
    wands: (n) => `${n} Stab-Karten sind gekommen: Hier steckt viel Tatkraft, und der Moment verlangt Bewegung.`,
    swords: (n) => `${n} Schwert-Karten sind gekommen: Dein Kopf arbeitet viel. Pass auf, dass du nicht im Voraus leidest.`,
    pentacles: (n) => `${n} Münz-Karten sind gekommen: Die praktische Seite (Geld, Alltag, Körper) steht im Mittelpunkt.`,
  },
  it: {
    cups: (n) => `Nota che sono uscite ${n} carte di Coppe: questa questione è prima di tutto emotiva.`,
    wands: (n) => `Sono uscite ${n} carte di Bastoni: c’è molta energia d’azione qui, e il momento chiede movimento.`,
    swords: (n) => `Sono uscite ${n} carte di Spade: la tua mente lavora molto. Attenzione a non soffrire in anticipo.`,
    pentacles: (n) => `Sono uscite ${n} carte di Denari: il lato pratico (denaro, routine, corpo) è al centro di tutto.`,
  },
};

export const X_MAJORS_PATTERN: X<(n: number) => string> = {
  fr: (n) => `${n} Arcanes Majeurs sont sortis : ce n’est pas une petite chose, c’est un chapitre important de ta vie.`,
  de: (n) => `${n} Große Arkana sind gekommen: Das ist keine Kleinigkeit, sondern ein wichtiges Kapitel deines Lebens.`,
  it: (n) => `Sono usciti ${n} Arcani Maggiori: non è una cosa piccola, è un capitolo importante della tua vita.`,
};

export const X_REVERSED_PATTERN: X<string> = {
  fr: 'Plusieurs cartes sont sorties inversées : il y a de l’énergie bloquée. Avant d’agir à l’extérieur, il vaut la peine de regarder à l’intérieur.',
  de: 'Mehrere Karten kamen umgekehrt: Da ist blockierte Energie. Bevor du außen handelst, lohnt sich der Blick nach innen.',
  it: 'Diverse carte sono uscite rovesciate: c’è energia bloccata. Prima di agire fuori, vale la pena guardare dentro.',
};

export const X_ANSWER: X<Record<Verdict, string>> = {
  fr: {
    yes: 'Pour répondre directement : je dirais oui. Les cartes ouvrent le chemin, mais ce oui dépend de ton action, pas seulement de l’attente.',
    maybe: 'Pour répondre directement : ce n’est pas encore un oui ferme. Il y a une vraie chance, mais quelque chose doit être ajusté avant, et cet ajustement est entre tes mains.',
    no: 'Pour répondre directement : en l’état actuel, les cartes disent non, ou du moins pas maintenant. Ce n’est pas une punition : c’est un signe pour changer de cap avant d’insister.',
  },
  de: {
    yes: 'Direkt geantwortet: Ich würde Ja sagen. Die Karten öffnen den Weg, aber dieses Ja hängt davon ab, dass du handelst und nicht nur wartest.',
    maybe: 'Direkt geantwortet: Es ist noch kein festes Ja. Es gibt eine echte Chance, aber vorher muss etwas angepasst werden, und das liegt in deiner Hand.',
    no: 'Direkt geantwortet: So wie die Dinge stehen, sagen die Karten Nein, oder zumindest nicht jetzt. Das ist keine Strafe, sondern ein Zeichen, den Kurs zu ändern, bevor du weiter drängst.',
  },
  it: {
    yes: 'Rispondendo in modo diretto: direi di sì. Le carte aprono la strada, ma questo sì dipende dal tuo agire, non solo dall’attesa.',
    maybe: 'Rispondendo in modo diretto: non è ancora un sì deciso. C’è una possibilità reale, ma prima qualcosa va sistemato, e questo è nelle tue mani.',
    no: 'Rispondendo in modo diretto: per come stanno le cose, le carte dicono di no, o almeno non adesso. Non è una punizione: è un segnale per cambiare rotta prima di insistere.',
  },
};

export const X_SUMMARY: X<Record<Verdict, string>> = {
  fr: {
    yes: 'En résumé : le moment est en ta faveur. Profite de cette bonne énergie et fais le pas suivant.',
    maybe: 'En résumé : c’est une phase d’ajustement. De bonnes choses arrivent, mais elles demandent attention et patience.',
    no: 'En résumé : c’est le moment de prendre soin de toi et de revoir le chemin avant de continuer.',
  },
  de: {
    yes: 'Alles zusammen: Der Moment ist auf deiner Seite. Nutze diese gute Energie und mach den nächsten Schritt.',
    maybe: 'Alles zusammen: Es ist eine Phase der Anpassung. Gutes kommt, aber es braucht Aufmerksamkeit und Geduld.',
    no: 'Alles zusammen: Es ist Zeit, gut für dich zu sorgen und den Weg zu überdenken, bevor du weitergehst.',
  },
  it: {
    yes: 'Mettendo tutto insieme: il momento è a tuo favore. Approfitta di questa buona energia e fai il passo successivo.',
    maybe: 'Mettendo tutto insieme: è una fase di aggiustamento. Arrivano cose buone, ma chiedono attenzione e pazienza.',
    no: 'Mettendo tutto insieme: è il momento di prenderti cura di te e rivedere il cammino prima di andare avanti.',
  },
};

export const X_CHOICE: X<Record<Verdict, string>> = {
  fr: {
    yes: 'Entre les options que tu as posées, les cartes favorisent celle qui te fait avancer, même si elle te fait un peu peur.',
    maybe: 'Entre les options que tu as posées, aucune n’est mauvaise. Choisis celle que tu peux tenir avec calme, pas celle qui semble la plus belle.',
    no: 'Entre les options que tu as posées, les cartes demandent de ne pas décider sur un coup de tête. Attends encore un peu et observe.',
  },
  de: {
    yes: 'Unter den Möglichkeiten, die du nennst, bevorzugen die Karten die, die dich voranbringt, auch wenn sie dir ein wenig Angst macht.',
    maybe: 'Unter den Möglichkeiten, die du nennst, ist keine falsch. Wähle die, die du in Ruhe tragen kannst, nicht die, die am schönsten aussieht.',
    no: 'Unter den Möglichkeiten, die du nennst, bitten die Karten dich, nicht aus dem Impuls zu entscheiden. Warte noch etwas und beobachte.',
  },
  it: {
    yes: 'Tra le opzioni che hai posto, le carte favoriscono quella che ti porta avanti, anche se ti fa un po’ paura.',
    maybe: 'Tra le opzioni che hai posto, nessuna è sbagliata. Scegli quella che riesci a sostenere con calma, non quella che sembra più bella.',
    no: 'Tra le opzioni che hai posto, le carte chiedono di non decidere d’impulso. Aspetta ancora un po’ e osserva.',
  },
};

export const X_TIMING_SUIT: X<Record<Suit | 'major', string>> = {
  fr: {
    wands: 'Côté temps : cela tend à aller vite, en quelques jours ou quelques semaines.',
    swords: 'Côté temps : cela devrait se décider en quelques semaines, juste après une conversation ou une décision importante.',
    cups: 'Côté temps : cela va au rythme du cœur. Pense à quelques mois, sans hâte.',
    pentacles: 'Côté temps : c’est une construction. Cela prend des mois et vient peu à peu, mais solidement.',
    major: 'Côté temps : cela ne dépend pas seulement du calendrier. Cela arrive quand tu fais le virage intérieur que cette carte demande.',
  },
  de: {
    wands: 'Zum Zeitpunkt: Das geht eher schnell, innerhalb von Tagen oder wenigen Wochen.',
    swords: 'Zum Zeitpunkt: Es sollte sich in einigen Wochen klären, direkt nach einem wichtigen Gespräch oder einer Entscheidung.',
    cups: 'Zum Zeitpunkt: Es folgt dem Tempo des Herzens. Denk an einige Monate, ohne Eile.',
    pentacles: 'Zum Zeitpunkt: Hier wird etwas aufgebaut. Es dauert Monate und kommt nach und nach, aber solide.',
    major: 'Zum Zeitpunkt: Es hängt nicht nur vom Kalender ab. Es geschieht, wenn du die innere Wende vollziehst, um die diese Karte bittet.',
  },
  it: {
    wands: 'Sui tempi: tende a muoversi in fretta, nel giro di giorni o poche settimane.',
    swords: 'Sui tempi: dovrebbe definirsi in alcune settimane, subito dopo una conversazione o una decisione importante.',
    cups: 'Sui tempi: segue il ritmo del cuore. Pensa ad alcuni mesi, senza fretta.',
    pentacles: 'Sui tempi: è qualcosa che si costruisce. Richiede mesi e arriva poco a poco, ma arriva solido.',
    major: 'Sui tempi: non dipende solo dal calendario. Succede quando fai la svolta interiore che questa carta chiede.',
  },
};

export const X_TIMING_VERDICT: X<Record<Verdict, string>> = {
  fr: {
    yes: 'Côté temps : cela semble plus proche que tu ne l’imagines.',
    maybe: 'Côté temps : ce n’est pas immédiat. Laisse le temps au temps et continue à faire ta part.',
    no: 'Côté temps : cela va encore prendre un peu de temps, et c’est peut-être mieux ainsi.',
  },
  de: {
    yes: 'Zum Zeitpunkt: Es scheint näher, als du denkst.',
    maybe: 'Zum Zeitpunkt: Es ist nicht sofort. Gib der Zeit Zeit und tu weiter deinen Teil.',
    no: 'Zum Zeitpunkt: Es wird noch etwas dauern, und vielleicht ist das gut so.',
  },
  it: {
    yes: 'Sui tempi: sembra più vicino di quanto immagini.',
    maybe: 'Sui tempi: non è immediato. Dai tempo al tempo e continua a fare la tua parte.',
    no: 'Sui tempi: ci vorrà ancora un po’, e forse è meglio così.',
  },
};

export const X_HOW: X<(c: string) => string> = {
  fr: (c) => `Et que faire de tout cela ? Le conseil le plus fort est celui de ${c} : commence par là, avec un petit pas concret dès cette semaine.`,
  de: (c) => `Und was tun damit? Der stärkste Rat kommt von dieser Karte: ${c}. Fang dort an, mit einem kleinen, konkreten Schritt noch diese Woche.`,
  it: (c) => `E cosa fare con tutto questo? Il consiglio più forte è quello arrivato con ${c}: comincia da lì, con un passo piccolo e concreto già questa settimana.`,
};

export const X_WHY: X<(c: string) => string> = {
  fr: (c) => `Et pourquoi cela arrive-t-il ? La racine apparaît avec ${c}. La regarder avec honnêteté, sans te culpabiliser, change déjà beaucoup.`,
  de: (c) => `Und warum geschieht das? Die Wurzel zeigt diese Karte: ${c}. Ehrlich hinzuschauen, ohne dir Vorwürfe zu machen, verändert schon viel.`,
  it: (c) => `E perché sta succedendo? La radice appare con ${c}. Guardarla con onestà, senza colpevolizzarti, cambia già molto.`,
};

export const X_WEAVE: X<(a: string, h: string | null, e: string, ask: boolean) => string> = {
  fr: (a, h, e, ask) => (ask && h ? `Autrement dit : même avec ${a} qui pèse, si tu utilises ${h} en ta faveur, cela va vers ${e}.` : h ? `Autrement dit : cela commence avec ${a}, compte sur ${h} et va vers ${e}.` : `Autrement dit : cela commence avec ${a} et va vers ${e}.`),
  de: (a, h, e, ask) => (ask && h ? `Anders gesagt: Auch wenn ${a} dich belastet, führt der Weg zu ${e}, wenn du ${h} für dich nutzt.` : h ? `Anders gesagt: Am Anfang steht ${a}, Unterstützung bringt ${h}, und am Ende wartet ${e}.` : `Anders gesagt: Am Anfang steht ${a}, und am Ende wartet ${e}.`),
  it: (a, h, e, ask) => (ask && h ? `In altre parole: anche con ${a} che pesa, se usi ${h} a tuo favore, questo va verso ${e}.` : h ? `In altre parole: tutto comincia con ${a}, conta su ${h} e va verso ${e}.` : `In altre parole: tutto comincia con ${a} e va verso ${e}.`),
};

export const X_TOPIC_ADVICE: X<Record<Topic, Record<Verdict, string>>> = {
  fr: {
    love: { yes: 'En amour, sois sincère sur ce que tu ressens et laisse l’autre te rejoindre à mi-chemin.', maybe: 'En amour, une conversation sincère vaut mieux que mille suppositions.', no: 'En amour, ne force pas : qui doit rester n’a pas besoin d’être convaincu.' },
    work: { yes: 'Au travail, montre ce que tu sais faire : c’est le moment de te positionner.', maybe: 'Au travail, organise la prochaine étape et trouve un allié.', no: 'Au travail, retiens l’anxiété et prépare-toi mieux avant le grand mouvement.' },
    money: { yes: 'Côté argent, c’est un bon moment pour semer, mais avec un plan.', maybe: 'Côté argent, revois tes comptes avant toute grande décision.', no: 'Côté argent, évite les risques maintenant et protège ce que tu as déjà.' },
    health: { yes: 'Côté santé, ton énergie tend à s’améliorer. Continue à prendre soin de toi.', maybe: 'Côté santé, écoute les signaux du corps et ne repousse pas ce soin.', no: 'Côté santé, cherche un avis professionnel et sois doux avec toi.' },
    family: { yes: 'En famille, c’est le moment de te rapprocher et de reconnaître qui est à tes côtés.', maybe: 'En famille, pose des limites avec tendresse : tout n’est pas ta responsabilité.', no: 'En famille, ne porte pas le poids seul. Demande de l’aide.' },
    study: { yes: 'Dans les études, ton effort tend à être reconnu. Garde le rythme.', maybe: 'Dans les études, préfère la régularité à la quantité.', no: 'Dans les études, revois ta méthode avant de douter de tes capacités.' },
    travel: { yes: 'Pour déménager ou voyager, les portes s’ouvrent. Planifie et vas-y.', maybe: 'Pour déménager ou voyager, il reste des détails pratiques à régler.', no: 'Pour déménager ou voyager, attends le bon moment : c’est le temps de la préparation.' },
    friends: { yes: 'En amitié, investis dans ceux qui te font du bien.', maybe: 'En amitié, dis ce que tu ressens avant que cela devienne de la rancœur.', no: 'En amitié, observe qui est vraiment présent.' },
    spirit: { yes: 'Sur le chemin spirituel, fais confiance à ton intuition : elle est bien accordée.', maybe: 'Sur le chemin spirituel, le silence et la pratique quotidienne apporteront la réponse.', no: 'Sur le chemin spirituel, reviens à l’essentiel : repos, présence et respiration.' },
    general: { yes: 'Avance avec confiance, un pas après l’autre.', maybe: 'Va doucement et ajuste ce qu’il faut en chemin.', no: 'Retire-toi un peu, prends soin de toi, et seulement ensuite avance.' },
  },
  de: {
    love: { yes: 'In der Liebe: Sei ehrlich mit dem, was du fühlst, und lass den anderen dir auf halbem Weg entgegenkommen.', maybe: 'In der Liebe ist ein ehrliches Gespräch mehr wert als tausend Vermutungen.', no: 'In der Liebe: Erzwinge nichts. Wer bleiben soll, muss nicht überzeugt werden.' },
    work: { yes: 'Im Beruf: Zeig, was du kannst. Es ist Zeit, Position zu beziehen.', maybe: 'Im Beruf: Plane den nächsten Schritt und such dir einen Verbündeten.', no: 'Im Beruf: Bremse die Unruhe und bereite dich besser vor dem großen Schritt vor.' },
    money: { yes: 'Beim Geld ist jetzt eine gute Zeit zum Säen, aber mit Plan.', maybe: 'Beim Geld: Prüfe deine Finanzen vor jeder großen Entscheidung.', no: 'Beim Geld: Meide jetzt Risiken und schütze, was du schon hast.' },
    health: { yes: 'Bei der Gesundheit verbessert sich deine Energie eher. Bleib achtsam mit dir.', maybe: 'Bei der Gesundheit: Hör auf die Signale deines Körpers und schieb die Vorsorge nicht auf.', no: 'Bei der Gesundheit: Hol dir fachlichen Rat und sei sanft mit dir.' },
    family: { yes: 'In der Familie ist es Zeit, näherzukommen und zu sehen, wer an deiner Seite steht.', maybe: 'In der Familie: Setz liebevoll Grenzen. Nicht alles ist deine Verantwortung.', no: 'In der Familie: Trag die Last nicht allein. Bitte um Hilfe.' },
    study: { yes: 'Beim Lernen wird deine Mühe eher anerkannt. Halte das Tempo.', maybe: 'Beim Lernen: Setz auf Beständigkeit statt Menge.', no: 'Beim Lernen: Überprüfe deine Methode, bevor du an deinen Fähigkeiten zweifelst.' },
    travel: { yes: 'Beim Umziehen oder Reisen öffnen sich Türen. Plane und geh los.', maybe: 'Beim Umziehen oder Reisen sind noch praktische Details zu klären.', no: 'Beim Umziehen oder Reisen: Warte auf den richtigen Moment. Jetzt ist Zeit der Vorbereitung.' },
    friends: { yes: 'In Freundschaften: Investiere in die, die dir guttun.', maybe: 'In Freundschaften: Sag, was du fühlst, bevor daraus Groll wird.', no: 'In Freundschaften: Achte darauf, wer wirklich da ist.' },
    spirit: { yes: 'Auf dem spirituellen Weg: Vertrau deiner Intuition, sie ist gut gestimmt.', maybe: 'Auf dem spirituellen Weg bringen Stille und tägliche Praxis die Antwort.', no: 'Auf dem spirituellen Weg: Zurück zum Wesentlichen, zu Ruhe, Präsenz und Atem.' },
    general: { yes: 'Geh mit Vertrauen weiter, Schritt für Schritt.', maybe: 'Geh es ruhig an und passe unterwegs an, was nötig ist.', no: 'Zieh dich ein wenig zurück, sorg für dich, und geh erst dann weiter.' },
  },
  it: {
    love: { yes: 'In amore, sii sincero su ciò che senti e lascia che l’altra persona ti venga incontro a metà strada.', maybe: 'In amore, una conversazione sincera vale più di mille supposizioni.', no: 'In amore, non forzare: chi deve restare non ha bisogno di essere convinto.' },
    work: { yes: 'Nel lavoro, mostra ciò che sai fare: è il momento di farti valere.', maybe: 'Nel lavoro, organizza il prossimo passo e cerca un alleato.', no: 'Nel lavoro, frena l’ansia e preparati meglio prima della grande mossa.' },
    money: { yes: 'Con il denaro, è un buon momento per seminare, ma con un piano.', maybe: 'Con il denaro, rivedi i conti prima di qualsiasi grande decisione.', no: 'Con il denaro, evita rischi adesso e proteggi ciò che hai già.' },
    health: { yes: 'Nella salute, la tua energia tende a migliorare. Continua a prenderti cura di te.', maybe: 'Nella salute, ascolta i segnali del corpo e non rimandare quel controllo.', no: 'Nella salute, cerca un parere professionale e sii gentile con te.' },
    family: { yes: 'In famiglia, è il momento di avvicinarti e riconoscere chi è al tuo fianco.', maybe: 'In famiglia, metti dei limiti con affetto: non tutto è una tua responsabilità.', no: 'In famiglia, non portare il peso da solo. Chiedi aiuto.' },
    study: { yes: 'Nello studio, il tuo impegno tende a essere riconosciuto. Mantieni il ritmo.', maybe: 'Nello studio, scambia la quantità con la costanza.', no: 'Nello studio, rivedi il metodo prima di dubitare delle tue capacità.' },
    travel: { yes: 'Per trasferirti o viaggiare, le porte si stanno aprendo. Pianifica e vai.', maybe: 'Per trasferirti o viaggiare, mancano ancora alcuni dettagli pratici.', no: 'Per trasferirti o viaggiare, aspetta il momento giusto: ora è tempo di prepararsi.' },
    friends: { yes: 'Nelle amicizie, investi in chi ti fa bene.', maybe: 'Nelle amicizie, di’ ciò che senti prima che diventi rancore.', no: 'Nelle amicizie, osserva chi è davvero presente.' },
    spirit: { yes: 'Nel cammino spirituale, fidati della tua intuizione: è ben accordata.', maybe: 'Nel cammino spirituale, il silenzio e la pratica quotidiana porteranno la risposta.', no: 'Nel cammino spirituale, torna all’essenziale: riposo, presenza e respiro.' },
    general: { yes: 'Vai avanti con fiducia, un passo alla volta.', maybe: 'Vai con calma e aggiusta ciò che serve lungo la strada.', no: 'Raccogliti un po’, prenditi cura di te e solo dopo vai avanti.' },
  },
};

export const X_YEAR_LINE: X<(n: number, title: string) => string> = {
  fr: (n, t) => `Et cela dialogue avec ton moment : tu es en Année personnelle ${n} (${t}).`,
  de: (n, t) => `Und das passt zu deinem Moment: Du bist im Persönlichen Jahr ${n} (${t}).`,
  it: (n, t) => `E questo dialoga con il tuo momento: sei nell’Anno personale ${n} (${t}).`,
};

export const X_CLOSING: X<string[]> = {
  fr: ['Prends cela comme un conseil d’ami : les cartes montrent le chemin, mais c’est toi qui marches.', 'Utilise cela comme un miroir, pas comme une sentence. Le choix reste le tien.'],
  de: ['Nimm das als Rat unter Freunden: Die Karten zeigen den Weg, aber gehen musst du ihn selbst.', 'Nutze das als Spiegel, nicht als Urteil. Die Entscheidung bleibt deine.'],
  it: ['Prendilo come il consiglio di un amico: le carte mostrano la strada, ma sei tu a camminare.', 'Usalo come uno specchio, non come una sentenza. La scelta resta tua.'],
};

export const X_COLUMNS: X<Record<string, string>> = {
  fr: { past: 'Dans ce qui est derrière toi', development: 'Autour du présent', future: 'Dans ce qui vient' },
  de: { past: 'In dem, was hinter dir liegt', development: 'Rund um die Gegenwart', future: 'In dem, was kommt' },
  it: { past: 'In ciò che è rimasto indietro', development: 'Intorno al presente', future: 'In ciò che arriva' },
};

/** Palavras curtas usadas ao nomear as cartas. */
export const X_WORDS: X<{ card: string; rune: string; reversedCard: string; reversedRune: string; or: string }> = {
  fr: { card: 'la carte', rune: 'la rune', reversedCard: ' (inversée)', reversedRune: ' (inversée)', or: 'ou' },
  de: { card: 'die Karte', rune: 'die Rune', reversedCard: ' (umgekehrt)', reversedRune: ' (umgekehrt)', or: 'oder' },
  it: { card: 'la carta', rune: 'la runa', reversedCard: ' (rovesciata)', reversedRune: ' (rovesciata)', or: 'o' },
};

export const X_ICHING: X<{ noQ: (n: string) => string; formed: (num: number, name: string, j: string) => string; changing: (num: number, name: string, j: string) => string; stable: string }> = {
  fr: {
    noQ: (n) => `${n}, tu as lancé les pièces sans question, alors le Yi King a parlé de ton moment dans son ensemble.`,
    formed: (num, name, j) => `L’hexagramme formé est le ${num}, ${name}. Son message : ${j}`,
    changing: (num, name, j) => `Comme des traits mutables sont sortis, la situation n’est pas figée : elle se transforme en l’hexagramme ${num}, ${name}. Autrement dit, le chemin mène à ceci : ${j}`,
    stable: 'Aucun trait mutable : la situation est stable, et le conseil vaut entièrement, tel quel.',
  },
  de: {
    noQ: (n) => `${n}, du hast die Münzen ohne Frage geworfen, also hat das I Ging über deinen Moment als Ganzes gesprochen.`,
    formed: (num, name, j) => `Es hat sich Hexagramm ${num} gebildet, ${name}. Seine Botschaft: ${j}`,
    changing: (num, name, j) => `Da wandelnde Linien gefallen sind, steht die Lage nicht still: Sie verwandelt sich in Hexagramm ${num}, ${name}. Der Weg führt also hierhin: ${j}`,
    stable: 'Keine wandelnden Linien: Die Lage ist stabil, und der Rat gilt ganz, so wie er ist.',
  },
  it: {
    noQ: (n) => `${n}, hai lanciato le monete senza una domanda, così l’I Ching ha parlato del tuo momento nel suo insieme.`,
    formed: (num, name, j) => `L’esagramma che si è formato è il ${num}, ${name}. Il suo messaggio è: ${j}`,
    changing: (num, name, j) => `Poiché sono uscite linee mutevoli, la situazione non è ferma: si sta trasformando nell’esagramma ${num}, ${name}. In altre parole, il cammino porta a questo: ${j}`,
    stable: 'Nessuna linea mutevole: la situazione è stabile, e il consiglio vale per intero, così com’è.',
  },
};
