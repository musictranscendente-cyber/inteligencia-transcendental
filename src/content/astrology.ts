import type { AspectKey, ElementKey, ModalityKey, PointKey, SignKey } from '@/engines/astro/chart';
import type { L } from './types';

export const SIGN_GLYPHS: Record<SignKey, string> = {
  aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋', leo: '♌', virgo: '♍',
  libra: '♎', scorpio: '♏', sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓',
};

export const PLANET_GLYPHS: Record<PointKey, string> = {
  sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂', jupiter: '♃', saturn: '♄',
  uranus: '♅', neptune: '♆', pluto: '♇', node: '☊', asc: 'AC', mc: 'MC',
};

type SignText = { name: string; summary: string; text: string; keywords: string[]; sun: string; moon: string; asc: string };

export const SIGNS_TEXT: Record<SignKey, L<SignText>> = {
  aries: {
    pt: { name: 'Áries', keywords: ['coragem', 'iniciativa', 'impulso'], summary: 'O fogo que começa: direto, corajoso e pioneiro.', text: 'Áries abre o zodíaco com energia de largada. É o signo da ação, da coragem e da autenticidade sem rodeios.', sun: 'Sua essência é de pioneiro: você brilha quando toma a frente, decide rápido e enfrenta desafios de peito aberto.', moon: 'Suas emoções são rápidas e intensas. Você se sente bem quando pode agir, e precisa de espaço para desabafar sem filtros.', asc: 'Você chega chegando: as pessoas percebem você como alguém direto, enérgico e cheio de iniciativa.' },
    en: { name: 'Aries', keywords: ['courage', 'initiative', 'drive'], summary: 'The fire that starts: direct, brave and pioneering.', text: 'Aries opens the zodiac with starting-line energy. It is the sign of action, courage and straightforward authenticity.', sun: 'Your essence is that of a pioneer: you shine when you lead, decide quickly and face challenges head-on.', moon: 'Your emotions are fast and intense. You feel good when you can act, and you need room to vent without filters.', asc: 'You make an entrance: people see you as direct, energetic and full of initiative.' },
    es: { name: 'Aries', keywords: ['coraje', 'iniciativa', 'impulso'], summary: 'El fuego que comienza: directo, valiente y pionero.', text: 'Aries abre el zodíaco con energía de largada. Es el signo de la acción, el coraje y la autenticidad sin rodeos.', sun: 'Tu esencia es de pionero: brillas cuando tomas la delantera, decides rápido y enfrentas los desafíos de frente.', moon: 'Tus emociones son rápidas e intensas. Te sientes bien cuando puedes actuar y necesitas espacio para desahogarte sin filtros.', asc: 'Llegas pisando fuerte: la gente te percibe como alguien directo, enérgico y con iniciativa.' },
  },
  taurus: {
    pt: { name: 'Touro', keywords: ['estabilidade', 'prazer', 'constância'], summary: 'A terra fértil: calmo, sensorial e persistente.', text: 'Touro é o signo da segurança e dos prazeres simples. Valoriza o que é sólido, bonito e duradouro.', sun: 'Sua essência busca estabilidade e beleza. Você constrói devagar, mas o que constrói dura.', moon: 'Você se acalma com conforto, rotina, boa comida e afeto físico. Precisa de segurança para se abrir.', asc: 'Você transmite calma e confiança. As pessoas te veem como alguém estável, elegante e de presença tranquila.' },
    en: { name: 'Taurus', keywords: ['stability', 'pleasure', 'steadiness'], summary: 'The fertile earth: calm, sensual and persistent.', text: 'Taurus is the sign of security and simple pleasures. It values what is solid, beautiful and lasting.', sun: 'Your essence seeks stability and beauty. You build slowly, but what you build lasts.', moon: 'You calm down with comfort, routine, good food and physical affection. You need security to open up.', asc: 'You convey calm and trust. People see you as steady, elegant and quietly present.' },
    es: { name: 'Tauro', keywords: ['estabilidad', 'placer', 'constancia'], summary: 'La tierra fértil: tranquilo, sensorial y persistente.', text: 'Tauro es el signo de la seguridad y los placeres simples. Valora lo sólido, lo bello y lo duradero.', sun: 'Tu esencia busca estabilidad y belleza. Construyes despacio, pero lo que construyes perdura.', moon: 'Te calmas con comodidad, rutina, buena comida y afecto físico. Necesitas seguridad para abrirte.', asc: 'Transmites calma y confianza. La gente te ve como alguien estable, elegante y de presencia tranquila.' },
  },
  gemini: {
    pt: { name: 'Gêmeos', keywords: ['curiosidade', 'comunicação', 'versatilidade'], summary: 'O ar em movimento: curioso, falante e adaptável.', text: 'Gêmeos é o signo das ideias, das conversas e das conexões. Aprende rápido e vive cercado de estímulos.', sun: 'Sua essência é curiosa e comunicativa. Você brilha trocando ideias, aprendendo e conectando pessoas.', moon: 'Você processa emoções falando e pensando. Precisa de conversa, novidade e leveza para se sentir bem.', asc: 'Você parece jovem, esperto e simpático. As pessoas te percebem como alguém ágil e fácil de conversar.' },
    en: { name: 'Gemini', keywords: ['curiosity', 'communication', 'versatility'], summary: 'Air in motion: curious, talkative and adaptable.', text: 'Gemini is the sign of ideas, conversations and connections. It learns fast and lives surrounded by stimuli.', sun: 'Your essence is curious and communicative. You shine exchanging ideas, learning and connecting people.', moon: 'You process emotions by talking and thinking. You need conversation, novelty and lightness to feel good.', asc: 'You come across as youthful, bright and friendly. People see you as quick and easy to talk to.' },
    es: { name: 'Géminis', keywords: ['curiosidad', 'comunicación', 'versatilidad'], summary: 'El aire en movimiento: curioso, conversador y adaptable.', text: 'Géminis es el signo de las ideas, las conversaciones y las conexiones. Aprende rápido y vive rodeado de estímulos.', sun: 'Tu esencia es curiosa y comunicativa. Brillas intercambiando ideas, aprendiendo y conectando personas.', moon: 'Procesas las emociones hablando y pensando. Necesitas conversación, novedad y ligereza para sentirte bien.', asc: 'Pareces joven, despierto y simpático. La gente te percibe como alguien ágil y fácil de hablar.' },
  },
  cancer: {
    pt: { name: 'Câncer', keywords: ['cuidado', 'memória', 'sensibilidade'], summary: 'A água que acolhe: sensível, protetor e afetivo.', text: 'Câncer é o signo do lar, da família e das raízes emocionais. Sente fundo e cuida com dedicação.', sun: 'Sua essência é acolhedora. Você brilha quando cria vínculos seguros e cuida de quem ama.', moon: 'A Lua está em casa aqui: emoções profundas, memória afetiva forte e grande necessidade de pertencimento.', asc: 'Você transmite gentileza e cuidado. As pessoas se sentem à vontade perto de você, embora você se proteja no início.' },
    en: { name: 'Cancer', keywords: ['care', 'memory', 'sensitivity'], summary: 'The water that embraces: sensitive, protective and loving.', text: 'Cancer is the sign of home, family and emotional roots. It feels deeply and cares with devotion.', sun: 'Your essence is nurturing. You shine when you create safe bonds and care for those you love.', moon: 'The Moon is at home here: deep emotions, strong emotional memory and a great need to belong.', asc: 'You convey kindness and care. People feel at ease around you, though you protect yourself at first.' },
    es: { name: 'Cáncer', keywords: ['cuidado', 'memoria', 'sensibilidad'], summary: 'El agua que acoge: sensible, protector y afectivo.', text: 'Cáncer es el signo del hogar, la familia y las raíces emocionales. Siente a fondo y cuida con dedicación.', sun: 'Tu esencia es acogedora. Brillas cuando creas vínculos seguros y cuidas a quienes amas.', moon: 'La Luna está en casa aquí: emociones profundas, fuerte memoria afectiva y gran necesidad de pertenencia.', asc: 'Transmites amabilidad y cuidado. La gente se siente cómoda contigo, aunque al principio te proteges.' },
  },
  leo: {
    pt: { name: 'Leão', keywords: ['brilho', 'generosidade', 'criatividade'], summary: 'O fogo que brilha: caloroso, criativo e generoso.', text: 'Leão é o signo da expressão do coração. Gosta de criar, liderar e espalhar calor humano.', sun: 'O Sol está em casa aqui: sua essência é radiante, criativa e generosa. Você nasceu para se expressar.', moon: 'Você se sente bem quando é reconhecido e amado. Precisa de afeto caloroso e espaço para brincar.', asc: 'Você tem presença marcante. As pessoas te percebem como confiante, carismático e caloroso.' },
    en: { name: 'Leo', keywords: ['radiance', 'generosity', 'creativity'], summary: 'The fire that shines: warm, creative and generous.', text: 'Leo is the sign of heartfelt expression. It loves to create, lead and spread warmth.', sun: 'The Sun is at home here: your essence is radiant, creative and generous. You were born to express yourself.', moon: 'You feel good when recognized and loved. You need warm affection and room to play.', asc: 'You have a striking presence. People see you as confident, charismatic and warm.' },
    es: { name: 'Leo', keywords: ['brillo', 'generosidad', 'creatividad'], summary: 'El fuego que brilla: cálido, creativo y generoso.', text: 'Leo es el signo de la expresión del corazón. Le gusta crear, liderar y contagiar calidez.', sun: 'El Sol está en casa aquí: tu esencia es radiante, creativa y generosa. Naciste para expresarte.', moon: 'Te sientes bien cuando te reconocen y te aman. Necesitas afecto cálido y espacio para jugar.', asc: 'Tienes una presencia marcada. La gente te percibe como seguro, carismático y cálido.' },
  },
  virgo: {
    pt: { name: 'Virgem', keywords: ['análise', 'serviço', 'aperfeiçoamento'], summary: 'A terra que refina: atento, útil e prático.', text: 'Virgem é o signo do detalhe, do cuidado prático e do aperfeiçoamento. Gosta de ser útil e de fazer bem feito.', sun: 'Sua essência busca aprimorar. Você brilha resolvendo problemas, organizando e ajudando de forma concreta.', moon: 'Você se acalma com ordem e rotina. Demonstra amor cuidando dos detalhes da vida de quem ama.', asc: 'Você transmite discrição e competência. As pessoas te veem como alguém atento, educado e confiável.' },
    en: { name: 'Virgo', keywords: ['analysis', 'service', 'refinement'], summary: 'The earth that refines: attentive, useful and practical.', text: 'Virgo is the sign of detail, practical care and improvement. It likes to be useful and to do things well.', sun: 'Your essence seeks to improve. You shine solving problems, organizing and helping in concrete ways.', moon: 'You calm down with order and routine. You show love by caring for the details of loved ones’ lives.', asc: 'You convey discretion and competence. People see you as attentive, polite and reliable.' },
    es: { name: 'Virgo', keywords: ['análisis', 'servicio', 'perfeccionamiento'], summary: 'La tierra que refina: atento, útil y práctico.', text: 'Virgo es el signo del detalle, el cuidado práctico y el perfeccionamiento. Le gusta ser útil y hacer las cosas bien.', sun: 'Tu esencia busca mejorar. Brillas resolviendo problemas, organizando y ayudando de forma concreta.', moon: 'Te calmas con orden y rutina. Demuestras amor cuidando los detalles de la vida de quienes amas.', asc: 'Transmites discreción y competencia. La gente te ve como alguien atento, educado y confiable.' },
  },
  libra: {
    pt: { name: 'Libra', keywords: ['harmonia', 'beleza', 'relações'], summary: 'O ar que equilibra: diplomático, elegante e justo.', text: 'Libra é o signo das relações, da estética e da justiça. Busca equilíbrio e parcerias harmoniosas.', sun: 'Sua essência é relacional. Você brilha criando pontes, harmonizando ambientes e buscando o que é justo.', moon: 'Você se sente bem em harmonia e em boa companhia. Conflitos te desgastam; beleza te restaura.', asc: 'Você transmite charme e gentileza. As pessoas te percebem como agradável, sociável e de bom gosto.' },
    en: { name: 'Libra', keywords: ['harmony', 'beauty', 'relationships'], summary: 'The air that balances: diplomatic, elegant and fair.', text: 'Libra is the sign of relationships, aesthetics and justice. It seeks balance and harmonious partnerships.', sun: 'Your essence is relational. You shine building bridges, harmonizing spaces and seeking fairness.', moon: 'You feel good in harmony and good company. Conflict wears you down; beauty restores you.', asc: 'You convey charm and kindness. People see you as pleasant, sociable and tasteful.' },
    es: { name: 'Libra', keywords: ['armonía', 'belleza', 'relaciones'], summary: 'El aire que equilibra: diplomático, elegante y justo.', text: 'Libra es el signo de las relaciones, la estética y la justicia. Busca equilibrio y asociaciones armoniosas.', sun: 'Tu esencia es relacional. Brillas tendiendo puentes, armonizando ambientes y buscando lo justo.', moon: 'Te sientes bien en armonía y en buena compañía. Los conflictos te desgastan; la belleza te restaura.', asc: 'Transmites encanto y amabilidad. La gente te percibe como agradable, sociable y de buen gusto.' },
  },
  scorpio: {
    pt: { name: 'Escorpião', keywords: ['intensidade', 'transformação', 'profundidade'], summary: 'A água profunda: intenso, magnético e transformador.', text: 'Escorpião é o signo da intensidade e da transformação. Não aceita superficialidade e vai fundo em tudo.', sun: 'Sua essência é intensa e investigativa. Você brilha quando mergulha fundo e transforma situações difíceis.', moon: 'Suas emoções são profundas e leais. Você precisa de confiança total para se entregar.', asc: 'Você tem um magnetismo misterioso. As pessoas te percebem como reservado, intenso e observador.' },
    en: { name: 'Scorpio', keywords: ['intensity', 'transformation', 'depth'], summary: 'The deep water: intense, magnetic and transformative.', text: 'Scorpio is the sign of intensity and transformation. It rejects superficiality and goes deep into everything.', sun: 'Your essence is intense and investigative. You shine when you dive deep and transform difficult situations.', moon: 'Your emotions are deep and loyal. You need complete trust to surrender.', asc: 'You have a mysterious magnetism. People see you as reserved, intense and observant.' },
    es: { name: 'Escorpio', keywords: ['intensidad', 'transformación', 'profundidad'], summary: 'El agua profunda: intenso, magnético y transformador.', text: 'Escorpio es el signo de la intensidad y la transformación. No acepta la superficialidad y va a fondo en todo.', sun: 'Tu esencia es intensa e investigadora. Brillas cuando te sumerges a fondo y transformas situaciones difíciles.', moon: 'Tus emociones son profundas y leales. Necesitas confianza total para entregarte.', asc: 'Tienes un magnetismo misterioso. La gente te percibe como reservado, intenso y observador.' },
  },
  sagittarius: {
    pt: { name: 'Sagitário', keywords: ['liberdade', 'sentido', 'otimismo'], summary: 'O fogo que explora: otimista, livre e filosófico.', text: 'Sagitário é o signo da busca por sentido, das viagens e da expansão. Tem fé no futuro e sede de horizontes.', sun: 'Sua essência é exploradora. Você brilha quando aprende, viaja, ensina e compartilha sua visão de mundo.', moon: 'Você se sente bem com liberdade e aventura. Rotinas pesadas sufocam; novos horizontes animam.', asc: 'Você transmite entusiasmo e franqueza. As pessoas te percebem como alegre, aberto e espirituoso.' },
    en: { name: 'Sagittarius', keywords: ['freedom', 'meaning', 'optimism'], summary: 'The fire that explores: optimistic, free and philosophical.', text: 'Sagittarius is the sign of the search for meaning, travel and expansion. It has faith in the future and a thirst for horizons.', sun: 'Your essence is that of an explorer. You shine when you learn, travel, teach and share your worldview.', moon: 'You feel good with freedom and adventure. Heavy routines suffocate you; new horizons lift you.', asc: 'You convey enthusiasm and frankness. People see you as cheerful, open and witty.' },
    es: { name: 'Sagitario', keywords: ['libertad', 'sentido', 'optimismo'], summary: 'El fuego que explora: optimista, libre y filosófico.', text: 'Sagitario es el signo de la búsqueda de sentido, los viajes y la expansión. Tiene fe en el futuro y sed de horizontes.', sun: 'Tu esencia es exploradora. Brillas cuando aprendes, viajas, enseñas y compartes tu visión del mundo.', moon: 'Te sientes bien con libertad y aventura. Las rutinas pesadas te asfixian; los nuevos horizontes te animan.', asc: 'Transmites entusiasmo y franqueza. La gente te percibe como alegre, abierto e ingenioso.' },
  },
  capricorn: {
    pt: { name: 'Capricórnio', keywords: ['ambição', 'responsabilidade', 'maturidade'], summary: 'A terra que escala: disciplinado, ambicioso e sério.', text: 'Capricórnio é o signo das metas de longo prazo e da maturidade. Sobe a montanha passo a passo.', sun: 'Sua essência é realizadora. Você brilha assumindo responsabilidades e construindo algo sólido ao longo do tempo.', moon: 'Você se protege com autocontrole. Sente-se seguro quando tem estrutura e demonstra amor sendo confiável.', asc: 'Você transmite seriedade e competência. As pessoas te percebem como maduro, discreto e determinado.' },
    en: { name: 'Capricorn', keywords: ['ambition', 'responsibility', 'maturity'], summary: 'The earth that climbs: disciplined, ambitious and serious.', text: 'Capricorn is the sign of long-term goals and maturity. It climbs the mountain step by step.', sun: 'Your essence is that of an achiever. You shine taking on responsibility and building something solid over time.', moon: 'You protect yourself with self-control. You feel safe with structure and show love by being reliable.', asc: 'You convey seriousness and competence. People see you as mature, discreet and determined.' },
    es: { name: 'Capricornio', keywords: ['ambición', 'responsabilidad', 'madurez'], summary: 'La tierra que escala: disciplinado, ambicioso y serio.', text: 'Capricornio es el signo de las metas a largo plazo y la madurez. Sube la montaña paso a paso.', sun: 'Tu esencia es realizadora. Brillas asumiendo responsabilidades y construyendo algo sólido con el tiempo.', moon: 'Te proteges con autocontrol. Te sientes seguro con estructura y demuestras amor siendo confiable.', asc: 'Transmites seriedad y competencia. La gente te percibe como maduro, discreto y determinado.' },
  },
  aquarius: {
    pt: { name: 'Aquário', keywords: ['originalidade', 'liberdade', 'coletivo'], summary: 'O ar que inova: original, livre e humanitário.', text: 'Aquário é o signo do futuro, da amizade e das ideias que mudam o coletivo. Valoriza a autenticidade.', sun: 'Sua essência é original. Você brilha quando pensa diferente, defende causas e conecta pessoas por ideais.', moon: 'Você processa emoções com certa distância e precisa de liberdade. Amizade é sua forma de intimidade.', asc: 'Você transmite autenticidade. As pessoas te percebem como diferente, amigável e um pouco imprevisível.' },
    en: { name: 'Aquarius', keywords: ['originality', 'freedom', 'community'], summary: 'The air that innovates: original, free and humanitarian.', text: 'Aquarius is the sign of the future, friendship and ideas that change the collective. It values authenticity.', sun: 'Your essence is original. You shine when you think differently, champion causes and connect people through ideals.', moon: 'You process emotions with some distance and need freedom. Friendship is your form of intimacy.', asc: 'You convey authenticity. People see you as different, friendly and a bit unpredictable.' },
    es: { name: 'Acuario', keywords: ['originalidad', 'libertad', 'colectivo'], summary: 'El aire que innova: original, libre y humanitario.', text: 'Acuario es el signo del futuro, la amistad y las ideas que cambian lo colectivo. Valora la autenticidad.', sun: 'Tu esencia es original. Brillas cuando piensas distinto, defiendes causas y conectas personas por ideales.', moon: 'Procesas las emociones con cierta distancia y necesitas libertad. La amistad es tu forma de intimidad.', asc: 'Transmites autenticidad. La gente te percibe como diferente, amigable y algo impredecible.' },
  },
  pisces: {
    pt: { name: 'Peixes', keywords: ['compaixão', 'imaginação', 'espiritualidade'], summary: 'A água sem margens: sensível, intuitivo e sonhador.', text: 'Peixes fecha o zodíaco com empatia e imaginação. Sente o todo e se conecta ao invisível.', sun: 'Sua essência é compassiva e criativa. Você brilha na arte, no cuidado e em tudo que pede sensibilidade.', moon: 'Você absorve as emoções ao redor. Precisa de momentos de recolhimento e de limites para não se perder.', asc: 'Você transmite doçura e mistério. As pessoas te percebem como gentil, sonhador e acolhedor.' },
    en: { name: 'Pisces', keywords: ['compassion', 'imagination', 'spirituality'], summary: 'Water without shores: sensitive, intuitive and dreamy.', text: 'Pisces closes the zodiac with empathy and imagination. It feels the whole and connects with the unseen.', sun: 'Your essence is compassionate and creative. You shine in art, care and anything that calls for sensitivity.', moon: 'You absorb the emotions around you. You need moments of retreat and boundaries so you don’t get lost.', asc: 'You convey sweetness and mystery. People see you as gentle, dreamy and welcoming.' },
    es: { name: 'Piscis', keywords: ['compasión', 'imaginación', 'espiritualidad'], summary: 'El agua sin orillas: sensible, intuitivo y soñador.', text: 'Piscis cierra el zodíaco con empatía e imaginación. Siente el todo y se conecta con lo invisible.', sun: 'Tu esencia es compasiva y creativa. Brillas en el arte, el cuidado y todo lo que pide sensibilidad.', moon: 'Absorbes las emociones a tu alrededor. Necesitas momentos de recogimiento y límites para no perderte.', asc: 'Transmites dulzura y misterio. La gente te percibe como amable, soñador y acogedor.' },
  },
};

type PlanetText = { name: string; function: string };

export const PLANETS_TEXT: Record<PointKey, L<PlanetText>> = {
  sun: { pt: { name: 'Sol', function: 'sua essência, vitalidade e o que te faz brilhar' }, en: { name: 'Sun', function: 'your essence, vitality and what makes you shine' }, es: { name: 'Sol', function: 'tu esencia, vitalidad y lo que te hace brillar' } },
  moon: { pt: { name: 'Lua', function: 'suas emoções, necessidades e o que te dá segurança' }, en: { name: 'Moon', function: 'your emotions, needs and what makes you feel safe' }, es: { name: 'Luna', function: 'tus emociones, necesidades y lo que te da seguridad' } },
  mercury: { pt: { name: 'Mercúrio', function: 'seu jeito de pensar, aprender e se comunicar' }, en: { name: 'Mercury', function: 'how you think, learn and communicate' }, es: { name: 'Mercurio', function: 'tu forma de pensar, aprender y comunicarte' } },
  venus: { pt: { name: 'Vênus', function: 'como você ama, o que valoriza e o que acha bonito' }, en: { name: 'Venus', function: 'how you love, what you value and what you find beautiful' }, es: { name: 'Venus', function: 'cómo amas, qué valoras y qué te parece bello' } },
  mars: { pt: { name: 'Marte', function: 'sua energia, desejo e forma de agir e conquistar' }, en: { name: 'Mars', function: 'your energy, desire and way of acting and pursuing' }, es: { name: 'Marte', function: 'tu energía, deseo y forma de actuar y conquistar' } },
  jupiter: { pt: { name: 'Júpiter', function: 'onde você cresce, tem sorte e encontra sentido' }, en: { name: 'Jupiter', function: 'where you grow, find luck and meaning' }, es: { name: 'Júpiter', function: 'dónde creces, tienes suerte y encuentras sentido' } },
  saturn: { pt: { name: 'Saturno', function: 'suas lições, responsabilidades e o que amadurece com o tempo' }, en: { name: 'Saturn', function: 'your lessons, responsibilities and what matures with time' }, es: { name: 'Saturno', function: 'tus lecciones, responsabilidades y lo que madura con el tiempo' } },
  uranus: { pt: { name: 'Urano', function: 'onde você inova, se liberta e surpreende' }, en: { name: 'Uranus', function: 'where you innovate, break free and surprise' }, es: { name: 'Urano', function: 'dónde innovas, te liberas y sorprendes' } },
  neptune: { pt: { name: 'Netuno', function: 'seus sonhos, inspiração e sensibilidade espiritual' }, en: { name: 'Neptune', function: 'your dreams, inspiration and spiritual sensitivity' }, es: { name: 'Neptuno', function: 'tus sueños, inspiración y sensibilidad espiritual' } },
  pluto: { pt: { name: 'Plutão', function: 'onde você se transforma profundamente e encontra poder' }, en: { name: 'Pluto', function: 'where you transform deeply and find power' }, es: { name: 'Plutón', function: 'dónde te transformas profundamente y encuentras poder' } },
  node: { pt: { name: 'Nodo Norte', function: 'a direção de crescimento da sua alma nesta vida' }, en: { name: 'North Node', function: 'your soul’s direction of growth in this life' }, es: { name: 'Nodo Norte', function: 'la dirección de crecimiento de tu alma en esta vida' } },
  asc: { pt: { name: 'Ascendente', function: 'como você se apresenta e é visto à primeira vista' }, en: { name: 'Ascendant', function: 'how you present yourself and are first perceived' }, es: { name: 'Ascendente', function: 'cómo te presentas y te ven a primera vista' } },
  mc: { pt: { name: 'Meio do Céu', function: 'sua vocação, carreira e imagem pública' }, en: { name: 'Midheaven', function: 'your calling, career and public image' }, es: { name: 'Medio Cielo', function: 'tu vocación, carrera e imagen pública' } },
};

/** Como cada signo "colore" um planeta: adjetivo/estilo curto. */
export const SIGN_STYLE: Record<SignKey, L<string>> = {
  aries: { pt: 'de forma direta, corajosa e impulsiva', en: 'in a direct, brave and impulsive way', es: 'de forma directa, valiente e impulsiva' },
  taurus: { pt: 'com calma, constância e prazer sensorial', en: 'with calm, steadiness and sensual pleasure', es: 'con calma, constancia y placer sensorial' },
  gemini: { pt: 'com curiosidade, leveza e muitas ideias', en: 'with curiosity, lightness and many ideas', es: 'con curiosidad, ligereza y muchas ideas' },
  cancer: { pt: 'com sensibilidade, cuidado e memória afetiva', en: 'with sensitivity, care and emotional memory', es: 'con sensibilidad, cuidado y memoria afectiva' },
  leo: { pt: 'com brilho, generosidade e dramaticidade', en: 'with radiance, generosity and flair', es: 'con brillo, generosidad y dramatismo' },
  virgo: { pt: 'com atenção aos detalhes, método e senso prático', en: 'with attention to detail, method and practicality', es: 'con atención al detalle, método y sentido práctico' },
  libra: { pt: 'buscando harmonia, beleza e parceria', en: 'seeking harmony, beauty and partnership', es: 'buscando armonía, belleza y pareja' },
  scorpio: { pt: 'com intensidade, profundidade e estratégia', en: 'with intensity, depth and strategy', es: 'con intensidad, profundidad y estrategia' },
  sagittarius: { pt: 'com otimismo, liberdade e busca de sentido', en: 'with optimism, freedom and a search for meaning', es: 'con optimismo, libertad y búsqueda de sentido' },
  capricorn: { pt: 'com seriedade, ambição e responsabilidade', en: 'with seriousness, ambition and responsibility', es: 'con seriedad, ambición y responsabilidad' },
  aquarius: { pt: 'de forma original, independente e inovadora', en: 'in an original, independent and innovative way', es: 'de forma original, independiente e innovadora' },
  pisces: { pt: 'com empatia, imaginação e intuição', en: 'with empathy, imagination and intuition', es: 'con empatía, imaginación e intuición' },
};

export const HOUSES_TEXT: L<{ name: string; theme: string }[]> = {
  pt: [
    { name: 'Casa 1', theme: 'identidade, aparência e início' },
    { name: 'Casa 2', theme: 'dinheiro, valores e recursos' },
    { name: 'Casa 3', theme: 'comunicação, estudos e irmãos' },
    { name: 'Casa 4', theme: 'lar, família e raízes' },
    { name: 'Casa 5', theme: 'criatividade, romance e prazer' },
    { name: 'Casa 6', theme: 'rotina, trabalho diário e bem-estar' },
    { name: 'Casa 7', theme: 'parcerias e relacionamentos' },
    { name: 'Casa 8', theme: 'intimidade, transformação e recursos compartilhados' },
    { name: 'Casa 9', theme: 'viagens, filosofia e estudos superiores' },
    { name: 'Casa 10', theme: 'carreira, reputação e vocação' },
    { name: 'Casa 11', theme: 'amizades, grupos e sonhos' },
    { name: 'Casa 12', theme: 'inconsciente, espiritualidade e recolhimento' },
  ],
  en: [
    { name: '1st House', theme: 'identity, appearance and beginnings' },
    { name: '2nd House', theme: 'money, values and resources' },
    { name: '3rd House', theme: 'communication, learning and siblings' },
    { name: '4th House', theme: 'home, family and roots' },
    { name: '5th House', theme: 'creativity, romance and pleasure' },
    { name: '6th House', theme: 'routine, daily work and wellbeing' },
    { name: '7th House', theme: 'partnerships and relationships' },
    { name: '8th House', theme: 'intimacy, transformation and shared resources' },
    { name: '9th House', theme: 'travel, philosophy and higher learning' },
    { name: '10th House', theme: 'career, reputation and calling' },
    { name: '11th House', theme: 'friends, groups and dreams' },
    { name: '12th House', theme: 'the unconscious, spirituality and retreat' },
  ],
  es: [
    { name: 'Casa 1', theme: 'identidad, apariencia e inicios' },
    { name: 'Casa 2', theme: 'dinero, valores y recursos' },
    { name: 'Casa 3', theme: 'comunicación, estudios y hermanos' },
    { name: 'Casa 4', theme: 'hogar, familia y raíces' },
    { name: 'Casa 5', theme: 'creatividad, romance y placer' },
    { name: 'Casa 6', theme: 'rutina, trabajo diario y bienestar' },
    { name: 'Casa 7', theme: 'asociaciones y relaciones' },
    { name: 'Casa 8', theme: 'intimidad, transformación y recursos compartidos' },
    { name: 'Casa 9', theme: 'viajes, filosofía y estudios superiores' },
    { name: 'Casa 10', theme: 'carrera, reputación y vocación' },
    { name: 'Casa 11', theme: 'amistades, grupos y sueños' },
    { name: 'Casa 12', theme: 'inconsciente, espiritualidad y recogimiento' },
  ],
};

export const ASPECTS_TEXT: Record<AspectKey, L<{ name: string; symbol: string; meaning: string }>> = {
  conjunction: { pt: { name: 'Conjunção', symbol: '☌', meaning: 'fundem suas energias e agem juntos' }, en: { name: 'Conjunction', symbol: '☌', meaning: 'merge their energies and act together' }, es: { name: 'Conjunción', symbol: '☌', meaning: 'funden sus energías y actúan juntos' } },
  opposition: { pt: { name: 'Oposição', symbol: '☍', meaning: 'puxam para lados opostos e pedem equilíbrio' }, en: { name: 'Opposition', symbol: '☍', meaning: 'pull in opposite directions and ask for balance' }, es: { name: 'Oposición', symbol: '☍', meaning: 'tiran hacia lados opuestos y piden equilibrio' } },
  trine: { pt: { name: 'Trígono', symbol: '△', meaning: 'fluem com facilidade e se apoiam' }, en: { name: 'Trine', symbol: '△', meaning: 'flow easily and support each other' }, es: { name: 'Trígono', symbol: '△', meaning: 'fluyen con facilidad y se apoyan' } },
  square: { pt: { name: 'Quadratura', symbol: '□', meaning: 'criam tensão que gera crescimento' }, en: { name: 'Square', symbol: '□', meaning: 'create tension that drives growth' }, es: { name: 'Cuadratura', symbol: '□', meaning: 'crean tensión que impulsa el crecimiento' } },
  sextile: { pt: { name: 'Sextil', symbol: '⚹', meaning: 'abrem oportunidades quando você age' }, en: { name: 'Sextile', symbol: '⚹', meaning: 'open opportunities when you take action' }, es: { name: 'Sextil', symbol: '⚹', meaning: 'abren oportunidades cuando actúas' } },
};

export const ELEMENTS_TEXT: Record<ElementKey, L<{ name: string; text: string }>> = {
  fire: { pt: { name: 'Fogo', text: 'Entusiasmo, coragem e iniciativa. Muito fogo traz paixão; pouco pede mais ousadia.' }, en: { name: 'Fire', text: 'Enthusiasm, courage and initiative. Lots of fire brings passion; little asks for more daring.' }, es: { name: 'Fuego', text: 'Entusiasmo, coraje e iniciativa. Mucho fuego trae pasión; poco pide más audacia.' } },
  earth: { pt: { name: 'Terra', text: 'Praticidade, constância e realização. Muita terra traz estabilidade; pouca pede mais chão.' }, en: { name: 'Earth', text: 'Practicality, steadiness and achievement. Lots of earth brings stability; little asks for more grounding.' }, es: { name: 'Tierra', text: 'Practicidad, constancia y realización. Mucha tierra trae estabilidad; poca pide más suelo.' } },
  air: { pt: { name: 'Ar', text: 'Ideias, comunicação e conexões. Muito ar traz agilidade mental; pouco pede mais diálogo.' }, en: { name: 'Air', text: 'Ideas, communication and connections. Lots of air brings mental agility; little asks for more dialogue.' }, es: { name: 'Aire', text: 'Ideas, comunicación y conexiones. Mucho aire trae agilidad mental; poco pide más diálogo.' } },
  water: { pt: { name: 'Água', text: 'Emoção, intuição e empatia. Muita água traz sensibilidade; pouca pede mais escuta do coração.' }, en: { name: 'Water', text: 'Emotion, intuition and empathy. Lots of water brings sensitivity; little asks to listen more to the heart.' }, es: { name: 'Agua', text: 'Emoción, intuición y empatía. Mucha agua trae sensibilidad; poca pide escuchar más al corazón.' } },
};

export const MODALITIES_TEXT: Record<ModalityKey, L<{ name: string; text: string }>> = {
  cardinal: { pt: { name: 'Cardinal', text: 'Você tende a iniciar, liderar e colocar as coisas em movimento.' }, en: { name: 'Cardinal', text: 'You tend to initiate, lead and set things in motion.' }, es: { name: 'Cardinal', text: 'Tiendes a iniciar, liderar y poner las cosas en movimiento.' } },
  fixed: { pt: { name: 'Fixo', text: 'Você tende a sustentar, aprofundar e levar as coisas até o fim.' }, en: { name: 'Fixed', text: 'You tend to sustain, deepen and see things through.' }, es: { name: 'Fijo', text: 'Tiendes a sostener, profundizar y llevar las cosas hasta el final.' } },
  mutable: { pt: { name: 'Mutável', text: 'Você tende a se adaptar, transitar e conectar diferentes mundos.' }, en: { name: 'Mutable', text: 'You tend to adapt, move between and connect different worlds.' }, es: { name: 'Mutable', text: 'Tiendes a adaptarte, transitar y conectar mundos distintos.' } },
};
