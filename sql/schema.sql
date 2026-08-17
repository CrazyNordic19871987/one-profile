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
  "desc"      text not null default '',
  focus       text[] not null default '{}',     -- из 7 составных
  weight      int not null default 2,           -- вес в радаре
  coins       int not null default 20
);

create table if not exists quests (
  id          text primary key,
  concept_id  text not null,
  title       text not null,
  "desc"      text not null default '',
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
  "desc"      text not null default '',
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

-- ── RLS отключаем ПРИНУДИТЕЛЬНО (MVP): приложение работает от anon key ──
-- (Supabase включает RLS по умолчанию для новых таблиц; без policies это
--  блокирует и чтение, и запись. Отключаем для постоянных таблиц.)
do $$
declare t text;
begin
  for t in
    select tablename from pg_tables
    where schemaname = 'public'
      and tablename in (
        'students','clans','shifts','shift_students','missions','quests',
        'assignments','badges','challenges','projects','sport_stats',
        'concept_skins','test_results')
  loop
    execute format('alter table %I disable row level security', t);
  end loop;
end $$;