/** Textos de aprofundamento da aba Hoje: dia pessoal, fases da Lua e áreas do dia. */
import type { Area } from '@/engines/daily';
import { localized, type L } from './types';

type DayText = { title: string; text: string; favors: string; avoid: string };

/** O que cada dia pessoal (1 a 9) pede. */
export const PERSONAL_DAY = localized<Record<number, L<DayText>>>('PERSONAL_DAY', {
  1: {
    pt: { title: 'Dia de começos', text: 'O dia pessoal 1 abre um pequeno ciclo. A energia favorece iniciativa, decisões rápidas e assumir a frente do que é seu. O que você colocar em movimento hoje tende a ganhar impulso nos próximos dias.', favors: 'Iniciar projetos, se apresentar, tomar decisões, praticar algo novo.', avoid: 'Esperar a aprovação de todos ou adiar o primeiro passo.' },
    en: { title: 'A day of beginnings', text: 'Personal day 1 opens a small cycle. The energy favors initiative, quick decisions and leading what is yours. What you set in motion today tends to gain momentum in the days ahead.', favors: 'Starting projects, introducing yourself, deciding, trying something new.', avoid: 'Waiting for everyone’s approval or postponing the first step.' },
    es: { title: 'Día de comienzos', text: 'El día personal 1 abre un pequeño ciclo. La energía favorece la iniciativa, las decisiones rápidas y tomar la delantera en lo que es tuyo. Lo que pongas en marcha hoy tiende a ganar impulso en los próximos días.', favors: 'Iniciar proyectos, presentarte, decidir, probar algo nuevo.', avoid: 'Esperar la aprobación de todos o aplazar el primer paso.' },
  },
  2: {
    pt: { title: 'Dia de parceria', text: 'O dia pessoal 2 pede delicadeza. As respostas chegam pela escuta, pela cooperação e pelos detalhes. É um dia mais receptivo: a força está em acolher, negociar e esperar o tempo certo.', favors: 'Conversas sinceras, acordos, trabalho em dupla, cuidar de alguém.', avoid: 'Forçar resultados, confrontos diretos e decisões precipitadas.' },
    en: { title: 'A day of partnership', text: 'Personal day 2 asks for gentleness. Answers come through listening, cooperation and details. It is a more receptive day: strength lies in welcoming, negotiating and waiting for the right time.', favors: 'Honest talks, agreements, teamwork, caring for someone.', avoid: 'Forcing results, direct confrontation and rushed decisions.' },
    es: { title: 'Día de alianza', text: 'El día personal 2 pide delicadeza. Las respuestas llegan por la escucha, la cooperación y los detalles. Es un día más receptivo: la fuerza está en acoger, negociar y esperar el momento justo.', favors: 'Charlas sinceras, acuerdos, trabajo en pareja, cuidar a alguien.', avoid: 'Forzar resultados, confrontaciones directas y decisiones apresuradas.' },
  },
  3: {
    pt: { title: 'Dia de expressão', text: 'O dia pessoal 3 é leve, criativo e social. Sua voz encontra espaço: escrever, falar, postar, encontrar pessoas. A alegria funciona como estratégia, abrindo portas que a seriedade não abre.', favors: 'Criar, comunicar, encontrar amigos, divulgar uma ideia.', avoid: 'Dispersar energia em mil frentes ou falar sem pensar.' },
    en: { title: 'A day of expression', text: 'Personal day 3 is light, creative and social. Your voice finds room: writing, speaking, posting, meeting people. Joy works as a strategy, opening doors that seriousness does not.', favors: 'Creating, communicating, meeting friends, sharing an idea.', avoid: 'Scattering energy across too many fronts or speaking without thinking.' },
    es: { title: 'Día de expresión', text: 'El día personal 3 es ligero, creativo y social. Tu voz encuentra espacio: escribir, hablar, publicar, ver gente. La alegría funciona como estrategia y abre puertas que la seriedad no abre.', favors: 'Crear, comunicar, ver amigos, difundir una idea.', avoid: 'Dispersar la energía en mil frentes o hablar sin pensar.' },
  },
  4: {
    pt: { title: 'Dia de construção', text: 'O dia pessoal 4 pede foco e método. É o dia de colocar ordem: organizar a agenda, resolver pendências e dar passos concretos. Pequenas tarefas bem feitas hoje viram base sólida amanhã.', favors: 'Planejar, organizar, cuidar do corpo, finanças e tarefas práticas.', avoid: 'Atalhos, improvisos arriscados e rigidez com os outros.' },
    en: { title: 'A day of building', text: 'Personal day 4 asks for focus and method. It is a day to bring order: organize your schedule, clear pending tasks and take concrete steps. Small tasks done well today become a solid base tomorrow.', favors: 'Planning, organizing, caring for your body, finances and practical tasks.', avoid: 'Shortcuts, risky improvising and rigidity with others.' },
    es: { title: 'Día de construcción', text: 'El día personal 4 pide foco y método. Es el día de poner orden: organizar la agenda, resolver pendientes y dar pasos concretos. Pequeñas tareas bien hechas hoy se vuelven base sólida mañana.', favors: 'Planificar, organizar, cuidar el cuerpo, finanzas y tareas prácticas.', avoid: 'Atajos, improvisaciones arriesgadas y rigidez con los demás.' },
  },
  5: {
    pt: { title: 'Dia de movimento', text: 'O dia pessoal 5 traz mudança, curiosidade e imprevistos. A rotina pede uma pausa: algo novo quer entrar. Flexibilidade é o seu melhor recurso, e uma surpresa pode virar oportunidade.', favors: 'Experimentar, viajar, mudar de ambiente, conhecer pessoas e ideias.', avoid: 'Excessos, impulsividade e prometer o que não pode cumprir.' },
    en: { title: 'A day of movement', text: 'Personal day 5 brings change, curiosity and the unexpected. Routine asks for a pause: something new wants in. Flexibility is your best resource, and a surprise may turn into an opportunity.', favors: 'Experimenting, traveling, changing scenery, meeting people and ideas.', avoid: 'Excess, impulsiveness and promising what you cannot deliver.' },
    es: { title: 'Día de movimiento', text: 'El día personal 5 trae cambio, curiosidad e imprevistos. La rutina pide una pausa: algo nuevo quiere entrar. La flexibilidad es tu mejor recurso, y una sorpresa puede volverse oportunidad.', favors: 'Experimentar, viajar, cambiar de ambiente, conocer gente e ideas.', avoid: 'Excesos, impulsividad y prometer lo que no puedes cumplir.' },
  },
  6: {
    pt: { title: 'Dia de afeto', text: 'O dia pessoal 6 gira em torno do amor, da casa e da responsabilidade com quem importa. É um dia para cuidar e se deixar cuidar, harmonizar ambientes e resolver pendências afetivas.', favors: 'Família, relacionamentos, beleza, casa, gestos de cuidado.', avoid: 'Querer controlar os outros ou carregar o peso de todos.' },
    en: { title: 'A day of affection', text: 'Personal day 6 revolves around love, home and responsibility toward those who matter. It is a day to care and be cared for, harmonize spaces and settle emotional matters.', favors: 'Family, relationships, beauty, home, caring gestures.', avoid: 'Trying to control others or carrying everyone’s weight.' },
    es: { title: 'Día de afecto', text: 'El día personal 6 gira en torno al amor, el hogar y la responsabilidad con quienes importan. Es un día para cuidar y dejarse cuidar, armonizar espacios y resolver asuntos afectivos.', favors: 'Familia, relaciones, belleza, hogar, gestos de cuidado.', avoid: 'Querer controlar a los demás o cargar con el peso de todos.' },
  },
  7: {
    pt: { title: 'Dia de introspecção', text: 'O dia pessoal 7 convida ao silêncio. A mente fica mais profunda e a intuição, mais clara. É um dia ótimo para estudar, meditar e entender algo por dentro, não para exposição ou correria.', favors: 'Estudo, meditação, terapia, natureza, momentos a sós.', avoid: 'Agenda lotada, discussões e decisões só pela lógica do outro.' },
    en: { title: 'A day of introspection', text: 'Personal day 7 invites silence. The mind grows deeper and intuition clearer. It is a great day to study, meditate and understand something from within, not for exposure or rushing.', favors: 'Study, meditation, therapy, nature, time alone.', avoid: 'A packed schedule, arguments and deciding by someone else’s logic.' },
    es: { title: 'Día de introspección', text: 'El día personal 7 invita al silencio. La mente se vuelve más profunda y la intuición más clara. Es un gran día para estudiar, meditar y entender algo por dentro, no para exponerse ni correr.', favors: 'Estudio, meditación, terapia, naturaleza, momentos a solas.', avoid: 'Agenda llena, discusiones y decidir por la lógica de otro.' },
  },
  8: {
    pt: { title: 'Dia de realização', text: 'O dia pessoal 8 traz força para resultados concretos. Dinheiro, carreira e decisões importantes ganham destaque. É o dia de se posicionar com autoridade e colher o que foi plantado com esforço.', favors: 'Negociar, cobrar, investir, liderar, tomar decisões de peso.', avoid: 'Arrogância, gastos por impulso e medir tudo só pelo resultado.' },
    en: { title: 'A day of achievement', text: 'Personal day 8 brings strength for concrete results. Money, career and important decisions take center stage. It is a day to stand with authority and harvest what was planted with effort.', favors: 'Negotiating, collecting, investing, leading, making weighty decisions.', avoid: 'Arrogance, impulse spending and measuring everything by results.' },
    es: { title: 'Día de realización', text: 'El día personal 8 trae fuerza para resultados concretos. Dinero, carrera y decisiones importantes ganan protagonismo. Es el día de posicionarte con autoridad y cosechar lo que sembraste con esfuerzo.', favors: 'Negociar, cobrar, invertir, liderar, tomar decisiones de peso.', avoid: 'Arrogancia, gastos impulsivos y medir todo solo por el resultado.' },
  },
  9: {
    pt: { title: 'Dia de encerramento', text: 'O dia pessoal 9 fecha o pequeno ciclo. É hora de concluir, perdoar, doar e abrir espaço. O que já cumpriu seu papel pode ir embora com gratidão, para que algo novo chegue no próximo dia 1.', favors: 'Finalizar tarefas, desapegar, ajudar alguém, agradecer.', avoid: 'Começar grandes projetos ou se agarrar ao que já terminou.' },
    en: { title: 'A day of closure', text: 'Personal day 9 closes the small cycle. It is time to complete, forgive, give and make room. What has served its purpose can leave with gratitude, so something new arrives on the next day 1.', favors: 'Finishing tasks, letting go, helping someone, giving thanks.', avoid: 'Starting big projects or clinging to what has ended.' },
    es: { title: 'Día de cierre', text: 'El día personal 9 cierra el pequeño ciclo. Es hora de concluir, perdonar, donar y abrir espacio. Lo que ya cumplió su papel puede irse con gratitud, para que algo nuevo llegue el próximo día 1.', favors: 'Terminar tareas, soltar, ayudar a alguien, agradecer.', avoid: 'Empezar grandes proyectos o aferrarte a lo que ya terminó.' },
  },
});

/** Aprofundamento de cada fase da Lua (0 = nova … 7 = balsâmica). */
export const MOON_PHASE_DEEP = localized<L<{ text: string; ritual: string }[]>>('MOON_PHASE_DEEP', {
  pt: [
    { text: 'A Lua está entre a Terra e o Sol, invisível no céu. É o ponto zero do ciclo: energia voltada para dentro, ideal para silenciar, sentir e definir o que você quer cultivar nas próximas quatro semanas.', ritual: 'Escreva três intenções no presente, como se já fossem reais.' },
    { text: 'O primeiro fio de luz aparece. A intenção começa a ganhar forma, mas ainda é frágil: precisa de proteção, constância e pequenos passos diários.', ritual: 'Escolha uma ação de 10 minutos para começar hoje.' },
    { text: 'Metade da Lua iluminada: é o primeiro teste do ciclo. Surgem obstáculos que pedem decisão e ajuste de rota. A tensão aqui é motor, não sinal de desistência.', ritual: 'Liste um obstáculo e uma decisão que destrava o caminho.' },
    { text: 'A luz cresce quase até o máximo. É fase de refinar, corrigir detalhes e confiar no processo. A colheita está perto; a pressa pode atrapalhar.', ritual: 'Revise um projeto e melhore um detalhe que ninguém vê.' },
    { text: 'A Lua está oposta ao Sol, totalmente iluminada. Emoções ficam intensas e o que estava escondido se revela. É o ápice do ciclo: tempo de celebrar, perceber resultados e reconhecer o que precisa mudar.', ritual: 'Agradeça por uma conquista e observe o que te tirou do eixo.' },
    { text: 'A luz começa a diminuir. É a fase de compartilhar o que foi aprendido, ensinar, distribuir e reconhecer quem ajudou no caminho.', ritual: 'Conte a alguém algo que você aprendeu neste mês.' },
    { text: 'Metade da Lua iluminada, agora minguando. Momento de crise de consciência: rever hábitos, cortar excessos e reorganizar prioridades antes do próximo ciclo.', ritual: 'Escolha um hábito, objeto ou compromisso para soltar.' },
    { text: 'O último fio de luz antes da Lua Nova. Fase de descanso, entrega e cura. O corpo e a mente pedem pausa para que o próximo começo venha limpo.', ritual: 'Durma mais cedo e faça uma limpeza simples em casa.' },
  ],
  en: [
    { text: 'The Moon sits between Earth and Sun, invisible in the sky. It is the zero point of the cycle: energy turned inward, ideal for quiet, feeling and defining what you want to grow over the next four weeks.', ritual: 'Write three intentions in the present tense, as if already true.' },
    { text: 'The first thread of light appears. Your intention starts to take shape but is still fragile: it needs protection, consistency and small daily steps.', ritual: 'Choose a 10-minute action to start today.' },
    { text: 'Half the Moon is lit: the cycle’s first test. Obstacles appear that call for decisions and course correction. Tension here is fuel, not a reason to quit.', ritual: 'List one obstacle and one decision that clears the path.' },
    { text: 'The light grows almost to its peak. It is a phase for refining, fixing details and trusting the process. Harvest is near; hurry can get in the way.', ritual: 'Review a project and improve a detail no one sees.' },
    { text: 'The Moon is opposite the Sun, fully lit. Emotions run high and what was hidden comes to light. It is the peak of the cycle: time to celebrate, notice results and recognize what needs to change.', ritual: 'Give thanks for an achievement and notice what threw you off balance.' },
    { text: 'The light begins to wane. It is a phase to share what you learned, teach, give back and acknowledge who helped along the way.', ritual: 'Tell someone something you learned this month.' },
    { text: 'Half the Moon lit, now waning. A moment of reckoning: review habits, cut excess and reorder priorities before the next cycle.', ritual: 'Choose one habit, object or commitment to release.' },
    { text: 'The last thread of light before the New Moon. A phase of rest, surrender and healing. Body and mind ask for a pause so the next beginning comes clean.', ritual: 'Go to bed earlier and do a simple clean-up at home.' },
  ],
  es: [
    { text: 'La Luna está entre la Tierra y el Sol, invisible en el cielo. Es el punto cero del ciclo: energía hacia dentro, ideal para hacer silencio, sentir y definir lo que quieres cultivar en las próximas cuatro semanas.', ritual: 'Escribe tres intenciones en presente, como si ya fueran reales.' },
    { text: 'Aparece el primer hilo de luz. La intención empieza a tomar forma, pero aún es frágil: necesita protección, constancia y pequeños pasos diarios.', ritual: 'Elige una acción de 10 minutos para empezar hoy.' },
    { text: 'Media Luna iluminada: es la primera prueba del ciclo. Surgen obstáculos que piden decisión y ajuste de rumbo. La tensión aquí es motor, no señal para rendirse.', ritual: 'Anota un obstáculo y una decisión que despeje el camino.' },
    { text: 'La luz crece casi al máximo. Es fase de refinar, corregir detalles y confiar en el proceso. La cosecha está cerca; la prisa puede estorbar.', ritual: 'Revisa un proyecto y mejora un detalle que nadie ve.' },
    { text: 'La Luna está opuesta al Sol, totalmente iluminada. Las emociones se intensifican y lo oculto se revela. Es el punto máximo del ciclo: tiempo de celebrar, ver resultados y reconocer lo que debe cambiar.', ritual: 'Agradece un logro y observa lo que te sacó de tu eje.' },
    { text: 'La luz empieza a disminuir. Es la fase de compartir lo aprendido, enseñar, repartir y reconocer a quien ayudó en el camino.', ritual: 'Cuéntale a alguien algo que aprendiste este mes.' },
    { text: 'Media Luna iluminada, ahora menguante. Momento de crisis de conciencia: revisar hábitos, cortar excesos y reordenar prioridades antes del próximo ciclo.', ritual: 'Elige un hábito, objeto o compromiso para soltar.' },
    { text: 'El último hilo de luz antes de la Luna Nueva. Fase de descanso, entrega y sanación. El cuerpo y la mente piden pausa para que el próximo comienzo llegue limpio.', ritual: 'Acuéstate más temprano y haz una limpieza sencilla en casa.' },
  ],
});

type Level = 'low' | 'mid' | 'high';
export const levelOf = (score: number): Level => (score <= 2 ? 'low' : score >= 4 ? 'high' : 'mid');

/** Conselho por área e intensidade da nota do dia. */
export const AREA_ADVICE = localized<Record<Area, L<Record<Level, string>>>>('AREA_ADVICE', {
  love: {
    pt: { low: 'Afetos mais sensíveis hoje. Prefira gentileza a cobranças e deixe conversas difíceis para outro dia.', mid: 'Clima estável nas relações. Um gesto simples de atenção rende mais do que grandes declarações.', high: 'Coração aberto e magnético. Ótimo para encontros, reconciliações e dizer o que você sente.' },
    en: { low: 'Feelings are more sensitive today. Choose kindness over demands and leave hard talks for another day.', mid: 'Relationships feel steady. A simple act of attention goes further than grand declarations.', high: 'An open, magnetic heart. Great for dates, reconciliations and saying what you feel.' },
    es: { low: 'Afectos más sensibles hoy. Prefiere la amabilidad a los reclamos y deja las charlas difíciles para otro día.', mid: 'Clima estable en las relaciones. Un gesto simple de atención rinde más que grandes declaraciones.', high: 'Corazón abierto y magnético. Ideal para encuentros, reconciliaciones y decir lo que sientes.' },
  },
  work: {
    pt: { low: 'Trabalho pede revisão, não ousadia. Confira detalhes e evite assinar ou decidir no impulso.', mid: 'Ritmo produtivo e previsível. Bom dia para avançar tarefas de rotina com constância.', high: 'Dia forte para carreira e dinheiro. Apresente ideias, negocie e tome a iniciativa.' },
    en: { low: 'Work calls for review, not boldness. Check details and avoid signing or deciding on impulse.', mid: 'A productive, predictable pace. A good day to move routine tasks forward steadily.', high: 'A strong day for career and money. Pitch ideas, negotiate and take the initiative.' },
    es: { low: 'El trabajo pide revisión, no audacia. Revisa detalles y evita firmar o decidir por impulso.', mid: 'Ritmo productivo y previsible. Buen día para avanzar tareas de rutina con constancia.', high: 'Día fuerte para carrera y dinero. Presenta ideas, negocia y toma la iniciativa.' },
  },
  energy: {
    pt: { low: 'Bateria mais baixa. Respeite pausas, beba água e não se compare com o ritmo dos outros.', mid: 'Energia equilibrada. Alterne foco e descanso para chegar bem ao fim do dia.', high: 'Vitalidade em alta. Use para treinar, resolver pendências e encarar o que vinha adiando.' },
    en: { low: 'Lower battery. Respect breaks, drink water and don’t compare yourself to others’ pace.', mid: 'Balanced energy. Alternate focus and rest to end the day well.', high: 'Vitality is high. Use it to exercise, clear pending tasks and face what you were putting off.' },
    es: { low: 'Batería más baja. Respeta las pausas, bebe agua y no te compares con el ritmo ajeno.', mid: 'Energía equilibrada. Alterna foco y descanso para llegar bien al final del día.', high: 'Vitalidad alta. Úsala para entrenar, resolver pendientes y enfrentar lo que venías posponiendo.' },
  },
});
