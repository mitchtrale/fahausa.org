export interface RecurrenceRule {
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'yearly';
  interval: number;
  dayOfWeek?: number | null; // 0=Sun..6=Sat
  weekOfMonth?: number | null; // 1..5 (5 = last)
  startDate: string; // ISO date YYYY-MM-DD
  endsAt?: string | null; // ISO date YYYY-MM-DD
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getNthWeekdayOfMonth(year: number, month: number, dayOfWeek: number, nth: number): Date | null {
  const firstDay = new Date(year, month, 1);
  let firstOccurrence = firstDay;

  // Find first occurrence of dayOfWeek in the month
  while (firstOccurrence.getDay() !== dayOfWeek) {
    firstOccurrence = addDays(firstOccurrence, 1);
  }

  if (nth === 5) {
    // "Last" occurrence: find the last one in the month
    let last = firstOccurrence;
    let next = addDays(firstOccurrence, 7);
    while (next.getMonth() === month) {
      last = next;
      next = addDays(next, 7);
    }
    return last;
  }

  // nth occurrence (1-indexed)
  const target = addDays(firstOccurrence, (nth - 1) * 7);
  if (target.getMonth() !== month) return null; // nth doesn't exist this month
  return target;
}

export function generateOccurrences(rule: RecurrenceRule, monthsAhead: number = 3): string[] {
  const dates: string[] = [];
  const start = new Date(rule.startDate + 'T00:00:00');
  const endDate = rule.endsAt
    ? new Date(rule.endsAt + 'T00:00:00')
    : addMonths(new Date(), monthsAhead);

  if (rule.frequency === 'weekly' || rule.frequency === 'biweekly') {
    const weekInterval = rule.frequency === 'biweekly' ? 2 : rule.interval;
    let current = new Date(start);

    // Adjust to target day of week if specified
    if (rule.dayOfWeek != null) {
      const diff = rule.dayOfWeek - current.getDay();
      if (diff > 0) current = addDays(current, diff);
      else if (diff < 0) current = addDays(current, diff + 7);
    }

    while (current <= endDate) {
      if (current >= start) {
        dates.push(formatDate(current));
      }
      current = addDays(current, weekInterval * 7);
    }
  }

  if (rule.frequency === 'monthly') {
    let current = new Date(start);

    for (let i = 0; i < monthsAhead * 4 + 12; i++) {
      const year = current.getFullYear();
      const month = current.getMonth();

      if (rule.dayOfWeek != null && rule.weekOfMonth != null) {
        // Nth weekday of month (e.g., 2nd Saturday)
        const date = getNthWeekdayOfMonth(year, month, rule.dayOfWeek, rule.weekOfMonth);
        if (date && date >= start && date <= endDate) {
          dates.push(formatDate(date));
        }
      } else {
        // Same day of month
        if (current >= start && current <= endDate) {
          dates.push(formatDate(current));
        }
      }

      current = addMonths(current, rule.interval);
    }
  }

  if (rule.frequency === 'yearly') {
    let current = new Date(start);
    while (current <= endDate) {
      if (current >= start) {
        dates.push(formatDate(current));
      }
      current = new Date(current.getFullYear() + rule.interval, current.getMonth(), current.getDate());
    }
  }

  return dates;
}
