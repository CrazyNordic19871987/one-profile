import React from 'react';

export default function Avatar({ student, size = 'md' }) {
  const hash = String(student?.id || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const grads = [
    'linear-gradient(135deg,#f4d03f,#d4ac0d)',
    'linear-gradient(135deg,#5dade2,#3498db)',
    'linear-gradient(135deg,#a569bd,#7d3c98)',
    'linear-gradient(135deg,#58d68d,#27ae60)',
    'linear-gradient(135deg,#f5b301,#ed7615)'
  ];
  return (
    <span className={`avatar a-${size}`} style={{ background: grads[hash % grads.length] }}>
      {student?.emoji || '🦊'}
    </span>
  );
}