import type { Trait } from '@/engines/traits';
import type { L } from './types';

export const CHAKRA_COLORS = ['#E5484D', '#F76B15', '#FFC53D', '#46A758', '#3E9BD6', '#6E56CF', '#C98FE5'];

export const CHAKRAS: L<{ name: string; sanskrit: string; theme: string; text: string; crystals: string[] }>[] = [
  {
    pt: { name: 'Raiz', sanskrit: 'Muladhara', theme: 'segurança e enraizamento', text: 'Associado à sensação de chão, pertencimento e estabilidade material.', crystals: ['Hematita', 'Turmalina negra', 'Jaspe vermelho'] },
    en: { name: 'Root', sanskrit: 'Muladhara', theme: 'safety and grounding', text: 'Associated with a sense of ground, belonging and material stability.', crystals: ['Hematite', 'Black tourmaline', 'Red jasper'] },
    es: { name: 'Raíz', sanskrit: 'Muladhara', theme: 'seguridad y enraizamiento', text: 'Asociado a la sensación de suelo, pertenencia y estabilidad material.', crystals: ['Hematita', 'Turmalina negra', 'Jaspe rojo'] },
  },
  {
    pt: { name: 'Sacral', sanskrit: 'Svadhisthana', theme: 'prazer e criatividade', text: 'Associado às emoções, ao prazer de viver e à criatividade.', crystals: ['Cornalina', 'Pedra do sol', 'Calcita laranja'] },
    en: { name: 'Sacral', sanskrit: 'Svadhisthana', theme: 'pleasure and creativity', text: 'Associated with emotions, joy of living and creativity.', crystals: ['Carnelian', 'Sunstone', 'Orange calcite'] },
    es: { name: 'Sacro', sanskrit: 'Svadhisthana', theme: 'placer y creatividad', text: 'Asociado a las emociones, el placer de vivir y la creatividad.', crystals: ['Cornalina', 'Piedra solar', 'Calcita naranja'] },
  },
  {
    pt: { name: 'Plexo Solar', sanskrit: 'Manipura', theme: 'poder pessoal e confiança', text: 'Associado à autoestima, à força de vontade e à capacidade de agir.', crystals: ['Citrino', 'Olho de tigre', 'Pirita'] },
    en: { name: 'Solar Plexus', sanskrit: 'Manipura', theme: 'personal power and confidence', text: 'Associated with self-esteem, willpower and the ability to act.', crystals: ['Citrine', 'Tiger’s eye', 'Pyrite'] },
    es: { name: 'Plexo Solar', sanskrit: 'Manipura', theme: 'poder personal y confianza', text: 'Asociado a la autoestima, la fuerza de voluntad y la capacidad de actuar.', crystals: ['Citrino', 'Ojo de tigre', 'Pirita'] },
  },
  {
    pt: { name: 'Coração', sanskrit: 'Anahata', theme: 'amor e compaixão', text: 'Associado ao afeto, ao perdão e à conexão com os outros.', crystals: ['Quartzo rosa', 'Aventurina verde', 'Rodonita'] },
    en: { name: 'Heart', sanskrit: 'Anahata', theme: 'love and compassion', text: 'Associated with affection, forgiveness and connection with others.', crystals: ['Rose quartz', 'Green aventurine', 'Rhodonite'] },
    es: { name: 'Corazón', sanskrit: 'Anahata', theme: 'amor y compasión', text: 'Asociado al afecto, el perdón y la conexión con otros.', crystals: ['Cuarzo rosa', 'Aventurina verde', 'Rodonita'] },
  },
  {
    pt: { name: 'Garganta', sanskrit: 'Vishuddha', theme: 'expressão e verdade', text: 'Associado à comunicação sincera e à expressão criativa.', crystals: ['Água-marinha', 'Sodalita', 'Turquesa'] },
    en: { name: 'Throat', sanskrit: 'Vishuddha', theme: 'expression and truth', text: 'Associated with honest communication and creative expression.', crystals: ['Aquamarine', 'Sodalite', 'Turquoise'] },
    es: { name: 'Garganta', sanskrit: 'Vishuddha', theme: 'expresión y verdad', text: 'Asociado a la comunicación sincera y la expresión creativa.', crystals: ['Aguamarina', 'Sodalita', 'Turquesa'] },
  },
  {
    pt: { name: 'Terceiro Olho', sanskrit: 'Ajna', theme: 'intuição e visão', text: 'Associado à intuição, à imaginação e à clareza interior.', crystals: ['Ametista', 'Lápis-lazúli', 'Fluorita'] },
    en: { name: 'Third Eye', sanskrit: 'Ajna', theme: 'intuition and vision', text: 'Associated with intuition, imagination and inner clarity.', crystals: ['Amethyst', 'Lapis lazuli', 'Fluorite'] },
    es: { name: 'Tercer Ojo', sanskrit: 'Ajna', theme: 'intuición y visión', text: 'Asociado a la intuición, la imaginación y la claridad interior.', crystals: ['Amatista', 'Lapislázuli', 'Fluorita'] },
  },
  {
    pt: { name: 'Coroa', sanskrit: 'Sahasrara', theme: 'propósito e espiritualidade', text: 'Associado ao senso de propósito e à conexão com algo maior.', crystals: ['Quartzo transparente', 'Selenita', 'Howlita'] },
    en: { name: 'Crown', sanskrit: 'Sahasrara', theme: 'purpose and spirituality', text: 'Associated with a sense of purpose and connection to something greater.', crystals: ['Clear quartz', 'Selenite', 'Howlite'] },
    es: { name: 'Corona', sanskrit: 'Sahasrara', theme: 'propósito y espiritualidad', text: 'Asociado al sentido de propósito y la conexión con algo mayor.', crystals: ['Cuarzo transparente', 'Selenita', 'Howlita'] },
  },
];

export const TRAITS_TEXT: Record<Trait, L<{ label: string; gift: string; shadow: string }>> = {
  leadership: { pt: { label: 'liderança', gift: 'Você tende a assumir a frente e inspirar movimento.', shadow: 'Cuidado com a impaciência e com querer controlar tudo.' }, en: { label: 'leadership', gift: 'You tend to take the lead and inspire movement.', shadow: 'Watch out for impatience and wanting to control everything.' }, es: { label: 'liderazgo', gift: 'Tiendes a tomar la delantera e inspirar movimiento.', shadow: 'Cuidado con la impaciencia y con querer controlarlo todo.' } },
  sensitivity: { pt: { label: 'sensibilidade', gift: 'Você percebe nuances e sente o que os outros sentem.', shadow: 'Proteja sua energia: nem tudo que você sente é seu.' }, en: { label: 'sensitivity', gift: 'You notice nuances and feel what others feel.', shadow: 'Protect your energy: not everything you feel is yours.' }, es: { label: 'sensibilidad', gift: 'Percibes matices y sientes lo que otros sienten.', shadow: 'Protege tu energía: no todo lo que sientes es tuyo.' } },
  communication: { pt: { label: 'comunicação', gift: 'Palavras e ideias são suas grandes ferramentas.', shadow: 'Foco: escolha poucas ideias e leve-as até o fim.' }, en: { label: 'communication', gift: 'Words and ideas are your great tools.', shadow: 'Focus: choose a few ideas and see them through.' }, es: { label: 'comunicación', gift: 'Las palabras y las ideas son tus grandes herramientas.', shadow: 'Enfoque: elige pocas ideas y llévalas hasta el final.' } },
  stability: { pt: { label: 'estabilidade', gift: 'Você constrói bases sólidas e transmite confiança.', shadow: 'Flexibilidade também é força; abra espaço para o novo.' }, en: { label: 'stability', gift: 'You build solid foundations and convey trust.', shadow: 'Flexibility is strength too; make room for the new.' }, es: { label: 'estabilidad', gift: 'Construyes bases sólidas y transmites confianza.', shadow: 'La flexibilidad también es fuerza; abre espacio a lo nuevo.' } },
  freedom: { pt: { label: 'liberdade', gift: 'Você precisa de espaço e traz renovação por onde passa.', shadow: 'Liberdade com direção: escolha compromissos que te ampliem.' }, en: { label: 'freedom', gift: 'You need space and bring renewal wherever you go.', shadow: 'Freedom with direction: choose commitments that expand you.' }, es: { label: 'libertad', gift: 'Necesitas espacio y traes renovación por donde pasas.', shadow: 'Libertad con dirección: elige compromisos que te amplíen.' } },
  care: { pt: { label: 'cuidado', gift: 'Você acolhe, protege e faz as pessoas se sentirem em casa.', shadow: 'Inclua você na lista de quem merece cuidado.' }, en: { label: 'care', gift: 'You welcome, protect and make people feel at home.', shadow: 'Put yourself on the list of those who deserve care.' }, es: { label: 'cuidado', gift: 'Acoges, proteges y haces que la gente se sienta en casa.', shadow: 'Inclúyete en la lista de quienes merecen cuidado.' } },
  introspection: { pt: { label: 'introspecção', gift: 'Você enxerga fundo e encontra respostas no silêncio.', shadow: 'Compartilhe o que descobre; não se isole demais.' }, en: { label: 'introspection', gift: 'You see deeply and find answers in silence.', shadow: 'Share what you discover; don’t isolate too much.' }, es: { label: 'introspección', gift: 'Ves a fondo y encuentras respuestas en el silencio.', shadow: 'Comparte lo que descubres; no te aísles demasiado.' } },
  ambition: { pt: { label: 'ambição', gift: 'Você tem visão e força para realizar grandes objetivos.', shadow: 'Sucesso é ferramenta, não medida do seu valor.' }, en: { label: 'ambition', gift: 'You have vision and strength to achieve big goals.', shadow: 'Success is a tool, not the measure of your worth.' }, es: { label: 'ambición', gift: 'Tienes visión y fuerza para lograr grandes objetivos.', shadow: 'El éxito es una herramienta, no la medida de tu valor.' } },
  compassion: { pt: { label: 'compaixão', gift: 'Seu coração é generoso e enxerga o outro com amor.', shadow: 'Doar também inclui receber; respeite seus limites.' }, en: { label: 'compassion', gift: 'Your heart is generous and sees others with love.', shadow: 'Giving also includes receiving; respect your limits.' }, es: { label: 'compasión', gift: 'Tu corazón es generoso y ve al otro con amor.', shadow: 'Dar también incluye recibir; respeta tus límites.' } },
  creativity: { pt: { label: 'criatividade', gift: 'Você cria, inventa e transforma ideias em algo novo.', shadow: 'Termine o que começa para seu talento ganhar corpo.' }, en: { label: 'creativity', gift: 'You create, invent and turn ideas into something new.', shadow: 'Finish what you start so your talent takes shape.' }, es: { label: 'creatividad', gift: 'Creas, inventas y conviertes ideas en algo nuevo.', shadow: 'Termina lo que empiezas para que tu talento tome forma.' } },
  intuition: { pt: { label: 'intuição', gift: 'Você sabe antes de saber: seu faro é afiado.', shadow: 'Confirme com os fatos antes de decidir.' }, en: { label: 'intuition', gift: 'You know before you know: your instincts are sharp.', shadow: 'Check the facts before deciding.' }, es: { label: 'intuición', gift: 'Sabes antes de saber: tu olfato es agudo.', shadow: 'Confirma con los hechos antes de decidir.' } },
  harmony: { pt: { label: 'harmonia', gift: 'Você une pessoas e encontra o ponto de equilíbrio.', shadow: 'Paz verdadeira inclui dizer o que você sente.' }, en: { label: 'harmony', gift: 'You bring people together and find the balance point.', shadow: 'True peace includes saying what you feel.' }, es: { label: 'armonía', gift: 'Unes personas y encuentras el punto de equilibrio.', shadow: 'La paz verdadera incluye decir lo que sientes.' } },
};

export const SEPTENIOS: L<{ title: string; text: string }[]> = {
  pt: [
    { title: 'O corpo', text: 'Formação do corpo e da confiança no mundo.' },
    { title: 'Os sentimentos', text: 'Imaginação, afetos e descoberta do belo.' },
    { title: 'O pensamento', text: 'Adolescência: identidade, ideais e questionamentos.' },
    { title: 'As escolhas', text: 'Experimentar caminhos, amores e profissões.' },
    { title: 'A construção', text: 'Firmar escolhas e assumir responsabilidades.' },
    { title: 'A consciência', text: 'Crise de sentido: rever valores e propósito.' },
    { title: 'A autenticidade', text: 'Viver o que é essencial, com mais verdade.' },
    { title: 'A sabedoria', text: 'Colher, compartilhar e orientar.' },
    { title: 'O legado', text: 'Transmitir experiência e cuidar do que fica.' },
    { title: 'A serenidade', text: 'Contemplação e liberdade interior.' },
    { title: 'A essência', text: 'Gratidão e conexão com o que é eterno.' },
    { title: 'A plenitude', text: 'Integração da vida inteira.' },
    { title: 'A luz', text: 'Presença, memória e bênção.' },
  ],
  en: [
    { title: 'The body', text: 'Shaping the body and trust in the world.' },
    { title: 'The feelings', text: 'Imagination, affection and discovering beauty.' },
    { title: 'The mind', text: 'Adolescence: identity, ideals and questions.' },
    { title: 'The choices', text: 'Trying paths, loves and professions.' },
    { title: 'The building', text: 'Committing to choices and taking responsibility.' },
    { title: 'The awareness', text: 'A crisis of meaning: reviewing values and purpose.' },
    { title: 'The authenticity', text: 'Living what is essential, more truthfully.' },
    { title: 'The wisdom', text: 'Harvesting, sharing and guiding.' },
    { title: 'The legacy', text: 'Passing on experience and tending what remains.' },
    { title: 'The serenity', text: 'Contemplation and inner freedom.' },
    { title: 'The essence', text: 'Gratitude and connection with the eternal.' },
    { title: 'The fullness', text: 'Integrating a whole life.' },
    { title: 'The light', text: 'Presence, memory and blessing.' },
  ],
  es: [
    { title: 'El cuerpo', text: 'Formación del cuerpo y de la confianza en el mundo.' },
    { title: 'Los sentimientos', text: 'Imaginación, afectos y descubrimiento de lo bello.' },
    { title: 'El pensamiento', text: 'Adolescencia: identidad, ideales y preguntas.' },
    { title: 'Las elecciones', text: 'Probar caminos, amores y profesiones.' },
    { title: 'La construcción', text: 'Afirmar elecciones y asumir responsabilidades.' },
    { title: 'La conciencia', text: 'Crisis de sentido: revisar valores y propósito.' },
    { title: 'La autenticidad', text: 'Vivir lo esencial, con más verdad.' },
    { title: 'La sabiduría', text: 'Cosechar, compartir y orientar.' },
    { title: 'El legado', text: 'Transmitir experiencia y cuidar lo que queda.' },
    { title: 'La serenidad', text: 'Contemplación y libertad interior.' },
    { title: 'La esencia', text: 'Gratitud y conexión con lo eterno.' },
    { title: 'La plenitud', text: 'Integración de toda la vida.' },
    { title: 'La luz', text: 'Presencia, memoria y bendición.' },
  ],
};

/** Textos dos trânsitos lentos na linha do tempo ({planet} {aspect} {natal}). */
export const TRANSIT_THEMES: L<Record<string, string>> = {
  pt: {
    jupiter: 'expansão, oportunidades e otimismo',
    saturn: 'amadurecimento, responsabilidade e estrutura',
    uranus: 'mudanças inesperadas e libertação',
    neptune: 'inspiração, sensibilidade e sonhos',
    pluto: 'transformação profunda e renascimento',
    saturnReturn: 'Retorno de Saturno: um rito de passagem para a maturidade. Hora de rever escolhas e construir com mais verdade.',
    jupiterSun: 'Júpiter sobre o seu Sol: fase de crescimento, confiança e boas oportunidades.',
    mercuryRetro: 'Mercúrio retrógrado: revise, reveja, reconecte. Evite decisões apressadas e confira contratos e mensagens.',
    venusRetro: 'Vênus retrógrada: reavaliação de afetos e valores. Antigos amores e gostos podem voltar à tona.',
    marsRetro: 'Marte retrógrado: energia voltada para dentro. Bom para rever estratégias antes de agir.',
    solarEclipse: 'Eclipse solar: portal de novos começos.',
    lunarEclipse: 'Eclipse lunar: culminação e revelações emocionais.',
    sensitive: 'Toca um ponto sensível do seu mapa ({point}).',
  },
  en: {
    jupiter: 'expansion, opportunities and optimism',
    saturn: 'maturing, responsibility and structure',
    uranus: 'unexpected change and liberation',
    neptune: 'inspiration, sensitivity and dreams',
    pluto: 'deep transformation and rebirth',
    saturnReturn: 'Saturn Return: a rite of passage into maturity. Time to review choices and build more truthfully.',
    jupiterSun: 'Jupiter on your Sun: a phase of growth, confidence and good opportunities.',
    mercuryRetro: 'Mercury retrograde: review, revisit, reconnect. Avoid hasty decisions and double-check contracts and messages.',
    venusRetro: 'Venus retrograde: reassessing love and values. Old flames and tastes may resurface.',
    marsRetro: 'Mars retrograde: energy turned inward. Good for reviewing strategies before acting.',
    solarEclipse: 'Solar eclipse: a portal of new beginnings.',
    lunarEclipse: 'Lunar eclipse: culmination and emotional revelations.',
    sensitive: 'It touches a sensitive point in your chart ({point}).',
  },
  es: {
    jupiter: 'expansión, oportunidades y optimismo',
    saturn: 'maduración, responsabilidad y estructura',
    uranus: 'cambios inesperados y liberación',
    neptune: 'inspiración, sensibilidad y sueños',
    pluto: 'transformación profunda y renacimiento',
    saturnReturn: 'Retorno de Saturno: un rito de paso hacia la madurez. Hora de revisar elecciones y construir con más verdad.',
    jupiterSun: 'Júpiter sobre tu Sol: fase de crecimiento, confianza y buenas oportunidades.',
    mercuryRetro: 'Mercurio retrógrado: revisa, repasa, reconecta. Evita decisiones apresuradas y comprueba contratos y mensajes.',
    venusRetro: 'Venus retrógrada: reevaluación de afectos y valores. Antiguos amores y gustos pueden volver.',
    marsRetro: 'Marte retrógrado: energía hacia dentro. Bueno para revisar estrategias antes de actuar.',
    solarEclipse: 'Eclipse solar: portal de nuevos comienzos.',
    lunarEclipse: 'Eclipse lunar: culminación y revelaciones emocionales.',
    sensitive: 'Toca un punto sensible de tu carta ({point}).',
  },
};

/** Frases sobre pares de planetas na sinastria. */
export const SYNASTRY_PAIRS: L<Record<string, string>> = {
  pt: {
    'sun-moon': 'Sol e Lua se encontram: um entende naturalmente as necessidades do outro.',
    'venus-mars': 'Vênus e Marte: atração, química e desejo mútuo.',
    'moon-moon': 'Luas em sintonia: conforto emocional e sensação de lar.',
    'mercury-mercury': 'Mentes em sintonia: conversa fácil e boas ideias juntos.',
    'venus-venus': 'Gostos e valores parecidos tornam a convivência agradável.',
    'sun-sun': 'Essências que se reconhecem e se fortalecem.',
    'saturn': 'Saturno traz compromisso e seriedade — e às vezes cobrança.',
    'jupiter': 'Júpiter traz generosidade, crescimento e otimismo à relação.',
    'mars-mars': 'Energias que se ativam: parceria dinâmica, às vezes competitiva.',
    'node': 'Um laço que parece ter propósito e destino.',
    default: 'Uma conexão que ativa a área de {a} e {b}.',
  },
  en: {
    'sun-moon': 'Sun and Moon meet: one naturally understands the other’s needs.',
    'venus-mars': 'Venus and Mars: attraction, chemistry and mutual desire.',
    'moon-moon': 'Moons in tune: emotional comfort and a sense of home.',
    'mercury-mercury': 'Minds in tune: easy conversation and good ideas together.',
    'venus-venus': 'Similar tastes and values make life together pleasant.',
    'sun-sun': 'Essences that recognize and strengthen each other.',
    'saturn': 'Saturn brings commitment and seriousness — and sometimes pressure.',
    'jupiter': 'Jupiter brings generosity, growth and optimism to the relationship.',
    'mars-mars': 'Energies that activate each other: dynamic, sometimes competitive.',
    'node': 'A bond that feels purposeful and fated.',
    default: 'A connection that activates {a} and {b}.',
  },
  es: {
    'sun-moon': 'Sol y Luna se encuentran: uno entiende naturalmente las necesidades del otro.',
    'venus-mars': 'Venus y Marte: atracción, química y deseo mutuo.',
    'moon-moon': 'Lunas en sintonía: comodidad emocional y sensación de hogar.',
    'mercury-mercury': 'Mentes en sintonía: conversación fácil y buenas ideas juntos.',
    'venus-venus': 'Gustos y valores parecidos hacen agradable la convivencia.',
    'sun-sun': 'Esencias que se reconocen y se fortalecen.',
    'saturn': 'Saturno trae compromiso y seriedad, y a veces exigencia.',
    'jupiter': 'Júpiter trae generosidad, crecimiento y optimismo a la relación.',
    'mars-mars': 'Energías que se activan: pareja dinámica, a veces competitiva.',
    'node': 'Un lazo que parece tener propósito y destino.',
    default: 'Una conexión que activa {a} y {b}.',
  },
};

export const COMPAT_ADVICE: L<{ high: string; mid: string; low: string }> = {
  pt: {
    high: 'Vocês têm afinidade natural. O convite é não deixar a facilidade virar acomodação: cultivem novidades juntos.',
    mid: 'Há pontos fortes e pontos de atrito. Conversas honestas sobre expectativas fazem toda a diferença.',
    low: 'Vocês são bem diferentes — e isso pode ser uma riqueza. Paciência e curiosidade pelo jeito do outro transformam choque em aprendizado.',
  },
  en: {
    high: 'You have a natural affinity. The invitation is not to let ease become complacency: keep exploring new things together.',
    mid: 'There are strengths and friction points. Honest talks about expectations make all the difference.',
    low: 'You are quite different — and that can be a gift. Patience and curiosity about each other’s ways turn clashes into learning.',
  },
  es: {
    high: 'Tienen afinidad natural. La invitación es no dejar que la facilidad se vuelva comodidad: cultiven novedades juntos.',
    mid: 'Hay puntos fuertes y puntos de fricción. Las conversaciones honestas sobre expectativas marcan la diferencia.',
    low: 'Son bastante diferentes, y eso puede ser una riqueza. Paciencia y curiosidad por la forma del otro convierten el choque en aprendizaje.',
  },
};
