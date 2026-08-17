import React, { useState } from 'react';
import useData from '../hooks/useData.js';
import { Store } from '../lib/store.js';
import { DB } from '../lib/db.js';
import { Engine } from '../lib/engine.js';
import { CONCEPTS, conceptById, GRADE_REWARD, AUTO_BADGES, CONCEPT_BADGES } from '../lib/config.js';
import Avatar from '../components/Avatar.jsx';

const SECS = [
  { id:'overview', name:'Обзор' },
  { id:'shifts',   name:'Смены' },
  { id:'grades',   name:'Миссии и оценки' },
  { id:'sport',    name:'Спорт' },
  { id:'projects', name:'Проекты' },
  { id:'preview',  name:'Превью ребёнка' }
];

export default function Counselor({ csec, onCsec, onRoleKid, students, onRefresh }) {
  const [msg, setMsg] = useState(null);
  const [dv, setDv] = useState(0);

  async function loadDemo() {
    const { seedDemo } = await import('../lib/demo.js');
    await seedDemo(DB);
    setDv(v => v + 1);
    onRefresh && onRefresh();
    setMsg('✅ Демо-данные загружены: 4 клана, 6 детей, смена «Кибер-Атлеты» с миссиями, квестом и баджами.');
  }

  return (
    <main className="counselor">
      <div className="c-head">
        <h2>🧭 Кабинет вожатого</h2>
        <div className="c-actions">
          <button className="btn sm ghost" onClick={onRoleKid}>👀 Смотреть как ребёнок</button>
          <button className="btn sm primary" onClick={loadDemo}>📦 Загрузить демо-данные</button>
        </div>
      </div>
      {msg && <div className="toast">{msg}</div>}
      <nav className="c-tabs">
        {SECS.map(s => <button key={s.id} className={`c-tab ${csec === s.id ? 'on' : ''}`} onClick={() => onCsec(s.id)}>{s.name}</button>)}
      </nav>

      <div className="c-body">
        {csec === 'overview' && <Overview students={students} dv={dv} />}
        {csec === 'shifts' && <ShiftsSec dv={dv} />}
        {csec === 'grades' && <GradesSec dv={dv} />}
        {csec === 'sport' && <SportSec dv={dv} />}
        {csec === 'projects' && <ProjectsSec dv={dv} />}
        {csec === 'preview' && <PreviewSec onRoleKid={onRoleKid} />}
      </div>
    </main>
  );
}

function Overview({ students }) {
  const total = students?.length || 0;
  const totalXp = students?.reduce((a, s) => a + (s.xp || 0), 0) || 0;
  return (
    <div className="ov-grid">
      <div className="ov-card"><b>{total}</b><span>участников</span></div>
      <div className="ov-card"><b>{totalXp}</b><span>XP всего</span></div>
      <div className="ov-card"><b>10</b><span>концепций</span></div>
      <div className="ov-card"><b>4</b><span>сезона</span></div>
    </div>
  );
}

function ShiftsSec({ dv }) {
  const [shifts] = useData(() => Store.shifts(), [dv]);
  return (
    <div className="sec">
      <h3>Смены учебного года</h3>
      {shifts?.length ? shifts.map(s => {
        const c = conceptById(s.concept_id);
        return (
          <div key={s.id} className="row-card">
            <span className="rc-ic">{c?.emoji || '🗓️'}</span>
            <div><b>{s.title}</b><span className="dim">{s.date_from} – {s.date_to} · {s.status === 'active' ? '🟢 активна' : '⏹ закрыта'}</span></div>
          </div>
        );
      }) : (
        <div className="dim empty">Смен пока нет. Нажми «Загрузить демо-данные».</div>
      )}
    </div>
  );
}

function GradesSec({ dv }) {
  const [students] = useData(() => Store.students(), [dv]);
  const [shift] = useData(() => Store.activeOrLastShift(), [dv]);
  const [missions] = useData(() => Store.missions(), [dv]);
  const [, , reload] = useData(() => Promise.resolve(), [dv]);

  const shiftMissions = missions.filter(m => m.concept_id === (shift?.concept_id || 'camp-01')).slice(0, 2);

  async function setGrade(sid, itemId, grade) {
    if (!shift) return;
    const existing = (await Store.assignmentsFor(shift.id, sid)).find(a => a.item_type === 'mission' && a.item_id === itemId);
    await DB.upsert('assignments', {
      id: existing?.id || `asg-${shift.id}-${sid}-${itemId}`,
      shift_id: shift.id, student_id: sid, item_type: 'mission',
      item_id: itemId, day_date: existing?.day_date || shift.date_from,
      status: grade >= 3 ? 'credited' : 'not_credited', grade
    });
    const st = await Store.student(sid);
    const reward = Engine.rewardOf(grade);
    await DB.upsert('students', {
      ...st,
      xp: (st.xp || 0) + (grade * 10),
      coins: (st.coins || 0) + reward.coins
    });
    reload();
  }

  return (
    <div className="sec">
      <h3>Оценки миссий (1–5, засчитывается от 3)</h3>
      {students && shift ? (
        <table className="c-table">
          <thead><tr><th>Ребёнок</th><th>Миссия</th><th>Оценка</th></tr></thead>
          <tbody>
            {students.slice(0, 6).map(st => shiftMissions.map(m => (
              <tr key={st.id + m.id}>
                <td><Avatar student={st} size="sm" /> {st.nickname}</td>
                <td>{m.title}</td>
                <td><div className="grade-cell">{[1, 2, 3, 4, 5].map(g => (
                  <button key={g} className="grade-btn" onClick={() => setGrade(st.id, m.id, g)}>{g}</button>
                ))}</div></td>
              </tr>
            )))}
          </tbody>
        </table>
      ) : <div className="dim empty">Загрузите демо-данные, чтобы увидеть оценки</div>}
    </div>
  );
}

function SportSec() {
  const [students] = useData(() => Store.students(), []);
  const [shift, reload] = useData(() => Store.activeOrLastShift(), []);
  return (
    <div className="sec">
      <h3>Спортивные результаты — ввод вожатого</h3>
      {students?.length ? students.slice(0, 6).map(st => (
        <div key={st.id} className="row-card">
          <Avatar student={st} size="sm" /><b>{st.nickname}</b>
          <span className="dim">Спорт в смене пока без записей — вожатый добавит результат (вид, итог, баллы).</span>
        </div>
      )) : <div className="dim empty">Нет данных</div>}
    </div>
  );
}

function ProjectsSec() {
  const [students] = useData(() => Store.students(), []);
  return (
    <div className="sec">
      <h3>Портфолио проектов (интервью → MVP → слайд → защита)</h3>
      {students?.length ? students.map(st => (
        <div key={st.id} className="row-card">
          <Avatar student={st} size="sm" /><b>{st.nickname}</b>
          <span className="chip on">MVP</span><span className="dim">защита будет на {conceptById('camp-01').quest}</span>
        </div>
      )) : <div className="dim empty">Нет данных</div>}
    </div>
  );
}

function PreviewSec({ onRoleKid }) {
  return (
    <div className="sec preview-note">
      <h3>Превью «как видит ребёнок»</h3>
      <p>Переключись в роль участника и выбери себя по нику — так ребёнок видит свой профиль.</p>
      <button className="btn primary" onClick={onRoleKid}>🎮 Открыть детский профиль</button>
    </div>
  );
}