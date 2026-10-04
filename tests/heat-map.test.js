const test = require('node:test');
const assert = require('node:assert/strict');

const {
  normalizeSessions,
  aggregateMinutesByDay,
  buildDateGrid,
  calculateIntensity,
  buildHeatMapData,
} = require('../heat-map.js');

test('normalizeSessions ignora fechas futuras y entradas inválidas', () => {
  const today = new Date('2026-10-01T12:00:00');
  const rawSessions = [
    { fecha: '2026-10-01', tema: 'hoy', minutos: 30 },
    { fecha: '2026-10-02', tema: 'mañana', minutos: 25 },
    { fecha: 'invalid', tema: 'mal', minutos: 5 },
    { fecha: '2026-09-30', tema: 'ayer', minutos: 0 },
    { fecha: '2026-09-29', tema: 'anteayer', minutos: 45 },
  ];

  const result = normalizeSessions(rawSessions, today);

  assert.deepEqual(result, [
    { fecha: '2026-10-01', tema: 'hoy', minutos: 30 },
    { fecha: '2026-09-29', tema: 'anteayer', minutos: 45 },
  ]);
});

test('aggregateMinutesByDay suma sesiones del mismo día', () => {
  const sessions = [
    { fecha: '2026-10-01', minutos: 30 },
    { fecha: '2026-10-01', minutos: 20 },
    { fecha: '2026-09-30', minutos: 10 },
    { fecha: '2026-10-02', minutos: 5 },
  ];

  const result = aggregateMinutesByDay(sessions);

  assert.deepEqual(result, {
    '2026-10-01': 50,
    '2026-09-30': 10,
    '2026-10-02': 5,
  });
});

test('buildDateGrid genera todos los días del rango visible', () => {
  const start = new Date('2026-09-28T12:00:00');
  const end = new Date('2026-10-04T12:00:00');

  const result = buildDateGrid(start, end);

  assert.deepEqual(result, [
    '2026-09-28',
    '2026-09-29',
    '2026-09-30',
    '2026-10-01',
    '2026-10-02',
    '2026-10-03',
    '2026-10-04',
  ]);
});

test('calculateIntensity devuelve intensidad creciente con minutos', () => {
  const max = 90;

  assert.equal(calculateIntensity(0, max), 0);
  assert.equal(calculateIntensity(30, max), 1);
  assert.equal(calculateIntensity(45, max), 2);
  assert.equal(calculateIntensity(90, max), 4);
});

test('buildHeatMapData agrega minutos, elimina fechas futuras y calcula intensidad', () => {
  const today = new Date('2026-10-01T12:00:00');
  const sessions = [
    { fecha: '2026-10-01', tema: 'hoy 1', minutos: 20 },
    { fecha: '2026-10-01', tema: 'hoy 2', minutos: 30 },
    { fecha: '2026-09-30', tema: 'ayer', minutos: 45 },
    { fecha: '2026-10-02', tema: 'mañana', minutos: 60 },
    { fecha: '2026-09-28', tema: 'viejo', minutos: 90 },
  ];

  const result = buildHeatMapData({ sessions, today, weeks: 2 });

  assert.deepEqual(result.days, [
    '2026-09-21',
    '2026-09-22',
    '2026-09-23',
    '2026-09-24',
    '2026-09-25',
    '2026-09-26',
    '2026-09-27',
    '2026-09-28',
    '2026-09-29',
    '2026-09-30',
    '2026-10-01',
  ]);
  assert.deepEqual(result.byDay, {
    '2026-09-21': 0,
    '2026-09-22': 0,
    '2026-09-23': 0,
    '2026-09-24': 0,
    '2026-09-25': 0,
    '2026-09-26': 0,
    '2026-09-27': 0,
    '2026-09-28': 90,
    '2026-09-29': 0,
    '2026-09-30': 45,
    '2026-10-01': 50,
  });
  assert.deepEqual(result.levels, {
    '2026-09-21': 0,
    '2026-09-22': 0,
    '2026-09-23': 0,
    '2026-09-24': 0,
    '2026-09-25': 0,
    '2026-09-26': 0,
    '2026-09-27': 0,
    '2026-09-28': 4,
    '2026-09-29': 0,
    '2026-09-30': 2,
    '2026-10-01': 2,
  });
  assert.equal(result.maxMinutes, 90);
});
