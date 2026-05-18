import {
  format,
  parse,
  addMinutes,
  isBefore,
  isAfter,
  isEqual,
  startOfDay,
  endOfDay,
  parseISO,
  isValid,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const DATE_FORMAT = 'yyyy-MM-dd';
export const TIME_FORMAT = 'HH:mm';
export const DISPLAY_DATE = "dd 'de' MMMM 'de' yyyy";
export const DISPLAY_DATETIME = "dd/MM/yyyy 'às' HH:mm";

export function formatDate(date, pattern = DISPLAY_DATE) {
  const d = toDate(date);
  return isValid(d) ? format(d, pattern, { locale: ptBR }) : '';
}

export function formatTime(date) {
  const d = toDate(date);
  return isValid(d) ? format(d, TIME_FORMAT) : '';
}

export function toDate(value) {
  if (!value) return new Date(NaN);
  if (value instanceof Date) return value;
  if (typeof value?.toDate === 'function') return value.toDate();
  if (typeof value === 'string') return parseISO(value);
  return new Date(value);
}

export function combineDateAndTime(dateStr, timeStr) {
  const base = parse(dateStr, DATE_FORMAT, new Date());
  const [hours, minutes] = timeStr.split(':').map(Number);
  base.setHours(hours, minutes, 0, 0);
  return base;
}

export function addMinutesToDate(date, minutes) {
  return addMinutes(toDate(date), minutes);
}

export function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

export function minutesToTime(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function rangesOverlap(startA, endA, startB, endB) {
  const aStart = toDate(startA);
  const aEnd = toDate(endA);
  const bStart = toDate(startB);
  const bEnd = toDate(endB);
  return isBefore(aStart, bEnd) && isAfter(aEnd, bStart);
}

export function isSlotInPast(slotStart) {
  return isBefore(toDate(slotStart), new Date());
}

export function getDayBounds(dateStr) {
  const day = parse(dateStr, DATE_FORMAT, new Date());
  return { start: startOfDay(day), end: endOfDay(day) };
}

export function datesEqual(a, b) {
  return isEqual(toDate(a), toDate(b));
}
