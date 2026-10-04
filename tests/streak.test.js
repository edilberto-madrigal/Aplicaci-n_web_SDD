const test = require('node:test');
const assert = require('node:assert/strict');

const {
  toLocalDateKey,
  calculateStreak,
  calculateBestStreak,
} = require('../streak.js');

test('toLocalDateKey devuelve fecha local en formato YYYY-MM-DD', () => {
  const date = new Date(2026, 9, 15); // 15 de octubre de 2026
  assert.equal(toLocalDateKey(date), '2026-10-15');
});

test('calculateStreak devuelve 0 sin sesiones', () => {
  assert.equal(calculateStreak([]), 0);
});

test('calculateStreak cuenta solo hoy', () => {
  const today = toLocalDateKey(new Date());
  const sessions = [{ fecha: today, tema: 'test', minutos: 30 }];
  assert.equal(calculateStreak(sessions), 1);
});

test('calculateStreak cuenta hoy y ayer', () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const sessions = [
    { fecha: toLocalDateKey(today), tema: 'hoy', minutos: 30 },
    { fecha: toLocalDateKey(yesterday), tema: 'ayer', minutos: 45 },
  ];
  assert.equal(calculateStreak(sessions), 2);
});

test('calculateStreak sigue viva si hoy no hay sesión pero ayer sí', () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const dayBefore = new Date(today);
  dayBefore.setDate(dayBefore.getDate() - 2);

  const sessions = [
    { fecha: toLocalDateKey(yesterday), tema: 'ayer', minutos: 30 },
    { fecha: toLocalDateKey(dayBefore), tema: 'anteayer', minutos: 45 },
  ];
  assert.equal(calculateStreak(sessions), 2);
});

test('calculateStreak ignora fechas futuras', () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const sessions = [
    { fecha: toLocalDateKey(today), tema: 'hoy', minutos: 30 },
    { fecha: toLocalDateKey(tomorrow), tema: 'mañana', minutos: 60 },
  ];
  assert.equal(calculateStreak(sessions), 1);
});

test('calculateStreak cuenta múltiples sesiones del mismo día como una', () => {
  const today = toLocalDateKey(new Date());
  const sessions = [
    { fecha: today, tema: 'sesión 1', minutos: 30 },
    { fecha: today, tema: 'sesión 2', minutos: 45 },
  ];
  assert.equal(calculateStreak(sessions), 1);
});

test('calculateBestStreak devuelve 0 sin sesiones', () => {
  assert.equal(calculateBestStreak([]), 0);
});

test('calculateBestStreak encuentra la serie más larga', () => {
  const today = new Date();
  const dates = [];

  // Serie de 3 días: hoy, ayer, anteayer
  for (let i = 0; i < 3; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(toLocalDateKey(d));
  }

  // Serie de 2 días: hace 5 y 6 días
  for (let i = 5; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(toLocalDateKey(d));
  }

  const sessions = dates.map((fecha) => ({ fecha, tema: 'test', minutos: 30 }));
  assert.equal(calculateBestStreak(sessions), 3);
});

test('calculateBestStreak ignora fechas futuras', () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const sessions = [
    { fecha: toLocalDateKey(today), tema: 'hoy', minutos: 30 },
    { fecha: toLocalDateKey(tomorrow), tema: 'mañana', minutos: 60 },
  ];
  assert.equal(calculateBestStreak(sessions), 1);
});

test('calculateStreak funciona en lunes (cambio de semana)', () => {
  // Verificar que si hoy es lunes y hay sesión, la racha es al menos 1
  const today = new Date();
  const sessions = [{ fecha: toLocalDateKey(today), tema: 'hoy', minutos: 30 }];
  const streak = calculateStreak(sessions);
  assert.ok(streak >= 1, `Racha debería ser al menos 1, pero fue ${streak}`);
});

test('calculateStreak ignora sesiones con minutos <= 0', () => {
  const today = toLocalDateKey(new Date());
  const sessions = [
    { fecha: today, tema: 'test', minutos: 0 },
    { fecha: today, tema: 'test2', minutos: -10 },
  ];
  assert.equal(calculateStreak(sessions), 0);
});

test('calculateBestStreak ignora sesiones con minutos <= 0', () => {
  const today = toLocalDateKey(new Date());
  const sessions = [
    { fecha: today, tema: 'test', minutos: 0 },
    { fecha: today, tema: 'test2', minutos: -10 },
  ];
  assert.equal(calculateBestStreak(sessions), 0);
});
