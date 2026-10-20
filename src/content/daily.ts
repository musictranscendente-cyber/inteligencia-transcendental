import type { L } from './types';

type DayLine = { title: string; phrase: string };

/** Três variações por dia pessoal; a escolha muda a cada dia. */
export const DAY_LINES: Record<number, L<DayLine[]>> = {
  1: {
    pt: [
      { title: 'Comece antes de estar pronto', phrase: 'Hoje a coragem vale mais que o plano perfeito.' },
      { title: 'O primeiro passo é seu', phrase: 'Uma decisão simples pode abrir um caminho inteiro.' },
      { title: 'Dia de assinar seu nome', phrase: 'Mostre sua ideia: ela tem mais força do que você imagina.' },
    ],
    en: [
      { title: 'Start before you feel ready', phrase: 'Today courage is worth more than the perfect plan.' },
      { title: 'The first step is yours', phrase: 'One simple decision can open a whole path.' },
      { title: 'A day to sign your name', phrase: 'Share your idea: it is stronger than you think.' },
    ],
    es: [
      { title: 'Empieza antes de estar listo', phrase: 'Hoy el coraje vale más que el plan perfecto.' },
      { title: 'El primer paso es tuyo', phrase: 'Una decisión simple puede abrir todo un camino.' },
      { title: 'Día de firmar con tu nombre', phrase: 'Muestra tu idea: tiene más fuerza de la que imaginas.' },
    ],
  },
  2: {
    pt: [
      { title: 'A força está no encontro', phrase: 'Ouça mais do que fala: a resposta vem de alguém.' },
      { title: 'Devagar também é caminho', phrase: 'Paciência hoje é uma forma de inteligência.' },
      { title: 'Dia de dar as mãos', phrase: 'Uma conversa sincera pode resolver o que a pressa complicou.' },
    ],
    en: [
      { title: 'Strength lives in togetherness', phrase: 'Listen more than you speak: the answer comes through someone.' },
      { title: 'Slow is also a path', phrase: 'Today patience is a form of intelligence.' },
      { title: 'A day to hold hands', phrase: 'An honest talk can fix what hurry complicated.' },
    ],
    es: [
      { title: 'La fuerza está en el encuentro', phrase: 'Escucha más de lo que hablas: la respuesta llega a través de alguien.' },
      { title: 'Despacio también es camino', phrase: 'Hoy la paciencia es una forma de inteligencia.' },
      { title: 'Día de darse la mano', phrase: 'Una charla sincera puede resolver lo que la prisa complicó.' },
    ],
  },
  3: {
    pt: [
      { title: 'Sua voz quer espaço', phrase: 'Diga, escreva, crie: hoje a expressão abre portas.' },
      { title: 'Leveza é estratégia', phrase: 'Um sorriso pode destravar o que a seriedade não alcança.' },
      { title: 'Dia de brilhar sem pedir licença', phrase: 'Compartilhe algo seu com o mundo.' },
    ],
    en: [
      { title: 'Your voice wants room', phrase: 'Say it, write it, create it: today expression opens doors.' },
      { title: 'Lightness is a strategy', phrase: 'A smile can unlock what seriousness cannot.' },
      { title: 'Shine without asking permission', phrase: 'Share something of yours with the world.' },
    ],
    es: [
      { title: 'Tu voz quiere espacio', phrase: 'Dilo, escríbelo, créalo: hoy la expresión abre puertas.' },
      { title: 'La ligereza es estrategia', phrase: 'Una sonrisa puede destrabar lo que la seriedad no alcanza.' },
      { title: 'Brilla sin pedir permiso', phrase: 'Comparte algo tuyo con el mundo.' },
    ],
  },
  4: {
    pt: [
      { title: 'Tijolo por tijolo', phrase: 'Organize uma coisa só e sinta a calma que isso traz.' },
      { title: 'O dia pede raízes', phrase: 'Constância vence inspiração passageira.' },
      { title: 'Feito é melhor que perfeito', phrase: 'Termine aquilo que está pela metade.' },
    ],
    en: [
      { title: 'Brick by brick', phrase: 'Organize just one thing and feel the calm it brings.' },
      { title: 'Today asks for roots', phrase: 'Consistency beats passing inspiration.' },
      { title: 'Done beats perfect', phrase: 'Finish what is halfway done.' },
    ],
    es: [
      { title: 'Ladrillo a ladrillo', phrase: 'Organiza una sola cosa y siente la calma que trae.' },
      { title: 'El día pide raíces', phrase: 'La constancia vence a la inspiración pasajera.' },
      { title: 'Hecho es mejor que perfecto', phrase: 'Termina lo que quedó a medias.' },
    ],
  },
  5: {
    pt: [
      { title: 'Mude a rota sem medo', phrase: 'O inesperado de hoje pode ser um presente disfarçado.' },
      { title: 'Abra uma janela nova', phrase: 'Experimente algo diferente, nem que seja o caminho de casa.' },
      { title: 'Liberdade com direção', phrase: 'Diga sim à aventura, mas lembre-se do seu porquê.' },
    ],
    en: [
      { title: 'Change course without fear', phrase: 'Today’s surprise may be a gift in disguise.' },
      { title: 'Open a new window', phrase: 'Try something different, even just the way home.' },
      { title: 'Freedom with direction', phrase: 'Say yes to adventure, but remember your why.' },
    ],
    es: [
      { title: 'Cambia de ruta sin miedo', phrase: 'Lo inesperado de hoy puede ser un regalo disfrazado.' },
      { title: 'Abre una ventana nueva', phrase: 'Prueba algo distinto, aunque sea el camino a casa.' },
      { title: 'Libertad con dirección', phrase: 'Di sí a la aventura, pero recuerda tu porqué.' },
    ],
  },
  6: {
    pt: [
      { title: 'O amor mora nos detalhes', phrase: 'Um gesto pequeno de cuidado vale muito hoje.' },
      { title: 'Cuide de quem cuida', phrase: 'Inclua você na lista de pessoas que merecem carinho.' },
      { title: 'Dia de harmonizar o lar', phrase: 'Beleza e afeto transformam qualquer ambiente.' },
    ],
    en: [
      { title: 'Love lives in the details', phrase: 'A small gesture of care goes a long way today.' },
      { title: 'Care for the caregiver', phrase: 'Put yourself on the list of people who deserve kindness.' },
      { title: 'A day to harmonize home', phrase: 'Beauty and affection transform any space.' },
    ],
    es: [
      { title: 'El amor vive en los detalles', phrase: 'Un pequeño gesto de cuidado vale mucho hoy.' },
      { title: 'Cuida a quien cuida', phrase: 'Inclúyete en la lista de personas que merecen cariño.' },
      { title: 'Día de armonizar el hogar', phrase: 'La belleza y el afecto transforman cualquier espacio.' },
    ],
  },
  7: {
    pt: [
      { title: 'O silêncio tem respostas', phrase: 'Desacelere: sua intuição está falando baixinho.' },
      { title: 'Olhe para dentro', phrase: 'Hoje entender vale mais que fazer.' },
      { title: 'Dia de mergulhar fundo', phrase: 'Estude, observe e confie no que você sente.' },
    ],
    en: [
      { title: 'Silence holds answers', phrase: 'Slow down: your intuition is speaking softly.' },
      { title: 'Look within', phrase: 'Today understanding is worth more than doing.' },
      { title: 'A day to dive deep', phrase: 'Study, observe and trust what you feel.' },
    ],
    es: [
      { title: 'El silencio tiene respuestas', phrase: 'Baja el ritmo: tu intuición habla bajito.' },
      { title: 'Mira hacia dentro', phrase: 'Hoy entender vale más que hacer.' },
      { title: 'Día de sumergirse a fondo', phrase: 'Estudia, observa y confía en lo que sientes.' },
    ],
  },
  8: {
    pt: [
      { title: 'Seu poder está em jogo', phrase: 'Decida com firmeza e assuma o comando.' },
      { title: 'Dia de colher', phrase: 'O esforço de antes pode virar resultado agora.' },
      { title: 'Pense grande, aja preciso', phrase: 'Estratégia e foco transformam metas em conquistas.' },
    ],
    en: [
      { title: 'Your power is in play', phrase: 'Decide firmly and take the lead.' },
      { title: 'A day to harvest', phrase: 'Past effort can turn into results now.' },
      { title: 'Think big, act precisely', phrase: 'Strategy and focus turn goals into wins.' },
    ],
    es: [
      { title: 'Tu poder está en juego', phrase: 'Decide con firmeza y toma el mando.' },
      { title: 'Día de cosechar', phrase: 'El esfuerzo de antes puede convertirse en resultado ahora.' },
      { title: 'Piensa en grande, actúa preciso', phrase: 'Estrategia y enfoque convierten metas en logros.' },
    ],
  },
  9: {
    pt: [
      { title: 'Solte para receber', phrase: 'Encerrar algo hoje abre espaço para o novo.' },
      { title: 'Perdão é liberdade', phrase: 'Deixe ir o que pesa: você não precisa carregar tudo.' },
      { title: 'Dia de olhar o todo', phrase: 'Generosidade volta multiplicada.' },
    ],
    en: [
      { title: 'Let go to receive', phrase: 'Closing something today makes room for the new.' },
      { title: 'Forgiveness is freedom', phrase: 'Release what weighs on you: you don’t have to carry it all.' },
      { title: 'See the bigger picture', phrase: 'Generosity comes back multiplied.' },
    ],
    es: [
      { title: 'Suelta para recibir', phrase: 'Cerrar algo hoy abre espacio para lo nuevo.' },
      { title: 'Perdonar es libertad', phrase: 'Deja ir lo que pesa: no tienes que cargarlo todo.' },
      { title: 'Día de mirar el todo', phrase: 'La generosidad vuelve multiplicada.' },
    ],
  },
};

/** Dicas da Lua por fase (0 = nova … 7 = minguante balsâmica). */
export const MOON_PHASES: L<{ name: string; tip: string }[]> = {
  pt: [
    { name: 'Lua Nova', tip: 'Bom momento para intenções e começos silenciosos.' },
    { name: 'Lua Crescente', tip: 'Dê os primeiros passos do que você planejou.' },
    { name: 'Quarto Crescente', tip: 'Ajuste a rota e enfrente os obstáculos com decisão.' },
    { name: 'Crescente Gibosa', tip: 'Refine os detalhes: a colheita está perto.' },
    { name: 'Lua Cheia', tip: 'Emoções à flor da pele; celebre e observe o que se revelou.' },
    { name: 'Minguante Gibosa', tip: 'Compartilhe o que aprendeu e agradeça.' },
    { name: 'Quarto Minguante', tip: 'Hora de soltar, limpar e reorganizar.' },
    { name: 'Lua Balsâmica', tip: 'Descanse e prepare o terreno para o próximo ciclo.' },
  ],
  en: [
    { name: 'New Moon', tip: 'A good time for intentions and quiet beginnings.' },
    { name: 'Waxing Crescent', tip: 'Take the first steps of what you planned.' },
    { name: 'First Quarter', tip: 'Adjust course and meet obstacles decisively.' },
    { name: 'Waxing Gibbous', tip: 'Refine the details: harvest is near.' },
    { name: 'Full Moon', tip: 'Emotions run high; celebrate and notice what was revealed.' },
    { name: 'Waning Gibbous', tip: 'Share what you learned and give thanks.' },
    { name: 'Last Quarter', tip: 'Time to release, clear and reorganize.' },
    { name: 'Balsamic Moon', tip: 'Rest and prepare the ground for the next cycle.' },
  ],
  es: [
    { name: 'Luna Nueva', tip: 'Buen momento para intenciones y comienzos silenciosos.' },
    { name: 'Luna Creciente', tip: 'Da los primeros pasos de lo que planeaste.' },
    { name: 'Cuarto Creciente', tip: 'Ajusta el rumbo y enfrenta los obstáculos con decisión.' },
    { name: 'Gibosa Creciente', tip: 'Refina los detalles: la cosecha está cerca.' },
    { name: 'Luna Llena', tip: 'Emociones a flor de piel; celebra y observa lo que se reveló.' },
    { name: 'Gibosa Menguante', tip: 'Comparte lo que aprendiste y agradece.' },
    { name: 'Cuarto Menguante', tip: 'Hora de soltar, limpiar y reorganizar.' },
    { name: 'Luna Balsámica', tip: 'Descansa y prepara el terreno para el próximo ciclo.' },
  ],
};

/** Notificações diárias intrigantes (o app escolhe uma por dia). */
export const NOTIFICATION_LINES: L<string[]> = {
  pt: [
    'O céu de hoje tem um recado só para você.',
    'Sua carta do dia está virada, esperando você.',
    'Hoje um número conversa com a sua história.',
    'A Lua mudou de humor. E você?',
    'Tem uma energia nova no seu dia. Vem ver.',
    'Seu anjo do dia já chegou.',
    'Uma pergunta para hoje: o que você vai soltar?',
  ],
  en: [
    'Today’s sky has a message just for you.',
    'Your card of the day is face down, waiting.',
    'Today a number is talking to your story.',
    'The Moon changed its mood. Did you?',
    'There’s a new energy in your day. Come see.',
    'Your angel of the day has arrived.',
    'A question for today: what will you let go of?',
  ],
  es: [
    'El cielo de hoy tiene un mensaje solo para ti.',
    'Tu carta del día está boca abajo, esperándote.',
    'Hoy un número conversa con tu historia.',
    'La Luna cambió de humor. ¿Y tú?',
    'Hay una energía nueva en tu día. Ven a ver.',
    'Tu ángel del día ya llegó.',
    'Una pregunta para hoy: ¿qué vas a soltar?',
  ],
};
