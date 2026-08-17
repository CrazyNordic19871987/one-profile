// ═════════════════════════════════════════════════════════════
//  ONE! Profile — ДОСТУП К ДАННЫМ
//  USE_SUPABASE=false: localStorage (демо, ключ к смене данных)
//  USE_SUPABASE=true:  Supabase (таблицы из sql/schema.sql)
// ═════════════════════════════════════════════════════════════
import { USE_SUPABASE, SUPABASE_URL, SUPABASE_ANON_KEY, TABLES } from './config.js';
import { ensureContent } from './demo.js';

// Клиент создаётся лениво (без top-level await — совместимо с ES2020).
let sbPromise = null;
function client() {
  if (!USE_SUPABASE) return null;
  if (!sbPromise) {
    sbPromise = import('@supabase/supabase-js')
      .then(({ createClient }) => createClient(SUPABASE_URL, SUPABASE_ANON_KEY));
  }
  return sbPromise;
}

const NS = 'one_profile';

function readAll(table) {
  try { return JSON.parse(localStorage.getItem(`${NS}_${table}`)) || []; }
  catch { return []; }
}
function writeAll(table, rows) {
  localStorage.setItem(`${NS}_${table}`, JSON.stringify(rows));
}
function nextId(table) {
  const rows = readAll(table);
  const nums = rows
    .map(r => parseInt(String(r.id).replace(`${table}-`, ''), 10))
    .filter(n => !Number.isNaN(n));
  return `${table}-${(nums.length ? Math.max(...nums) : 0) + 1}`;
}

async function sbSelect(sb, table, cols = '*', eq) {
  let q = sb.from(table).select(cols);
  if (eq) for (const [k, v] of Object.entries(eq)) q = q.eq(k, v);
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

export const DB = {
  async getAll(table) {
    if (USE_SUPABASE) return sbSelect(await client(), table);
    return readAll(table);
  },

  async find(table, id) {
    if (USE_SUPABASE) {
      const rows = await sbSelect(await client(), table, '*', { id });
      return rows[0] || null;
    }
    return readAll(table).find(r => r.id === id) || null;
  },

  async where(table, eq) {
    if (USE_SUPABASE) return sbSelect(await client(), table, '*', eq);
    return readAll(table).filter(r => Object.entries(eq).every(([k, v]) => r[k] === v));
  },

  async upsert(table, row) {
    if (USE_SUPABASE) {
      const { error } = await (await client()).from(table).upsert(row);
      if (error) throw error;
      return row;
    }
    const rows = readAll(table);
    if (!row.id) row.id = nextId(table);
    const i = rows.findIndex(r => r.id === row.id);
    if (i >= 0) rows[i] = row; else rows.push(row);
    writeAll(table, rows);
    return row;
  },

  async remove(table, id) {
    if (USE_SUPABASE) {
      const { error } = await (await client()).from(table).delete().eq('id', id);
      if (error) throw error;
      return;
    }
    writeAll(table, readAll(table).filter(r => r.id !== id));
  },

  async clearLocal() {
    if (USE_SUPABASE) return;
    Object.keys(TABLES).forEach(k => localStorage.removeItem(`${NS}_${TABLES[k]}`));
  },

  async ensureSeed() {
    if (USE_SUPABASE) return; // продакшен: содержание и штат ведутся через таблицы
    await ensureContent(this);
  }
};