import React from 'react';

export default function KidPicker({ students, onSelect }) {
  return (
    <main className="picker">
      <h2>Выбери себя 👀</h2>
      <p className="dim">Ты видишь только свой профиль. Настоящее имя скрыто.</p>
      <div className="picker-grid">
        {students.map(s => (
          <button key={s.id} className="picker-card" onClick={() => onSelect(s.id)}>
            <span className="picker-emoji">{s.emoji}</span>
            <span className="picker-nick">{s.nickname}</span>
          </button>
        ))}
      </div>
    </main>
  );
}