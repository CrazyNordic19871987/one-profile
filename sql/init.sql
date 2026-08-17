-- ══════════════════════════════════════════════════════
-- ONE! Profile — ИНИЦИАЛИЗАЦИЯ БАЗЫ (схема + контент)
-- Выполнить весь файл ОДНИМ запуском в SQL Editor Supabase.
-- ══════════════════════════════════════════════════════

-- ═════════════════════════════════════════════════════════════
--  ONE! Profile — СХЕМА БАЗЫ (Supabase / PostgreSQL)
--  Выполнить в SQL Editor консоли Supabase.
--  RLS отключён (MVP): данные доступны приложению через anon key.
-- ═════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

-- Идентификаторы текстовые (как в демо): students и формы типа 'std-1',
-- контент — 'camp-01-m1', скины — 'camp-01' и т.д.

-- ── Участники (детский профиль) ─────────────────────────────
create table if not exists students (
  id          text primary key,
  real_name   text not null default '',          -- видит только вожатый
  nickname    text not null,
  emoji       text not null default '🦊',
  age         int,
  class       text not null default 'warrior',   -- класс героя: warrior/trader/priest
  clan_id     text default null,                 -- текущий клан (FK: clans)
  coins       int not null default 0,
  xp          int not null default 0,
  gems        int not null default 0,
  league_key  text default 'bronze',
  created_at  timestamptz not null default now()
);

create table if not exists clans (
  id    text primary key,
  name  text not null,
  icon  text not null default '🐱'
);

-- ── Смены (10 концепций за год) ─────────────────────────────
create table if not exists shifts (
  id          text primary key,
  title       text not null,
  concept_id  text not null,                    -- 'camp-01'…'camp-10'
  date_from   date not null,
  date_to     date not null,
  status      text not null default 'planned',  -- planned/active/closed
  created_at  timestamptz not null default now()
);

create table if not exists shift_students (
  id          text primary key,
  shift_id    text not null references shifts(id) on delete cascade,
  student_id  text not null references students(id) on delete cascade,
  unique (shift_id, student_id)
);

-- ── Контент: пулы миссий и финальные квесты на концепцию ─────
create table if not exists missions (
  id          text primary key,
  concept_id  text not null,
  title       text not null,
  desc        text not null default '',
  focus       text[] not null default '{}',     -- из 7 составных
  weight      int not null default 2,           -- вес в радаре
  coins       int not null default 20
);

create table if not exists quests (
  id          text primary key,
  concept_id  text not null,
  title       text not null,
  desc        text not null default '',
  xp          int not null default 200,
  gems        int not null default 10,
  stages      text[] not null default '{}'      -- Идея→Интервью→MVP→Слайд→Защита
);

-- Скины концепции: палитра, валюта, название квеста
create table if not exists concept_skins (
  id          text primary key,
  concept_id  text not null unique,
  emoji       text not null,
  color       text not null,                    -- акцентный цвет
  skin        text not null,                    -- приглушённый подложка
  currency    text not null,                    -- название валюты
  quest       text not null,
  genre       text not null default ''
);

-- ── Назначения / оценки вожатого ─────────────────────────────
-- item_type: 'mission' | 'quest'
-- status:    'assigned' | 'in_progress' | 'credited' | 'not_credited'
create table if not exists assignments (
  id          text primary key,
  shift_id    text not null references shifts(id) on delete cascade,
  student_id  text not null references students(id) on delete cascade,
  item_type   text not null,
  item_id     text not null,
  day_index   int not null default 0,
  day_date    date,
  grade       int,                              -- 1–5
  status      text not null default 'assigned',
  created_at  timestamptz not null default now()
);

-- ── Баджи (авто + концепт-специфичные) ──────────────────────
create table if not exists badges (
  id          text primary key,
  student_id  text not null references students(id) on delete cascade,
  shift_id    text not null references shifts(id) on delete cascade,
  badge_id    text not null,                    -- ключ AUTO_BADGES / CONCEPT_BADGES
  count       int not null default 1,
  gems        int not null default 0
);

-- ── Клановые челленджи (задел — в MVP не используются) ───────
create table if not exists challenges (
  id          text primary key,
  shift_id    text not null references shifts(id) on delete cascade,
  clan_id     text not null references clans(id) on delete cascade,
  title       text not null,
  target      int not null default 0,
  progress    int not null default 0,
  reward_gems int not null default 0
);

-- ── Портфолио проектов (интервью → MVP → слайд → защита) ─────
create table if not exists projects (
  id          text primary key,
  shift_id    text not null references shifts(id) on delete cascade,
  student_id  text not null references students(id) on delete cascade,
  title       text not null,
  desc        text not null default '',
  stage       int not null default 0,           -- текущая стадия
  stages      text[] not null default '{}',
  grade       int,
  created_at  timestamptz not null default now()
);

-- ── Спорт (ввод вожатого) ────────────────────────────────────
create table if not exists sport_stats (
  id          text primary key,
  shift_id    text not null references shifts(id) on delete cascade,
  student_id  text not null references students(id) on delete cascade,
  sport_type  text not null,
  result      text not null,                    -- SPORT_RESULTS
  points      int not null default 0,
  created_at  timestamptz not null default now()
);

-- ── Карьерный тест (задел) ───────────────────────────────────
create table if not exists test_results (
  id          text primary key,
  student_id  text not null references students(id) on delete cascade,
  test_id     text not null default 'career',
  answers     jsonb not null default '[]',
  result      text,                             -- класс героя
  created_at  timestamptz not null default now()
);

-- ── Индексы под частые выборки ───────────────────────────────
create index if not exists idx_shift_students_student on shift_students (student_id);
create index if not exists idx_assignments_on_student on assignments (student_id, shift_id);
create index if not exists idx_badges_on_student on badges (student_id, shift_id);
create index if not exists idx_projects_on_student on projects (student_id, shift_id);
create index if not exists idx_sport_on_student on sport_stats (student_id, shift_id);


-- АВТОГЕНЕРАЦИЯ из src/lib/demo.js - не править вручную

insert into concept_skins (id, concept_id, emoji, color, skin, currency, quest, genre) values
('camp-01', 'camp-01', '⚡', '#3D9BE9', '#1f3c63', 'Нейро-коины', 'Битва с Боссом', 'Phygital & Sci-Fi'),
('camp-02', 'camp-02', '🌍', '#2E9E6B', '#1e4a38', 'Ресурсы', 'Совет директоров Земли', 'Adventure & Eco-Tech'),
('camp-03', 'camp-03', '🕵️', '#7B5CD6', '#2f244d', 'Улики', 'Финальный брифинг', 'Media & Soft Skills'),
('camp-04', 'camp-04', '🤖', '#E5584D', '#4a2522', 'Крипто-кредиты', 'Demo Day', 'STEM & Design Thinking'),
('camp-05', 'camp-05', '⚙️', '#12A9A0', '#123c3a', 'Импланты', 'Спортивный саммит', 'Sports Tech & Biohacking'),
('camp-06', 'camp-06', '🏙️', '#F0823D', '#46301d', 'Ключи Городского Разума', 'Взлом Центрального Ядра', 'City Adventure & AR'),
('camp-07', 'camp-07', '🏗️', '#F5A623', '#44361a', 'Модули города', 'Запуск Города Профессий', 'World of Work'),
('camp-08', 'camp-08', '🎮', '#9B3DB0', '#3a1f3e', 'Studio Coins', 'Релиз-вечеринка', 'GameDev & Entrepreneurship'),
('camp-09', 'camp-09', '🏆', '#E0A102', '#4a3a12', 'Медали', 'Игры Академии', 'Sports & Future Skills'),
('camp-10', 'camp-10', '🏝️', '#3BA97A', '#1c3a2b', 'Ракушки', 'Эвакуационный совет', 'Team Building & Future Skills')
on conflict (id) do nothing;

insert into missions (id, concept_id, title, desc, focus, weight, coins) values
('camp-01-m1', 'camp-01', 'Разведка: боевой брифинг на английском', 'Получи боевой брифинг «Битва с Боссом». Держи опорные фразы на английском.', ARRAY['edutainment', 'english', 'futureskills'], 2, 20),
('camp-01-m2', 'camp-01', '⚡ Сбор легенды смены', 'Расскажи своей команде легенду «Кибер-Атлеты» своими словами — вожатый оценит.', ARRAY['edutainment', 'futureskills', 'professions'], 2, 20),
('camp-01-m3', 'camp-01', 'Зарядка будущего: нейрогимнастика', 'Зарядка будущего: нейрогимнастика и координационная лестница.', ARRAY['sport', 'phygital', 'edutainment'], 2, 20),
('camp-01-m4', 'camp-01', 'Интервью с пользователем', 'Задай 5 вопросов тому, для кого делаешь продукт. Запиши ответы.', ARRAY['incubator', 'futureskills', 'phygital'], 2, 20),
('camp-01-m5', 'camp-01', 'MVP: первый рабочий прототип', 'Собери первую версию продукта. Это твой MVP.', ARRAY['incubator', 'edutainment', 'professions'], 2, 20),
('camp-01-m6', 'camp-01', 'Данные своими руками', 'Собери собственные данные и цифры для твоего продукта (физика + цифра).', ARRAY['phygital', 'incubator', 'futureskills'], 2, 20),
('camp-01-m7', 'camp-01', 'Английский: командный челлендж', 'Командное задание только на английском: инструкции, шифры, заказ.', ARRAY['english', 'futureskills', 'edutainment'], 2, 20),
('camp-01-m8', 'camp-01', 'Спотлайт-фразы дня', 'Выучи и употреби 5 фраз дня.', ARRAY['english', 'incubator'], 2, 20),
('camp-01-m9', 'camp-01', 'Спортивный вызов смены', 'Пройди спортивную активность смены: Нейро-коины за движение!', ARRAY['sport', 'phygital', 'futureskills'], 2, 20),
('camp-01-m10', 'camp-01', 'Профессия будущего: знакомство', 'Узнай профессию своего направления и расскажи команде.', ARRAY['professions', 'futureskills', 'english'], 2, 20),
('camp-01-m11', 'camp-01', 'Слайд доказательств', 'Подготовь слайд с доказательством: что сделал, что мерил, что получилось.', ARRAY['incubator', 'edutainment', 'futureskills'], 2, 20),
('camp-01-m12', 'camp-01', 'Репетиция защиты', 'Проговори защиту продукта перед «Битва с Боссом» на английском.', ARRAY['english', 'incubator', 'futureskills'], 2, 20),
('camp-02-m1', 'camp-02', 'Разведка: боевой брифинг на английском', 'Получи боевой брифинг «Совет директоров Земли». Держи опорные фразы на английском.', ARRAY['edutainment', 'english', 'futureskills'], 2, 20),
('camp-02-m2', 'camp-02', '🌍 Сбор легенды смены', 'Расскажи своей команде легенду «Terraforming» своими словами — вожатый оценит.', ARRAY['edutainment', 'futureskills', 'professions'], 2, 20),
('camp-02-m3', 'camp-02', 'Зарядка будущего: нейрогимнастика', 'Зарядка будущего: нейрогимнастика и координационная лестница.', ARRAY['sport', 'phygital', 'edutainment'], 2, 20),
('camp-02-m4', 'camp-02', 'Интервью с пользователем', 'Задай 5 вопросов тому, для кого делаешь продукт. Запиши ответы.', ARRAY['incubator', 'futureskills', 'phygital'], 2, 20),
('camp-02-m5', 'camp-02', 'MVP: первый рабочий прототип', 'Собери первую версию продукта. Это твой MVP.', ARRAY['incubator', 'edutainment', 'professions'], 2, 20),
('camp-02-m6', 'camp-02', 'Данные своими руками', 'Собери собственные данные и цифры для твоего продукта (физика + цифра).', ARRAY['phygital', 'incubator', 'futureskills'], 2, 20),
('camp-02-m7', 'camp-02', 'Английский: командный челлендж', 'Командное задание только на английском: инструкции, шифры, заказ.', ARRAY['english', 'futureskills', 'edutainment'], 2, 20),
('camp-02-m8', 'camp-02', 'Спотлайт-фразы дня', 'Выучи и употреби 5 фраз дня.', ARRAY['english', 'incubator'], 2, 20),
('camp-02-m9', 'camp-02', 'Спортивный вызов смены', 'Пройди спортивную активность смены: Ресурсы за движение!', ARRAY['sport', 'phygital', 'futureskills'], 2, 20),
('camp-02-m10', 'camp-02', 'Профессия будущего: знакомство', 'Узнай профессию своего направления и расскажи команде.', ARRAY['professions', 'futureskills', 'english'], 2, 20),
('camp-02-m11', 'camp-02', 'Слайд доказательств', 'Подготовь слайд с доказательством: что сделал, что мерил, что получилось.', ARRAY['incubator', 'edutainment', 'futureskills'], 2, 20),
('camp-02-m12', 'camp-02', 'Репетиция защиты', 'Проговори защиту продукта перед «Совет директоров Земли» на английском.', ARRAY['english', 'incubator', 'futureskills'], 2, 20),
('camp-03-m1', 'camp-03', 'Разведка: боевой брифинг на английском', 'Получи боевой брифинг «Финальный брифинг». Держи опорные фразы на английском.', ARRAY['edutainment', 'english', 'futureskills'], 2, 20),
('camp-03-m2', 'camp-03', '🕵️ Сбор легенды смены', 'Расскажи своей команде легенду «Meta-Agency» своими словами — вожатый оценит.', ARRAY['edutainment', 'futureskills', 'professions'], 2, 20),
('camp-03-m3', 'camp-03', 'Зарядка будущего: нейрогимнастика', 'Зарядка будущего: нейрогимнастика и координационная лестница.', ARRAY['sport', 'phygital', 'edutainment'], 2, 20),
('camp-03-m4', 'camp-03', 'Интервью с пользователем', 'Задай 5 вопросов тому, для кого делаешь продукт. Запиши ответы.', ARRAY['incubator', 'futureskills', 'phygital'], 2, 20),
('camp-03-m5', 'camp-03', 'MVP: первый рабочий прототип', 'Собери первую версию продукта. Это твой MVP.', ARRAY['incubator', 'edutainment', 'professions'], 2, 20),
('camp-03-m6', 'camp-03', 'Данные своими руками', 'Собери собственные данные и цифры для твоего продукта (физика + цифра).', ARRAY['phygital', 'incubator', 'futureskills'], 2, 20),
('camp-03-m7', 'camp-03', 'Английский: командный челлендж', 'Командное задание только на английском: инструкции, шифры, заказ.', ARRAY['english', 'futureskills', 'edutainment'], 2, 20),
('camp-03-m8', 'camp-03', 'Спотлайт-фразы дня', 'Выучи и употреби 5 фраз дня.', ARRAY['english', 'incubator'], 2, 20),
('camp-03-m9', 'camp-03', 'Спортивный вызов смены', 'Пройди спортивную активность смены: Улики за движение!', ARRAY['sport', 'phygital', 'futureskills'], 2, 20),
('camp-03-m10', 'camp-03', 'Профессия будущего: знакомство', 'Узнай профессию своего направления и расскажи команде.', ARRAY['professions', 'futureskills', 'english'], 2, 20),
('camp-03-m11', 'camp-03', 'Слайд доказательств', 'Подготовь слайд с доказательством: что сделал, что мерил, что получилось.', ARRAY['incubator', 'edutainment', 'futureskills'], 2, 20),
('camp-03-m12', 'camp-03', 'Репетиция защиты', 'Проговори защиту продукта перед «Финальный брифинг» на английском.', ARRAY['english', 'incubator', 'futureskills'], 2, 20),
('camp-04-m1', 'camp-04', 'Разведка: боевой брифинг на английском', 'Получи боевой брифинг «Demo Day». Держи опорные фразы на английском.', ARRAY['edutainment', 'english', 'futureskills'], 2, 20),
('camp-04-m2', 'camp-04', '🤖 Сбор легенды смены', 'Расскажи своей команде легенду «Future Makers» своими словами — вожатый оценит.', ARRAY['edutainment', 'futureskills', 'professions'], 2, 20),
('camp-04-m3', 'camp-04', 'Зарядка будущего: нейрогимнастика', 'Зарядка будущего: нейрогимнастика и координационная лестница.', ARRAY['sport', 'phygital', 'edutainment'], 2, 20),
('camp-04-m4', 'camp-04', 'Интервью с пользователем', 'Задай 5 вопросов тому, для кого делаешь продукт. Запиши ответы.', ARRAY['incubator', 'futureskills', 'phygital'], 2, 20),
('camp-04-m5', 'camp-04', 'MVP: первый рабочий прототип', 'Собери первую версию продукта. Это твой MVP.', ARRAY['incubator', 'edutainment', 'professions'], 2, 20),
('camp-04-m6', 'camp-04', 'Данные своими руками', 'Собери собственные данные и цифры для твоего продукта (физика + цифра).', ARRAY['phygital', 'incubator', 'futureskills'], 2, 20),
('camp-04-m7', 'camp-04', 'Английский: командный челлендж', 'Командное задание только на английском: инструкции, шифры, заказ.', ARRAY['english', 'futureskills', 'edutainment'], 2, 20),
('camp-04-m8', 'camp-04', 'Спотлайт-фразы дня', 'Выучи и употреби 5 фраз дня.', ARRAY['english', 'incubator'], 2, 20),
('camp-04-m9', 'camp-04', 'Спортивный вызов смены', 'Пройди спортивную активность смены: Крипто-кредиты за движение!', ARRAY['sport', 'phygital', 'futureskills'], 2, 20),
('camp-04-m10', 'camp-04', 'Профессия будущего: знакомство', 'Узнай профессию своего направления и расскажи команде.', ARRAY['professions', 'futureskills', 'english'], 2, 20),
('camp-04-m11', 'camp-04', 'Слайд доказательств', 'Подготовь слайд с доказательством: что сделал, что мерил, что получилось.', ARRAY['incubator', 'edutainment', 'futureskills'], 2, 20),
('camp-04-m12', 'camp-04', 'Репетиция защиты', 'Проговори защиту продукта перед «Demo Day» на английском.', ARRAY['english', 'incubator', 'futureskills'], 2, 20),
('camp-05-m1', 'camp-05', 'Разведка: боевой брифинг на английском', 'Получи боевой брифинг «Спортивный саммит». Держи опорные фразы на английском.', ARRAY['edutainment', 'english', 'futureskills'], 2, 20),
('camp-05-m2', 'camp-05', '⚙️ Сбор легенды смены', 'Расскажи своей команде легенду «Active Tech 2077» своими словами — вожатый оценит.', ARRAY['edutainment', 'futureskills', 'professions'], 2, 20),
('camp-05-m3', 'camp-05', 'Зарядка будущего: нейрогимнастика', 'Зарядка будущего: нейрогимнастика и координационная лестница.', ARRAY['sport', 'phygital', 'edutainment'], 2, 20),
('camp-05-m4', 'camp-05', 'Интервью с пользователем', 'Задай 5 вопросов тому, для кого делаешь продукт. Запиши ответы.', ARRAY['incubator', 'futureskills', 'phygital'], 2, 20),
('camp-05-m5', 'camp-05', 'MVP: первый рабочий прототип', 'Собери первую версию продукта. Это твой MVP.', ARRAY['incubator', 'edutainment', 'professions'], 2, 20),
('camp-05-m6', 'camp-05', 'Данные своими руками', 'Собери собственные данные и цифры для твоего продукта (физика + цифра).', ARRAY['phygital', 'incubator', 'futureskills'], 2, 20),
('camp-05-m7', 'camp-05', 'Английский: командный челлендж', 'Командное задание только на английском: инструкции, шифры, заказ.', ARRAY['english', 'futureskills', 'edutainment'], 2, 20),
('camp-05-m8', 'camp-05', 'Спотлайт-фразы дня', 'Выучи и употреби 5 фраз дня.', ARRAY['english', 'incubator'], 2, 20),
('camp-05-m9', 'camp-05', 'Спортивный вызов смены', 'Пройди спортивную активность смены: Импланты за движение!', ARRAY['sport', 'phygital', 'futureskills'], 2, 20),
('camp-05-m10', 'camp-05', 'Профессия будущего: знакомство', 'Узнай профессию своего направления и расскажи команде.', ARRAY['professions', 'futureskills', 'english'], 2, 20),
('camp-05-m11', 'camp-05', 'Слайд доказательств', 'Подготовь слайд с доказательством: что сделал, что мерил, что получилось.', ARRAY['incubator', 'edutainment', 'futureskills'], 2, 20),
('camp-05-m12', 'camp-05', 'Репетиция защиты', 'Проговори защиту продукта перед «Спортивный саммит» на английском.', ARRAY['english', 'incubator', 'futureskills'], 2, 20),
('camp-06-m1', 'camp-06', 'Разведка: боевой брифинг на английском', 'Получи боевой брифинг «Взлом Центрального Ядра». Держи опорные фразы на английском.', ARRAY['edutainment', 'english', 'futureskills'], 2, 20),
('camp-06-m2', 'camp-06', '🏙️ Сбор легенды смены', 'Расскажи своей команде легенду «Urban Quest» своими словами — вожатый оценит.', ARRAY['edutainment', 'futureskills', 'professions'], 2, 20),
('camp-06-m3', 'camp-06', 'Зарядка будущего: нейрогимнастика', 'Зарядка будущего: нейрогимнастика и координационная лестница.', ARRAY['sport', 'phygital', 'edutainment'], 2, 20),
('camp-06-m4', 'camp-06', 'Интервью с пользователем', 'Задай 5 вопросов тому, для кого делаешь продукт. Запиши ответы.', ARRAY['incubator', 'futureskills', 'phygital'], 2, 20),
('camp-06-m5', 'camp-06', 'MVP: первый рабочий прототип', 'Собери первую версию продукта. Это твой MVP.', ARRAY['incubator', 'edutainment', 'professions'], 2, 20),
('camp-06-m6', 'camp-06', 'Данные своими руками', 'Собери собственные данные и цифры для твоего продукта (физика + цифра).', ARRAY['phygital', 'incubator', 'futureskills'], 2, 20),
('camp-06-m7', 'camp-06', 'Английский: командный челлендж', 'Командное задание только на английском: инструкции, шифры, заказ.', ARRAY['english', 'futureskills', 'edutainment'], 2, 20),
('camp-06-m8', 'camp-06', 'Спотлайт-фразы дня', 'Выучи и употреби 5 фраз дня.', ARRAY['english', 'incubator'], 2, 20),
('camp-06-m9', 'camp-06', 'Спортивный вызов смены', 'Пройди спортивную активность смены: Ключи Городского Разума за движение!', ARRAY['sport', 'phygital', 'futureskills'], 2, 20),
('camp-06-m10', 'camp-06', 'Профессия будущего: знакомство', 'Узнай профессию своего направления и расскажи команде.', ARRAY['professions', 'futureskills', 'english'], 2, 20),
('camp-06-m11', 'camp-06', 'Слайд доказательств', 'Подготовь слайд с доказательством: что сделал, что мерил, что получилось.', ARRAY['incubator', 'edutainment', 'futureskills'], 2, 20),
('camp-06-m12', 'camp-06', 'Репетиция защиты', 'Проговори защиту продукта перед «Взлом Центрального Ядра» на английском.', ARRAY['english', 'incubator', 'futureskills'], 2, 20),
('camp-07-m1', 'camp-07', 'Разведка: боевой брифинг на английском', 'Получи боевой брифинг «Запуск Города Профессий». Держи опорные фразы на английском.', ARRAY['edutainment', 'english', 'futureskills'], 2, 20),
('camp-07-m2', 'camp-07', '🏗️ Сбор легенды смены', 'Расскажи своей команде легенду «FUTURE QUEST» своими словами — вожатый оценит.', ARRAY['edutainment', 'futureskills', 'professions'], 2, 20),
('camp-07-m3', 'camp-07', 'Зарядка будущего: нейрогимнастика', 'Зарядка будущего: нейрогимнастика и координационная лестница.', ARRAY['sport', 'phygital', 'edutainment'], 2, 20),
('camp-07-m4', 'camp-07', 'Интервью с пользователем', 'Задай 5 вопросов тому, для кого делаешь продукт. Запиши ответы.', ARRAY['incubator', 'futureskills', 'phygital'], 2, 20),
('camp-07-m5', 'camp-07', 'MVP: первый рабочий прототип', 'Собери первую версию продукта. Это твой MVP.', ARRAY['incubator', 'edutainment', 'professions'], 2, 20),
('camp-07-m6', 'camp-07', 'Данные своими руками', 'Собери собственные данные и цифры для твоего продукта (физика + цифра).', ARRAY['phygital', 'incubator', 'futureskills'], 2, 20),
('camp-07-m7', 'camp-07', 'Английский: командный челлендж', 'Командное задание только на английском: инструкции, шифры, заказ.', ARRAY['english', 'futureskills', 'edutainment'], 2, 20),
('camp-07-m8', 'camp-07', 'Спотлайт-фразы дня', 'Выучи и употреби 5 фраз дня.', ARRAY['english', 'incubator'], 2, 20),
('camp-07-m9', 'camp-07', 'Спортивный вызов смены', 'Пройди спортивную активность смены: Модули города за движение!', ARRAY['sport', 'phygital', 'futureskills'], 2, 20),
('camp-07-m10', 'camp-07', 'Профессия будущего: знакомство', 'Узнай профессию своего направления и расскажи команде.', ARRAY['professions', 'futureskills', 'english'], 2, 20),
('camp-07-m11', 'camp-07', 'Слайд доказательств', 'Подготовь слайд с доказательством: что сделал, что мерил, что получилось.', ARRAY['incubator', 'edutainment', 'futureskills'], 2, 20),
('camp-07-m12', 'camp-07', 'Репетиция защиты', 'Проговори защиту продукта перед «Запуск Города Профессий» на английском.', ARRAY['english', 'incubator', 'futureskills'], 2, 20),
('camp-08-m1', 'camp-08', 'Разведка: боевой брифинг на английском', 'Получи боевой брифинг «Релиз-вечеринка». Держи опорные фразы на английском.', ARRAY['edutainment', 'english', 'futureskills'], 2, 20),
('camp-08-m2', 'camp-08', '🎮 Сбор легенды смены', 'Расскажи своей команде легенду «ENGLISH GAME STUDIO» своими словами — вожатый оценит.', ARRAY['edutainment', 'futureskills', 'professions'], 2, 20),
('camp-08-m3', 'camp-08', 'Зарядка будущего: нейрогимнастика', 'Зарядка будущего: нейрогимнастика и координационная лестница.', ARRAY['sport', 'phygital', 'edutainment'], 2, 20),
('camp-08-m4', 'camp-08', 'Интервью с пользователем', 'Задай 5 вопросов тому, для кого делаешь продукт. Запиши ответы.', ARRAY['incubator', 'futureskills', 'phygital'], 2, 20),
('camp-08-m5', 'camp-08', 'MVP: первый рабочий прототип', 'Собери первую версию продукта. Это твой MVP.', ARRAY['incubator', 'edutainment', 'professions'], 2, 20),
('camp-08-m6', 'camp-08', 'Данные своими руками', 'Собери собственные данные и цифры для твоего продукта (физика + цифра).', ARRAY['phygital', 'incubator', 'futureskills'], 2, 20),
('camp-08-m7', 'camp-08', 'Английский: командный челлендж', 'Командное задание только на английском: инструкции, шифры, заказ.', ARRAY['english', 'futureskills', 'edutainment'], 2, 20),
('camp-08-m8', 'camp-08', 'Спотлайт-фразы дня', 'Выучи и употреби 5 фраз дня.', ARRAY['english', 'incubator'], 2, 20),
('camp-08-m9', 'camp-08', 'Спортивный вызов смены', 'Пройди спортивную активность смены: Studio Coins за движение!', ARRAY['sport', 'phygital', 'futureskills'], 2, 20),
('camp-08-m10', 'camp-08', 'Профессия будущего: знакомство', 'Узнай профессию своего направления и расскажи команде.', ARRAY['professions', 'futureskills', 'english'], 2, 20),
('camp-08-m11', 'camp-08', 'Слайд доказательств', 'Подготовь слайд с доказательством: что сделал, что мерил, что получилось.', ARRAY['incubator', 'edutainment', 'futureskills'], 2, 20),
('camp-08-m12', 'camp-08', 'Репетиция защиты', 'Проговори защиту продукта перед «Релиз-вечеринка» на английском.', ARRAY['english', 'incubator', 'futureskills'], 2, 20),
('camp-09-m1', 'camp-09', 'Разведка: боевой брифинг на английском', 'Получи боевой брифинг «Игры Академии». Держи опорные фразы на английском.', ARRAY['edutainment', 'english', 'futureskills'], 2, 20),
('camp-09-m2', 'camp-09', '🏆 Сбор легенды смены', 'Расскажи своей команде легенду «CHAMPIONS ACADEMY» своими словами — вожатый оценит.', ARRAY['edutainment', 'futureskills', 'professions'], 2, 20),
('camp-09-m3', 'camp-09', 'Зарядка будущего: нейрогимнастика', 'Зарядка будущего: нейрогимнастика и координационная лестница.', ARRAY['sport', 'phygital', 'edutainment'], 2, 20),
('camp-09-m4', 'camp-09', 'Интервью с пользователем', 'Задай 5 вопросов тому, для кого делаешь продукт. Запиши ответы.', ARRAY['incubator', 'futureskills', 'phygital'], 2, 20),
('camp-09-m5', 'camp-09', 'MVP: первый рабочий прототип', 'Собери первую версию продукта. Это твой MVP.', ARRAY['incubator', 'edutainment', 'professions'], 2, 20),
('camp-09-m6', 'camp-09', 'Данные своими руками', 'Собери собственные данные и цифры для твоего продукта (физика + цифра).', ARRAY['phygital', 'incubator', 'futureskills'], 2, 20),
('camp-09-m7', 'camp-09', 'Английский: командный челлендж', 'Командное задание только на английском: инструкции, шифры, заказ.', ARRAY['english', 'futureskills', 'edutainment'], 2, 20),
('camp-09-m8', 'camp-09', 'Спотлайт-фразы дня', 'Выучи и употреби 5 фраз дня.', ARRAY['english', 'incubator'], 2, 20),
('camp-09-m9', 'camp-09', 'Спортивный вызов смены', 'Пройди спортивную активность смены: Медали за движение!', ARRAY['sport', 'phygital', 'futureskills'], 2, 20),
('camp-09-m10', 'camp-09', 'Профессия будущего: знакомство', 'Узнай профессию своего направления и расскажи команде.', ARRAY['professions', 'futureskills', 'english'], 2, 20),
('camp-09-m11', 'camp-09', 'Слайд доказательств', 'Подготовь слайд с доказательством: что сделал, что мерил, что получилось.', ARRAY['incubator', 'edutainment', 'futureskills'], 2, 20),
('camp-09-m12', 'camp-09', 'Репетиция защиты', 'Проговори защиту продукта перед «Игры Академии» на английском.', ARRAY['english', 'incubator', 'futureskills'], 2, 20),
('camp-10-m1', 'camp-10', 'Разведка: боевой брифинг на английском', 'Получи боевой брифинг «Эвакуационный совет». Держи опорные фразы на английском.', ARRAY['edutainment', 'english', 'futureskills'], 2, 20),
('camp-10-m2', 'camp-10', '🏝️ Сбор легенды смены', 'Расскажи своей команде легенду «ISLAND SURVIVAL» своими словами — вожатый оценит.', ARRAY['edutainment', 'futureskills', 'professions'], 2, 20),
('camp-10-m3', 'camp-10', 'Зарядка будущего: нейрогимнастика', 'Зарядка будущего: нейрогимнастика и координационная лестница.', ARRAY['sport', 'phygital', 'edutainment'], 2, 20),
('camp-10-m4', 'camp-10', 'Интервью с пользователем', 'Задай 5 вопросов тому, для кого делаешь продукт. Запиши ответы.', ARRAY['incubator', 'futureskills', 'phygital'], 2, 20),
('camp-10-m5', 'camp-10', 'MVP: первый рабочий прототип', 'Собери первую версию продукта. Это твой MVP.', ARRAY['incubator', 'edutainment', 'professions'], 2, 20),
('camp-10-m6', 'camp-10', 'Данные своими руками', 'Собери собственные данные и цифры для твоего продукта (физика + цифра).', ARRAY['phygital', 'incubator', 'futureskills'], 2, 20),
('camp-10-m7', 'camp-10', 'Английский: командный челлендж', 'Командное задание только на английском: инструкции, шифры, заказ.', ARRAY['english', 'futureskills', 'edutainment'], 2, 20),
('camp-10-m8', 'camp-10', 'Спотлайт-фразы дня', 'Выучи и употреби 5 фраз дня.', ARRAY['english', 'incubator'], 2, 20),
('camp-10-m9', 'camp-10', 'Спортивный вызов смены', 'Пройди спортивную активность смены: Ракушки за движение!', ARRAY['sport', 'phygital', 'futureskills'], 2, 20),
('camp-10-m10', 'camp-10', 'Профессия будущего: знакомство', 'Узнай профессию своего направления и расскажи команде.', ARRAY['professions', 'futureskills', 'english'], 2, 20),
('camp-10-m11', 'camp-10', 'Слайд доказательств', 'Подготовь слайд с доказательством: что сделал, что мерил, что получилось.', ARRAY['incubator', 'edutainment', 'futureskills'], 2, 20),
('camp-10-m12', 'camp-10', 'Репетиция защиты', 'Проговори защиту продукта перед «Эвакуационный совет» на английском.', ARRAY['english', 'incubator', 'futureskills'], 2, 20)
on conflict (id) do nothing;

insert into quests (id, concept_id, title, desc, xp, gems, stages) values
('camp-01-q1', 'camp-01', 'Финальный вызов: «Битва с Боссом»', 'Защити продукт команды перед жюри. Оценка 3–5 решает награду.', 200, 10, ARRAY['Идея', 'Интервью', 'MVP', 'Слайд', 'Защита']),
('camp-02-q1', 'camp-02', 'Финальный вызов: «Совет директоров Земли»', 'Защити продукт команды перед жюри. Оценка 3–5 решает награду.', 200, 10, ARRAY['Идея', 'Интервью', 'MVP', 'Слайд', 'Защита']),
('camp-03-q1', 'camp-03', 'Финальный вызов: «Финальный брифинг»', 'Защити продукт команды перед жюри. Оценка 3–5 решает награду.', 200, 10, ARRAY['Идея', 'Интервью', 'MVP', 'Слайд', 'Защита']),
('camp-04-q1', 'camp-04', 'Финальный вызов: «Demo Day»', 'Защити продукт команды перед жюри. Оценка 3–5 решает награду.', 200, 10, ARRAY['Идея', 'Интервью', 'MVP', 'Слайд', 'Защита']),
('camp-05-q1', 'camp-05', 'Финальный вызов: «Спортивный саммит»', 'Защити продукт команды перед жюри. Оценка 3–5 решает награду.', 200, 10, ARRAY['Идея', 'Интервью', 'MVP', 'Слайд', 'Защита']),
('camp-06-q1', 'camp-06', 'Финальный вызов: «Взлом Центрального Ядра»', 'Защити продукт команды перед жюри. Оценка 3–5 решает награду.', 200, 10, ARRAY['Идея', 'Интервью', 'MVP', 'Слайд', 'Защита']),
('camp-07-q1', 'camp-07', 'Финальный вызов: «Запуск Города Профессий»', 'Защити продукт команды перед жюри. Оценка 3–5 решает награду.', 200, 10, ARRAY['Идея', 'Интервью', 'MVP', 'Слайд', 'Защита']),
('camp-08-q1', 'camp-08', 'Финальный вызов: «Релиз-вечеринка»', 'Защити продукт команды перед жюри. Оценка 3–5 решает награду.', 200, 10, ARRAY['Идея', 'Интервью', 'MVP', 'Слайд', 'Защита']),
('camp-09-q1', 'camp-09', 'Финальный вызов: «Игры Академии»', 'Защити продукт команды перед жюри. Оценка 3–5 решает награду.', 200, 10, ARRAY['Идея', 'Интервью', 'MVP', 'Слайд', 'Защита']),
('camp-10-q1', 'camp-10', 'Финальный вызов: «Эвакуационный совет»', 'Защити продукт команды перед жюри. Оценка 3–5 решает награду.', 200, 10, ARRAY['Идея', 'Интервью', 'MVP', 'Слайд', 'Защита'])
on conflict (id) do nothing;
