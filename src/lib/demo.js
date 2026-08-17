// ═════════════════════════════════════════════════════════════
//  ONE! Profile — КОНТЕНТ И ДЕМО
//  • Контент (скины, пулы миссий, квесты всех 10 концепций) —
//    служебный конфиг продукта: сидится при первом запуске.
//  • Демо-штат (дети, кланы, смены) — НЕ авто: добавляется только
//    кнопкой «Загрузить демо-данные» в панели вожатого.
// ═════════════════════════════════════════════════════════════
import { CONCEPTS, conceptById, TABLES } from './config.js';

function genMissions(concept) {
  const c = conceptById(concept);
  const pool = [];
  const push = (title, desc, focus, weight = 2) =>
    pool.push({ title, desc, focus, weight });
  push(`Разведка: боевой брифинг на английском`,
    `Получи боевой брифинг «${c.quest}». Держи опорные фразы на английском.`,
    ['edutainment', 'english', 'futureskills']);
  push(`${c.emoji} Сбор легенды смены`,
    `Расскажи своей команде легенду «${c.name}» своими словами — вожатый оценит.`,
    ['edutainment', 'futureskills', 'professions']);
  push(`Зарядка будущего: нейрогимнастика`,
    `Зарядка будущего: нейрогимнастика и координационная лестница.`,
    ['sport', 'phygital', 'edutainment']);
  push(`Интервью с пользователем`,
    `Задай 5 вопросов тому, для кого делаешь продукт. Запиши ответы.`,
    ['incubator', 'futureskills', 'phygital']);
  push(`MVP: первый рабочий прототип`,
    `Собери первую версию продукта. Это твой MVP.`,
    ['incubator', 'edutainment', 'professions']);
  push(`Данные своими руками`,
    `Собери собственные данные и цифры для твоего продукта (физика + цифра).`,
    ['phygital', 'incubator', 'futureskills']);
  push(`Английский: командный челлендж`,
    `Командное задание только на английском: инструкции, шифры, заказ.`,
    ['english', 'futureskills', 'edutainment']);
  push(`Спотлайт-фразы дня`,
    `Выучи и употреби 5 фраз дня.`,
    ['english', 'incubator']);
  push(`Спортивный вызов смены`,
    `Пройди спортивную активность смены: ${c.currency} за движение!`,
    ['sport', 'phygital', 'futureskills']);
  push(`Профессия будущего: знакомство`,
    `Узнай профессию своего направления и расскажи команде.`,
    ['professions', 'futureskills', 'english']);
  push(`Слайд доказательств`,
    `Подготовь слайд с доказательством: что сделал, что мерил, что получилось.`,
    ['incubator', 'edutainment', 'futureskills']);
  push(`Репетиция защиты`,
    `Проговори защиту продукта перед «${c.quest}» на английском.`,
    ['english', 'incubator', 'futureskills']);
  return pool.map((m, i) => ({
    id: `${concept}-m${i + 1}`,
    concept_id: concept,
    ...m,
    coins: 20
  }));
}

function genQuests(concept) {
  const c = conceptById(concept);
  return [{
    id: `${concept}-q1`,
    concept_id: concept,
    title: `Финальный вызов: «${c.quest}»`,
    desc: `Защити продукт команды перед жюри. Оценка 3–5 решает награду.`,
    xp: 200, gems: 10,
    stages: ['Идея', 'Интервью', 'MVP', 'Слайд', 'Защита']
  }];
}

export function makeMissions() { return CONCEPTS.flatMap(c => genMissions(c.id)); }
export function makeQuests()   { return CONCEPTS.flatMap(c => genQuests(c.id)); }
export function makeSkins() {
  return CONCEPTS.map(c => ({
    id: c.id, concept_id: c.id, emoji: c.emoji, color: c.color, skin: c.skin,
    currency: c.currency, quest: c.quest, genre: c.genre
  }));
}

// ── Контент сидится один раз при старте (это конфиг) ──────────
export async function ensureContent(DB) {
  const empty = async t => { try { return (await DB.getAll(t)).length === 0; } catch { return true; } };
  if (await empty(TABLES.CONCEPT_SKINS)) for (const c of makeSkins()) await DB.upsert(TABLES.CONCEPT_SKINS, c);
  if (await empty(TABLES.MISSIONS))       for (const m of makeMissions()) await DB.upsert(TABLES.MISSIONS, m);
  if (await empty(TABLES.QUESTS))         for (const q of makeQuests())   await DB.upsert(TABLES.QUESTS, q);
}

// ── Демо-штат: только по кнопке вожатого ──────────────────────
const CLANS = [
  { id:'clan-01', name:'Котята',       icon:'🐱' },
  { id:'clan-02', name:'Крутяшки',     icon:'🌀' },
  { id:'clan-03', name:'Пельмени',     icon:'🥟' },
  { id:'clan-04', name:'Трансформеры', icon:'🤖' }
];

const DEMO_KIDS = [
  { nickname:'Ниндзя',  emoji:'🦊', name:'Александр Т.', clan:'clan-01', age:10, class:'warrior' },
  { nickname:'Звёздная', emoji:'🦄', name:'София К.',    clan:'clan-02', age:9,  class:'trader' },
  { nickname:'Кибер',   emoji:'🐯', name:'Миша П.',      clan:'clan-01', age:11, class:'warrior' },
  { nickname:'Кекс',    emoji:'🐼', name:'Алиса В.',     clan:'clan-03', age:8,  class:'priest' },
  { nickname:'Феникс',  emoji:'🐺', name:'Егор С.',      clan:'clan-04', age:12, class:'trader' },
  { nickname:'Марс',    emoji:'🦖', name:'Катя Л.',      clan:'clan-02', age:9,  class:'priest' }
];

const DEMO_SHIFT = {
  id: 'shift-demo-01',
  title: 'Кибер-Атлеты: Хроники Будущего',
  concept_id: 'camp-01',
  date_from: '2026-10-04',
  date_to: '2026-10-10',
  status: 'active'
};

const MISSION_DAY = { 'camp-01': ['m1','m2','m3','m4','m5','m6','m7','m8','m9','m10','m11','m12'] };

export async function seedDemo(DB) {
  // кланы
  for (const c of CLANS) await DB.upsert('clans', c);
  // дети
  for (let i = 0; i < DEMO_KIDS.length; i++) {
    await DB.upsert('students', {
      id: `std-${i + 1}`, ...DEMO_KIDS[i],
      coins: (i + 1) * 40, xp: (i + 1) * 130, gems: i * 2
    });
  }
  // смена + привязки детей
  await DB.upsert('shifts', DEMO_SHIFT);
  for (let i = 0; i < DEMO_KIDS.length; i++) {
    await DB.upsert('shift_students', {
      id: `ss-${i + 1}`, shift_id: 'shift-demo-01', student_id: `std-${i + 1}`
    });
  }
  // назначения миссий: каждый ребёнок — по 2 миссии на 7 дней + финальный квест
  const mis = MISSION_DAY['camp-01'];
  const days = ['04','05','06','07','08','09','10'];
  let aid = 0;
  for (let i = 0; i < DEMO_KIDS.length; i++) {
    const sid = `std-${i + 1}`;
    for (let d = 0; d < 7; d++) {
      const a1 = mis[(d * 2) % mis.length];
      const a2 = mis[(d * 2 + 1) % mis.length];
      for (const m of [a1, a2]) {
        await DB.upsert('assignments', {
          id: `asg-${++aid}`,
          shift_id: 'shift-demo-01', student_id: sid,
          item_type: 'mission', item_id: `camp-01-${m}`,
          day_index: d, day_date: `2026-10-${days[d]}`,
          status: d < i % 5 ? 'credited' : 'in_progress',
          grade: d < i % 5 ? (d % 3) + 3 : null
        });
      }
      // финальный квест — последний день
      if (d === 6) {
        await DB.upsert('assignments', {
          id: `asg-${++aid}`,
          shift_id: 'shift-demo-01', student_id: sid,
          item_type: 'quest', item_id: 'camp-01-q1',
          day_index: 6, day_date: '2026-10-10',
          status: 'in_progress', grade: null
        });
      }
    }
  }
  // пара наград и баджей
  await DB.upsert('badges', { id:'b-1', student_id:'std-1', shift_id:'shift-demo-01', badge_id:'streak3', count:1, gems:1 });
  await DB.upsert('badges', { id:'b-2', student_id:'std-1', shift_id:'shift-demo-01', badge_id:'allday', count:2, gems:2 });
}