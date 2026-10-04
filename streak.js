(function (global) {
  function toLocalDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function getTodayKey() {
    return toLocalDateKey(new Date());
  }

  function isValidSession(session) {
    if (!session || typeof session !== 'object') return false;
    const minutes = Number(session.minutos);
    if (!Number.isFinite(minutes) || minutes <= 0) return false;
    return /^\d{4}-\d{2}-\d{2}$/.test(session.fecha);
  }

  function calculateStreak(sessions) {
    const validSessions = sessions.filter(isValidSession);
    const daysWithSession = new Set(validSessions.map((s) => s.fecha));
    const today = new Date();
    let currentDate;

    if (daysWithSession.has(toLocalDateKey(today))) {
      currentDate = today;
    } else {
      currentDate = new Date(today);
      currentDate.setDate(currentDate.getDate() - 1);
      if (!daysWithSession.has(toLocalDateKey(currentDate))) {
        return 0;
      }
    }

    let streak = 0;
    while (daysWithSession.has(toLocalDateKey(currentDate))) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }
    return streak;
  }

  function calculateBestStreak(sessions) {
    const todayKey = getTodayKey();
    const validSessions = sessions.filter(isValidSession);
    const daysWithSession = new Set(
      validSessions
        .map((s) => s.fecha)
        .filter((fecha) => fecha <= todayKey)
    );

    if (daysWithSession.size === 0) return 0;

    const dates = [...daysWithSession].sort();

    let bestStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < dates.length; i++) {
      const [yearA, monthA, dayA] = dates[i - 1].split('-').map(Number);
      const [yearB, monthB, dayB] = dates[i].split('-').map(Number);

      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);

      const nextDay = new Date(dateA);
      nextDay.setDate(nextDay.getDate() + 1);

      if (toLocalDateKey(dateB) === toLocalDateKey(nextDay)) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }

      if (currentStreak > bestStreak) {
        bestStreak = currentStreak;
      }
    }

    return bestStreak;
  }

  const api = {
    toLocalDateKey,
    getTodayKey,
    calculateStreak,
    calculateBestStreak,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  global.StreakLogic = api;
})(typeof window !== 'undefined' ? window : globalThis);
