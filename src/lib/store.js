// ═════════════════════════════════════════════════════════════
//  ONE! Profile — СТОР (бизнес-логика поверх DB)
// ═════════════════════════════════════════════════════════════
import { DB } from './db.js';
import { TABLES, YEAR_SHIFTS, conceptById } from './config.js';
import { Engine } from './engine.js';

export const Store = {

  async students()   { return DB.getAll(TABLES.STUDENTS); },
  async student(id)  { return DB.find(TABLES.STUDENTS, id); },
  async clans()      { return DB.getAll(TABLES.CLANS); },
  async shifts()     { return DB.getAll(TABLES.SHIFTS); },
  async shift(id)    { return DB.find(TABLES.SHIFTS, id); },

  async missions()   { return DB.getAll(TABLES.MISSIONS); },
  async quests()     { return DB.getAll(TABLES.QUESTS); },
  async mission(id)  { return DB.find(TABLES.MISSIONS, id); },
  async quest(id)    { return DB.find(TABLES.QUESTS, id); },

  async shiftStudents()      { return DB.getAll(TABLES.SHIFT_STUDENTS); },
  async assignmentsFor(sid, st) { return DB.where(TABLES.ASSIGNMENTS, { shift_id: sid, student_id: st }); },
  async badgesFor(st, sid)    { return DB.where(TABLES.BADGES, { student_id: st, shift_id: sid }); },

  async projects()          { return DB.getAll(TABLES.PROJECTS); },
  async projectsFor(sid, st){ return DB.where(TABLES.PROJECTS, { shift_id: sid, student_id: st }); },
  async sportStats()        { return DB.getAll(TABLES.SPORT_STATS); },
  async sportFor(sid, st)   { return DB.where(TABLES.SPORT_STATS, { shift_id: sid, student_id: st }); },

  // Активная (или последняя) смена в системе — для вожатого
  async activeOrLastShift() {
    const shifts = await this.shifts();
    return shifts
      .sort((a, b) => String(b.date_from).localeCompare(String(a.date_from)))
      .find(s => s.status === 'active') || shifts[shifts.length - 1] || null;
  },

  // Активная смена ребёнка (или последняя)
  async activeOrLastShiftOf(studentId) {
    const [shifts, ss] = await Promise.all([this.shifts(), this.shiftStudents()]);
    const mine = ss.filter(r => r.student_id === studentId).map(r => r.shift_id);
    const rows = shifts.filter(s => mine.includes(s.id)).sort((a, b) =>
      String(b.date_from).localeCompare(String(a.date_from)));
    return rows.find(s => s.status === 'active') || rows[0] || null;
  },

  // Полный набор показателей профиля ребёнка
  async profileOf(studentId) {
    const st = await this.student(studentId);
    if (!st) return null;
    const [clans, shifts, ss, missions, quests] = await Promise.all([
      this.clans(), this.shifts(), this.shiftStudents(),
      this.missions(), this.quests()
    ]);
    const clan = clans.find(c => c.id === st.clan_id) || null;
    const myShiftIds = ss.filter(r => r.student_id === studentId).map(r => r.shift_id);
    const mine = shifts.filter(s => myShiftIds.includes(s.id)).sort((a, b) =>
      String(b.date_from).localeCompare(String(a.date_from)));
    const active = mine.find(s => s.status === 'active') || null;
    const shiftRow = active || mine[0] || null;

    const level = Engine.levelFromXp(st.xp || 0);
    const league = Engine.leagueFromLevel(level);
    const rank = Engine.rankFromCurrencies(st.coins || 0, st.xp || 0, st.gems || 0);
    const stage = Engine.stageFromLevel(level, st.class);
    const cls = Engine.classById(st.class);
    const xpInfo = Engine.xpInLevel(st.xp || 0);

    const shiftCount = mine.length;
    const yearMap = YEAR_SHIFTS.map(y => {
      const done = mine.find(s => s.concept_id === y.concept && s.status === 'closed') ||
                   mine.find(s => s.concept_id === y.concept && s.date_from);
      return { ...y, done: !!done, isActive: !!active && active.concept_id === y.concept };
    });
    const diplomaPct = Math.round(shiftCount / YEAR_SHIFTS.length * 100);

    // radaer по текущей/последней смене
    let radar = null, missionsToday = [], questList = [], badges = [], skin = null;
    if (shiftRow) {
      const [asg, bad] = await Promise.all([
        this.assignmentsFor(shiftRow.id, studentId),
        this.badgesFor(studentId, shiftRow.id)
      ]);
      const credited = asg.filter(a => a.status === 'credited');
      const misMap = {};
      missions.forEach(m => { misMap[m.id] = m; });
      radar = Engine.radarOf(credited, misMap);
      missionsToday = asg.filter(a => a.item_type === 'mission');
      questList = asg.filter(a => a.item_type === 'quest');
      badges = bad;
      skin = await this.skinsOfConcept(shiftRow.concept_id);
    }

    // смена (концепция) для скина профиля
    const concept = shiftRow ? conceptById(shiftRow.concept_id) : null;

    return {
      st, clan, level, league, rank, stage, cls, xpInfo,
      shiftRow, concept, radar, missionsToday, questList, badges,
      shiftCount, yearMap, diplomaPct, missions, quests, skin
    };
  },

  async skinsOfConcept(conceptId) {
    const rows = await DB.where(TABLES.CONCEPT_SKINS, { concept_id: conceptId });
    return rows[0] || null;
  },

  async worldSchools() {
    const projs = await this.projects();
    const sport = await this.sportStats();
    return { projs, sport };
  }
};

export async function seedLocal() {}