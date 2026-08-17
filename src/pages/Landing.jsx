import React from 'react';
import { CONCEPTS, YEAR_SHIFTS, conceptById } from '../lib/config.js';

export default function Landing({ onKid, onCounselor, activeShift, students }) {
  const act = activeShift ? conceptById(activeShift.concept_id) : null;
  const yearDone = YEAR_SHIFTS.filter(y => false).length; // проставится из данных вожатым

  return (
    <main className="landing">
      <section className="hero">
        <div className="hero-badge">Каникулы с ONE!</div>
        <h1>Цифровой профиль участника</h1>
        <p className="lead">
          «Не лагерь, а акселератор навыков будущего в формате Phygital-игры».
          10 смен в году, единый Паспорт Агента, рейтинг и портфолио.
        </p>
        <div className="hero-actions">
          <button className="btn big primary" onClick={onKid}>🎮 Я участник</button>
          <button className="btn big ghost" onClick={onCounselor}>🛡️ Вожатый</button>
        </div>
      </section>

      {act && (
        <section className="strip active-shift">
          <span className="strip-emoji">{act.emoji}</span>
          <div>
            <b>Активная смена:</b> {activeShift.title}
            <span className="dim"> · {activeShift.date_from} – {activeShift.date_to}</span>
          </div>
        </section>
      )}

      <section className="concept-grid">
        {CONCEPTS.map(c => (
          <div className="concept-card" key={c.id} style={{ ['--cc']: c.color }}>
            <div className="cc-emoji" style={{ background: `${c.color}22` }}>{c.emoji}</div>
            <div className="cc-num">Смена {c.num}</div>
            <div className="cc-name">{c.name}</div>
            <div className="cc-sub">{c.sub}</div>
            <div className="cc-genre">{c.genre}</div>
            <div className="cc-meta"><span>💠 {c.currency}</span><span>🎯 {c.quest}</span></div>
          </div>
        ))}
      </section>
    </main>
  );
}