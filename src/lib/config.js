// ═════════════════════════════════════════════════════════════
//  ONE! Profile — КОНФИГУРАЦИЯ
//  10 концепций каникул (скины), экономика, лиги, ранги, баджи,
//  классы героя, 7 равноправных составных (radar), тренды, спорт
// ═════════════════════════════════════════════════════════════

export const APP_NAME = 'ONE!';

// ── Supabase (создать проект, вставить URL + anon key) ────────
// USE_SUPABASE=false → демо-режим в localStorage (для быстрого демо)
export const USE_SUPABASE = false;
export const SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co';
export const SUPABASE_ANON_KEY = 'YOUR-ANON-KEY';

export const TABLES = {
  STUDENTS: 'students',
  CLANS: 'clans',
  SHIFTS: 'shifts',
  SHIFT_STUDENTS: 'shift_students',
  MISSIONS: 'missions',
  QUESTS: 'quests',
  ASSIGNMENTS: 'assignments',
  BADGES: 'badges',
  CHALLENGES: 'challenges',
  PROJECTS: 'projects',
  SPORT_STATS: 'sport_stats',
  CONCEPT_SKINS: 'concept_skins',
  TEST_RESULTS: 'test_results'
};

// ── 7 равноправных составных продукта (радар) ────────────────
export const SEVEN = [
  { id: 'edutainment', name: 'Edutainment',      icon: '🎮' },
  { id: 'phygital',    name: 'Phygital',         icon: '🌐' },
  { id: 'english',     name: 'Английский',       icon: '🗣️' },
  { id: 'sport',       name: 'Спорт',            icon: '🏃' },
  { id: 'futureskills',name: 'Навыки будущего',  icon: '🧠' },
  { id: 'professions', name: 'Профессии',        icon: '🚀' },
  { id: 'incubator',   name: 'Инкубатор',        icon: '🛠️' }
];

// ── 10 концепций каникул: скины (палитра, валюта, квест) ──────
// skin: приглушённый цвет подложки radar-бейджа и акцентов смены
export const CONCEPTS = [
  { id:'camp-01', num:1,  name:'Кибер-Атлеты',          sub:'Хроники Будущего',
    genre:'Phygital & Sci-Fi', emoji:'⚡', color:'#3D9BE9', skin:'#1f3c63',
    currency:'Нейро-коины', quest:'Битва с Боссом', xpTheme:'нейро-импульс',
    focus:['edutainment','phygital','english','sport','futureskills','professions','incubator'] },
  { id:'camp-02', num:2,  name:'Terraforming',          sub:'Колонизаторы Новых Миров',
    genre:'Adventure & Eco-Tech', emoji:'🌍', color:'#2E9E6B', skin:'#1e4a38',
    currency:'Ресурсы', quest:'Совет директоров Земли', xpTheme:'кислород',
    focus:['edutainment','phygital','english','sport','futureskills','professions','incubator'] },
  { id:'camp-03', num:3,  name:'Meta-Agency',           sub:'Детективы Времени',
    genre:'Media & Soft Skills', emoji:'🕵️', color:'#7B5CD6', skin:'#2f244d',
    currency:'Улики', quest:'Финальный брифинг', xpTheme:'досье',
    focus:['edutainment','phygital','english','sport','futureskills','professions','incubator'] },
  { id:'camp-04', num:4,  name:'Future Makers',         sub:'Академия Прикладного Будущего',
    genre:'STEM & Design Thinking', emoji:'🤖', color:'#E5584D', skin:'#4a2522',
    currency:'Крипто-кредиты', quest:'Demo Day', xpTheme:'патент',
    focus:['edutainment','phygital','english','sport','futureskills','professions','incubator'] },
  { id:'camp-05', num:5,  name:'Active Tech 2077',      sub:'Академия Био-Тех Спорта',
    genre:'Sports Tech & Biohacking', emoji:'⚙️', color:'#12A9A0', skin:'#123c3a',
    currency:'Импланты', quest:'Спортивный саммит', xpTheme:'апгрейд',
    focus:['edutainment','phygital','english','sport','futureskills','professions','incubator'] },
  { id:'camp-06', num:6,  name:'Urban Quest',           sub:'Агенты Городского Разума',
    genre:'City Adventure & AR', emoji:'🏙️', color:'#F0823D', skin:'#46301d',
    currency:'Ключи Городского Разума', quest:'Взлом Центрального Ядра', xpTheme:'сеть',
    focus:['edutainment','phygital','english','sport','futureskills','professions','incubator'] },
  { id:'camp-07', num:7,  name:'FUTURE QUEST',          sub:'Город Профессий',
    genre:'World of Work', emoji:'🏗️', color:'#F5A623', skin:'#44361a',
    currency:'Модули города', quest:'Запуск Города Профессий', xpTheme:'энергия',
    focus:['edutainment','phygital','english','sport','futureskills','professions','incubator'] },
  { id:'camp-08', num:8,  name:'ENGLISH GAME STUDIO',   sub:'ONE Studios',
    genre:'GameDev & Entrepreneurship', emoji:'🎮', color:'#9B3DB0', skin:'#3a1f3e',
    currency:'Studio Coins', quest:'Релиз-вечеринка', xpTheme:'лайки',
    focus:['edutainment','phygital','english','sport','futureskills','professions','incubator'] },
  { id:'camp-09', num:9,  name:'CHAMPIONS ACADEMY',     sub:'Академия Чемпионов',
    genre:'Sports & Future Skills', emoji:'🏆', color:'#E0A102', skin:'#4a3a12',
    currency:'Медали', quest:'Игры Академии', xpTheme:'олимп',
    focus:['edutainment','phygital','english','sport','futureskills','professions','incubator'] },
  { id:'camp-10', num:10, name:'ISLAND SURVIVAL',       sub:'Остров Мистерий',
    genre:'Team Building & Future Skills', emoji:'🏝️', color:'#3BA97A', skin:'#1c3a2b',
    currency:'Ракушки', quest:'Эвакуационный совет', xpTheme:'выживание',
    focus:['edutainment','phygital','english','sport','futureskills','professions','incubator'] }
];

// ── Календарь смен учебного года 2026–2027 (10 точек) ─────────
export const YEAR_SHIFTS = [
  { concept:'camp-01', title:'Смена 1 · Кибер-Атлеты',      season:'Осень', period:'04–10 окт 2026' },
  { concept:'camp-02', title:'Смена 2 · Terraforming',       season:'Осень', period:'15–21 ноя 2026' },
  { concept:'camp-03', title:'Смена 3 · Meta-Agency',        season:'Зима',   period:'04–10 янв 2027' },
  { concept:'camp-04', title:'Смена 4 · Future Makers',      season:'Зима',   period:'22–28 фев 2027' },
  { concept:'camp-05', title:'Смена 5 · Active Tech 2077',   season:'Весна',  period:'29 мар – 04 апр 2027' },
  { concept:'camp-06', title:'Смена 6 · Urban Quest',        season:'Весна',  period:'03–09 мая 2027' },
  { concept:'camp-07', title:'Смена 7 · FUTURE QUEST',       season:'Лето',   period:'30 июн – 08 июл 2027' },
  { concept:'camp-08', title:'Смена 8 · ENGLISH GAME STUDIO',season:'Лето',   period:'09–17 июл 2027' },
  { concept:'camp-09', title:'Смена 9 · CHAMPIONS ACADEMY',  season:'Лето',   period:'18–26 июл 2027' },
  { concept:'camp-10', title:'Смена 10 · ISLAND SURVIVAL',   season:'Лето',   period:'27 июл – 04 авг 2027' }
];

export const conceptById = id => CONCEPTS.find(c => c.id === id) || null;

// ── Экономика: оценка 1–5 → Coins = оценка×5, XP = оценка×10 ──
export const GRADE_REWARD = {
  1: { coins: 5,  xp: 10, credited: false },
  2: { coins: 10, xp: 20, credited: false },
  3: { coins: 15, xp: 30, credited: true  },
  4: { coins: 20, xp: 40, credited: true  },
  5: { coins: 25, xp: 50, credited: true  }
};
// 1 балл = 5 Coins (+ XP отдельно) — формула подтверждена

// Финальный квест: оценка → награда (этап защиты).
export const QUEST_SCALE = {
  3: { xp: 180, gems: 8 },
  4: { xp: 200, gems: 10 },
  5: { xp: 220, gems: 12 }
};

export const LEVEL_XP = 25;
export const MAX_LEVEL = 100;

// Лиги по диапазонам уровня (аккаунт-лига героя).
export const LEAGUES = [
  { min:1,   max:20,  id:'bronze',    name:'Bronze',   color:'#CD7F32' },
  { min:21,  max:40,  id:'silver',    name:'Silver',   color:'#9DA6B5' },
  { min:41,  max:60,  id:'gold',      name:'Gold',     color:'#F5B301' },
  { min:61,  max:80,  id:'platinum',  name:'Platinum', color:'#6FB3E0' },
  { min:81,  max:100, id:'legend',    name:'Legend',   color:'#B026FF' }
];

// Еженедельные лиги внутри смены.
export const WEEK_LEAGUES = [
  { id:'w-bronze',   name:'Бронзовая',  icon:'🥉', color:'#CD7F32' },
  { id:'w-silver',   name:'Серебряная', icon:'🥈', color:'#9DA6B5' },
  { id:'w-gold',     name:'Золотая',    icon:'🥇', color:'#F5B301' },
  { id:'w-sapphire', name:'Сапфировая', icon:'🔷', color:'#2E86DE' },
  { id:'w-ruby',     name:'Рубиновая',  icon:'🔴', color:'#E5484D' },
  { id:'w-amethyst', name:'Аметистовая',icon:'💜', color:'#8B5CF6' },
  { id:'w-diamond',  name:'Алмазная',   icon:'💎', color:'#60C9D8' }
];

// ── Ранги (авто по доминирующей валюте) ──────────────────────
export const RANKS = [
  { id:'bankir', name:'Банкир',  icon:'💰', key:'coins' },
  { id:'boss',   name:'Босс',    icon:'💎', key:'gems'  },
  { id:'leader', name:'Лидер',   icon:'🧩', key:'xp'    },
  { id:'master', name:'Магистр', icon:'📈', key:'gems'  },
  { id:'novice', name:'Новичок', icon:'🌱', key:null    }
];

// ── Классы героя и 5 стадий эволюции ─────────────────────────
export const CLASSES = [
  { id:'warrior', name:'Воин', full:'Воин-Достигатор', icon:'⚔️', color:'#EF4444',
    dirs:['Инженерия','БиоТех','IT'],
    careers:['Инженер / Разработчик','Исследователь','Аналитик данных'],
    desc:'Ставит цели и добивается их. Достижения, рекорды и победы.',
    evolution:[
      { min:1,max:20, icon:'🐣', name:'Новичок-Боец' },
      { min:21,max:40, icon:'⚔️', name:'Боец' },
      { min:41,max:60, icon:'🛡️', name:'Рыцарь' },
      { min:61,max:80, icon:'🐉', name:'Дракон-Воин' },
      { min:81,max:100, icon:'👑', name:'Легенда' }
    ]},
  { id:'trader', name:'Торговец', full:'Торговец-Коммуникатор', icon:'💼', color:'#F59E0B',
    dirs:['Предпринимательство','Дипломатия','Медиа'],
    careers:['Предприниматель','Лидер / Коммуникатор','Специалист по медиа'],
    desc:'Умеет договариваться и убеждать. Общение, продажи и командная работа.',
    evolution:[
      { min:1,max:20, icon:'🐣', name:'Курьер' },
      { min:21,max:40, icon:'💼', name:'Торговец' },
      { min:41,max:60, icon:'💰', name:'Купец' },
      { min:61,max:80, icon:'🏦', name:'Магнат' },
      { min:81,max:100, icon:'👑', name:'Король Рынка' }
    ]},
  { id:'priest', name:'Жрец', full:'Жрец-Вдохновитель', icon:'✨', color:'#8B5CF6',
    dirs:['Медиа','Арт и Дизайн','Дипломатия'],
    careers:['Креативный дизайнер','Педагог / Вдохновитель','Арт-директор'],
    desc:'Вдохновляет и заботится о команде. Творчество, эмпатия и идеи.',
    evolution:[
      { min:1,max:20, icon:'🐣', name:'Ученик' },
      { min:21,max:40, icon:'✨', name:'Жрец' },
      { min:41,max:60, icon:'🔮', name:'Маг' },
      { min:61,max:80, icon:'🌟', name:'Архимаг' },
      { min:81,max:100, icon:'👑', name:'Легенда' }
    ]}
];

export const STAGE_RANGES = [[1,20],[21,40],[41,60],[61,80],[81,100]];

// ── Авто-баджи (в рамках смены, счётчик накапливается) ────────
export const AUTO_BADGES = [
  { id:'streak3', name:'Стрик 3 дня',      icon:'🔥', gems:1,
    desc:'Засчитано 3 дня подряд' },
  { id:'allday',  name:'Все миссии дня',   icon:'✅', gems:2,
    desc:'Засчитаны все миссии за один день' },
  { id:'rich100', name:'100 Coins',        icon:'🤑', gems:3,
    desc:'Накоплено 100 Coins за смену' }
];

// ── Концепт-специфичные баджи (по одной на концепцию) ─────────
export const CONCEPT_BADGES = {
  'camp-01': { id:'cb-kiber',    name:'Хранитель сети',     icon:'💠', desc:'Защитил цифровую вселенную в «Битве с Боссом»' },
  'camp-02': { id:'cb-terra',    name:'Первопроходец',      icon:'🌱', desc:'Построил жизнеспособную колонию на Тере-2' },
  'camp-03': { id:'cb-meta',     name:'Сыск Времени',       icon:'🔍', desc:'Раскрыл главное дело Meta-Agency' },
  'camp-04': { id:'cb-maker',    name:'Инженер будущего',   icon:'🔧', desc:'Довёл прототип до Demo Day' },
  'camp-05': { id:'cb-active',   name:'Био-атлет 2077',     icon:'🫀', desc:'Собрал имплант и аналитику тренировок' },
  'camp-06': { id:'cb-urban',    name:'Агент Разума',       icon:'🗝️', desc:'Взломал Центральное Ядро города' },
  'camp-07': { id:'cb-future',   name:'Главный архитектор', icon:'🌆', desc:'Запустил «Город Профессий»' },
  'camp-08': { id:'cb-studio',   name:'Владелец студии',    icon:'🎬', desc:'Выпустил свой хит в ONE Studios' },
  'camp-09': { id:'cb-champ',    name:'Чемпион Академии',   icon:'🏅', desc:'Прошёл «Игры Академии»' },
  'camp-10': { id:'cb-island',   name:'Хранитель Острова',  icon:'🏕️', desc:'Эвакуировал команду с Острова Мистерий' }
};

// ── Карьерный тест (ответ → класс героя) ─────────────────────
export const CAREER_TEST = {
  title: 'Кто ты в мире ONE!?',
  intro: 'Ответь на 6 вопросов — и узнай свой класс героя.',
  questions: [
    { q:'Задание, которое нравится больше всего:',
      options:[
        { text:'Собрать робота и победить в конкурсе', cls:'warrior' },
        { text:'Представить идею команде и убедить всех', cls:'trader' },
        { text:'Придумать сценарий и вдохновить друзей', cls:'priest' }
      ]},
    { q:'Команда поручила тебе роль:',
      options:[
        { text:'Собрать, починить и довести до финиша', cls:'warrior' },
        { text:'Договориться с другими командами', cls:'trader' },
        { text:'Поддержать каждого и поднять настроение', cls:'priest' }
      ]},
    { q:'Что тебе ближе?',
      options:[
        { text:'Решать сложные задачи и доказывать себя', cls:'warrior' },
        { text:'Вести переговоры и находить выгоду', cls:'trader' },
        { text:'Создавать красивое и помогать людям', cls:'priest' }
      ]},
    { q:'Твой любимый школьный предмет:',
      options:[
        { text:'Технологии и математика', cls:'warrior' },
        { text:'Английский и обществознание', cls:'trader' },
        { text:'Искусство и литература', cls:'priest' }
      ]},
    { q:'Какую награду хочешь получить за смену?',
      options:[
        { text:'Победить в общем рейтинге', cls:'warrior' },
        { text:'Сделать лучшую презентацию', cls:'trader' },
        { text:'Придумать идею, которую примут все', cls:'priest' }
      ]},
    { q:'Твоя суперсила:',
      options:[
        { text:'Сила и упорство', cls:'warrior' },
        { text:'Умение говорить с людьми', cls:'trader' },
        { text:'Воображение и эмпатия', cls:'priest' }
      ]}
  ]
};

// ── Виды спорта / физнаправлений (ввод вожатого) ──────────────
export const SPORT_TYPES = [
  'Нейро-фитнес', 'Баланс-борд', 'Blazepod (реакция)', 'Лазертаг', 'Archery Tag',
  'Мечевой бой', 'Ориентирование', 'Верёвочный курс', 'Скалодром', 'Захват флага',
  'Полоса препятствий', 'Капоэйра', 'Йога / стретчинг', 'Фрисби', 'Доджбол',
  'Футбол', 'Бадминтон', 'Настольный теннис', 'Эстафета', 'Танцевальная разминка'
];

export const SPORT_RESULTS = ['Участие', 'Победа', 'Личный рекорд', 'Честная игра'];

// ── Эмодзи-аватары ребёнка ────────────────────────────────────
export const AVATARS = ['🦊','🐼','🦁','🐸','🦄','🐨','🐯','🐙','🦖','🐳','🦋','🐺','🦉','🐹','🦜','🐢','🐝','🦩'];

// ── 7 составных → профиль: лёгкие веса приоритета по концепции ─
// (используется для «радара»: мощность составной зависит от прохождения
//  миссий, закреплённых за этой составной в пуле концепции)
export const SKILL_ALIASES = {
  edutainment: ['игра','игр','квест','гейм','блюз'],
  phygital: ['phygital','цифр','данные','датчик','gps','ar','qr','трекер','сеть'],
  english: ['англ','english','speak','prep','брифинг','питч','презента'],
  sport: ['спорт','фитнес','эстафет','блаз','лазер','скалодром','ориентир','зарядк'],
  futureskills: ['мышление','команд','критич','креатив','лидер','коммуника','решения'],
  professions: ['проф','инженер','разработ','дизайн','медиа','учён','фермер','архитек'],
  incubator: ['мвп', 'mvp', 'прототип', 'стартап', 'интервью', 'защита', 'питч', 'релиз', 'тест']
};