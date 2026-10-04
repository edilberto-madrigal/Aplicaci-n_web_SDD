(function (global) {
  function toLocalDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function parseLocalDateKey(dateKey) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
      return null;
    }

    const [year, month, day] = dateKey.split('-').map(Number);
    if (!year || !month || !day) {
      return null;
    }

    const parsed = new Date(year, month - 1, day);
    if (
      parsed.getFullYear() !== year ||
      parsed.getMonth() !== month - 1 ||
      parsed.getDate() !== day
    ) {
      return null;
    }

    return parsed;
  }

  function isSessionValid(session) {
    if (!session || typeof session !== 'object') {
      return false;
    }

    const date = parseLocalDateKey(session.fecha);
    if (!date) {
      return false;
    }

    const minutes = Number(session.minutos);
    if (!Number.isFinite(minutes) || minutes <= 0) {
      return false;
    }

    return true;
  }

  function normalizeSessions(sessions, today) {
    if (!Array.isArray(sessions)) {
      return [];
    }

    const todayKey = toLocalDateKey(today);

    return sessions.filter((session) => {
      if (!isSessionValid(session)) {
        return false;
      }

      if (session.fecha > todayKey) {
        return false;
      }

      return true;
    });
  }

  function aggregateMinutesByDay(sessions) {
    return sessions.reduce((accumulator, session) => {
      const dayKey = session.fecha;
      accumulator[dayKey] = (accumulator[dayKey] || 0) + Number(session.minutos);
      return accumulator;
    }, {});
  }

  function buildDateGrid(start, end) {
    const dates = [];
    const cursor = new Date(start);

    while (cursor <= end) {
      dates.push(toLocalDateKey(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }

    return dates;
  }

  function calculateIntensity(totalMinutes, maxMinutes) {
    if (!Number.isFinite(totalMinutes) || totalMinutes <= 0) {
      return 0;
    }

    if (maxMinutes <= 0) {
      return 0;
    }

    if (totalMinutes <= maxMinutes / 3) {
      return 1;
    }

    if (totalMinutes <= (maxMinutes * 2) / 3) {
      return 2;
    }

    if (totalMinutes < maxMinutes) {
      return 3;
    }

    return 4;
  }

  function getStartOfWeek(date) {
    const copy = new Date(date);
    const day = copy.getDay();
    const offset = (day === 0 ? -6 : 1) - day;
    copy.setDate(copy.getDate() + offset);
    copy.setHours(0, 0, 0, 0);
    return copy;
  }

  function buildHeatMapData({ sessions, today, weeks = 8 }) {
    const safeToday = today instanceof Date ? new Date(today) : new Date();
    safeToday.setHours(0, 0, 0, 0);

    const validSessions = normalizeSessions(sessions, safeToday);
    const currentWeekStart = getStartOfWeek(safeToday);
    const rangeStart = new Date(currentWeekStart);
    rangeStart.setDate(rangeStart.getDate() - (Math.max(1, weeks) - 1) * 7);

    const rangeEnd = new Date(safeToday);
    const dateList = buildDateGrid(rangeStart, rangeEnd);
    const byDay = dateList.reduce((accumulator, dateKey) => {
      accumulator[dateKey] = 0;
      return accumulator;
    }, {});

    const totals = aggregateMinutesByDay(validSessions);
    for (const [dateKey, totalMinutes] of Object.entries(totals)) {
      if (dateKey in byDay) {
        byDay[dateKey] = totalMinutes;
      }
    }

    const maxMinutes = Math.max(0, ...Object.values(byDay));
    const levels = Object.keys(byDay).reduce((accumulator, dateKey) => {
      accumulator[dateKey] = calculateIntensity(byDay[dateKey], maxMinutes);
      return accumulator;
    }, {});

    return {
      days: dateList,
      byDay,
      levels,
      maxMinutes,
    };
  }

  const api = {
    toLocalDateKey,
    parseLocalDateKey,
    normalizeSessions,
    aggregateMinutesByDay,
    buildDateGrid,
    calculateIntensity,
    buildHeatMapData,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  global.HeatMapLogic = api;
})(typeof window !== 'undefined' ? window : globalThis);
