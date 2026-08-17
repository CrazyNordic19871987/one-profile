import React from 'react';
import useData from '../hooks/useData.js';
import { Store } from '../lib/store.js';
import { Engine } from '../lib/engine.js';
import { AUTO_BADGES, CONCEPT_BADGES, SEVEN } from '../lib/config.js';
import Radar from '../components/Radar.jsx';
import Avatar from '../components/Avatar.jsx';

const TABS = [
  { id:'profile',   icon:'🦸', name:'Герой' },
  { id:'missions',  icon:'🎯', name:'Миссии' },
  { id:'quests',    icon:'🏁', name:'Квест' },
  { id:'badges',    icon:'🏅', name:'Баджи' },
  { id:'portfolio', icon:'📁', name:'Проекты' },
  { id:'sport',     icon:'⚽', name:'Спорт' },
  { id:'clan',      icon:'🏰', name:'Клан' },
  { id:'rating',    icon:'🏆', name:'Рейтинг' },
  { id:'shifts',    icon:'📅', name:'Смены' }
];

export default function KidApp({ studentId, tab, onTab, onSwitchKid, onGoCounselor }) {
  const [d] = useData(() => Store.profileOf(studentId), [studentId, tab]);

  if (!d) return <div className="boot">🚀 загружаем профиль…</div>;

  return (
    <main className="kidapp">
      <HeroCard d={d} />
      <YearMap d={d} />
      <TabNav tab={tab} onTab={onTab} />

      <div className="tab-body">
        {tab === 'profile' && <ProfileTab d={d} />}
        {tab === 'missions' && <MissionsTab d={d} />}
        {tab === 'quests' && <QuestsTab d={d} />}
        {tab === 'badges' && <BadgesTab d={d} />}
        {tab === 'portfolio' && <PortfolioTab d={d} />}
        {tab === 'sport' && <SportTab d={d} />}
        {tab === 'clan' && <ClanTab d={d} />}
        {tab === 'rating' && <RatingTab d={d} />}
        {tab === 'shifts' && <ShiftsTab d={d} />}
      </div>

      <button className="btn sm ghost switch-kid" onClick={onSwitchKid}>← выбрать другого</button>
    </main>
  );
}

function HeroCard({ d }) {
  const { st, level, league, rank, stage, xpInfo, clan, concept, skin } = d;
  const accent = skin ? skin.color : '#ED7615';
  const currency = skin ? skin.currency : 'Coins';
  return (
    <section className="hero-card" style={{ ['--accent']: accent }}>
      <div className="hero-ava"><Avatar student={st} size="hero" /></div>
      <div className="hero-info">
        <div className="hero-nick">{st.nickname} <span className="hero-stage">{stage.stage.icon}</span></div>
        <div className="hero-sub">{stage.stage.name} · {rank.icon} {rank.name}</div>
        <div className="hero-tags">
          <span className="lvl-badge">LVL {level}</span>
          <span className="league-badge" style={{ background: league.color }}>{league.name}</span>
          {concept && <span className="concept-tag" style={{ background: accent }}>{concept.emoji} {concept.name}</span>}
        </div>
        <div className="xp-line">
          <div className="xp-bar"><i style={{ width: xpInfo.pct + '%' }} /></div>
          <span>{xpInfo.xpInto}/{xpInfo.level >= 100 ? 'MAX' : '25'} XP</span>
        </div>
        <div className="coins-row">
          <span className="coin">🪙 {st.coins || 0}</span>
          <span className="coin">⭐ {st.xp || 0}</span>
          <span className="coin">💎 {st.gems || 0}</span>
          <span className="coin skin" style={{ ['--accent']: accent }}>💠 {currency}: {st.coins || 0}</span>
        </div>
        {clan && <div className="hero-clan">{clan.icon} Клан «{clan.name}»</div>}
      </div>
    </section>
  );
}

function YearMap({ d }) {
  const { yearMap, diplomaPct, shiftCount } = d;
  return (
    <section className="year-map">
      <div className="ym-head">
        <b>Карта года · 10 смен</b>
        <span className="dim">Пройдено {shiftCount}/10 · Диплом {diplomaPct}%</span>
      </div>
      <div className="ym-track">
        {yearMap.map((y, i) => (
          <div key={i} className={`ym-step ${y.done ? 'done' : ''} ${y.isActive ? 'active' : ''}`} title={y.title}>
            <div className="ym-ic">{y.done ? '✅' : y.isActive ? '🟠' : `${i + 1}`}</div>
            <div className="ym-label">{y.season}</div>
          </div>
        ))}
      </div>
      <div className="diploma-bar"><i style={{ width: diplomaPct + '%' }} /></div>
      {diplomaPct >= 100 && <div className="diploma-award">🎓 Диплом Агента Будущего получен!</div>}
    </section>
  );
}

function TabNav({ tab, onTab }) {
  return (
    <nav className="tabs">
      {TABS.map(t => (
        <button key={t.id} className={`tab ${tab === t.id ? 'on' : ''}`} onClick={() => onTab(t.id)}>
          <span className="tab-ic">{t.icon}</span><span className="tab-tx">{t.name}</span>
        </button>
      ))}
    </nav>
  );
}

// ── Вкладка Профиль: радар 7 составных + суть ────────────────
function ProfileTab({ d }) {
  const { radar, concept, skin, st, stage, cls } = d;
  return (
    <div className="profile-tab">
      <section className="panel radar-panel">
        <div className="panel-title">7 составляющих продукта</div>
        {radar ? <Radar data={radar} /> : <div className="dim">Нет данных о смене</div>}
      </section>
      <section className="panel">
        <div className="panel-title">Твой класс героя</div>
        <div className="class-card">
          <span className="cls-ic">{cls.icon}</span>
          <div>
            <b>{cls.full}</b>
            <p>{cls.desc}</p>
            <div className="chip-row">{cls.dirs.map(d => <span key={d} className="chip">{d}</span>)}</div>
            <div className="careers">{cls.careers.join(' · ')}</div>
          </div>
        </div>
      </section>
      {concept && skin && (
        <section className="panel concept-panel">
          <div className="panel-title">Текущая миссия года</div>
          <div className="concept-row" style={{ ['--accent']: skin.color }}>
            <span className="cr-ic">{concept.emoji}</span>
            <div><b>{concept.name}</b><span>{concept.sub} · {concept.genre}</span></div>
          </div>
        </section>
      )}
    </div>
  );
}

// ── Миссии ────────────────────────────────────────────────────
function MissionsTab({ d }) {
  const { missionsToday, missions } = d;
  const byId = {};
  missions.forEach(m => { byId[m.id] = m; });
  const done = missionsToday.filter(a => a.status === 'credited');
  const pend = missionsToday.filter(a => a.status !== 'credited');
  return (
    <div className="missions">
      <div className="mini-stats">
        <span>✅ {done.length}</span><span>🕒 {pend.length}</span>
      </div>
      {[...pend, ...done].map(a => {
        const m = byId[a.item_id];
        if (!m) return null;
        return (
          <div key={a.id} className={`mission-card ${a.status === 'credited' ? 'done' : ''}`}>
            <span className="mc-ic">{(a.status === 'credited' ? '✅' : '🎯')}</span>
            <div className="mc-body">
              <b>{m.title}</b>
              <p>{m.desc}</p>
              <div className="mc-meta">
                <span>+{m.coins} Coins</span>
                {a.day_date && <span className="dim">день {a.day_date.slice(-2)}</span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Квест ─────────────────────────────────────────────────────
function QuestsTab({ d }) {
  const { questList, quests, concept, skin } = d;
  const qById = {}; quests.forEach(q => { qById[q.id] = q; });
  const accent = skin ? skin.color : '#ED7615';
  return (
    <div className="quests">
      {questList.map(a => {
        const q = qById[a.item_id];
        if (!q) return null;
        const stageIdx = a.grade ? q.stages.length : Math.max(0, (a.grade || 1) - 1);
        return (
          <div key={a.id} className="quest-card" style={{ ['--accent']: accent }}>
            <div className="q-title">🏁 {q.title}</div>
            <p>{q.desc}</p>
            <div className="q-stages">
              {q.stages.map((s, i) => (
                <div key={i} className={`q-stage ${i < stageIdx ? 'on' : ''}`}>
                  <span className="qs-dot">{i < stageIdx ? '✓' : i + 1}</span><span>{s}</span>
                </div>
              ))}
            </div>
            <div className="q-reward">Награда: {q.xp} XP · {q.gems} 💎</div>
          </div>
        );
      })}
      {questList.length === 0 && <div className="dim empty">Финальный квест появится в смене</div>}
    </div>
  );
}

// ── Баджи ─────────────────────────────────────────────────────
function BadgesTab({ d }) {
  const { badges, concept, shiftRow } = d;
  const earned = {};
  badges.forEach(b => { earned[b.badge_id] = (earned[b.badge_id] || 0) + b.count; });
  const cBadge = concept ? CONCEPT_BADGES[concept.id] : null;
  const cEarned = concept ? earned[cBadge?.id] > 0 : false;
  return (
    <div className="badges">
      <div className="panel">
        <div className="panel-title">Автоматические</div>
        <div className="badge-grid">
          {AUTO_BADGES.map(b => {
            const cnt = earned[b.id] || 0;
            return (
              <div key={b.id} className={`badge-card ${cnt > 0 ? 'earned' : ''}`}>
                <span className="bd-ic">{b.icon}</span>
                <b>{b.name}</b>
                <span className="dim">{b.desc}</span>
                <span className="bd-cnt">{cnt > 0 ? `×${cnt}` : '—'}</span>
              </div>
            );
          })}
        </div>
      </div>
      {cBadge && (
        <div className="panel">
          <div className="panel-title">Концепция «{concept.name}»</div>
          <div className={`badge-card concept ${cEarned ? 'earned' : ''}`}>
            <span className="bd-ic">{cBadge.icon}</span>
            <b>{cBadge.name}</b>
            <span className="dim">{cBadge.desc}</span>
            <span className="bd-cnt">{cEarned ? 'Получен' : 'Не получен'}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Портфолио проектов ────────────────────────────────────────
function PortfolioTab({ d }) {
  const { st } = d;
  const [items] = useData(() => Store.projectsFor(d.shiftRow?.id || '', st.id), [d.shiftRow?.id]);
  return (
    <div className="portfolio">
      {items?.length ? items.map(p => (
        <div key={p.id} className="proj-card">
          <b>{p.title}</b>
          <p>{p.desc}</p>
          <div className="proj-stages">
            {(p.stages || []).map((s, i) => (
              <span key={i} className={`chip ${i <= (p.stage || 0) ? 'on' : ''}`}>{s}</span>
            ))}
          </div>
        </div>
      )) : (
        <div className="dim empty">Проекты появятся здесь после защиты в смене</div>
      )}
    </div>
  );
}

// ── Спорт ─────────────────────────────────────────────────────
function SportTab({ d }) {
  const { st } = d;
  const [items] = useData(() => Store.sportFor(d.shiftRow?.id || '', st.id), [d.shiftRow?.id]);
  return (
    <div className="sport">
      {items?.length ? items.map((s, i) => (
        <div key={i} className="sport-card">
          <span className="sp-ic">🏃</span>
          <div><b>{s.sport_type}</b><span className="dim">{s.result}</span></div>
          <span className="sp-points">+{s.points || 0}</span>
        </div>
      )) : (
        <div className="dim empty">Спортивные результаты записывает вожатый</div>
      )}
    </div>
  );
}

// ── Клан ──────────────────────────────────────────────────────
function ClanTab({ d }) {
  const { clan } = d;
  return (
    <div className="clan">
      {clan ? (
        <div className="panel clan-hero">
          <span className="clan-ic">{clan.icon}</span>
          <div><b>Клан «{clan.name}»</b><p>Твоя команда в этой смене. Помогай, делись идеями, побеждайте вместе!</p></div>
        </div>
      ) : (
        <div className="dim empty">Ты пока без клана</div>
      )}
    </div>
  );
}

// ── Рейтинг ───────────────────────────────────────────────────
function RatingTab({ d }) {
  const [students] = useData(() => Store.students(), []);
  const rows = [...(students || [])].sort((a, b) => (b.xp || 0) - (a.xp || 0));
  const me = d.st.id;
  return (
    <div className="rating">
      <div className="panel-title">Рейтинг по XP</div>
      {rows.map((s, i) => (
        <div key={s.id} className={`rate-row ${s.id === me ? 'me' : ''}`}>
          <span className="r-place">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</span>
          <span className="r-ava">{s.emoji}</span>
          <span className="r-name">{s.nickname}</span>
          <span className="r-xp">⭐ {s.xp || 0}</span>
        </div>
      ))}
    </div>
  );
}

// ── История смен ──────────────────────────────────────────────
function ShiftsTab({ d }) {
  const { yearMap, shiftRow, shiftCount } = d;
  return (
    <div className="shifts">
      <div className="panel-title">Твои смены ({shiftCount}/10)</div>
      {yearMap.map((y, i) => (
        <div key={i} className={`shift-row ${y.isActive ? 'active' : ''}`}>
          <span className="sr-ic">{y.done ? '✅' : y.isActive ? '🟠' : '⬜'}</span>
          <div><b>{y.title}</b><span className="dim">{y.period}</span></div>
          {y.isActive && <span className="chip on">сейчас</span>}
        </div>
      ))}
    </div>
  );
}