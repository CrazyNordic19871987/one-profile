import React, { useEffect, useState } from 'react';
import { DB } from './lib/db.js';
import { Store } from './lib/store.js';
import useData from './hooks/useData.js';
import Landing from './pages/Landing.jsx';
import KidPicker from './pages/KidPicker.jsx';
import KidApp from './pages/KidApp.jsx';
import Counselor from './pages/Counselor.jsx';
import { conceptById } from './lib/config.js';

export default function App() {
  const [ready, setReady] = useState(false);
  const [role, setRole] = useState('landing');
  const [studentId, setStudentId] = useState(null);
  const [kidTab, setKidTab] = useState('profile');
  const [csec, setCsec] = useState('shifts');
  const [students, reloadStudents] = useData(() => Store.students(), [ready]);
  const [activeShift, setActiveShift] = useState(null);

  useEffect(() => {
    let alive = true;
    DB.ensureSeed().then(async () => {
      try {
        const shifts = await Store.shifts();
        const act = shifts.find(s => s.status === 'active') || shifts[0] || null;
        if (alive) setActiveShift(act);
      } catch (e) {
        console.warn('Supabase недоступен, показываем пустой старт:', e);
      } finally {
        if (alive) setReady(true);
      }
    });
    return () => { alive = false; };
  }, []);

  if (!ready) return <div className="boot">🚀 ONE! <span>загружаем приключение…</span></div>;

  const kid = studentId ? students?.find(s => s.id === studentId) : null;

  const openKid = id => { setStudentId(id); setKidTab('profile'); setRole('kid'); window.scrollTo(0, 0); };
  const goLanding = () => { setRole('landing'); setStudentId(null); };
  const goCounselor = () => { setRole('counselor'); setCsec('shifts'); setStudentId(null); };

  return (
    <>
      <header className="topbar">
        <button className="logo" onClick={goLanding}>ONE!<span>Профиль</span></button>
        <div className="topbar-right">
          {role === 'kid' && kid && (
            <span className="kid-chip">{kid.emoji} {kid.nickname}</span>
          )}
          {role === 'kid' && (
            <button className="btn sm ghost" onClick={goCounselor}>Вожатый</button>
          )}
          {role !== 'kid' && (
            <button className="btn sm primary" onClick={() => { setRole('kid'); setKidTab('profile'); }}>🎮 Я участник</button>
          )}
        </div>
      </header>

      {role === 'landing' && (
        <Landing
          onKid={() => setRole('kid')}
          onCounselor={goCounselor}
          activeShift={activeShift}
          students={students || []}
        />
      )}

      {role === 'kid' && !kid && <KidPicker onSelect={openKid} students={students || []} />}

      {role === 'kid' && kid && (
        <KidApp
          studentId={studentId}
          tab={kidTab}
          onTab={setKidTab}
          onSwitchKid={() => setStudentId(null)}
          onGoCounselor={goCounselor}
        />
      )}

      {role === 'counselor' && (
        <Counselor
          csec={csec}
          onCsec={setCsec}
          onRoleKid={() => { setRole('kid'); setKidTab('profile'); }}
          onRefresh={() => reloadStudents()}
          students={students || []}
          activeShift={activeShift}
        />
      )}
    </>
  );
}