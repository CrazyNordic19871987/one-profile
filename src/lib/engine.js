import {
  LEVEL_XP, MAX_LEVEL, LEAGUES, RANKS, CLASSES, STAGE_RANGES,
  GRADE_REWARD, SEVEN
} from './config.js';

export const Engine = {

  levelFromXp(xp) {
    const lvl = Math.floor((xp || 0) / LEVEL_XP) + 1;
    return Math.min(MAX_LEVEL, Math.max(1, lvl));
  },

  leagueFromLevel(level) {
    for (const l of LEAGUES) if (level >= l.min && level <= l.max) return l;
    return LEAGUES[0];
  },

  stageFromLevel(level, clsId) {
    const cls = this.classById(clsId);
    const evo = cls ? cls.evolution : CLASSES[0].evolution;
    let idx = 0;
    for (let i = 0; i < STAGE_RANGES.length; i++) {
      if (level >= STAGE_RANGES[i][0] && level <= STAGE_RANGES[i][1]) idx = i;
    }
    return { index: idx + 1, stage: evo[idx], min: STAGE_RANGES[idx][0], max: STAGE_RANGES[idx][1] };
  },

  classById(id) { return CLASSES.find(c => c.id === id) || CLASSES[0]; },

  rankFromCurrencies(coins, xp, gems) {
    const vals = [
      { r: RANKS[0], v: coins }, // Банкир 💰 (coins)
      { r: RANKS[1], v: gems },  // Босс 💎 (gems)
      { r: RANKS[2], v: xp },    // Лидер 🧩 (xp)
      { r: RANKS[4], v: 0 }      // Новичок
    ];
    const sorted = vals.sort((a, b) => b.v - a.v);
    if (sorted[0].v <= 0) return RANKS[4];
    // Магистр 📈 — когда XP высокий, но не доминирует
    if (gems > 0 && xp > 0 && coins > 0) return RANKS[3];
    return sorted[0].r;
  },

  // Оценка → награда
  rewardOf(grade) { return GRADE_REWARD[grade] || GRADE_REWARD[3]; },

  // Прогресс XP в текущем уровне (%)
  xpInLevel(xp) {
    const level = this.levelFromXp(xp);
    const base = (level - 1) * LEVEL_XP;
    const into = (xp || 0) - base;
    const span = level >= MAX_LEVEL ? 1 : LEVEL_XP;
    return { level, xpInto: into, pct: Math.min(100, Math.round(Math.min(span, into) / span * 100)) };
  },

  // ── Радар 7 составных: sum(focus-весов зачтённых миссий) ─────
  radarOf(creditedMissions, missionsById) {
    const acc = {};
    SEVEN.forEach(s => { acc[s.id] = 0; });
    creditedMissions.forEach(a => {
      const m = missionsById[a.item_id];
      if (!m) return;
      (m.focus || []).forEach(f => {
        if (acc[f] !== undefined) acc[f] += m.weight || 1;
      });
    });
    const max = Math.max(1, ...Object.values(acc));
    return SEVEN.map(s => ({
      id: s.id, name: s.name, icon: s.icon,
      value: acc[s.id], pct: Math.round((acc[s.id] / max) * 100)
    }));
  },

  // ── Стрик «3 дня подряд с зачтённой миссией» (в рамках смены) ─
  streakOf(creditedDays) {
    let current = 0, max = 0;
    const sorted = [...creditedDays].sort();
    for (let i = 0; i < sorted.length; i++) {
      const d = new Date(sorted[i] + 'T00:00:00');
      const prev = new Date(sorted[i - 1] + 'T00:00:00');
      const diff = (d - prev) / 86400000;
      if (i === 0 || diff === 1) current++;
      else current = 1;
      if (current > max) max = current;
    }
    return { current, max };
  },

  // Статус «все миссии дня зачтены» для конкретной даты
  allDayDone(assignments, dateStr) {
    const day = assignments.filter(a => a.day_date === dateStr);
    if (day.length === 0) return false;
    return day.every(a => a.status === 'credited');
  },

  questRewardOf(grade) {
    return { 3:{xp:180,gems:8}, 4:{xp:200,gems:10}, 5:{xp:220,gems:12} }[grade] || { xp:0, gems:0 };
  },

  // Лига недели по XP (переключатель внутри смены)
  weeklyLeagueOf(xp) {
    const n = LEAGUES.length;
    const idx = Math.min(n - 1, Math.floor((xp || 0) / 500));
    return LEAGUES[idx];
  }
};